<?php

namespace App\Observers;

use App\Models\Tenant;
use App\Notifications\LowBalanceNotification;

class TenantObserver
{
    public function updating(Tenant $tenant): void
    {
        if ($tenant->isDirty('credit_millicents')) {
            $threshold = config('services.token.threshold', 10) * 1000;
            $newCredit = (int) $tenant->credit_millicents;
            $originalCredit = (int) $tenant->getOriginal('credit_millicents');

            $tenant->is_low_credit = $newCredit < $threshold;

            if ($originalCredit >= $threshold && $newCredit < $threshold) {
                $tenant->notify(new LowBalanceNotification);
            }
        }
    }
}
