<?php

namespace Tests\Feature;

use App\Listeners\PaddleSubscriptionEventListener;
use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Laravel\Paddle\Events\SubscriptionCanceled;
use Laravel\Paddle\Events\SubscriptionCreated;
use Laravel\Paddle\Events\SubscriptionUpdated;
use Laravel\Paddle\Subscription as PaddleSubscription;
use Tests\TestCase;

class PaddleSubscriptionEventListenerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Event::listen(SubscriptionCreated::class, PaddleSubscriptionEventListener::class);
        Event::listen(SubscriptionUpdated::class, PaddleSubscriptionEventListener::class);
        Event::listen(SubscriptionCanceled::class, PaddleSubscriptionEventListener::class);
    }

    private function makePlan(string $slug, string $paddlePriceId, bool $default = false): Plan
    {
        $plan = Plan::factory()->create(['slug' => $slug, 'is_default' => $default]);
        DB::table('plans')->where('id', $plan->id)->update(['paddle_price_id' => $paddlePriceId]);

        return $plan->fresh();
    }

    private function makeTenant(): Tenant
    {
        return Tenant::factory()->create();
    }

    private function makePaddleSubscription(Tenant $tenant, string $paddleId, string $status = 'active'): PaddleSubscription
    {
        return PaddleSubscription::create([
            'billable_type' => Tenant::class,
            'billable_id' => $tenant->id,
            'type' => 'default',
            'paddle_id' => $paddleId,
            'status' => $status,
        ]);
    }

    private function payload(string $paddlePriceId, string $status = 'active', string $interval = 'month'): array
    {
        return [
            'data' => [
                'id' => 'sub_test',
                'status' => $status,
                'billing_cycle' => ['interval' => $interval, 'frequency' => 1],
                'items' => [
                    [
                        'price' => ['id' => $paddlePriceId],
                        'status' => 'active',
                        'quantity' => 1,
                    ],
                ],
            ],
        ];
    }

    public function test_subscription_created_syncs_plan_and_tenant(): void
    {
        $tenant = $this->makeTenant();
        $enterprise = $this->makePlan('enterprise', 'pri_01kwvn2apb5q94dpj1bz8xvm46');
        $this->makePlan('starter', 'pri_01kwvn0ca60y5fkqcdsw9j6ntm', true);

        $subscription = $this->makePaddleSubscription($tenant, 'sub_test');

        event(new SubscriptionCreated($tenant, $subscription, $this->payload('pri_01kwvn2apb5q94dpj1bz8xvm46')));

        $this->assertDatabaseHas('tenant_subscriptions', [
            'tenant_id' => $tenant->id,
            'provider_subscription_id' => 'sub_test',
            'provider' => 'paddle',
            'provider_status' => 'active',
            'plan_id' => $enterprise->id,
        ]);

        $this->assertDatabaseHas('tenants', [
            'id' => $tenant->id,
            'plan_id' => $enterprise->id,
        ]);

        $this->assertDatabaseHas('plan_changes', [
            'tenant_id' => $tenant->id,
            'to_plan_id' => $enterprise->id,
            'changed_by' => 'paddle',
        ]);
    }

    public function test_subscription_updated_syncs_plan(): void
    {
        $tenant = $this->makeTenant();
        $this->makePlan('pro', 'pri_01kwvn1aen7dk1bddhpagv8vhc');
        $enterprise = $this->makePlan('enterprise', 'pri_01kwvn2apb5q94dpj1bz8xvm46');

        $subscription = $this->makePaddleSubscription($tenant, 'sub_test');

        event(new SubscriptionUpdated($subscription, $this->payload('pri_01kwvn2apb5q94dpj1bz8xvm46', 'active')));

        $this->assertDatabaseHas('tenant_subscriptions', [
            'tenant_id' => $tenant->id,
            'plan_id' => $enterprise->id,
        ]);
        $this->assertDatabaseHas('tenants', ['id' => $tenant->id, 'plan_id' => $enterprise->id]);
    }

    public function test_yearly_subscription_created_syncs_plan_and_interval(): void
    {
        $tenant = $this->makeTenant();
        $enterprise = $this->makePlan('enterprise', 'pri_01kwvn2apb5q94dpj1bz8xvm46');
        DB::table('plans')->where('id', $enterprise->id)->update([
            'paddle_price_id_yearly' => 'pri_year_enterprise',
        ]);
        $this->makePlan('starter', 'pri_01kwvn0ca60y5fkqcdsw9j6ntm', true);

        $subscription = $this->makePaddleSubscription($tenant, 'sub_test');

        event(new SubscriptionCreated($tenant, $subscription, $this->payload('pri_year_enterprise', 'active', 'year')));

        $this->assertDatabaseHas('tenant_subscriptions', [
            'tenant_id' => $tenant->id,
            'provider_subscription_id' => 'sub_test',
            'plan_id' => $enterprise->id,
            'interval' => 'year',
        ]);
        $this->assertDatabaseHas('tenants', ['id' => $tenant->id, 'plan_id' => $enterprise->id]);
    }

    public function test_subscription_canceled_during_grace_keeps_plan(): void
    {
        $tenant = $this->makeTenant();
        $enterprise = $this->makePlan('enterprise', 'pri_01kwvn2apb5q94dpj1bz8xvm46');
        $this->makePlan('starter', 'pri_01kwvn0ca60y5fkqcdsw9j6ntm', true);
        $tenant->update(['plan_id' => $enterprise->id]);

        $subscription = $this->makePaddleSubscription($tenant, 'sub_test', 'canceled');
        $subscription->update(['ends_at' => now()->addDays(5)]);

        event(new SubscriptionCanceled($subscription, $this->payload('pri_01kwvn2apb5q94dpj1bz8xvm46', 'canceled')));

        $this->assertDatabaseHas('tenant_subscriptions', [
            'tenant_id' => $tenant->id,
            'provider_status' => 'canceled',
            'plan_id' => $enterprise->id,
        ]);
        $this->assertDatabaseHas('tenants', ['id' => $tenant->id, 'plan_id' => $enterprise->id]);
    }

    public function test_subscription_canceled_after_grace_downgrades_to_default(): void
    {
        $tenant = $this->makeTenant();
        $enterprise = $this->makePlan('enterprise', 'pri_01kwvn2apb5q94dpj1bz8xvm46');
        $free = $this->makePlan('starter', 'pri_01kwvn0ca60y5fkqcdsw9j6ntm', true);
        $tenant->update(['plan_id' => $enterprise->id]);

        $subscription = $this->makePaddleSubscription($tenant, 'sub_test', 'canceled');
        $subscription->update(['ends_at' => now()->subDay()]);

        event(new SubscriptionCanceled($subscription, $this->payload('pri_01kwvn2apb5q94dpj1bz8xvm46', 'canceled')));

        $this->assertDatabaseHas('tenants', ['id' => $tenant->id, 'plan_id' => $free->id]);
    }

    public function test_empty_items_does_not_sync_and_does_not_throw(): void
    {
        $tenant = $this->makeTenant();
        $subscription = $this->makePaddleSubscription($tenant, 'sub_test');

        event(new SubscriptionCreated($tenant, $subscription, ['data' => ['id' => 'sub_test', 'items' => []]]));

        $this->assertDatabaseMissing('tenant_subscriptions', ['tenant_id' => $tenant->id]);
    }
}
