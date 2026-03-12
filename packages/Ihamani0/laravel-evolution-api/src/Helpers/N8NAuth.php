<?php

namespace Ihamani0\LaravelEvolutionApi\Helpers;

/**
 * N8NAuth
 *
 * Represents the optional authentication configuration for an N8N bot.
 * Use one of the static factory methods to build the correct auth type.
 *
 * Only one auth type should be used at a time:
 * - apiKey()   → sends { "apiKey": "..." } in the payload
 * - basic()    → sends { "authUser": "...", "authPass": "..." } in the payload
 * - none()     → sends no auth fields
 */
class N8NAuth
{
    private function __construct(
        private readonly ?string $apiKey = null,
        private readonly ?string $username = null,
        private readonly ?string $password = null,
    ) {}

    /**
     * Authenticate using an API key.
     *
     * @param  string  $apiKey  The API key for the N8N endpoint.
     */
    public static function apiKey(string $apiKey): static
    {
        return new static(apiKey: $apiKey);
    }

    /**
     * Authenticate using HTTP Basic Auth credentials.
     *
     * @param  string  $username  The basic auth username.
     * @param  string  $password  The basic auth password.
     */
    public static function basic(string $username, string $password): static
    {
        return new static(username: $username, password: $password);
    }

    /**
     * No authentication required for the N8N endpoint.
     */
    public static function none(): static
    {
        return new static;
    }

    /**
     * Convert auth config to array for use in API payload.
     */
    public function toArray(): array
    {
        if ($this->apiKey !== null) {
            return ['apiKey' => $this->apiKey];
        }

        if ($this->username !== null) {
            return [
                'authUser' => $this->username,
                'authPass' => $this->password,
            ];
        }

        return [];
    }
}
