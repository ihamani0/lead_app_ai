<?php

use App\Http\Controllers\SuperAdmin\LlmModelController;
use App\Http\Controllers\SuperAdmin\OpenRouterController;
use App\Http\Controllers\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\SuperAdminTenantController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'super.admin'])->group(function () {
    Route::get('/super-admin/dashboard', [SuperAdminDashboardController::class, 'dashboard'])
        ->name('super-admin.dashboard');

    Route::get('/super-admin/tenants', [SuperAdminTenantController::class, 'index'])->name('admin.tenant.index');
    Route::get('/super-admin/tenants/{tenant}', [SuperAdminTenantController::class, 'show'])->name('admin.tenant.show');

    Route::post('/super-admin/tenants/{tenant}/add-dollars', [SuperAdminTenantController::class, 'addDollars'])->name('admin.tenant.add-dollars');
    Route::post('/super-admin/tenants/{tenant}/update-model', [SuperAdminTenantController::class, 'updateModel'])->name('admin.tenant.update-model');

    Route::get('/super-admin/models', [LlmModelController::class, 'index'])->name('admin.model.index');
    Route::post('/super-admin/models', [LlmModelController::class, 'store'])->name('admin.model.store');
    Route::post('/super-admin/models/{llmModel}', [LlmModelController::class, 'update'])->name('admin.model.update');
    Route::delete('/super-admin/models/{llmModel}', [LlmModelController::class, 'destroy'])->name('admin.model.destroy');

    Route::get('/super-admin/openrouter/credits', [OpenRouterController::class, 'fetchCredits'])->name('admin.openrouter.credits');
});
