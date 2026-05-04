<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminTenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::withCount('users')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    public function show(Tenant $tenant)
    {
        $tenant->load('users');

        return Inertia::render('SuperAdmin/Tenants/Show', [
            'tenant' => $tenant,
        ]);
    }

    public function addTokens(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'type' => 'required|in:purchase,bonus,adjustment',
            'dollar_amount' => 'required|numeric|min:1',
            'description' => 'nullable|string|max:255',
        ]);

        $tokensPerDollar = 833333;
        $tokensToAdd = (int) ($validated['dollar_amount'] * $tokensPerDollar);

        $tenant->token_balance += $tokensToAdd;
        $tenant->save();

        return back()->with('success', "Added {$tokensToAdd} tokens to {$tenant->name}.");
    }
}
