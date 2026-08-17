<?php

use App\Http\Controllers\SuperAdmin\CreditPackageController;
use App\Http\Controllers\SuperAdmin\LlmModelController;
use App\Http\Controllers\SuperAdmin\OpenRouterController;
use App\Http\Controllers\SuperAdmin\PlanController;
use App\Http\Controllers\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\SuperAdminLeadController;
use App\Http\Controllers\SuperAdmin\SuperAdminReportController;
use App\Http\Controllers\SuperAdmin\SuperAdminTenantController;
use App\Http\Controllers\SuperAdmin\TokenUsageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'super.admin'])->group(function () {
    Route::get('/super-admin/dashboard', [SuperAdminDashboardController::class, 'dashboard'])
        ->name('super-admin.dashboard');

    Route::get('/super-admin/tenants', [SuperAdminTenantController::class, 'index'])->name('admin.tenant.index');
    Route::get('/super-admin/tenants/{tenant}', [SuperAdminTenantController::class, 'show'])->name('admin.tenant.show');

    Route::post('/super-admin/tenants/{tenant}/add-dollars', [SuperAdminTenantController::class, 'addDollars'])->name('admin.tenant.add-dollars');
    Route::post('/super-admin/tenants/{tenant}/update-model', [SuperAdminTenantController::class, 'updateModel'])->name('admin.tenant.update-model');
    Route::post('/super-admin/tenants/{tenant}/change-plan', [SuperAdminTenantController::class, 'changePlan'])->name('admin.tenant.change-plan');

    Route::get('/super-admin/reports', [SuperAdminReportController::class, 'index'])->name('admin.reports.index');

    Route::get('/super-admin/leads', [SuperAdminLeadController::class, 'index'])->name('admin.leads.index');
    Route::get('/super-admin/leads/export', [SuperAdminLeadController::class, 'export'])->name('admin.leads.export');

    Route::get('/super-admin/models', [LlmModelController::class, 'index'])->name('admin.model.index');
    Route::post('/super-admin/models', [LlmModelController::class, 'store'])->name('admin.model.store');
    Route::post('/super-admin/models/{llmModel}', [LlmModelController::class, 'update'])->name('admin.model.update');
    Route::delete('/super-admin/models/{llmModel}', [LlmModelController::class, 'destroy'])->name('admin.model.destroy');

    Route::get('/super-admin/plans', [PlanController::class, 'index'])->name('admin.plan.index');
    Route::post('/super-admin/plans', [PlanController::class, 'store'])->name('admin.plan.store');
    Route::post('/super-admin/plans/{plan}', [PlanController::class, 'update'])->name('admin.plan.update');
    Route::delete('/super-admin/plans/{plan}', [PlanController::class, 'destroy'])->name('admin.plan.destroy');

    Route::get('/super-admin/credit-packages', [CreditPackageController::class, 'index'])->name('admin.credit-packages.index');
    Route::post('/super-admin/credit-packages', [CreditPackageController::class, 'store'])->name('admin.credit-packages.store');
    Route::post('/super-admin/credit-packages/{creditPackage}', [CreditPackageController::class, 'update'])->name('admin.credit-packages.update');
    Route::delete('/super-admin/credit-packages/{creditPackage}', [CreditPackageController::class, 'destroy'])->name('admin.credit-packages.destroy');

    Route::get('/super-admin/token-usage', [TokenUsageController::class, 'index'])->name('admin.token-usage.index');

    Route::get('/super-admin/openrouter/credits', [OpenRouterController::class, 'fetchCredits'])->name('admin.openrouter.credits');
});
