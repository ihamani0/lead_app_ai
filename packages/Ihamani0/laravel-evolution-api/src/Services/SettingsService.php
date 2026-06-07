<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

class SettingsService extends BaseService
{
    public function set(
        string $uuid,
        bool $rejectCall = false,
        string $msgCall = '',
        bool $groupsIgnore = false,
        bool $alwaysOnline = false,
        bool $readMessages = false,
        bool $readStatus = false,
        bool $syncFullHistory = false,
    ): array {
        return $this->client->put("instance/{$uuid}/advanced-settings", [
            'rejectCalls' => $rejectCall,
            'rejectCallMessage' => $msgCall,
            'readMessages' => $readMessages,
            'readStatus' => $readStatus,
            'alwaysOnline' => $alwaysOnline,
        ], $this->client->getInstance());
    }

    public function find(string $uuid): array
    {
        return $this->client->get("instance/{$uuid}/advanced-settings", $this->client->getInstance());
    }
}
