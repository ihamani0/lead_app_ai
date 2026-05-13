<?php

namespace App\Http\Middleware;

use App\Http\Controllers\TranslationController;
use App\Models\TourProgress;
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
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => $locale,
            'availableLocales' => ['en', 'fr'],
            'langVersion' => app(TranslationController::class)->getVersion($locale),
            'route_name' => $request->route()?->getName(),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_super_admin' => $user->is_super_admin,
                    'tenant' => [
                        'name' => $user->tenant->name,
                        'slug' => $user->tenant->slug,
                        'plan' => $user->tenant->plan,
                        'is_low_credit' => $user->tenant->is_low_credit,
                        'credit' => $user->tenant->credit_in_dollars,
                    ],
                ] : null,
                'tours' => ($user && ! $user->is_super_admin) ? $this->getTourProgress($user) : [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            'flash' => fn () => [
                'success' => session('success'),
                'error' => session('error'),
                'info' => session('info'),
            ],
        ];
    }

    protected function getTourProgress($user): array
    {
        if (! $user) {
            return [];
        }

        return TourProgress::forUser($user->id)
            ->get()
            ->mapWithKeys(fn ($tour) => [
                $tour->tour_name => [
                    'completed' => $tour->completed,
                    'completed_steps' => $tour->completed_steps,
                    'skipped_at' => $tour->skipped_at?->toIsoString(),
                ],
            ])
            ->all();
    }
}
