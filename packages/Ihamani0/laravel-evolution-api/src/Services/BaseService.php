<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

use Ihamani0\LaravelEvolutionApi\EvolutionApiClient;

abstract class BaseService
{
    protected EvolutionApiClient $client;

    public function __construct(EvolutionApiClient $client)
    {
        $this->client = $client;
    }
}
