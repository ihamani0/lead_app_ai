<?php

use App\Models\AgentConfig;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('instance.{instanceName}', function ($user, $instanceName) {
    Log::info('info', [$user, $instanceName]);

    return true;
});

Broadcast::channel('lead', function ($user) {
    Log::info('info', [$user]);

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
