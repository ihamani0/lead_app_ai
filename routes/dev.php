<?php

/*
 * Development / utility routes (not intended for production use)
 * - /create-n8n-token: Generates a Sanctum API token for a new n8n tenant
 * - Commented-out test routes for manual API testing
 */
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

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
