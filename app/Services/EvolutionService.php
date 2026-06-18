<?php

namespace App\Services;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use Exception;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EvolutionService
{
    protected $baseUrl;

    protected $adminKey;

    protected $webhookUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.evolution.base_url');
        $this->adminKey = config('services.evolution.admin_key');
        $this->webhookUrl = config('services.evolution.webhook_url');
    }

    public function createInstance(string $instanceName, string $token, array $settings = []): array
    {
        $response = EvolutionApi::instance()->create($instanceName, $token, $settings);

        if (isset($response['error'])) {
            return $response;
        }

        return $response;
    }

    public function connectInstance(EvolutionInstance $instance): void
    {
        $response = EvolutionApi::setInstance($instance->api_token)
            ->instance()
            ->connect($instance->api_token, $this->webhookUrl, ['QRCODE', 'MESSAGE', 'SEND_MESSAGE', 'CONNECTION', 'PRESENCE']);

        Log::info('Instance connect response', ['response' => $response]);
    }

    public function fetchQrCode(EvolutionInstance $instance): void
    {
        try {

            $response = EvolutionApi::setInstance($instance->api_token)
                ->instance()
                ->qr();

            $qrCode = $response['code'] ?? null;
        } catch (Exception $e) {
            Log::error("Failed to fetch QR for {$instance->instance_name}: ".$e->getMessage());
            Log::error("Failed to fetch QR for {$instance->instance_name}: ".json_encode($response));
        }

    }

    public function pairInstance(EvolutionInstance $instance, string $phone): array
    {
        return EvolutionApi::setInstance($instance->api_token)
            ->instance()
            ->pair($phone);
    }

    public function logoutInstance(EvolutionInstance $instance): array
    {
        return EvolutionApi::setInstance($instance->api_token)
            ->instance()
            ->logout();
    }

    public function deleteInstance(EvolutionInstance $instance): array
    {
        return EvolutionApi::instance()->delete($instance->uuid);
    }

    public function restartInstance(EvolutionInstance $instance): array
    {
        return EvolutionApi::setInstance($instance->api_token)
            ->instance()
            ->reconnect();
    }

    public function getInstanceStatus(EvolutionInstance $instance): array
    {
        return EvolutionApi::setInstance($instance->api_token)
            ->instance()
            ->status();
    }

    public function disconnectInstance(EvolutionInstance $instance): array
    {
        return EvolutionApi::setInstance($instance->api_token)
            ->instance()
            ->disconnect();
    }

    // ==========Handle N8n Integration===============

    private function formatPhoneToJid(string $phone): string
    {
        return preg_replace('/[^0-9]/', '', $phone).'@s.whatsapp.net';
    }

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
            'description' => $settings['description'] ?? '',
            'webhookUrl' => $agent->webhook_url,
            'basicAuthUser' => $settings['basicAuthUser'] ?? '',
            'basicAuthPass' => $settings['basicAuthPass'] ?? '',
            'triggerType' => $settings['triggerType'] ?? 'all',
            'triggerOperator' => $settings['triggerOperator'] ?? 'equals',
            'triggerValue' => $settings['triggerValue'] ?? '',
            'expire' => (int) ($settings['expire'] ?? 0),
            'keywordFinish' => $settings['keywordFinish'] ?? '#STOP',
            'delayMessage' => (int) ($settings['delayMessage'] ?? 1000),
            'debounceTime' => (int) ($settings['debounceTime'] ?? 4),
            'unknownMessage' => $settings['unknownMessage'] ?? '',
            'listeningFromMe' => (bool) ($settings['listeningFromMe'] ?? false),
            'stopBotFromMe' => (bool) ($settings['stopBotFromMe'] ?? true),
            'keepOpen' => (bool) ($settings['keepOpen'] ?? false),
            'ignoreJids' => implode(',', $this->convertBlacklistToJids($settings['blocklist'] ?? [])),
            'splitMessages' => (bool) ($settings['splitMessages'] ?? false),
            'timePerChar' => (int) ($settings['timePerChar'] ?? 0),
            'systemMessage' => $settings['systemMessage'] ?? '',
            'contextWindowSize' => (int) ($settings['contextWindowSize'] ?? 5),
            'fallbackMessage' => $settings['fallbackMessage'] ?? '',
            'fallbackId' => $settings['fallbackId'] ?? null,
        ];
    }

    public function connectN8nBot(EvolutionInstance $instance, AgentConfig $agent)
    {
        $payload = $this->buildN8nPayload($agent, true);

        $response = Http::withHeaders(['apikey' => $this->adminKey])
            ->post("{$this->baseUrl}/n8n/create/{$instance->instance_name}", $payload);

        if ($response->failed()) {
            Log::error('Evolution API: '.$response->body());
            throw new Exception('Evolution API: '.$response->body());
        }

        return $response->json();
    }

    public function updateN8nBot(EvolutionInstance $instance, AgentConfig $agent)
    {
        $payload = $this->buildN8nPayload($agent, $agent->is_active);

        $response = Http::withHeaders(['apikey' => $this->adminKey])
            ->put("{$this->baseUrl}/n8n/update/{$agent->evo_integration_id}/{$instance->instance_name}", $payload);

        if ($response->failed()) {
            throw new Exception('Evolution API: '.$response->body());
        }

        return $response->json();
    }

    public function toggleN8nBot(EvolutionInstance $instance, AgentConfig $agent, bool $status)
    {
        $payload = $this->buildN8nPayload($agent, $status);

        $response = Http::withHeaders(['apikey' => $this->adminKey])
            ->put("{$this->baseUrl}/n8n/update/{$agent->evo_integration_id}/{$instance->instance_name}", $payload);

        if ($response->failed()) {
            throw new Exception('Evolution API: '.$response->body());
        }

        return $response->json();
    }

    public function deleteN8nBot(EvolutionInstance $instance, AgentConfig $agent)
    {
        if (! $agent->evo_integration_id) {
            return true;
        }

        $response = Http::withHeaders(['apikey' => $this->adminKey])
            ->delete("{$this->baseUrl}/n8n/delete/{$agent->evo_integration_id}/{$instance->instance_name}");

        if ($response->failed()) {
            throw new Exception('Evolution API: '.$response->body());
        }

        return $response->successful();
    }

    public function updateN8nSettings(EvolutionInstance $instance, AgentConfig $agent, ?array $oldBlocklist = null)
    {
        if (! $agent->evo_integration_id) {
            return;
        }

        $newBlocklist = $agent->settings['blocklist'] ?? [];
        $oldBlocklist = $oldBlocklist ?? [];

        $addedPhones = array_values(array_diff($newBlocklist, $oldBlocklist));
        $removedPhones = array_values(array_diff($oldBlocklist, $newBlocklist));

        foreach ($addedPhones as $phone) {
            $jid = $this->formatPhoneToJid($phone);
            EvolutionApi::setInstance($instance->api_token)
                ->n8n()
                ->ignoreJid($agent->evo_integration_id, $jid, 'add');
        }

        foreach ($removedPhones as $phone) {
            $jid = $this->formatPhoneToJid($phone);
            EvolutionApi::setInstance($instance->api_token)
                ->n8n()
                ->ignoreJid($agent->evo_integration_id, $jid, 'remove');
        }
    }
}
