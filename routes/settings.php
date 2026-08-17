<?php

use App\Http\Controllers\Settings\AccountSettingsController;
use App\Http\Controllers\Settings\BillingController;
use App\Http\Controllers\Settings\CheckoutController;
use App\Http\Controllers\Settings\InvoiceController;
use App\Http\Controllers\Settings\LanguageController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SubscriptionController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::patch('settings/language', [LanguageController::class, 'update'])->name('language.update');

    // Account Settings (all-in-one page)
    Route::get('account/settings', [AccountSettingsController::class, 'index'])->name('account.settings');

    // Billing & Subscriptions
    Route::get('account/billing', [BillingController::class, 'index'])->name('account.billing');
    Route::get('account/subscriptions', [SubscriptionController::class, 'index'])->name('account.subscriptions');

    if (config('services.paddle.enabled')) {
        Route::post('billing/checkout/{plan}', [CheckoutController::class, 'checkout'])->name('billing.checkout');
        Route::get('billing/transactions/{transaction}/invoice', [InvoiceController::class, 'download'])->name('billing.invoice');
        Route::post('billing/portal', [CheckoutController::class, 'portal'])->name('billing.portal');
        Route::post('billing/subscription/cancel', [CheckoutController::class, 'cancel'])->name('billing.cancel');
        Route::post('billing/credit/checkout/{creditPackage}', [CheckoutController::class, 'creditCheckout'])->name('billing.credit.checkout');
    }
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
