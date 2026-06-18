<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\LlmModel;
use App\Models\Tenant;
use App\Models\TokenTransaction;
use App\Models\TokenTransactionDaily;
use App\Services\TokenService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminTenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::withCount('users')
            ->whereDoesntHave('users', function ($query) {
                $query->where('is_super_admin', true);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    public function show(Tenant $tenant)
    {
        $tenant->load('users', 'llmModel');

        $dailyUsage = TokenTransactionDaily::where('tenant_id', $tenant->id)
            ->where('date', '>=', now()->subDays(30)->toDateString())
            ->orderBy('date', 'desc')
            ->get();

        $transactions = TokenTransaction::where('tenant_id', $tenant->id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        $availableModels = LlmModel::where('is_active', true)->get();

        return Inertia::render('SuperAdmin/Tenants/Show', [
            'tenant' => $tenant,
            'daily_usage' => $dailyUsage,
            'transactions' => $transactions,
            'available_models' => $availableModels,
        ]);
    }

    public function addDollars(Request $request, Tenant $tenant, TokenService $tokenService)
    {
        $validated = $request->validate([
            'type' => 'required|in:purchase,bonus,adjustment',
            'dollar_amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
        ]);

        $tokenService->addDollars(
            $tenant,
            (float) $validated['dollar_amount'],
            $validated['description'] ?? 'Recharge',
            null
        );

        return back()->with('success', "Added \${$validated['dollar_amount']} credit to {$tenant->name}.");
    }

    public function updateModel(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'llm_model_id' => 'nullable|ulid|exists:llm_models,id',
        ]);

        $tenant->update(['llm_model_id' => $validated['llm_model_id'] ?: null]);

        return back()->with('success', 'Model updated successfully.');
    }
}
