<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\PlanEnforcementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::withCount('tenants')->orderBy('price_millicents')->get();

        return Inertia::render('SuperAdmin/Plans/Index', [
            'plans' => $plans,
            'availableFeatures' => PlanEnforcementService::getAvailableFeatures(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:50|unique:plans,slug',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'price_millicents' => 'required|integer|min:0',
            'max_teams' => 'nullable|integer|min:0',
            'max_members' => 'nullable|integer|min:0',
            'max_leads' => 'nullable|integer|min:0',
            'max_agents' => 'nullable|integer|min:0',
            'max_instances' => 'nullable|integer|min:0',
            'max_storage_mb' => 'nullable|integer|min:0',
            'dollar_limit' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'is_default' => 'sometimes|boolean',
            'paddle_price_id' => 'nullable|string|max:255',
            'paddle_price_id_yearly' => 'nullable|string|max:255',
            'price_yearly_millicents' => 'nullable|integer|min:0',
        ]);

        if ($validated['is_default'] ?? false) {
            Plan::where('is_default', true)->update(['is_default' => false]);
        }

        Plan::create($validated);

        return back()->with('success', 'Plan created successfully.');
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'slug' => 'sometimes|string|max:50|unique:plans,slug,'.$plan->id,
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:500',
            'price_millicents' => 'sometimes|integer|min:0',
            'max_teams' => 'nullable|integer|min:0',
            'max_members' => 'nullable|integer|min:0',
            'max_leads' => 'nullable|integer|min:0',
            'max_agents' => 'nullable|integer|min:0',
            'max_instances' => 'nullable|integer|min:0',
            'max_storage_mb' => 'nullable|integer|min:0',
            'dollar_limit' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'is_default' => 'sometimes|boolean',
            'paddle_price_id' => 'nullable|string|max:255',
            'paddle_price_id_yearly' => 'nullable|string|max:255',
            'price_yearly_millicents' => 'nullable|integer|min:0',
        ]);

        if ($validated['is_default'] ?? false) {
            Plan::where('is_default', true)->where('id', '!=', $plan->id)->update(['is_default' => false]);
        }

        $plan->update($validated);

        return back()->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan)
    {
        if ($plan->tenants()->count() > 0) {
            return back()->with('error', 'Cannot delete a plan that has tenants assigned.');
        }

        $plan->delete();

        return back()->with('success', 'Plan deleted successfully.');
    }
}
