<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\KnowledgeBase;
use App\Models\Tenant;
use App\Services\EvolutionService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AgentWizardController extends Controller
{
    use WorkspaceScoped;

    /**
     * Show wizard page.
     */
    public function index(Request $request): Response
    {
        $availableInstances = $this->scopedQuery($request, EvolutionInstance::class)
            ->where('status', 'connected')
            ->whereDoesntHave('agentConfig')
            ->get();

        return Inertia::render('Wizard/Index', [
            'availableInstances' => $availableInstances,
        ]);
    }

    /**
     * Step 1: Create WhatsApp instance.
     */
    public function createInstance(Request $request, EvolutionService $evolutionService): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'instance_name' => 'required|string|max:50',
            'display_name' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $evolutionInstanceName = $this->generateInstanceName(
            tenant: $user->tenant,
            displayName: $validated['display_name'] ?? $validated['instance_name']
        );

        $instanceToken = Str::random(32);

        try {
            $response = $evolutionService->createInstance($evolutionInstanceName, $instanceToken);

            if (isset($response['error'])) {
                return response()->json([
                    'error' => data_get($response, 'response.message.0', 'Evolution API error'),
                ], 422);
            }

            $instance = EvolutionInstance::create($this->withTeam($request, [
                'tenant_id' => $user->tenant_id,
                'instance_name' => $evolutionInstanceName,
                'display_name' => $validated['display_name'],
                'phone_number' => $validated['phone_number'],
                'status' => 'disconnected',
                'settings' => [
                    'token' => $instanceToken,
                ],
            ]));

            return response()->json([
                'success' => true,
                'instance' => $instance,
            ]);
        } catch (Exception $e) {
            Log::error('Wizard instance creation failed: '.$e->getMessage());

            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Step 2: Fetch QR code for instance.
     */
    public function fetchQr(Request $request, EvolutionService $service): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'instance_id' => 'required|exists:evolution_instances,id',
        ]);

        $instance = $this->findScoped($request, EvolutionInstance::class, $validated['instance_id']);

        $settings = $instance->settings ?? [];
        $settings['was_connected'] = false;
        $instance->update([
            'settings' => $settings,
            'status' => 'connecting',
        ]);

        try {
            $service->fetchQrCode($instance->instance_name);

            return response()->json([
                'success' => true,
                'message' => 'QR code generation initiated',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Step 3 & 4: Complete setup - Create agent and link instance.
     */
    public function completeSetup(Request $request, EvolutionService $evoService): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'instance_id' => 'required|exists:evolution_instances,id',
            'agent_name' => 'required|string|max:255',
            'languages' => 'required|array',
            'languages.*' => 'string',
            'primary_objective' => 'required|string',
            'tone' => 'nullable|string',
            'google_maps_url' => 'nullable|string|max:2048',
            'calendar_url' => 'nullable|string|max:2048',
            'additional_info' => 'nullable|string|max:5000',
            'prompt' => 'nullable|string|max:10000',
            'knowledge_files' => 'nullable|array',
            'knowledge_files.*' => 'file|mimes:pdf,txt,docx|max:30720',
        ]);

        try {
            return DB::transaction(function () use ($request, $validated, $evoService) {
                $instance = EvolutionInstance::find($validated['instance_id']);

                // Build system prompt
                $systemPrompt = $this->buildSystemPrompt($validated);

                // Create agent
                $agent = AgentConfig::create($this->withTeam($request, [
                    'tenant_id' => $request->user()->tenant_id,
                    'name' => $validated['agent_name'],
                    'system_prompt' => $systemPrompt,
                    'default_system_prompt' => $systemPrompt,
                    'settings' => [
                        'languages' => $validated['languages'],
                        'primary_objective' => $validated['primary_objective'],
                        'tone' => $validated['tone'] ?? 'professional',
                        'google_maps_url' => $validated['google_maps_url'] ?? null,
                        'calendar_url' => $validated['calendar_url'] ?? null,
                        'additional_info' => $validated['additional_info'] ?? null,
                    ],
                    'is_active' => false,
                ]));

                // Link instance to agent
                // Mark welcome as dismissed
                $request->user()->update(['welcome_dismissed_at' => now()]);

                if ($instance->status === 'connected') {
                    $agent->update([
                        'evolution_instance_id' => $instance->id,
                        'webhook_url' => config('services.whatsapp.webhook_url'),
                        'is_active' => true,
                    ]);

                    // Connect bot to Evolution API
                    $evoResponse = $evoService->connectN8nBot($instance, $agent);
                    $agent->update(['evo_integration_id' => $evoResponse['id'] ?? null]);
                }

                // Upload knowledge base files
                if ($request->hasFile('knowledge_files')) {
                    foreach ($request->file('knowledge_files') as $file) {
                        $document = KnowledgeBase::create([
                            'tenant_id' => $request->user()->tenant_id,
                            'team_id' => $agent->team_id,
                            'name' => $file->getClientOriginalName(),
                            'agent_config_id' => $agent->id,
                            'status' => 'processing',
                        ]);

                        $document->addMedia($file)->toMediaCollection('documents');

                        try {
                            Http::withHeaders([
                                'X-N8N-API-KEY' => config('services.n8n.api_key'),
                            ])->post(config('services.document.webhook_url'), [
                                'document_id' => $document->id,
                                'tenant_id' => (string) $document->tenant_id,
                                'agent_config_id' => $document->agent_config_id,
                                'file_name' => $file->getClientOriginalName(),
                            ]);
                        } catch (Exception $e) {
                            $document->update(['status' => 'failed']);
                            Log::warning('n8n webhook failed for document '.$document->id.': '.$e->getMessage());
                        }
                    }
                }

                return redirect()->route('workspaces.agents.show', [
                    'slug' => $request->route('slug'),
                    'agent' => $agent->id,
                ])->with('success', 'AI Assistant created successfully!');
            });
        } catch (Exception $e) {
            Log::error('Wizard setup failed: '.$e->getMessage());

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Dismiss welcome overlay for the current user.
     */
    public function dismissWelcome(Request $request): JsonResponse
    {
        $request->user()->update(['welcome_dismissed_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * Build system prompt from wizard data.
     */
    private function buildSystemPrompt(array $data): string
    {
        $config = [
            'agent_name' => $data['agent_name'],
            'languages' => $data['languages'],
            'primary_objective' => $data['primary_objective'],
            'tone' => $data['tone'] ?? 'professional',
        ];

        if (! empty($data['google_maps_url'])) {
            $config['google_maps_url'] = $data['google_maps_url'];
        }

        if (! empty($data['calendar_url'])) {
            $config['calendar_url'] = $data['calendar_url'];
        }

        if (! empty($data['additional_info'])) {
            $config['additional_info'] = $data['additional_info'];
        }

        if (! empty($data['prompt'])) {
            $config['prompt'] = $data['prompt'];
        }

        return json_encode($config, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Generate unique instance name for Evolution API.
     */
    private function generateInstanceName(Tenant $tenant, ?string $displayName = null): string
    {
        $tenantSlug = $tenant->slug ?? 'tenant';
        $baseName = Str::slug($displayName ?? 'instance');
        $uniquePart = Str::random(6);

        return "{$tenantSlug}-{$baseName}-{$uniquePart}";
    }
}
