<?php

/*
 * Webhook routes (no authentication — invoked by external services)
 * - Evolution API webhook: receives connection status updates for WhatsApp instances
 */
use App\Http\Controllers\Api\EvolutionWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/webhooks/evolution', [EvolutionWebhookController::class, 'handle'])
    ->name('webhooks.evolution');
