<?php

namespace App\Providers;

use App\Models\Tenant;
use App\Observers\TenantObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        Tenant::observe(TenantObserver::class);

        // Http::globalRequestMiddleware(function ($request) {
        //     Log::info('HTTP OUT', [
        //         'method' => $request->getMethod(),
        //         'url' => (string) $request->getUri(),
        //         'body' => (string) $request->getBody(),
        //     ]);

        //     return $request;
        // });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
