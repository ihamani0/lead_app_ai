<?php

/*
 * Authentication routes (guest middleware)
 * - Google OAuth: redirect & callback
 * - No authentication required — these handle the login flow itself
 */
use App\Http\Controllers\Auth\SocialiteController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->middleware('guest')->group(function () {
    Route::get('/google/redirect', [SocialiteController::class, 'redirectToGoogle'])
        ->name('auth.google.redirect');

    Route::get('/google/callback', [SocialiteController::class, 'handleGoogleCallback'])
        ->name('auth.google.callback');
});
