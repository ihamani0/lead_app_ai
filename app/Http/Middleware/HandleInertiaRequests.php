<?php

namespace App\Http\Middleware;

use App\Http\Controllers\TranslationController;
use App\Models\TourProgress;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $locale = $request->user()?->tenant?->settings['locale'] ?? 'en';
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'support_email' => config('app.support_email'),
            'locale' => $locale,
            'availableLocales' => ['en', 'fr'],
            'langVersion' => app(TranslationController::class)->getVersion($locale),
            'route_name' => $request->route()?->getName(),
            'paddleEnabled' => config('services.paddle.enabled'),
            'paddleSandbox' => config('services.paddle.sandbox', false),
            'paddleClientToken' => config('services.paddle.client_side_token'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_super_admin' => $user->is_super_admin,
                    'has_password' => (bool) $user->has_password,
                    'welcome_dismissed_at' => $user->welcome_dismissed_at?->toIsoString() ?? null,
                    'tenant' => [
                        'name' => $user->tenant->name,
                        'slug' => $user->tenant->slug,
                        'plan' => $user->tenant->plan()->first()?->only('slug', 'name'),
                        'features' => $user->tenant->plan?->features ?? [],
                        'is_low_credit' => $user->tenant->is_low_credit,
                        'credit' => $user->tenant->credit_in_dollars,
                    ],
                ] : null,
                'tours' => ($user && ! $user->is_super_admin) ? $this->getTourProgress($user) : [],
                'workspaces' => $user ? $user->allTeams()->values() : [],
            ],
            'notifications' => function () use ($request) {
                $team = $request->attributes->get('active_team');

                if (! $request->user() || ! $team) {
                    return ['data' => [], 'unread_count' => 0];
                }

                $notifications = $request->user()
                    ->notifications()
                    ->take(20)
                    ->get();

                return [
                    'data' => $notifications,
                    'unread_count' => $notifications->whereNull('read_at')->count(),
                ];
            },
            'activeWorkspace' => function () use ($request) {
                $team = $request->attributes->get('active_team');

                return $team ? [
                    'id' => $team->id,
                    'name' => $team->name,
                    'slug' => $team->slug,
                ] : null;
            },
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
