<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\CreditPackage;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Paddle\Exceptions\PaddleException;
use Symfony\Component\HttpFoundation\Response;

class CheckoutController extends Controller
{
    public function checkout(Request $request, Plan $plan): JsonResponse
    {
        if (! config('services.paddle.enabled')) {
            abort(404);
        }

        $interval = $request->input('interval', 'monthly');

        if (! in_array($interval, ['monthly', 'yearly'], true)) {
            return response()->json(['error' => 'Invalid billing interval.'], 422);
        }

        $priceId = $interval === 'yearly' ? $plan->paddle_price_id_yearly : $plan->paddle_price_id;

        if (! $priceId) {
            return response()->json(['error' => 'Plan has no Paddle price configured for this interval.'], 422);
        }

        $tenant = $request->user()->tenant;

        $checkout = $tenant->checkout($priceId)
            ->returnTo(route('account.subscriptions'));

        return response()->json([
            'items' => $checkout->getItems(),
            'customer_id' => $checkout->getCustomer()?->paddle_id,
            'custom_data' => $checkout->getCustomData(),
            'return_url' => $checkout->getReturnUrl(),
        ]);
    }

    public function portal(Request $request): RedirectResponse|Response
    {
        if (! config('services.paddle.enabled')) {
            abort(404);
        }

        $tenant = $request->user()->tenant;
        $subscription = $tenant->subscriptions()->where('type', 'default')->first();

        if (! $subscription) {
            return redirect()->route('account.billing')->with('error', 'No active subscription found.');
        }

        try {
            return Inertia::location($subscription->paymentMethodUpdateUrl());
        } catch (PaddleException $e) {
            return redirect()->route('account.billing')
                ->with('error', 'Unable to generate payment method update link. Please try again.');
        }
    }

    public function cancel(Request $request): RedirectResponse
    {
        if (! config('services.paddle.enabled')) {
            abort(404);
        }

        $tenant = $request->user()->tenant;
        $cashierSubscription = $tenant->subscriptions()->where('type', 'default')->first();

        if (! $cashierSubscription) {
            return redirect()->route('account.subscriptions')->with('error', 'No active subscription found.');
        }

        if ($cashierSubscription->canceled() || $cashierSubscription->onGracePeriod()) {
            $this->syncLocalSubscription($tenant, $cashierSubscription);

            return redirect()->route('account.subscriptions')
                ->with('info', 'Subscription cancellation is already in progress.');
        }

        try {
            $cashierSubscription->cancel();
        } catch (PaddleException $e) {
            $this->syncLocalSubscription($tenant, $cashierSubscription);

            return redirect()->route('account.subscriptions')
                ->with('info', 'Subscription cancellation is already in progress.');
        }

        $this->syncLocalSubscription($tenant, $cashierSubscription);

        return redirect()->route('account.subscriptions')
            ->with('success', 'Subscription canceled. You retain access until the end of the billing period.');
    }

    public function creditCheckout(Request $request, CreditPackage $creditPackage): JsonResponse
    {
        if (! config('services.paddle.enabled')) {
            abort(404);
        }

        if (! $creditPackage->is_active || ! $creditPackage->paddle_price_id) {
            return response()->json(['error' => 'Credit package is not available.'], 422);
        }

        $tenant = $request->user()->tenant;

        $checkout = $tenant->checkout($creditPackage->paddle_price_id)
            ->returnTo(route('account.billing'))
            ->customData(['type' => 'credit_recharge']);

        return response()->json([
            'items' => $checkout->getItems(),
            'customer_id' => $checkout->getCustomer()?->paddle_id,
            'custom_data' => $checkout->getCustomData(),
            'return_url' => $checkout->getReturnUrl(),
        ]);
    }

    private function syncLocalSubscription($tenant, $cashierSubscription): void
    {
        $tenantSubscription = Subscription::where('tenant_id', $tenant->id)
            ->where('provider', 'paddle')
            ->first();

        if ($tenantSubscription) {
            $tenantSubscription->update([
                'status' => 'canceled',
                'current_period_end' => $cashierSubscription->ends_at,
                'canceled_at' => now(),
            ]);
        }
    }
}
