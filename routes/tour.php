<?php

/*
 * Tour onboarding routes (auth + verified required)
 * Tracks user progress through guided product tours.
 * Each tour has named steps; the API records completion and skip events.
 */
use App\Http\Controllers\Api\TourController;
use Illuminate\Support\Facades\Route;

Route::get('/api/tour/status', [TourController::class, 'status'])->name('tour.status');
Route::post('/api/tour/{tourName}/step', [TourController::class, 'completeStep'])->name('tour.step');
Route::post('/api/tour/{tourName}/complete', [TourController::class, 'complete'])->name('tour.complete');
Route::post('/api/tour/{tourName}/skip', [TourController::class, 'skip'])->name('tour.skip');
Route::post('/api/tour/{tourName}/reset', [TourController::class, 'reset'])->name('tour.reset');
