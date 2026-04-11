<?php

namespace App\Services;

use App\Events\QrCodeUpdated;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EvolutionService
{
    protected $baseUrl;

    protected $apiKey;

    protected $evolutaion_url_webhook;

    public function __construct()
    {
        $this->baseUrl = config('services.evolution.base_url');
        $this->apiKey = config('services.evolution.api_key');
        $this->evolutaion_url_webhook = config('services.evolution.evolutaion_url_webhook');

    }

    public function createInstance(string $instanceName, string $token): array
    {

        $response = EvolutionApi::instance()->create($instanceName, [
            'token' => $token,
            'reject_call' => true,
            'webhook' => [
                'enabled' => true,
                'url' => $this->evolutaion_url_webhook,
                'byEvents' => false,
                'events' => [
                    'CONNECTION_UPDATE',
                    'MESSAGES_UPSERT',
                    'QRCODE_UPDATED',
                ],
            ],
        ]);

        return $response;

    }

    public function fetchQrCode(string $instanceName): void
    {
        // 1. Make the request to Evolution API
        $response = Http::withHeaders([
            'apikey' => $this->apiKey, // 'apikey' should usually be lowercase 'a' in v2
            'Content-Type' => 'application/json',
        ])->get("{$this->baseUrl}/instance/connect/{$instanceName}");

        // 2. If successful, Evolution returns the QR code in the response body!
        if ($response->successful()) {
            $data = $response->json();

            // Extract the raw code
            $qrCode = $data['code'] ?? null;

            // 3. Instantly broadcast it to the frontend!
            // This guarantees the UI updates immediately even if the webhook is delayed.
            if ($qrCode) {
                broadcast(new QrCodeUpdated($instanceName, $qrCode));
            }
        } else {
            Log::error("Failed to fetch QR for {$instanceName}: ".$response->body());
        }
    }

    public function logoutInstance(string $instanceName): array
    {

        $response = EvolutionApi::setInstance($instanceName)->instance()->logout();

        return $response;
    }

    public function deleteInstance(string $instanceName): array
    {

        $response = EvolutionApi::setInstance($instanceName)->instance()->delete();

        // $response = Http::withHeaders([
        //     'apiKey' => $this->apiKey,
        //     'Content-Type' => 'application/json'
        //  ])->delete("{$this->baseUrl}/instance/delete/{$instanceName}");

        return $response;
    }

    public function restartInstance(string $instanceName)
    {

        $response = EvolutionApi::setInstance($instanceName)->instance()->restart();

        return $response;
    }

    public function getInstanceStatus(string $instanceName): array
    {
        return EvolutionApi::setInstance($instanceName)->instance()->status();
    }

    public function disconnectInstance(string $instanceName): array
    {
        return EvolutionApi::setInstance($instanceName)->instance()->logout();
    }

    // ==========Handle N8n Integration===============

    /**
     * Convert phone number to WhatsApp JID format.
     * Example: +213 697 096 705 -> 213697096705@s.whatsapp.net
     */
    private function formatPhoneToJid(string $phone): string
    {
        return preg_replace('/[^0-9]/', '', $phone).'@s.whatsapp.net';
    }

    /**
     * Convert blacklist phone numbers to JID format.
     */
    private function convertBlacklistToJids(array $blacklist): array
    {
        return collect($blacklist)
            ->map(fn ($phone) => $this->formatPhoneToJid($phone))
            ->toArray();
    }

    private function buildN8nPayload(AgentConfig $agent, bool $isEnabled)
    {
        $settings = $agent->settings ?? [];

        return [
            'enabled' => $isEnabled,
            'webhookUrl' => $agent->webhook_url,
            'triggerType' => $settings['triggerType'] ?? 'all',
            'triggerOperator' => $settings['triggerOperator'] ?? 'equals',
            'triggerValue' => $settings['triggerValue'] ?? '',
            'expire' => (int) ($settings['expire'] ?? 0),
            'keywordFinish' => $settings['keywordFinish'] ?? '#STOP',
            'delayMessage' => (int) ($settings['delayMessage'] ?? 1000),
            'unknownMessage' => $settings['unknownMessage'] ?? '',
            'listeningFromMe' => (bool) ($settings['listeningFromMe'] ?? false),
            'stopBotFromMe' => (bool) ($settings['stopBotFromMe'] ?? true),
            'ignoreJids' => $this->convertBlacklistToJids($settings['blacklist'] ?? []),
        ];
    }

    public function connectN8nBot(EvolutionInstance $instance, AgentConfig $agent)
    {

        $payload = $this->buildN8nPayload($agent, true);

        $response = Http::withHeaders(['apikey' => $this->apiKey])
            ->post("{$this->baseUrl}/n8n/create/{$instance->instance_name}", $payload);

        if ($response->failed()) {
            throw new \Exception('Evolution API: '.$response->body());
        }

        return $response->json();

    }

    public function updateN8nBot(EvolutionInstance $instance, AgentConfig $agent)
    {

        $payload = $this->buildN8nPayload($agent, $agent->is_active);

        $response = Http::withHeaders(['apikey' => $this->apiKey])
            ->put("{$this->baseUrl}/n8n/update/{$agent->evo_integration_id}/{$instance->instance_name}", $payload);

        if ($response->failed()) {
            throw new \Exception('Evolution API: '.$response->body());
        }

        return $response->json();
    }

    public function toggleN8nBot(EvolutionInstance $instance, AgentConfig $agent, bool $status)
    {
        $payload = $this->buildN8nPayload($agent, $status);

        $response = Http::withHeaders(['apikey' => $this->apiKey])
            ->put("{$this->baseUrl}/n8n/update/{$agent->evo_integration_id}/{$instance->instance_name}", $payload);

        if ($response->failed()) {
            dd($response->body());
            throw new \Exception('Evolution API: '.$response->body());
        }

        return $response->json();
    }

    public function deleteN8nBot(EvolutionInstance $instance, AgentConfig $agent)
    {
        if (! $agent->evo_integration_id) {
            return true;
        }

        $response = Http::withHeaders(['apikey' => $this->apiKey])
            ->delete("{$this->baseUrl}/n8n/delete/{$agent->evo_integration_id}/{$instance->instance_name}");

        if ($response->failed()) {
            throw new \Exception('Evolution API: '.$response->body());
        }

        return $response->successful();
    }

    /**
     * Update global N8N settings (applies to all bots).
     * Gets current settings, merges with new blacklist, sends complete config.
     */
    public function updateN8nSettings(EvolutionInstance $instance, AgentConfig $agent)
    {
        $settings = $agent->settings ?? [];
        $blacklist = $settings['blocklist'] ?? [];

        if (empty($blacklist)) {
            return;
        }

        // Get current global settings
        $currentSettings = EvolutionApi::setInstance($instance->instance_name)
            ->n8n()
            ->getSettings();

        Log::info('Current settings: '.json_encode($currentSettings));

        // Convert new blacklist to JIDs
        $newJids = $this->convertBlacklistToJids($blacklist);

        // Merge with existing ignoreJids
        $existingJids = $currentSettings['ignoreJids'] ?? [];
        $mergedJids = array_unique(array_merge($existingJids, $newJids));

        // Send complete settings (POST overwrites all)
        EvolutionApi::setInstance($instance->instance_name)
            ->n8n()
            ->setSettings(
                expire: $currentSettings['expire'] ?? 20,
                keywordFinish: $currentSettings['keywordFinish'] ?? '#STOP',
                delayMessage: $currentSettings['delayMessage'] ?? 1000,
                unknownMessage: $currentSettings['unknownMessage'] ?: 'Message not recognized',
                listeningFromMe: $currentSettings['listeningFromMe'] ?? false,
                stopBotFromMe: $currentSettings['stopBotFromMe'] ?? true,
                keepOpen: $currentSettings['keepOpen'] ?? false,
                debounceTime: $currentSettings['debounceTime'] ?? 0,
                ignoreJids: $mergedJids,
            );
    }
}
