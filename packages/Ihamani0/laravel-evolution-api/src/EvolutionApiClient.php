<?php

namespace Ihamani0\LaravelEvolutionApi;

use Ihamani0\LaravelEvolutionApi\Exceptions\EvolutionApiException;
use Ihamani0\LaravelEvolutionApi\Services\InstanceService;
use Ihamani0\LaravelEvolutionApi\Services\SettingsService;
use Ihamani0\LaravelEvolutionApi\Services\WebsocketService;
use Illuminate\Support\Facades\Http;

class EvolutionApiClient
{
    protected string $base_url;

    protected string $api_key;

    protected ?string $instance;

    public function __construct(string $baseUrl, string $apiKey, ?string $Inistance = null)
    {
        $this->base_url = rtrim($baseUrl, '/');
        $this->api_key = $apiKey;
        $this->instance = $Inistance;

    }

    // ----------------------------
    // Getter \ Setter
    // ----------------------------
    public function getInstance(): string
    {
        if (empty($this->instance)) {
            throw new EvolutionApiException(
                'No instance specified. Use EvolutionApi::setInstance("your-instance") before calling this method.'
            );
        }

        return $this->instance;
    }

    // Dynamically switch instance
    public function setInstance(string $instance): static
    {
        $this->instance = $instance;

        return $this;
    }

    // ----------------------------
    // Core HTTP methods
    // ----------------------------

    public function post(string $endpoint, array $data): array
    {
        $response = Http::withHeaders([
            'apikey' => $this->api_key,
            'Content-Type' => 'application/json',
        ])->post("{$this->base_url}/{$endpoint}", $data);

        return $response->json();
    }

    public function get(?string $endpoint = null): array
    {
        $response = Http::withHeaders([
            'apikey' => $this->api_key,
        ])->get("{$this->base_url}/{$endpoint}");

        return $response->json();
    }

    public function delete(string $endpoint): array
    {
        $response = Http::withHeaders([
            'apikey' => $this->api_key,
        ])->delete("{$this->base_url}/{$endpoint}");

        return $response->json();
    }

    public function put(string $endpoint, array $data = []): array
    {
        $response = Http::withHeaders([
            'apikey' => $this->api_key,
        ])->put("{$this->base_url}/{$endpoint}", $data);

        return $response->json();
    }

    // ----------------------------
    //  health Check
    // ----------------------------
    public function healthCheck(): array
    {
        return $this->get('');
    }

    // ----------------------------
    // Services
    // ----------------------------
    public function instance()
    {
        return new InstanceService($this);
    }

    public function settings(): SettingsService
    {
        return new SettingsService($this);
    }

    public function websocket(): WebsocketService
    {
        return new WebsocketService($this);
    }
}
