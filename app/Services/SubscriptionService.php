<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\PlanChange;
use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    public function __construct(
        protected PlanEnforcementService $enforcement,
    ) {}

    /**
     * Change a tenant's plan.
     *
     * Creates/updates the subscription record, updates tenant.plan_id,
     * and logs the change in plan_changes audit table.
     */
    public function changePlan(
        Tenant $tenant,
        Plan $newPlan,
        string $changedBy,
        ?string $reason = null,
    ): void {
        $oldPlan = $tenant->relationLoaded('plan') ? $tenant->plan : $tenant->plan()->first();

        DB::transaction(function () use ($tenant, $oldPlan, $newPlan, $changedBy, $reason) {
            Subscription::updateOrCreate(
                ['tenant_id' => $tenant->id],
                [
                    'plan_id' => $newPlan->id,
                    'provider' => 'manual',
                    'status' => 'active',
                ],
            );

            $tenant->update(['plan_id' => $newPlan->id]);

            PlanChange::create([
                'tenant_id' => $tenant->id,
                'from_plan_id' => $oldPlan?->id,
                'to_plan_id' => $newPlan->id,
                'changed_by' => $changedBy,
                'reason' => $reason,
            ]);
        });
    }
}
