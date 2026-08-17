<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\CreditPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        $tenant = $request->user()->tenant;
        $paddleEnabled = config('services.paddle.enabled');

        if (! $paddleEnabled) {
            return Inertia::render('settings/billing', [
                'paddleEnabled' => false,
                'transactions' => [],
                'creditPackages' => [],
            ]);
        }

        $transactions = $tenant->transactions()
            ->orderBy('billed_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn ($tx) => [
                'id' => $tx->id,
                'status' => $tx->status,
                'total' => $tx->total(),
                'tax' => $tx->tax(),
                'currency' => $tx->currency,
                'billed_at' => $tx->billed_at?->toIsoString(),
                'invoice_url' => route('billing.invoice', $tx->id),
            ]);

        $subscription = $tenant->subscriptions()
            ->where('type', 'default')
            ->first();

        $creditPackages = CreditPackage::where('is_active', true)
            ->orderBy('price_millicents')
            ->get()
            ->map(fn ($pkg) => [
                'id' => $pkg->id,
                'name' => $pkg->name,
                'description' => $pkg->description,
                'price_millicents' => $pkg->price_millicents,
                'credit_millicents' => $pkg->credit_millicents,
                'has_price' => $pkg->paddle_price_id !== null,
            ]);

        return Inertia::render('settings/billing', [
            'paddleEnabled' => true,
            'transactions' => $transactions,
            'hasPaymentMethod' => $subscription !== null,
            'creditPackages' => $creditPackages,
        ]);
    }
}
