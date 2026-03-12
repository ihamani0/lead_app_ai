<?php

namespace Ihamani0\LaravelEvolutionApi;

use Illuminate\Support\ServiceProvider;

class EvolutionApiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Merge default config
        $this->mergeConfigFrom(
            __DIR__.'/../config/evolution-api.php',
            'evolution-api'
        );

        $this->app->singleton('evolution-api', function ($app) {
            return new EvolutionApiClient(
                config('evolution-api.base_url'),
                config('evolution-api.api_key'),
                config('evolution-api.instance_name') ?? null,
            );
        });
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/evolution-api.php' => config_path('evolution-api.php'),
        ], 'evolution-api-config');
    }
}
