<?php

namespace App\Http\Controllers;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Services\EvolutionService;
use Exception;
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
     *
     * @return Inertia\Response
     *
     * @description
     * Currently a placeholder. Can be implemented to return all agents for the tenant.
     */
    public function index(): Response
    {

        $tenantId = Auth::user()->tenant_id;

        // Fetch all agents for this tenant, including the WhatsApp instance data
        $agents = AgentConfig::with('instance')
            ->where('tenant_id', $tenantId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Fetch connected instances that DO NOT have an agent yet
        // So the user knows which numbers are available for automation
        $availableInstances = EvolutionInstance::where('tenant_id', $tenantId)
            ->where('status', 'connected')
            ->doesntHave('agentConfig')
            ->get();

        return Inertia::render('Agents/Index', [
            'agents' => $agents,
            'availableInstances' => $availableInstances,
        ]);

    }

    /**
     * Create or connect an AI agent to an Evolution instance.
     *
     * @param  Request  $request  The HTTP request, must include 'webhook_url' as a valid URL.
     * @param  string  $instanceId  The ID of the Evolution instance to connect the bot to.
     * @param  EvolutionService  $evoService  Service to handle API communication with Evolution.
     * @return \Illuminate\Http\RedirectResponse Redirects back with success or error message.
     *
     * @description
     * - Validates webhook URL.
     * - Finds the instance for the current tenant.
     * - Creates or updates the local AgentConfig record.
     * - Sends the agent configuration to Evolution API.
     * - Stores the returned evo_integration_id locally.
     * - Sets default settings if the agent is new (delayMessage, keywordFinish).
     */
    public function store(Request $request, string $instanceId, EvolutionService $evoService): \Illuminate\Http\RedirectResponse
    {

        $request->validate(['webhook_url' => 'required|url']);

        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)->findOrFail($instanceId);

        // dd($instance);

        try {
            // Create or update the Agent Config locally first
            return DB::transaction(function () use ($instance, $request, $evoService) {
                $agent = AgentConfig::updateOrCreate(
                    [
                        'tenant_id' => $instance->tenant_id,
                        'evolution_instance_id' => $instance->id,
                    ], [
                        'instance_name' => $instance->instance_name,
                        'webhook_url' => $request->webhook_url,
                        'is_active' => true,
                        // Default settings if brand new
                        'settings' => ['delayMessage' => 1200, 'keywordFinish' => '#STOP'],
                    ]
                );

                // Send to Evolution API
                $evoResponse = $evoService->connectN8nBot($instance, $agent);

                // Save the Integration ID returned by Evolution
                $agent->update(['evo_integration_id' => $evoResponse['id'] ?? null]);

                return back()->with('success', __('message.success.connected_agent'));
            });

        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

    }

    /**
     * Update AI agent settings and system prompt.
     *
     * @param  Request  $request  The HTTP request; optional fields:
     *                            - system_prompt (string)
     *                            - settings (array)
     *                            - webhook_url (string, URL)
     * @param  string  $instanceId  The ID of the Evolution instance.
     * @param  EvolutionService  $evoService  Service to communicate with Evolution API.
     * @return \Illuminate\Http\RedirectResponse Redirects back with success or error message.
     *
     * @description
     * - Finds the agent config for the instance.
     * - Merges new settings with existing ones.
     * - Updates system prompt and webhook URL if provided.
     * - Sends updated settings to Evolution API (prompt handled by n8n).
     */
    public function update(Request $request, $instanceId, EvolutionService $evoService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($instanceId);

        $agent = $instance->agentConfig;
        if (! $agent) {
            return back()->withErrors(['error' => __('message.error.no_found_agent')]);
        }

        $request->validate([
            'config_webhook_url' => 'nullable|url',
            'system_prompt' => 'required|string',
            'settings' => 'nullable|array',
        ]);

        try {
            // Update local DB
            $agent->update([
                'config_webhook_url' => $request->config_webhook_url ?? $agent->config_webhook_url,
                'system_prompt' => $request->system_prompt,
                'settings' => [...($agent->settings ?? []), ...($request->settings ?? [])],
            ]);

            // Sync Settings with Evolution API (Prompt is handled by n8n, but settings go to Evo)
            $evoService->updateN8nBot($instance, $agent);

            // if ($agent->config_webhook_url) {
            //      \Illuminate\Support\Facades\Http::withHeaders(['X-N8N-API-KEY' => $this->apiKey])->post($agent->config_webhook_url, [
            //         'system_prompt' => $agent->system_prompt,
            //     ]);
            // }

            return back()->with('success', __('message.success.updated_agent'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Toggle the AI agent status (pause/resume).
     *
     * @param  Request  $request  The HTTP request.
     * @param  string  $instanceId  The ID of the Evolution instance.
     * @param  EvolutionService  $evoService  Service to communicate with Evolution API.
     * @return \Illuminate\Http\RedirectResponse Redirects back with message indicating bot status.
     *
     * @description
     * - Retrieves the agent config for the instance.
     * - Computes the new status as the opposite of current 'is_active'.
     * - Calls Evolution API to pause/resume the bot.
     * - Updates local DB 'is_active' field.
     * - Returns a message: 'Bot Paused' or 'Bot Resumed'.
     */
    public function toggle(Request $request, $instanceId, EvolutionService $evoService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)->findOrFail($instanceId);
        $agent = $instance->agentConfig;

        try {

            return DB::transaction(function () use ($instance, $agent, $evoService) {

                $newStatus = ! $agent->is_active;

                // Send to Evolution API  // Tell Evolution to pause/resume
                $evoService->toggleN8nBot($instance, $agent, $newStatus);

                // Update DB
                $agent->update(['is_active' => $newStatus]);

                $message = $newStatus ? 'Bot Resumed' : 'Bot Paused';

                return back()->with('success', $message);
            });
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Disconnect the AI agent from Evolution API and clear integration details.
     *
     * @param  Request  $request  The HTTP request.
     * @param  string  $instanceId  The ID of the Evolution instance.
     * @param  EvolutionService  $evoService  Service to communicate with Evolution API.
     * @return \Illuminate\Http\RedirectResponse Redirects back with success or error message.
     *
     * @description
     * - Retrieves the agent config for the instance.
     * - Calls Evolution API to delete the bot.
     * - Updates local DB to clear integration ID and webhook URL.
     * - Sets 'is_active' to false.
     * - Preserves system prompt/settings in local DB for future reuse.
     */
    public function destroy(Request $request, $instanceId, EvolutionService $evoService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)->findOrFail($instanceId);
        $agent = $instance->agentConfig;

        try {
            if ($agent) {
                // Remove from Evolution
                $evoService->deleteN8nBot($instance, $agent);

                // We keep the record but clear the connection details so they don't lose their prompt
                $agent->update([
                    'is_active' => false,
                    'evo_integration_id' => null,
                    'webhook_url' => null,
                ]);
            }

            return back()->with('success', __('message.success.disconnected_agent'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
