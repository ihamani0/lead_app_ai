<?php

namespace App\Services;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Support\Facades\Http;

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

        EvolutionApi::setInstance($instanceName)->instance()->connect();

        Http::withHeaders([
            'apiKey' => $this->apiKey,
            'Content-Type' => 'application/json',
        ])->get("{$this->baseUrl}/instance/connect/{$instanceName}");

        //  if ($response->successful()) {

        //     // Evolution v2 usually returns {
        //     //   "pairingCode": "WZYEH1YY",
        //     //   "code": "2@y8eK+bjtEjUWy9/FOM...",
        //     //   "count": 1
        //     // }

        //     return $response->json('code');
        // }

        // return null;
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

    // ==========Handle N8n Integration===============

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
}
