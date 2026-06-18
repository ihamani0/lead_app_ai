<?php

namespace App\Http\Controllers\Api;

use App\Events\LeadFlagged;
use App\Http\Controllers\Controller;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\Tenant;
use App\Notifications\LeadFlaggedNotification;
use Illuminate\Http\Request;
use Log;

class LeadIntegrationController extends Controller
{
    // 2|NIWLFRm8ea3STzaftp9VzyaokIS8XLyy822VhjLm9234cd2f

    // Helper to find Tenant based on the WhatsApp Instance Name
    private function getTenantIdFromInstance($instanceName)
    {
        $instance = EvolutionInstance::where('instance_name', $instanceName)->firstOrFail();

        return $instance->tenant_id;
    }

    public function lookupLead(Request $request)
    {
        Log::info('Evolution lookupLead received', ['payload' => $request->all()]);
        $request->validate([
            'instance' => 'required',
            'phone' => 'required',
        ]);
        // n8n sends: { "instance": "tenant-slug-xyz", "phone": "551199...", "push_name": "..." }
        $instance = EvolutionInstance::where('instance_name', $request->input('instance'))->firstOrFail();
        $phone = $request->input('phone');
        $pushName = $request->input('push_name');

        $lead = Lead::firstOrCreate(
            ['tenant_id' => $instance->tenant_id, 'phone' => $phone],
            [
                'instance_id' => $instance->id,
                'team_id' => $instance->team_id,
                'name' => $pushName,
                'status' => 'NEW',
                'contact_status' => 'REPONDU',
                'phone' => $phone,
            ]
        );

        if ($pushName && $lead->name !== $pushName) {
            $lead->update(['name' => $pushName]);
        }

        return response()->json($lead);
    }

    public function updateLead(Request $request)
    {

        $request->validate([
            'instance' => 'required',
            'phone' => 'required',
        ]);

        $tenantId = $this->getTenantIdFromInstance($request->input('instance'));

        $lead = Lead::where('tenant_id', $tenantId)
            ->where('phone', $request->input('phone'))
            ->firstOrFail();

        $lead->update($request->only(['name', 'email', 'status', 'contact_status', 'notes']));

        return response()->json(['status' => 'success', 'lead' => $lead]);
    }

    // --- 3. ADS/FORM: STORE (Used by Lead Form Webhook) ---
    public function storeLead(Request $request)
    {

        $request->validate([
            'instance' => 'required',
            'phone' => 'required',
        ]);

        $instance = EvolutionInstance::where('instance_name', $request->input('instance'))->firstOrFail();

        $lead = Lead::updateOrCreate(
            ['tenant_id' => $instance->tenant_id, 'phone' => $request->input('phone')],
            [
                'name' => $request->input('name', 'UNKNOW'),
                'status' => 'NEW',
                'budget' => $request->input('budget'),
                'quartier' => $request->input('quartier'),
                'source' => $request->input('source'),
                'contact_status' => 'ATTENTE_REPONSE',
                'phone' => $request->input('phone'),
                'instance_id' => $instance->id,
                'team_id' => $instance->team_id,
            ]
        );

        return response()->json(['message' => 'leads created successfaully', 'lead' => $lead, 'instance' => $request->input('instance')]);
    }

    // ---5. Get Status of the Lead if he response or not
    public function getStatusContact(Request $request)
    {
        $request->validate([
            'instance' => 'required',
            'phone' => 'required',
        ]);
        // n8n sends: { "instance": "tenant-slug-xyz", "phone": "551199..." }
        $tenantId = $this->getTenantIdFromInstance($request->input('instance'));
        $phone = $request->input('phone');

        $lead = Lead::where('tenant_id', $tenantId)->where('phone', $phone)->first();

        if (! $lead) {
            return response()->json(['error', 'lead not found']);
        }

        return response()->json(['status' => $lead['contact_status']]);
    }

    // get instance with agent config
    public function getAgentConfig(Request $request)
    {
        $request->validate(['instance' => 'required']);

        $tenantId = $this->getTenantIdFromInstance($request->input('instance'));
        $instance = EvolutionInstance::where('tenant_id', $tenantId)
            ->where('instance_name', $request->input('instance'))
            ->with('agentConfig.knowledgeBases')
            ->firstOrFail();

        $agentConfig = $instance->agentConfig;
        $tenant = Tenant::findOrFail($tenantId);

        return response()->json([
            'status' => $agentConfig->is_active,
            'agent' => [
                'id' => $agentConfig->id,
                'name' => $agentConfig->name,
                'provider' => $agentConfig->provider,
                'webhook_url' => $agentConfig->webhook_url,
                'is_active' => $agentConfig->is_active,
                'settings' => $agentConfig->settings,
                'botId' => $agentConfig->evo_integration_id,
            ],
            'has_sufficient_tokens' => ! $tenant->isBelowThreshold(),
        ]);
    }

    public function flagLead(Request $request)
    {
        $validated = $request->validate([
            'instance' => 'required|string',
            'phone' => 'required|string',
            'reason' => 'required|string|max:1000',
            'severity' => 'sometimes|string|in:low,medium,high,critical',
        ]);

        $instance = EvolutionInstance::where('instance_name', $validated['instance'])->firstOrFail();

        $lead = Lead::where('tenant_id', $instance->tenant_id)
            ->where('phone', $validated['phone'])
            ->firstOrFail();

        $severity = $validated['severity'] ?? 'high';
        $agentName = $instance->agentConfig?->name;

        $lead->update([
            'flagged_at' => now(),
            'flag_reason' => $validated['reason'],
            'flag_severity' => $severity,
        ]);

        if ($lead->team) {
            $lead->team->users->each(
                fn ($user) => $user->notify(new LeadFlaggedNotification($lead, $validated['reason'], $severity, $agentName))
            );

            event(new LeadFlagged($lead, $validated['reason'], $severity, $agentName));
        }

        return response()->json([
            'status' => 'success',
            'lead_id' => $lead->id,
        ]);
    }
}
