<?php

use App\Http\Controllers\SuperAdmin\SuperAdminTenantController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'super.admin'])->group(function () {
    Route::get('/super-admin/tenants', [SuperAdminTenantController::class, 'index'])
        ->name('super-admin.tenants.index');

    Route::get('/super-admin/tenants/{tenant}', [SuperAdminTenantController::class, 'show'])
        ->name('super-admin.tenants.show');

    Route::post('/super-admin/tenants/{tenant}/add-tokens', [SuperAdminTenantController::class, 'addTokens'])
        ->name('super-admin.tenants.add-tokens');
});
