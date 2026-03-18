<?php

namespace App\Http\Middleware;

use App\Http\Controllers\TranslationController;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = $request->user()?->tenant?->settings['locale'] ?? 'en';

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => $locale,
            'availableLocales' => ['en', 'fr'],
            'langVersion' => app(TranslationController::class)->getVersion($locale),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,

                    'tenant' => [
                        'name' => $request->user()->tenant->name,
                        'slug' => $request->user()->tenant->slug,
                        'plan' => $request->user()->tenant->plan,
                    ],
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            'flash' => fn () => [
                'success' => session('success'),
                'error' => session('error'),
                'info' => session('info'),
            ],
        ];
    }
}
