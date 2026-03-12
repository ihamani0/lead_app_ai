<?php

namespace Ihamani0\LaravelEvolutionApi\Contracts;

interface InstanceServiceInterface
{
    public function create(string $instanceName, array $options = []): array;

    public function all(?string $instanceName = null): array;

    public function connect(): array;

    public function restart(): array;

    public function setPresence(string $presence): array;

    public function status(): array;

    public function logout(): array;

    public function delete(): array;
}
