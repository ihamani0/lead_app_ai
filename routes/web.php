<?php

use App\Http\Controllers\AgentBotController;
use App\Http\Controllers\Api\EvolutionWebhookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EvolutionInstanceController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\MediaAssetController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TranslationController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::post('/webhooks/evolution', [EvolutionWebhookController::class, 'handle'])
    ->name('webhooks.evolution');

// Translation JSON endpoint (public, cached)
Route::get('/translations/{locale}', [TranslationController::class, 'show'])
    ->name('translations.show');

Route::post('/lang/refresh', [TranslationController::class, 'refresh'])
    ->name('translations.refresh');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home')->middleware('guest');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('profile', [EvolutionInstanceController::class, 'index'])->name('profile.index');

    Route::post('profile', [EvolutionInstanceController::class, 'store'])->name('profile.store');

    // The new Manage/Show page
    Route::get('/profile/{id}', [EvolutionInstanceController::class, 'show'])->name('profile.show');

    // The AJAX endpoint to get the QR base64
    Route::post('/fetch-qr/{id}', [EvolutionInstanceController::class, 'fetchQr'])->name('profile.fetch-qr');

    // Placeholders for disconnect/restart
    Route::post('/disconnect/{id}', [EvolutionInstanceController::class, 'disconnect'])->name('profile.disconnect');
    Route::put('/restart/{id}', [EvolutionInstanceController::class, 'restart'])->name('instances.restart');

    Route::post('/restore/{id}', [EvolutionInstanceController::class, 'restore'])->name('instances.restore');

    // Delete Instance Route
    Route::delete('/{id}', [EvolutionInstanceController::class, 'destroy'])->name('instances.destroy');
    // Admin only
    Route::delete('/{id}/force', [EvolutionInstanceController::class, 'forceDestroy'])->name('instances.force-destroy');

    // Agent Index
    Route::get('/agents', [AgentBotController::class, 'index'])->name('agents.index');

    // Standalone Agent CRUD
    Route::post('/agents', [AgentBotController::class, 'store'])->name('agents.store');
    Route::put('/agents/{agent}', [AgentBotController::class, 'update'])->name('agents.update');
    Route::patch('/agents/{agent}/toggle', [AgentBotController::class, 'toggle'])->name('agents.toggle');
    Route::delete('/agents/{agent}', [AgentBotController::class, 'destroy'])->name('agents.destroy');

    // Agent-Instance linking
    Route::post('/agents/{agent}/link-instance', [AgentBotController::class, 'linkInstance'])->name('agents.link-instance');
    Route::post('/agents/{agent}/unlink-instance', [AgentBotController::class, 'unlinkInstance'])->name('agents.unlink-instance');

    // Agent Detail Page & Operations
    Route::get('/agents/{agent}', [AgentBotController::class, 'show'])->name('agents.show');
    Route::post('/agents/{agent}/clone', [AgentBotController::class, 'clone'])->name('agents.clone');
    Route::patch('/agents/{agent}/settings', [AgentBotController::class, 'updateSettings'])->name('agents.update-settings');
    Route::post('/agents/{agent}/reset-prompt', [AgentBotController::class, 'resetSystemPrompt'])->name('agents.reset-prompt');
    Route::get('/agents/{agent}/prompt-history', [AgentBotController::class, 'promptHistory'])->name('agents.prompt-history');
    Route::post('/agents/{agent}/restore-prompt/{version}', [AgentBotController::class, 'restorePrompt'])->name('agents.restore-prompt');

    // Legacy bot routes (keep for backward compatibility)
    Route::post('/instances/{id}/bot', [AgentBotController::class, 'storeLegacy'])->name('bot.store');
    Route::put('/instances/{id}/bot', [AgentBotController::class, 'updateLegacy'])->name('bot.update');
    Route::patch('/instances/{id}/bot/toggle', [AgentBotController::class, 'toggleLegacy'])->name('bot.toggle');
    Route::delete('/instances/{id}/bot', [AgentBotController::class, 'destroyLegacy'])->name('bot.destroy');

    // CRM Leads
    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');

    Route::put('/leads/{id}', [LeadController::class, 'update'])->name('leads.update');

    Route::post('/leads/{id}/trigger-qualification', [LeadController::class, 'triggerQualification'])->name('leads.trigger-qualification');

    Route::post('/leads/bulk-qualify', [LeadController::class, 'bulkQualify'])->name('leads.bulk-qualify');

    // Media Catalog
    Route::get('/media', [MediaAssetController::class, 'index'])->name('media.index');
    Route::post('/media', [MediaAssetController::class, 'store'])->name('media.store');
    Route::post('/media/presign', [MediaAssetController::class, 'presign'])->name('media.presign');
    Route::post('/media/finalize', [MediaAssetController::class, 'finalize'])->name('media.finalize');
    Route::delete('/media/{id}', [MediaAssetController::class, 'destroy'])->name('media.destroy');

    Route::get('/knowledge', [KnowledgeBaseController::class, 'index'])->name('knowledge.index');
    Route::post('/knowledge', [KnowledgeBaseController::class, 'store'])->name('knowledge.store');
    Route::delete('/knowledge/{id}', [KnowledgeBaseController::class, 'destroy'])->name('knowledge.destroy');

    Route::get('/knowledge/download/{id}', [KnowledgeBaseController::class, 'download'])->name('knowledge.web.download');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});

Route::get('/create-n8n-token', function () {
    $instance = Tenant::create([
        'name' => 'n8n-user',
        'slug' => 'n8n-user',
        'plan' => 'free',
        'is_active' => true,
        'settings' => [],
    ]);

    $token = $instance->createToken('n8n-token')->plainTextToken;

    return response()->json([
        'status' => '200',
        'token' => $token,
    ]);
});

// "token": "1|Vq6rEDq2LTdBsJ6DZj142l5gzNc0el2Ie9R1kXLV825adeec"

// Route::get('/sendMessage' , function(){

//     $result = EvolutionApi::sendMessageTest('Hello World' , 'ha-issam-LPKV' , '213697096705');

//     return response()->json($result);

// });

require __DIR__.'/settings.php';
