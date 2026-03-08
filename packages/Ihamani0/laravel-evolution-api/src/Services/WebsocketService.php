<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

use Ihamani0\LaravelEvolutionApi\Helpers\EvolutionEvents;

/**
 * WebsocketService
 *
 * Manages the WebSocket integration for an instance.
 * All methods require an active instance via setInstance().
 *
 * @package Ihamani0\LaravelEvolutionApi\Services
 */
class WebsocketService extends BaseService{


    /**
     * Configure the WebSocket integration for the active instance.
     *
     * @param bool          $enabled Whether to enable the WebSocket integration.
     * @param array<string> $events  List of events to listen to.
     *                               Use EvolutionEvents constants or EvolutionEvents::all().
     *
     * @return array The API response.
     */
    public function set(
        bool  $enabled = true,
        array $events  = [],
    ): array {
        // If no events passed, subscribe to all by default
        if (empty($events)) {
            $events = EvolutionEvents::all();
        }

        return $this->client->post("websocket/set/{$this->client->getInstance()}", [
            'websocket' => [
                'enabled' => $enabled,
                'events'  => $events,
            ],
        ]);
    }

    /**
     * Retrieve the current WebSocket configuration of the active instance.
     *
     * @return array The API response containing WebSocket settings.
     */
    public function find(): array
    {
        return $this->client->get("websocket/find/{$this->client->getInstance()}");
    }
    

}