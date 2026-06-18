<?php

use App\Models\AgentConfig;
use App\Models\Lead;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('instance.{instanceName}', function ($user, $instanceName) {
    return true;
});

Broadcast::channel('lead.{leadId}', function ($user, $leadId) {
    $lead = Lead::find($leadId);
    if (! $lead) {
        return false;
    }

    return $user->tenant_id === $lead->tenant_id;
});

Broadcast::channel('lead', function ($user) {
    return true;
});

Broadcast::channel('test-conversation.{agentId}', function ($user, $agentId) {
    $agent = AgentConfig::find($agentId);

    if (! $agent) {
        return false;
    }

    return $agent->tenant_id === $user->tenant_id;
});

Broadcast::channel('knowledge-base.{tenantId}', function ($user, $tenantId) {
    return $user->tenant_id === $tenantId;
});

Broadcast::channel('knowledge-base.agent.{agentConfigId}', function ($user, $agentConfigId) {
    $agent = AgentConfig::find($agentConfigId);

    if (! $agent) {
        return false;
    }

    return $agent->tenant_id === $user->tenant_id;
});

Broadcast::channel('notifications.team.{teamId}', function ($user, $teamId) {
    return $user->allTeams()->contains('id', (int) $teamId);
});
