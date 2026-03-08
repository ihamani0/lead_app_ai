<?php

use App\Http\Controllers\Api\LeadIntegrationController;
use App\Http\Controllers\Api\N8nIntegrationController;
use App\Http\Controllers\KnowledgeBaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::group(['prefix' => 'n8n', 'middleware' => 'auth:sanctum'], function () {
    
    // 1. Lookup or Create Client (Replaces Google Sheet Lookup)
    Route::post('/lead/lookup', [LeadIntegrationController::class, 'lookupLead']);
    
    // 2. Store Client (Replaces Google Sheet Lookup)
    Route::post('/lead/store', [LeadIntegrationController::class, 'storeLead']);

    // 2. Update Client Status (Replaces Google Sheet Update)
    Route::post('/lead/update', [LeadIntegrationController::class, 'updateLead']);

    Route::post('/lead/get-contact-status', [LeadIntegrationController::class, 'getStatusContact']);
    
    
    // 5. Get Status of  Agent config if enable or disable
    Route::post('/instance/agent-config' , [LeadIntegrationController::class , 'getAgentConfig']);


    // . Get Media (Replaces Google Sheet Media)
    Route::get('/assets/media', [N8nIntegrationController::class, 'getMedia']);

    // . put updateLead
    Route::put('/update/score/lead' , [N8nIntegrationController::class , 'updateLead']);


    // 2. Download Document  
    Route::get('/knowledge/download/{id}', [KnowledgeBaseController::class, 'download'])->name('knowledge.download');
    
    // 3. Mark Document as Indexed (Replaces Google Sheet Update)
    Route::post('/knowledge/mark-indexed', [KnowledgeBaseController::class, 'markAsIndexed']);
});