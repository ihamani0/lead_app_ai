<?php

namespace App\Http\Controllers;

use App\Models\AgentConfig;
use App\Models\AgentSystemPromptHistory;
use App\Models\EvolutionInstance;
use App\Services\EvolutionService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AgentBotController extends Controller
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.n8n.api_key');
    }

    /**
     * Display a list of AI agents for the tenant.
     */
    public function index(): Response
    {
        $tenantId = Auth::user()->tenant_id;

        $agents = AgentConfig::with(['instance', 'knowledgeBases'])
            ->withCount('knowledgeBases')
            ->where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();

        $availableInstances = EvolutionInstance::where('tenant_id', $tenantId)
            ->where('status', 'connected')
            ->whereDoesntHave('agentConfig')
            ->get();

        return Inertia::render('Agents/Index', [
            'agents' => $agents,
            'availableInstances' => $availableInstances,
        ]);
    }

    /**
     * Create a standalone agent (no instance required).
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'system_prompt' => 'nullable|string',
            'webhook_url' => 'nullable|url',
        ]);

        try {
            AgentConfig::create([
                'tenant_id' => $request->user()->tenant_id,
                'name' => $request->name,
                'system_prompt' => $request->system_prompt,
                'webhook_url' => $request->webhook_url,
                'is_active' => false,
                'settings' => [],
            ]);

            return back()->with('success', __('messages.success.agent_created'));
        } catch (Exception $e) {
            dd($e->getMessage());

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Update AI agent settings and system prompt.
     */
    public function update(Request $request, AgentConfig $agent): RedirectResponse
    {

        if ($agent->tenant_id !== $request->user()->tenant_id) {
            abort(403);
        }

        $request->validate([
            'name' => 'nullable|string|max:255',
            'config_webhook_url' => 'nullable|url',
            'system_prompt' => 'nullable|string',
            'settings' => 'nullable|array',
        ]);

        try {
            // Record history if system prompt is being changed (using hash comparison)
            $promptChanged = $request->filled('system_prompt')
                && $agent->hasSystemPromptChanged($request->system_prompt);

            if ($promptChanged && $agent->system_prompt) {
                AgentSystemPromptHistory::record($agent, 'Auto-saved before update');
            }

            $agent->update([
                'name' => $request->name ?? $agent->name,
                'webhook_url' => $request->config_webhook_url ?? $agent->webhook_url,
                'system_prompt' => $request->system_prompt,
                'settings' => [...($agent->settings ?? []), ...($request->settings ?? [])],
            ]);

            // Sync with Evolution API if linked
            if ($agent->isLinked() && $agent->instance) {
                $evoService = app(EvolutionService::class);
                $evoService->updateN8nBot($agent->instance, $agent);

                $blacklist = $request->settings['blacklist'] ?? [];
                if (! empty($blacklist)) {
                    $evoService->updateN8nSettings($agent->instance, $agent);
                }
            }

            return back()->with('success', __('messages.success.updated_agent'));
        } catch (Exception $e) {

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Link an instance to an agent.
     */
    public function linkInstance(Request $request, AgentConfig $agent, EvolutionService $evoService): RedirectResponse
    {

        if ($agent->tenant_id !== $request->user()->tenant_id) {
            abort(403);
        }

        $request->validate([
            'instance_id' => 'required|exists:evolution_instances,id',
            'webhook_url' => 'required|url',
        ]);

        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($request->instance_id);

        if ($instance->status !== 'connected') {
            return back()->withErrors(['error' => 'Instance must be connected before linking.']);
        }

        try {
            return DB::transaction(function () use ($agent, $instance, $request, $evoService) {
                // If agent was previously linked to another instance, unlink first
                if ($agent->isLinked() && $agent->instance) {
                    try {
                        $evoService->deleteN8nBot($agent->instance, $agent);
                    } catch (Exception) {
                        // Ignore errors when unlinking
                    }
                }

                // Update agent with new instance
                $agent->update([
                    'evolution_instance_id' => $instance->id,
                    'webhook_url' => $request->webhook_url,
                    'is_active' => true,
                ]);

                // Connect bot to Evolution API
                $evoResponse = $evoService->connectN8nBot($instance, $agent);
                $agent->update(['evo_integration_id' => $evoResponse['id'] ?? null]);

                return back()->with('success', __('messages.success.connected_agent'));
            });
        } catch (Exception $e) {
            dd($e->getMessage());

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Unlink an instance from an agent (keeps agent config intact).
     */
    public function unlinkInstance(Request $request, AgentConfig $agent, EvolutionService $evoService): RedirectResponse
    {
        if ($agent->tenant_id !== $request->user()->tenant_id) {
            abort(403);
        }

        if (! $agent->isLinked()) {
            return back()->withErrors(['error' => 'Agent is not linked to any instance.']);
        }

        try {
            return DB::transaction(function () use ($agent, $evoService) {
                // Remove from Evolution API
                if ($agent->instance) {
                    try {
                        $evoService->deleteN8nBot($agent->instance, $agent);
                    } catch (Exception $e) {
                        // Ignore errors
                        dd($e->getMessage());
                    }
                }

                // Clear connection details but keep name, prompt, settings, knowledge bases
                $agent->update([
                    'evolution_instance_id' => null,
                    'is_active' => false,
                    'evo_integration_id' => null,
                    'webhook_url' => null,
                ]);

                return back()->with('success', __('messages.success.disconnected_agent'));
            });
        } catch (Exception $e) {
            dd($e->getMessage());

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Toggle the AI agent status (pause/resume).
     */
    public function toggle(Request $request, AgentConfig $agent, EvolutionService $evoService): RedirectResponse
    {
        if ($agent->tenant_id !== $request->user()->tenant_id) {
            abort(403);
        }

        if (! $agent->isLinked()) {
            return back()->withErrors(['error' => 'Agent must be linked to an instance first.']);
        }

        try {
            return DB::transaction(function () use ($agent, $evoService) {
                $newStatus = ! $agent->is_active;

                $evoService->toggleN8nBot($agent->instance, $agent, $newStatus);
                $agent->update(['is_active' => $newStatus]);

                $message = $newStatus ? 'Bot Resumed' : 'Bot Paused';

                return back()->with('success', $message);
            });
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete an agent entirely.
     */
    public function destroy(Request $request, AgentConfig $agent): RedirectResponse
    {
        if ($agent->tenant_id !== $request->user()->tenant_id) {
            abort(403);
        }

        try {
            if ($agent->isLinked() && $agent->instance) {
                $evoService = app(EvolutionService::class);
                $evoService->deleteN8nBot($agent->instance, $agent);
            }

            $agent->delete();

            return back()->with('success', 'Agent deleted successfully.');
        } catch (Exception $e) {
            dd($e->getMessage());

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // ─── Legacy methods (for backward compatibility with old instance-based routes) ───

    public function storeLegacy(Request $request, string $instanceId, EvolutionService $evoService): RedirectResponse
    {
        $request->validate(['webhook_url' => 'required|url']);

        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)->findOrFail($instanceId);

        try {
            return DB::transaction(function () use ($instance, $request, $evoService) {
                $agent = AgentConfig::updateOrCreate(
                    [
                        'tenant_id' => $instance->tenant_id,
                        'evolution_instance_id' => $instance->id,
                    ], [
                        'instance_name' => $instance->instance_name,
                        'name' => $instance->instance_name,
                        'webhook_url' => $request->webhook_url,
                        'is_active' => true,
                        'settings' => ['delayMessage' => 1200, 'keywordFinish' => '#STOP'],
                    ]
                );

                $evoResponse = $evoService->connectN8nBot($instance, $agent);
                $agent->update(['evo_integration_id' => $evoResponse['id'] ?? null]);

                return back()->with('success', __('messages.success.connected_agent'));
            });
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updateLegacy(Request $request, $instanceId, EvolutionService $evoService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($instanceId);

        $agent = $instance->agentConfig;
        if (! $agent) {
            return back()->withErrors(['error' => __('messages.error.no_found_agent')]);
        }

        $request->validate([
            'config_webhook_url' => 'nullable|url',
            'system_prompt' => 'nullable|string',
            'settings' => 'nullable|array',
        ]);

        try {
            $agent->update([
                'config_webhook_url' => $request->config_webhook_url ?? $agent->config_webhook_url,
                'system_prompt' => $request->system_prompt,
                'settings' => [...($agent->settings ?? []), ...($request->settings ?? [])],
            ]);

            $evoService->updateN8nBot($instance, $agent);

            $blacklist = $request->settings['blacklist'] ?? [];
            if (! empty($blacklist)) {
                $evoService->updateN8nSettings($instance, $agent);
            }

            return back()->with('success', __('messages.success.updated_agent'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function toggleLegacy(Request $request, $instanceId, EvolutionService $evoService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)->findOrFail($instanceId);
        $agent = $instance->agentConfig;

        try {
            return DB::transaction(function () use ($agent, $evoService) {
                $newStatus = ! $agent->is_active;
                $evoService->toggleN8nBot($agent->instance, $agent, $newStatus);
                $agent->update(['is_active' => $newStatus]);

                $message = $newStatus ? 'Bot Resumed' : 'Bot Paused';

                return back()->with('success', $message);
            });
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroyLegacy(Request $request, $instanceId, EvolutionService $evoService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)->findOrFail($instanceId);
        $agent = $instance->agentConfig;

        try {
            if ($agent) {
                $evoService->deleteN8nBot($instance, $agent);
                $agent->update([
                    'is_active' => false,
                    'evo_integration_id' => null,
                    'webhook_url' => null,
                ]);
            }

            return back()->with('success', __('messages.success.disconnected_agent'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display agent detail page.
     */
    public function show(Request $request, string $agentId): Response
    {
        $tenantId = $request->user()->tenant_id;

        $agent = AgentConfig::with(['instance', 'knowledgeBases'])
            ->withCount('knowledgeBases')
            ->where('tenant_id', $tenantId)
            ->findOrFail($agentId);

        $availableInstances = EvolutionInstance::where('tenant_id', $tenantId)
            ->where('status', 'connected')
            ->where(function ($query) use ($agent) {
                $query->whereDoesntHave('agentConfig')
                    ->orWhere('id', $agent->evolution_instance_id);
            })
            ->get();

        return Inertia::render('Agents/Show', [
            'agent' => $agent,
            'availableInstances' => $availableInstances,
        ]);
    }

    /**
     * Clone an agent (copy without instance link).
     */
    public function clone(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $originalAgent = AgentConfig::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($request->route('agent'));

        try {
            $clonedAgent = $originalAgent->replicate();
            $clonedAgent->name = $request->input('name', $originalAgent->name.' (Copy)');
            $clonedAgent->evolution_instance_id = null;
            $clonedAgent->is_active = false;
            $clonedAgent->webhook_url = null;
            $clonedAgent->evo_integration_id = null;
            $clonedAgent->save();

            return back()->with('success', 'Agent cloned successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to clone agent: '.$e->getMessage()]);
        }
    }

    /**
     * Update agent settings (blocklist, delay, etc).
     */
    public function updateSettings(Request $request, string $agentId, EvolutionService $evoService)
    {
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

        $agent = AgentConfig::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($agentId);

        try {
            DB::transaction(function () use ($agent, $request, $evoService) {
                $currentSettings = $agent->settings ?? [];
                $newSettings = $request->input('settings', []);

                $mergedSettings = array_merge($currentSettings, $newSettings);

                if (isset($newSettings['blocklist'])) {
                    $mergedSettings['blocklist'] = array_values(array_unique($newSettings['blocklist']));
                }

                $agent->settings = $mergedSettings;
                $agent->save();

                if ($agent->isLinked() && $agent->is_active) {
                    $evoService->updateN8nSettings($agent->instance, $agent);
                }
            });

            return back()->with('success', 'Settings updated successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to update settings: '.$e->getMessage()]);

        }
    }

    /**
     * Reset system prompt to default.
     */
    public function resetSystemPrompt(Request $request, string $agentId)
    {
        $agent = AgentConfig::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($agentId);

        try {
            $agent->update([
                'system_prompt' => $agent->default_system_prompt,
            ]);

            return back()->with('success', 'System prompt reset to default.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to reset prompt: '.$e->getMessage()]);
        }
    }

    /**
     * Get prompt history for an agent (JSON response).
     */
    public function promptHistory(Request $request, string $agentId)
    {
        $agent = AgentConfig::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($agentId);

        $history = $agent->history()->get();

        return response()->json([
            'history' => $history,
        ]);
    }

    /**
     * Restore system prompt to a specific version.
     */
    public function restorePrompt(Request $request, string $agentId, int $version): RedirectResponse
    {
        $agent = AgentConfig::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($agentId);

        $historyRecord = $agent->history()->where('version', $version)->first();

        if (! $historyRecord) {
            return back()->withErrors(['error' => 'Version not found.']);
        }

        try {
            if ($agent->system_prompt) {
                AgentSystemPromptHistory::record($agent, 'Auto-saved before restore to v'.$version);
            }

            $agent->update([
                'system_prompt' => $historyRecord->system_prompt,
            ]);

            if ($agent->isLinked() && $agent->instance) {
                $evoService = app(EvolutionService::class);
                $evoService->updateN8nBot($agent->instance, $agent);
            }

            return back()->with('success', "Restored to version {$version}.");
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to restore prompt: '.$e->getMessage()]);
        }
    }
}
