<?php

/*
 * Public routes (no authentication required)
 * - Home page (requires guest — redirects authenticated users)
 * - Legal pages: Terms & Privacy
 * - Translation JSON endpoint (public, cached)
 * - Translation refresh
 */
use App\Http\Controllers\TranslationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home')->middleware('guest');

Route::get('/terms', fn () => Inertia::render('legal/terms'))->name('terms');
Route::get('/privacy', fn () => Inertia::render('legal/privacy'))->name('privacy');

Route::get('/translations/{locale}', [TranslationController::class, 'show'])
    ->name('translations.show');

Route::post('/lang/refresh', [TranslationController::class, 'refresh'])
    ->name('translations.refresh');
