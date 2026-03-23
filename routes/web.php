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

    Route::delete('/instances/{id}', [EvolutionInstanceController::class, 'destroy'])->name('instances.destroy');

    Route::put('/restart/{id}', [EvolutionInstanceController::class, 'restart'])->name('instances.restart');

    // Bot Management
    Route::post('/instances/{id}/bot', [AgentBotController::class, 'store'])->name('bot.store');

    Route::put('/instances/{id}/bot', [AgentBotController::class, 'update'])->name('bot.update');

    Route::patch('/instances/{id}/bot/toggle', [AgentBotController::class, 'toggle'])->name('bot.toggle');

    Route::delete('/instances/{id}/bot', [AgentBotController::class, 'destroy'])->name('bot.destroy');

    // Agent Idnex
    Route::get('/agents', [AgentBotController::class, 'index'])->name('agents.index');

    // CRM Leads
    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');

    Route::put('/leads/{id}', [LeadController::class, 'update'])->name('leads.update');

    Route::post('/leads/{id}/trigger-qualification', [LeadController::class, 'triggerQualification'])->name('leads.trigger-qualification');

    // Media Catalog
    Route::get('/media', [MediaAssetController::class, 'index'])->name('media.index');
    Route::post('/media', [MediaAssetController::class, 'store'])->name('media.store');
    Route::delete('/media/{id}', [MediaAssetController::class, 'destroy'])->name('media.destroy');

    Route::get('/knowledge', [KnowledgeBaseController::class, 'index'])->name('knowledge.index');
    Route::post('/knowledge', [KnowledgeBaseController::class, 'store'])->name('knowledge.store');
    Route::delete('/knowledge/{id}', [KnowledgeBaseController::class, 'destroy'])->name('knowledge.destroy');

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
