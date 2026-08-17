<?php

namespace App\Listeners;

use App\Models\CreditPackage;
use App\Models\TokenTransaction;
use App\Services\TokenService;
use Laravel\Paddle\Events\TransactionCompleted;

class PaddleTransactionCompletedListener
{
    public function handle(TransactionCompleted $event): void
    {
        $tenant = $event->billable;

        if (! $tenant) {
            return;
        }

        $referenceId = 'paddle_transaction:'.$event->transaction->id;

        if (TokenTransaction::where('reference_type', 'paddle_recharge')
            ->where('reference_id', $referenceId)
            ->exists()
        ) {
            return;
        }

        $customData = $event->payload['data']['custom_data'] ?? [];

        if (($customData['type'] ?? null) !== 'credit_recharge') {
            return;
        }

        $items = $event->payload['data']['items'] ?? [];

        if (empty($items)) {
            return;
        }

        $paddlePriceId = $items[0]['price']['id'] ?? null;

        if (! $paddlePriceId) {
            return;
        }

        $package = CreditPackage::where('paddle_price_id', $paddlePriceId)->first();

        if (! $package) {
            return;
        }

        $creditDollars = $package->credit_millicents / 100_000;

        app(TokenService::class)->addDollars(
            $tenant,
            $creditDollars,
            $referenceId,
            null,
            'paddle_recharge',
        );
    }
}
