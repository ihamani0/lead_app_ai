<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\Lead;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    use WorkspaceScoped;

    private function resolveInstance(Request $request, Lead $lead): ?array
    {
        $lead = $this->findScoped($request, Lead::class, $lead->id);
        $lead->loadMissing('instance');

        $instance = $lead->instance;
        if (! $instance || ! $instance->api_token) {
            return null;
        }

        $agentConfig = $instance->agentConfig;

        return [
            'instance' => $instance,
            'token' => $instance->api_token,
            'instanceName' => $instance->instance_name,
            'remoteJid' => $lead->phone.'@s.whatsapp.net',
            'n8nId' => $agentConfig?->evo_integration_id,
        ];
    }

    public function index(Request $request, string $slug, Lead $lead)
    {
        $meta = $this->resolveInstance($request, $lead);
        if (! $meta || ! $meta['n8nId']) {
            return response()->json(['session' => null]);
        }

        $sessions = EvolutionApi::setInstance($meta['instanceName'], $meta['token'])
            ->n8n()
            ->fetchSessions($meta['n8nId']);

        $session = collect($sessions['sessions'] ?? [])
            ->firstWhere('remoteJid', $meta['remoteJid']);

        return response()->json(['session' => $session]);
    }

    public function allSessions(Request $request, string $slug, Lead $lead)
    {
        $meta = $this->resolveInstance($request, $lead);
        if (! $meta) {
            return response()->json(['sessions' => []]);
        }

        $sessions = EvolutionApi::setInstance($meta['instanceName'], $meta['token'])
            ->n8n()
            ->allSessions();

        return response()->json($sessions);
    }

    public function changeStatus(Request $request, string $slug, Lead $lead)
    {
        $meta = $this->resolveInstance($request, $lead);
        if (! $meta) {
            return response()->json(['error' => 'No instance found'], 400);
        }

        $validated = $request->validate([
            'status' => 'required|in:opened,paused,closed,delete',
        ]);

        $result = EvolutionApi::setInstance($meta['instanceName'], $meta['token'])
            ->n8n()
            ->changeSessionStatus($meta['remoteJid'], $validated['status']);

        return response()->json($result);
    }
}
