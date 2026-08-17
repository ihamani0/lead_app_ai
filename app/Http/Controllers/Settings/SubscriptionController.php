<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $tenant = $request->user()->tenant;
        $paddleEnabled = config('services.paddle.enabled');

        if (! $paddleEnabled) {
            return Inertia::render('settings/subscriptions', [
                'paddleEnabled' => false,
                'plans' => [],
                'nextPayment' => null,
                'subscription' => null,
                'graceEndDate' => null,
            ]);
        }

        $tenant->load('subscription.plan');

        $plans = Plan::where('is_active', true)
            ->whereNotNull('paddle_price_id')
            ->orderBy('price_millicents')
            ->get()
            ->map(fn (Plan $plan) => [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'price' => $plan->price_millicents / 100_000,
                'price_millicents' => $plan->price_millicents,
                'price_yearly' => $plan->price_yearly_millicents ? $plan->price_yearly_millicents / 100_000 : null,
                'has_yearly' => (bool) $plan->paddle_price_id_yearly,
                'features' => collect($plan->features ?? [])
                    ->filter(fn ($enabled) => $enabled)
                    ->keys()
                    ->toArray(),
                'max_teams' => $plan->max_teams,
                'max_members' => $plan->max_members,
                'max_leads' => $plan->max_leads,
                'max_agents' => $plan->max_agents,
                'max_instances' => $plan->max_instances,
                'max_storage_mb' => $plan->max_storage_mb,
                'dollar_limit' => $plan->dollar_limit,
                'is_current' => $tenant->plan_id === $plan->id,
            ]);

        $subscription = $tenant->subscription()
            ->where('provider', 'paddle')
            ->first();

        $cashierSubscription = $tenant->subscriptions()
            ->where('type', 'default')
            ->first();

        $nextPayment = null;
        if ($cashierSubscription && ! $cashierSubscription->canceled()) {
            $payment = $cashierSubscription->nextPayment();
            if ($payment) {
                $nextPayment = [
                    'amount' => $payment->amount(),
                    'date' => $payment->date()->toIsoString(),
                ];
            }
        }

        $graceEndDate = null;
        if ($cashierSubscription && $cashierSubscription->canceled()) {
            $graceEndDate = $cashierSubscription->ends_at?->toIsoString();
        }

        return Inertia::render('settings/subscriptions', [
            'paddleEnabled' => true,
            'plans' => $plans,
            'nextPayment' => $nextPayment,
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'plan_id' => $subscription->plan_id,
                'provider' => $subscription->provider,
                'provider_status' => $subscription->provider_status,
                'status' => $subscription->status,
                'interval' => $subscription->interval ?? 'month',
                'current_period_end' => $subscription->current_period_end?->toIsoString(),
            ] : null,
            'graceEndDate' => $graceEndDate,
        ]);
    }
}
