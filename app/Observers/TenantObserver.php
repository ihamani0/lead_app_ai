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
            $originalCredit = (int) $tenant->getOriginal('credit_millicents');
            $newCredit = (int) $tenant->credit_millicents;

            if ($originalCredit >= $threshold && $newCredit < $threshold) {
                $tenant->notify(new LowBalanceNotification);
            }
        }
    }
}
