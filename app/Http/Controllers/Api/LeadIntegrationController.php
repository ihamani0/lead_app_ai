<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use Illuminate\Http\Request;

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
        $request->validate([
            'instance' => 'required',
            'phone' => 'required',
        ]);
        // n8n sends: { "instance": "tenant-slug-xyz", "phone": "551199..." }
        $tenantId = $this->getTenantIdFromInstance($request->input('instance'));
        $phone = $request->input('phone');
        $instance_id = EvolutionInstance::where('instance_name', $request->input('instance'))->firstOrFail()->id;

        $lead = Lead::firstOrCreate(
            ['tenant_id' => $tenantId, 'phone' => $phone],
            [
                'instance_id' => $instance_id,
                'name' => $request->input('name', 'UNKNOW'),
                'status' => 'NEW',
                'contact_status' => 'REPONDU',
                'phone' => $phone,
            ]
        );

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

        $tenantId = $this->getTenantIdFromInstance($request->input('instance'));

        $instance_id = EvolutionInstance::where('instance_name', $request->input('instance'))->firstOrFail()->id;

        $lead = Lead::updateOrCreate(
            ['tenant_id' => $tenantId, 'phone' => $request->input('phone')],
            [
                'name' => $request->input('name', 'UNKNOW'),
                'status' => 'NEW',
                'budget' => $request->input('budget'),
                'quartier' => $request->input('quartier'),
                'source' => $request->input('source'),
                'contact_status' => 'ATTENTE_REPONSE',
                'phone' => $request->input('phone'),
                'instance_id' => $instance_id,
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

        return response()->json([
            'status' => $agentConfig->is_active,
            'agent' => [
                'id' => $agentConfig->id,
                'name' => $agentConfig->name,
                'provider' => $agentConfig->provider,
                'webhook_url' => $agentConfig->webhook_url,
                'is_active' => $agentConfig->is_active,
                'settings' => $agentConfig->settings,
            ],
            'system_prompt' => $agentConfig->system_prompt, // Only once here
        ]);
    }
}
