<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

use Ihamani0\LaravelEvolutionApi\Contracts\InstanceServiceInterface;

class InstanceService extends BaseService implements InstanceServiceInterface
{
    public function create(string $name, string $token, array $settings = []): array
    {
        $defaults = [
            'alwaysOnline' => false,
            'rejectCall' => true,
            'msgRejectCall' => 'Not taking calls right now',
            'readMessages' => false,
            'ignoreGroups' => false,
            'ignoreStatus' => true,
        ];

        $advancedSettings = empty($settings) ? $defaults : $settings;

        return $this->client->post('instance/create', [
            'name' => $name,
            'token' => $token,
            'advancedSettings' => $advancedSettings,
        ]);
    }

    public function all(?string $instanceName = null): array
    {
        $endpoint = 'instance/fetchInstances';

        if ($instanceName) {
            $endpoint .= '?instanceName='.$instanceName;
        }

        return $this->client->get($endpoint);
    }

    public function connect(string $token, string $webhookUrl, array $subscribe = ['ALL'], ?string $phone = null): array
    {
        $body = [
            'webhookUrl' => $webhookUrl,
            'subscribe' => $subscribe,
        ];

        if ($phone) {
            $body['phone'] = $phone;
        }

        return $this->client->post('instance/connect', $body, $token);
    }

    public function qr(): array
    {
        return $this->client->get('instance/qr', $this->client->getInstance());
    }

    public function pair(string $phone): array
    {
        return $this->client->post('instance/pair', [
            'phone' => $phone,
        ], $this->client->getInstance());
    }

    public function status(): array
    {
        return $this->client->get('instance/status', $this->client->getInstance());
    }

    public function disconnect(): array
    {
        return $this->client->post('instance/disconnect', [], $this->client->getInstance());
    }

    public function reconnect(): array
    {
        return $this->client->post('instance/reconnect', [], $this->client->getInstance());
    }

    public function logout(): array
    {
        return $this->client->delete('instance/logout', $this->client->getInstance());
    }

    public function delete(string $uuid): array
    {
        return $this->client->delete("instance/delete/{$uuid}");
    }
}
