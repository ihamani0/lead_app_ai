<?php

namespace Ihamani0\LaravelEvolutionApi;

use Ihamani0\LaravelEvolutionApi\Exceptions\EvolutionApiException;
use Ihamani0\LaravelEvolutionApi\Services\InstanceService;
use Ihamani0\LaravelEvolutionApi\Services\MessageService;
use Ihamani0\LaravelEvolutionApi\Services\N8NService;
use Ihamani0\LaravelEvolutionApi\Services\SendService;
use Ihamani0\LaravelEvolutionApi\Services\SettingsService;
use Ihamani0\LaravelEvolutionApi\Services\UserService;
use Ihamani0\LaravelEvolutionApi\Services\WebsocketService;
use Illuminate\Support\Facades\Http;

class EvolutionApiClient
{
    protected string $base_url;

    protected string $admin_key;

    protected ?string $instance;

    protected ?string $instanceToken = null;

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

    /**
     * Set the active instance and optionally its authentication token.
     *
     * @param  string  $instance  The instance name (used in URLs and as fallback token).
     * @param  string|null  $token  The instance-specific API token. Falls back to $instance if null.
     * @return $this
     */
    public function setInstance(string $instance, ?string $token = null): static
    {
        $this->instance = $instance;
        $this->instanceToken = $token;

        return $this;
    }

    /**
     * Get the instance-specific API token.
     * Falls back to the instance name if no token was set.
     */
    public function getToken(): string
    {
        return $this->instanceToken ?? $this->getInstance();
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

    public function message(): MessageService
    {
        return new MessageService($this);
    }

    public function user(): UserService
    {
        return new UserService($this);
    }

    public function send(): SendService
    {
        return new SendService($this);
    }
}
