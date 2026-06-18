<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\Api\FaqsController;
use App\Http\Controllers\Api\LeadIntegrationController;
use App\Http\Controllers\Api\N8nIntegrationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TokenStatusController;
use App\Http\Controllers\Api\TokenUsageController;
use App\Http\Controllers\TestAiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/test-ai/callback', [TestAiController::class, 'callback']);
Route::post('/test-ai/typing', [TestAiController::class, 'typing']);

Route::group(['prefix' => 'n8n', 'middleware' => 'auth:sanctum'], function () {

    // 1. Lookup or Create Client (Replaces Google Sheet Lookup)
    Route::post('/lead/lookup', [LeadIntegrationController::class, 'lookupLead']);

    // 2. Store Client (Replaces Google Sheet Lookup)
    Route::post('/lead/store', [LeadIntegrationController::class, 'storeLead']);

    // 2. Update Client Status (Replaces Google Sheet Update)
    Route::post('/lead/update', [LeadIntegrationController::class, 'updateLead']);

    Route::post('/lead/get-contact-status', [LeadIntegrationController::class, 'getStatusContact']);

    // 5. Get Status of  Agent config if enable or disable
    Route::post('/instance/agent-config', [LeadIntegrationController::class, 'getAgentConfig']);

    // 6. Flag a lead for policy violations
    Route::post('/lead/flag', [LeadIntegrationController::class, 'flagLead']);

    // . Get Media (Replaces Google Sheet Media)
    Route::get('/assets/media/{agent}', [N8nIntegrationController::class, 'getMedia']);

    // . put updateLead
    Route::put('/update/score/lead', [N8nIntegrationController::class, 'updateLead']);

    // 2. Download Document
    // Route::get('/knowledge/download/{id}', [N8nIntegrationController::class, 'download'])->name('knowledge.download');
    Route::get('/workspaces/{slug}/agents/{agent}/download/{id}', [AgentController::class, 'knowledgeDownload'])->name('workspaces.agents.knowledge.download');

    // 3. Mark Document as Indexed (Replaces Google Sheet Update)
    Route::post('/knowledge/mark-indexed', [N8nIntegrationController::class, 'markAsIndexed']);

    // 4. Token Usage Reporting (for AI token tracking)
    Route::post('/token-usage', [TokenUsageController::class, 'store']);
    // 5. Token Status Pre-Check (for N8N workflow gating)
    Route::get('/token-status', [TokenStatusController::class, 'show']);

    // 6. FAQ endpoint for AI bot
    Route::get('/faqs', [FaqsController::class, 'index']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'read']);
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll']);
});
