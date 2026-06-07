<?php

namespace Ihamani0\LaravelEvolutionApi;

use Ihamani0\LaravelEvolutionApi\Exceptions\EvolutionApiException;
use Ihamani0\LaravelEvolutionApi\Services\InstanceService;
use Ihamani0\LaravelEvolutionApi\Services\N8NService;
use Ihamani0\LaravelEvolutionApi\Services\SettingsService;
use Ihamani0\LaravelEvolutionApi\Services\WebsocketService;
use Illuminate\Support\Facades\Http;

class EvolutionApiClient
{
    protected string $base_url;

    protected string $admin_key;

    protected ?string $instance;

    public function __construct(string $baseUrl, string $adminKey, ?string $instance = null)
    {
        $this->base_url = rtrim($baseUrl, '/');
        $this->admin_key = $adminKey;
        $this->instance = $instance;
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

    public function setInstance(string $instance): static
    {
        $this->instance = $instance;

        return $this;
    }

    // ----------------------------
    // Core HTTP methods
    // ----------------------------
    public function post(string $endpoint, array $data = [], ?string $token = null, array $extraHeaders = []): array
    {
        $headers = array_merge([
            'apikey' => $token ?? $this->admin_key,
            'Content-Type' => 'application/json',
        ], $extraHeaders);

        $response = Http::withHeaders($headers)
            ->post("{$this->base_url}/{$endpoint}", $data);

        return $response->json();
    }

    public function get(string $endpoint, ?string $token = null, array $extraHeaders = []): array
    {
        $headers = array_merge([
            'apikey' => $token ?? $this->admin_key,
        ], $extraHeaders);

        $response = Http::withHeaders($headers)
            ->get("{$this->base_url}/{$endpoint}");

        return $response->json();
    }

    public function delete(string $endpoint, ?string $token = null, array $extraHeaders = []): array
    {
        $headers = array_merge([
            'apikey' => $token ?? $this->admin_key,
        ], $extraHeaders);

        $response = Http::withHeaders($headers)
            ->delete("{$this->base_url}/{$endpoint}");

        return $response->json();
    }

    public function put(string $endpoint, array $data = [], ?string $token = null, array $extraHeaders = []): array
    {
        $headers = array_merge([
            'apikey' => $token ?? $this->admin_key,
        ], $extraHeaders);

        $response = Http::withHeaders($headers)
            ->put("{$this->base_url}/{$endpoint}", $data);

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
    public function instance(): InstanceService
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

    public function n8n(): N8NService
    {
        return new N8NService($this);
    }
}
