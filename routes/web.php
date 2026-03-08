<?php

use App\Http\Controllers\AgentBotController;
use App\Http\Controllers\Api\EvolutionWebhookController;
use App\Http\Controllers\EvolutionInstanceController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\MediaAssetController;
use App\Models\EvolutionInstance;
use App\Models\Tenant;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::post('/webhooks/evolution', [EvolutionWebhookController::class, 'handle'])
    ->name('webhooks.evolution');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::get('/sprint', function () {
    return Inertia::render('sprint');
})->name('sprint');

 


Route::middleware(['auth', 'verified'])->group(function () {
   
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('profile',[EvolutionInstanceController::class , 'index'])->name('profile.index');

    Route::post('profile',[EvolutionInstanceController::class , 'store'])->name('profile.store');

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


    //Agent Idnex
     Route::get('/agents', [AgentBotController::class, 'index'])->name('agents.index');


    // CRM Leads
    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
    Route::get('/leads/{id}', [LeadController::class, 'show'])->name('leads.show');
    Route::put('/leads/{id}', [LeadController::class, 'update'])->name('leads.update');



    // Media Catalog
    Route::get('/media', [MediaAssetController::class, 'index'])->name('media.index');
    Route::post('/media', [MediaAssetController::class, 'store'])->name('media.store');
    Route::delete('/media/{id}', [MediaAssetController::class, 'destroy'])->name('media.destroy');

    Route::get('/knowledge', [KnowledgeBaseController::class, 'index'])->name('knowledge.index');
    Route::post('/knowledge', [KnowledgeBaseController::class, 'store'])->name('knowledge.store');
});



Route::get('/create-n8n-token' , function(){
    $instance = Tenant::create([
        'name'=> 'n8n-user',
        'slug'=> 'n8n-user',
        'plan'=> 'free',
        'is_active'=> true,
        'settings'=> [],
    ]);

    $token = $instance->createToken('n8n-token')->plainTextToken;

    return response()->json([
        'status'=> '200',
        'token' => $token,
    ]);
});

//"token": "1|Vq6rEDq2LTdBsJ6DZj142l5gzNc0el2Ie9R1kXLV825adeec"

// Route::get('/sendMessage' , function(){
    
//     $result = EvolutionApi::sendMessageTest('Hello World' , 'ha-issam-LPKV' , '213697096705');

//     return response()->json($result);

// });


 

require __DIR__.'/settings.php';
