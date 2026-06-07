<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\KnowledgeBase;
use App\Models\MediaAsset;
use App\Services\AgentService;
use App\Services\EvolutionService;
use App\Services\InstanceService;
use App\Services\KnowledgeBaseService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    use WorkspaceScoped;

    public function __construct(
        private AgentService $agentService,
        private InstanceService $instanceService,
        private EvolutionService $evolutionService,
    ) {}

    // ─────────────────────────────────────────────
    //  AGENT CRUD
    // ─────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $tenantId = $request->user()->tenant_id;
        $team = $request->attributes->get('active_team');

        $agents = $this->scopedQuery($request, AgentConfig::class)
            ->with(['instance', 'knowledgeBases'])
            ->withCount('knowledgeBases')
            ->withCount('MediaAsset')
            ->orderBy('created_at', 'desc')
            ->get();

        $availableInstances = $this->scopedQuery($request, EvolutionInstance::class)
            ->where('status', 'connected')
            ->whereDoesntHave('agentConfig')
            ->get();

        $roleCode = $this->getRoleCode($request);
        $canManage = in_array($roleCode, ['owner', 'admin', 'member']);

        return Inertia::render('Agents/Index', [
            'agents' => $agents,
            'availableInstances' => $availableInstances,
            'canCreate' => $canManage,
            'canManage' => $canManage,
        ]);
    }

    public function show(Request $request): Response
    {
        $agent = $this->scopedQuery($request, AgentConfig::class)
            ->with(['instance', 'knowledgeBases', 'testConversation', 'mediaAssets'])
            ->withCount('knowledgeBases')
            ->findOrFail($request->route('agent'));

        $availableInstances = $this->scopedQuery($request, EvolutionInstance::class)
            ->where('status', 'connected')
            ->where(function ($query) use ($agent) {
                $query->whereDoesntHave('agentConfig')
                    ->orWhere('id', $agent->evolution_instance_id);
            })
            ->get();

        $stats = $this->agentService->getStats($agent);

        $roleCode = $this->getRoleCode($request);
        $canManage = in_array($roleCode, ['owner', 'admin', 'member']);

        $mediaAssets = $agent->mediaAssets->map(function ($asset) {
            $asset->url = $asset->resolved_url;

            return $asset;
        });

        return Inertia::render('Agents/Show', [
            'agent' => $agent,
            'availableInstances' => $availableInstances,
            'stats' => $stats,
            'canManage' => $canManage,
            'testConversation' => $agent->testConversation,
            'mediaAssets' => $mediaAssets,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $request->validate([
            'name' => 'required|string|max:255',
            'webhook_url' => 'nullable|url',
        ]);

        try {
            $this->agentService->create($this->withTeam($request, [
                'tenant_id' => $request->user()->tenant_id,
                'name' => $request->name,
                'webhook_url' => $request->webhook_url,
                'is_active' => false,
                'settings' => ['name' => $request->name],
            ]));

            return back()->with('success', __('messages.success.agent_created'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));
        $this->authorizeWorkspace($request, $agent);

        $request->validate([
            'name' => 'nullable|string|max:255',
            'config_webhook_url' => 'nullable|url',
            'settings' => 'nullable|array',
            'settings.languages' => 'nullable|array',
            'settings.languages.*' => 'string',
        ]);

        try {
            $settings = $request->settings ?? [];

            $updateData = [
                'name' => $request->name ?? $agent->name,
                'webhook_url' => $request->config_webhook_url ?? $agent->webhook_url,
                'settings' => array_merge($agent->settings ?? [], $settings),
            ];

            $this->agentService->update($agent, $updateData);

            if ($agent->isLinked() && $agent->instance) {
                $this->evolutionService->updateN8nBot($agent->instance, $agent);

                $blacklist = $settings['blacklist'] ?? [];
                if (! empty($blacklist)) {
                    $this->evolutionService->updateN8nSettings($agent->instance, $agent);
                }
            }

            return back()->with('success', __('messages.success.updated_agent'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));
        $this->authorizeWorkspace($request, $agent);

        try {
            if ($agent->isLinked() && $agent->instance) {
                $this->evolutionService->deleteN8nBot($agent->instance, $agent);
            }

            $agent->delete();

            return back()->with('success', 'Agent deleted successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ─────────────────────────────────────────────
    //  AGENT ACTIONS
    // ─────────────────────────────────────────────

    public function clone(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));

        try {
            $this->agentService->clone($agent, $request->input('name'));

            return back()->with('success', 'Agent cloned successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to clone agent: '.$e->getMessage()]);
        }
    }

    public function toggle(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));
        $this->authorizeWorkspace($request, $agent);

        if (! $agent->isLinked()) {
            return back()->withErrors(['error' => 'Agent must be linked to an instance first.']);
        }

        try {
            $wasActive = $agent->is_active;
            $this->agentService->toggle($agent);

            $message = $wasActive ? 'Bot Paused' : 'Bot Resumed';

            return back()->with('success', $message);
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updateSettings(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $request->validate([
            'settings' => 'nullable|array',
            'settings.blocklist' => 'nullable|array',
            'settings.blocklist.*' => 'string|max:20',
            'settings.delayMessage' => 'nullable|integer|min:0',
            'settings.keywordFinish' => 'nullable|string|max:50',
            'settings.unknownMessage' => 'nullable|string|max:500',
            'settings.listeningFromMe' => 'nullable|boolean',
            'settings.stopBotFromMe' => 'nullable|boolean',
            'settings.keepOpen' => 'nullable|boolean',
        ]);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));

        try {
            $this->agentService->updateSettings($agent, $request->input('settings', []));

            return back()->with('success', 'Settings updated successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to update settings: '.$e->getMessage()]);
        }
    }

    // ─────────────────────────────────────────────
    //  INSTANCE LINKING
    // ─────────────────────────────────────────────

    public function linkInstance(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));
        $this->authorizeWorkspace($request, $agent);

        $request->validate([
            'instance_id' => 'required|exists:evolution_instances,id',
        ]);

        $instance = $this->findScoped($request, EvolutionInstance::class, $request->instance_id);

        if ($instance->status !== 'connected') {
            return back()->withErrors(['error' => 'Instance must be connected before linking.']);
        }

        try {
            $this->agentService->linkInstance($agent, $instance);

            return back()->with('success', __('messages.success.connected_agent'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function unlinkInstance(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));
        $this->authorizeWorkspace($request, $agent);

        if (! $agent->isLinked()) {
            return back()->withErrors(['error' => 'Agent is not linked to any instance.']);
        }

        try {
            $this->agentService->unlinkInstance($agent);

            return back()->with('success', __('messages.success.disconnected_agent'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ─────────────────────────────────────────────
    //  AGENT-SCOPED INSTANCE CONNECTION (axios)
    // ─────────────────────────────────────────────

    public function fetchQr(Request $request): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));

        if (! $agent->isLinked() || ! $agent->instance) {
            return response()->json(['error' => 'Agent has no linked instance.'], 422);
        }

        try {
            $instanceService = app(InstanceService::class);
            $instanceService->fetchQr($agent->instance);

            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function disconnect(Request $request): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));

        if (! $agent->isLinked() || ! $agent->instance) {
            return response()->json(['error' => 'Agent has no linked instance.'], 422);
        }

        try {
            $instanceService = app(InstanceService::class);
            $instanceService->disconnect($agent->instance);

            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function restart(Request $request): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));

        if (! $agent->isLinked() || ! $agent->instance) {
            return response()->json(['error' => 'Agent has no linked instance.'], 422);
        }

        try {
            $instanceService = app(InstanceService::class);
            $instanceService->restart($agent->instance);

            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function createInstance(Request $request): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'instance_name' => 'required|string|max:50',
            'display_name' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:20',
        ]);

        try {
            $instanceService = app(InstanceService::class);
            $instance = $instanceService->create(
                $validated,
                $request->user()->tenant,
                $request->attributes->get('active_team')?->id,
            );

            $agentId = $request->route('agent');
            if ($agentId) {
                $agent = $this->findScoped($request, AgentConfig::class, $agentId);
                $this->agentService->linkInstance($agent, $instance);
            }

            return response()->json([
                'success' => true,
                'instance' => $instance,
            ]);
        } catch (Exception $e) {
            Log::error('Instance creation failed: '.$e->getMessage());

            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    // ─────────────────────────────────────────────
    //  AGENT-SCOPED KNOWLEDGE
    // ─────────────────────────────────────────────

    public function knowledgeStore(Request $request): RedirectResponse
    {

        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));

        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,docx|max:30720',
        ]);

        try {
            $slug = $request->route('slug');

            app(KnowledgeBaseService::class)->store(
                $this->withTeam($request, [
                    'tenant_id' => $request->user()->tenant_id,
                    'name' => $request->file('file')->getClientOriginalName(),
                    'agent_config_id' => $agent->id,
                    'slug' => $slug,
                ]),
                $request->file('file'),
            );

            return back()->with('success', __('messages.success.document_uploaded'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => __('messages.error.document_uploaded')]);
        }
    }

    public function knowledgeDestroy(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $agent = $this->findScoped($request, AgentConfig::class, $request->route('agent'));

        $document = $this->findScoped($request, KnowledgeBase::class, $request->route('id'));

        if ($document->agent_config_id !== $agent->id) {
            return back()->withErrors(['error' => 'Document does not belong to this agent.']);
        }

        app(KnowledgeBaseService::class)->destroy($document);

        return back()->with('success', __('messages.success.document_deleted'));
    }

    public function knowledgeDownload(Request $request)
    {
        $document = KnowledgeBase::where('id', $request->route('id'))->first();

        $normalized = $request->has('normalized')
        || str_contains($request->header('User-Agent', ''), 'n8n');

        return app(KnowledgeBaseService::class)->download($document, $normalized);
    }

    // ─────────────────────────────────────────────
    //  WIZARD
    // ─────────────────────────────────────────────

    public function wizardIndex(Request $request): Response
    {
        $availableInstances = $this->scopedQuery($request, EvolutionInstance::class)
            ->where('status', 'connected')
            ->whereDoesntHave('agentConfig')
            ->get();

        return Inertia::render('Wizard/Index', [
            'availableInstances' => $availableInstances,
        ]);
    }

    public function wizardCreateInstance(Request $request): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'instance_name' => 'required|string|max:50',
            'display_name' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:20',
        ]);

        try {
            $instance = $this->instanceService->create(
                $validated,
                $request->user()->tenant,
                $request->attributes->get('active_team')?->id,
            );

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

    public function wizardFetchQr(Request $request): JsonResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'instance_id' => 'required|exists:evolution_instances,id',
        ]);

        $instance = $this->findScoped($request, EvolutionInstance::class, $validated['instance_id']);

        try {
            $this->instanceService->fetchQr($instance);

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

    public function completeSetup(Request $request): RedirectResponse
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'instance_id' => 'required|exists:evolution_instances,id',
            'agent_name' => 'required|string|max:255',
            'languages' => 'required|array',
            'languages.*' => 'string',
            'main_objective' => 'required|string',
            'tone' => 'nullable|string',
            'response_style' => 'nullable|string',
            'greeting_message' => 'nullable|string|max:500',
            'call_to_action' => 'nullable|string',
            'max_response_length' => 'nullable|string',
            'knowledge_mode' => 'nullable|string',
            'google_maps_url' => 'nullable|string|max:2048',
            'calendar_url' => 'nullable|string|max:2048',
            'additional_info' => 'nullable|string|max:5000',
            'prompt' => 'nullable|string|max:10000',
            'knowledge_files' => 'nullable|array',
            'knowledge_files.*' => 'file|mimes:pdf,txt,docx|max:30720',
            'media_files' => 'nullable|array',
            'media_files.*' => 'file|mimes:jpg,jpeg,png,gif,webp,mp4,webm|max:30720',
            'sector' => 'nullable|string|max:100',
        ]);

        try {
            return DB::transaction(function () use ($request, $validated) {
                $instance = EvolutionInstance::find($validated['instance_id']);

                $settings = [
                    'languages' => $validated['languages'],
                    'sector' => $validated['sector'] ?? null,
                    'main_objective' => $validated['main_objective'],
                    'tone' => $validated['tone'] ?? 'professionnel',
                    'response_style' => $validated['response_style'] ?? 'equilibree',
                    'greeting_message' => $validated['greeting_message'] ?? null,
                    'call_to_action' => $validated['call_to_action'] ?? null,
                    'max_response_length' => $validated['max_response_length'] ?? null,
                    'knowledge_mode' => $validated['knowledge_mode'] ?? 'strict',
                    'google_maps_url' => $validated['google_maps_url'] ?? null,
                    'calendar_url' => $validated['calendar_url'] ?? null,
                    'additional_info' => $validated['additional_info'] ?? null,
                    'custom_prompt' => $validated['prompt'] ?? null,
                ];

                $agent = $this->agentService->create($this->withTeam($request, [
                    'tenant_id' => $request->user()->tenant_id,
                    'name' => $validated['agent_name'],
                    'settings' => $settings,
                    'is_active' => false,
                ]));

                $request->user()->update(['welcome_dismissed_at' => now()]);

                if ($instance->status === 'connected') {
                    $agent->update([
                        'evolution_instance_id' => $instance->id,
                        'webhook_url' => config('services.whatsapp.webhook_url'),
                        'is_active' => true,
                    ]);

                    $evoResponse = $this->evolutionService->connectN8nBot($instance, $agent);
                    $agent->update(['evo_integration_id' => $evoResponse['id'] ?? null]);
                }

                if ($request->hasFile('media_files')) {
                    foreach ($request->file('media_files') as $file) {
                        $asset = MediaAsset::create($this->withTeam($request, [
                            'tenant_id' => $request->user()->tenant_id,
                            'agent_config_id' => $agent->id,
                            'category' => 'wizard',
                            'type' => str_starts_with($file->getMimeType(), 'video') ? 'video' : 'image',
                            'caption' => $file->getClientOriginalName(),
                            'is_active' => true,
                        ]));

                        $media = $asset->addMedia($file)->toMediaCollection('assets', 's3');
                        $asset->update(['external_url' => $media->getUrl()]);
                    }
                }

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

    public function dismissWelcome(Request $request): JsonResponse
    {
        $request->user()->update(['welcome_dismissed_at' => now()]);

        return response()->json(['success' => true]);
    }
}
