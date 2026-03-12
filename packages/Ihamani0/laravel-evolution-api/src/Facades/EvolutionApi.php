<?php

namespace Ihamani0\LaravelEvolutionApi\Facades;

use Illuminate\Support\Facades\Facade;

class EvolutionApi extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'evolution-api';
    }
}
