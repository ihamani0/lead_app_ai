<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

/**
 * SettingsService
 *
 * Manages instance-level behavior settings.
 * All methods require an active instance via setInstance().
 *
 * @package Ihamani0\LaravelEvolutionApi\Services
 */

class SettingsService extends BaseService{


    public function set(
        bool   $rejectCall      = false,
        string $msgCall         = '',
        bool   $groupsIgnore    = false,
        bool   $alwaysOnline    = false,
        bool   $readMessages    = false,
        bool   $readStatus      = false,
        bool   $syncFullHistory = false,
    ) : array{

        return $this->client->post("settings/set/{$this->client->getInstance()}", [
            'rejectCall'      => $rejectCall,
            'msgCall'         => $msgCall,
            'groupsIgnore'    => $groupsIgnore,
            'alwaysOnline'    => $alwaysOnline,
            'readMessages'    => $readMessages,
            'readStatus'      => $readStatus,
            'syncFullHistory' => $syncFullHistory,
        ]);
    }


    /**
     * Retrieve the current settings of the active instance.
     *
     * @return array The API response containing current settings.
     */
    public function find(): array
    {
        return $this->client->get("settings/find/{$this->client->getInstance()}");
    }

}