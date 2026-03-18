<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

use Ihamani0\LaravelEvolutionApi\Exceptions\EvolutionApiException;
use Ihamani0\LaravelEvolutionApi\Helpers\N8NAuth;
use Ihamani0\LaravelEvolutionApi\Helpers\N8NTrigger;

/**
 * N8NService
 *
 * Manages N8N bot integrations for an Evolution API instance.
 * Covers bot CRUD, default settings, and session management.
 * All methods require an active instance via setInstance().
 */
class N8NService extends BaseService
{
    // -------------------------
    // Bot CRUD
    // -------------------------

    /**
     * Create a new N8N bot for the active instance.
     *
     * @param  string  $apiUrl  The N8N webhook or API URL.
     * @param  N8NTrigger  $trigger  When this bot should be triggered.
     * @param  bool  $enabled  Whether the bot is active.
     * @param  N8NAuth  $auth  Optional API key for the N8N endpoint.
     * @param  int  $expire  Session expiry time in minutes. 0 = never.
     * @param  string  $keywordFinish  Message that ends the session.
     * @param  int  $delayMessage  Delay in ms before sending a response.
     * @param  string  $unknownMessage  Message sent when input is not understood.
     * @param  bool  $listeningFromMe  Whether to process messages sent by the instance itself.
     * @param  bool  $stopBotFromMe  Whether the instance owner can stop the bot.
     * @param  bool  $keepOpen  Keep the session open after finishing.
     * @param  int  $debounceTime  Wait time in ms to debounce rapid messages.
     * @param  array  $ignoreJids  List of JIDs to ignore.
     * @return array The API response.
     */
    public function create(
        string $apiUrl,
        N8NTrigger $trigger,
        bool $enabled = true,
        ?N8NAuth $auth = null,
        int $expire = 0,
        string $keywordFinish = '#SAIR',
        int $delayMessage = 1000,
        string $unknownMessage = 'Message not recognized',
        bool $listeningFromMe = false,
        bool $stopBotFromMe = false,
        bool $keepOpen = false,
        int $debounceTime = 0,
        array $ignoreJids = []
    ): array {

        $auth ??= N8NAuth::none();

        $payload = array_merge(
            [
                'enabled' => $enabled,
                'apiUrl' => $apiUrl,
                'expire' => $expire,
                'keywordFinish' => $keywordFinish,
                'delayMessage' => $delayMessage,
                'unknownMessage' => $unknownMessage,
                'listeningFromMe' => $listeningFromMe,
                'stopBotFromMe' => $stopBotFromMe,
                'keepOpen' => $keepOpen,
                'debounceTime' => $debounceTime,
                'ignoreJids' => $ignoreJids,
            ],
            $trigger->toArray(),
            $auth->toArray(),
        );

        return $this->client->post("n8n/create/{$this->client->getInstance()}", $payload);
    }

    /**
     * Find all N8N bots registered for the active instance.
     *
     * @return array List of bots.
     */
    public function find(): array
    {
        return $this->client->get("n8n/find/{$this->client->getInstance()}");
    }

    /**
     * Fetch a single N8N bot by its ID.
     *
     * @param  string  $n8nId  The ID of the N8N bot.
     * @return array The bot details.
     */
    public function fetch(string $n8nId): array
    {
        if (! $n8nId) {
            throw new EvolutionApiException('N8N ID is required');
        }

        return $this->client->get("n8n/fetch/{$n8nId}/{$this->client->getInstance()}");
    }

    /**
     * Update an existing N8N bot.
     *
     * @param  string  $n8nId  The ID of the bot to update.
     * @param  string  $apiUrl  The N8N webhook or API URL.
     * @param  N8NTrigger  $trigger  When this bot should be triggered.
     * @param  bool  $enabled  Whether the bot is active.
     * @param  string|null  $apiKey  Optional API key for the N8N endpoint.
     * @param  int  $expire  Session expiry time in minutes. 0 = never.
     * @param  string  $keywordFinish  Message that ends the session.
     * @param  int  $delayMessage  Delay in ms before sending a response.
     * @param  string  $unknownMessage  Message sent when input is not understood.
     * @param  bool  $listeningFromMe  Whether to process messages sent by the instance itself.
     * @param  bool  $stopBotFromMe  Whether the instance owner can stop the bot.
     * @param  bool  $keepOpen  Keep the session open after finishing.
     * @param  int  $debounceTime  Wait time in ms to debounce rapid messages.
     * @param  array  $ignoreJids  List of JIDs to ignore.
     * @return array The API response.
     */
    public function update(
        string $n8nId,
        string $apiUrl,
        N8NTrigger $trigger,
        bool $enabled = true,
        ?string $apiKey = null,
        int $expire = 0,
        string $keywordFinish = '#SAIR',
        int $delayMessage = 1000,
        string $unknownMessage = 'Message not recognized',
        bool $listeningFromMe = false,
        bool $stopBotFromMe = false,
        bool $keepOpen = false,
        int $debounceTime = 0,
        array $ignoreJids = []
    ): array {
        $payload = array_merge(
            [
                'enabled' => $enabled,
                'apiUrl' => $apiUrl,
                'expire' => $expire,
                'keywordFinish' => $keywordFinish,
                'delayMessage' => $delayMessage,
                'unknownMessage' => $unknownMessage,
                'listeningFromMe' => $listeningFromMe,
                'stopBotFromMe' => $stopBotFromMe,
                'keepOpen' => $keepOpen,
                'debounceTime' => $debounceTime,
                'ignoreJids' => $ignoreJids,
            ],
            $trigger->toArray(),
            $apiKey ? ['apiKey' => $apiKey] : [],
        );

        return $this->client->put("n8n/update/{$n8nId}/{$this->client->getInstance()}", $payload);
    }

    /**
     * Delete an N8N bot by its ID.
     *
     * @param  string  $n8nId  The ID of the bot to delete.
     * @return array The API response.
     */
    public function delete(string $n8nId): array
    {
        return $this->client->delete("n8n/delete/{$n8nId}/{$this->client->getInstance()}");
    }

    // -------------------------
    // Default Settings
    // -------------------------

    /**
     * Set the default N8N settings for the active instance.
     * These defaults apply to all bots unless overridden per bot.
     *
     * @param  int  $expire  Session expiry in minutes. 0 = never.
     * @param  string  $keywordFinish  Keyword that closes the session.
     * @param  int  $delayMessage  Delay in ms before responding.
     * @param  string  $unknownMessage  Fallback message for unrecognized input.
     * @param  bool  $listeningFromMe  Process messages sent by the instance itself.
     * @param  bool  $stopBotFromMe  Allow instance owner to stop the bot.
     * @param  bool  $keepOpen  Keep session open after completion.
     * @param  int  $debounceTime  Debounce wait time in ms.
     * @param  array  $ignoreJids  JIDs to exclude from bot processing.
     * @param  string|null  $n8nIdFallback  Bot ID to use as fallback when no bot matches.
     * @return array The API response.
     */
    public function setSettings(
        int $expire = 20,
        string $keywordFinish = '#SAIR',
        int $delayMessage = 1000,
        string $unknownMessage = 'Message not recognized',
        bool $listeningFromMe = false,
        bool $stopBotFromMe = false,
        bool $keepOpen = false,
        int $debounceTime = 0,
        array $ignoreJids = [],
        ?string $n8nIdFallback = null,
        ?bool $splitMessages = false,
        ?int $timePerChar = 0
    ): array {
        $payload = [
            'expire'            => $expire,
            'keywordFinish'     => $keywordFinish,
            'delayMessage'      => $delayMessage,
            'unknownMessage'    => $unknownMessage,
            'listeningFromMe'   => $listeningFromMe,
            'stopBotFromMe'     => $stopBotFromMe,
            'keepOpen'          => $keepOpen,
            'debounceTime'      => $debounceTime,
            'ignoreJids'        => $ignoreJids,
            'splitMessages'     => $splitMessages ?? false,
            'timePerChar'       => $timePerChar   ?? 0,
        ];

        if ($n8nIdFallback) {
            $payload['n8nIdFallback'] = $n8nIdFallback;
        }

        return $this->client->post("n8n/settings/{$this->client->getInstance()}", $payload);
    }

    /**
     * Fetch the current default N8N settings for the active instance.
     *
     * @return array The current default settings.
     */
    public function getSettings(): array
    {
        return $this->client->get("n8n/fetchSettings/{$this->client->getInstance()}");
    }

    // -------------------------
    // Sessions
    // -------------------------

    /**
     * Change the status of an N8N session for a specific contact.
     *
     * @param  string  $remoteJid  The contact JID (e.g. '5511912345678@s.whatsapp.net').
     * @param  string  $status  The new session status: 'opened' | 'paused' | 'closed'.
     * @return array The API response.
     */
    public function changeSessionStatus(string $remoteJid, string $status): array
    {
        return $this->client->post("n8n/changeStatus/{$this->client->getInstance()}", [
            'remoteJid' => $remoteJid,
            'status' => $status,
        ]);
    }

    /**
     * Fetch all sessions for a specific N8N bot.
     *
     * @param  string  $n8nId  The ID of the N8N bot.
     * @return array List of sessions.
     */
    public function fetchSessions(string $n8nId): array
    {
        return $this->client->get("n8n/fetchSessions/{$n8nId}/{$this->client->getInstance()}");
    }
}
