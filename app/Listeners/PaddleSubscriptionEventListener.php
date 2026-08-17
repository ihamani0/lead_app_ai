<?php

namespace App\Listeners;

use App\Models\Plan;
use App\Models\PlanChange;
use App\Models\Subscription;
use Laravel\Paddle\Events\SubscriptionCanceled;
use Laravel\Paddle\Events\SubscriptionCreated;
use Laravel\Paddle\Events\SubscriptionUpdated;

class PaddleSubscriptionEventListener
{
    public function handle(SubscriptionCreated|SubscriptionUpdated|SubscriptionCanceled $event): void
    {
        $subscription = $event->subscription;
        $tenant = $subscription->billable;

        if (! $tenant) {
            return;
        }

        $prices = $event->payload['data']['items'] ?? [];
        if (empty($prices)) {
            return;
        }

        $paddlePriceId = $prices[0]['price']['id'] ?? null;
        if (! $paddlePriceId) {
            return;
        }

        $plan = Plan::where('paddle_price_id', $paddlePriceId)
            ->orWhere('paddle_price_id_yearly', $paddlePriceId)
            ->first();

        if ($event instanceof SubscriptionCanceled && ! $plan) {
            $plan = $tenant->plan;
        }

        if (! $plan) {
            return;
        }

        $paddleStatus = $subscription->status ?? 'active';

        $interval = $event->payload['data']['billing_cycle']['interval']
            ?? $tenant->subscription?->interval
            ?? 'month';

        if ($event instanceof SubscriptionCanceled) {
            $endsAt = $subscription->ends_at;

            // During grace period, keep the plan until ends_at passes
            if ($endsAt && $endsAt->isFuture()) {
                $this->syncSubscription($tenant, $plan, $subscription, $paddleStatus, $interval, 'paddle_canceled');

                return;
            }

            $freePlan = Plan::where('is_default', true)->first();
            if ($freePlan) {
                $this->syncSubscription($tenant, $freePlan, $subscription, 'canceled', $interval, 'paddle_canceled');
                $tenant->update(['plan_id' => $freePlan->id]);
            }

            return;
        }

        $this->syncSubscription($tenant, $plan, $subscription, $paddleStatus, $interval, 'paddle');
        $tenant->update(['plan_id' => $plan->id]);
    }

    private function syncSubscription(
        $tenant,
        Plan $plan,
        $paddleSubscription,
        string $status,
        string $interval,
        string $reason,
    ): void {
        $oldPlan = $tenant->relationLoaded('plan') ? $tenant->plan : $tenant->plan()->first();

        Subscription::updateOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'plan_id' => $plan->id,
                'provider' => 'paddle',
                'provider_subscription_id' => (string) $paddleSubscription->paddle_id,
                'provider_status' => $status,
                'interval' => $interval,
                'status' => $status === 'paddle_canceled' ? 'canceled' : 'active',
            ],
        );

        if ($oldPlan?->id !== $plan->id) {
            PlanChange::create([
                'tenant_id' => $tenant->id,
                'from_plan_id' => $oldPlan?->id,
                'to_plan_id' => $plan->id,
                'changed_by' => 'paddle',
                'reason' => "Paddle subscription {$reason}",
            ]);
        }
    }
}
