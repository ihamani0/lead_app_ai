<?php

namespace Ihamani0\LaravelEvolutionApi\Contracts;

interface InstanceServiceInterface
{
    public function create(string $name, string $token, array $Settings): array;

    public function all(?string $instanceName = null): array;

    public function connect(string $uuid, string $webhookUrl, array $subscribe = ['ALL'], ?string $phone = null): array;

    public function qr(): array;

    public function pair(string $phone): array;

    public function status(): array;

    public function disconnect(): array;

    public function reconnect(): array;

    public function logout(): array;

    public function delete(string $uuid): array;
}
