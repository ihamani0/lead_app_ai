<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CreditPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditPackageController extends Controller
{
    public function index()
    {
        $packages = CreditPackage::orderBy('price_millicents')->get();

        return Inertia::render('SuperAdmin/CreditPackages/Index', [
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'price_millicents' => 'required|integer|min:0',
            'credit_millicents' => 'required|integer|min:0',
            'paddle_price_id' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        CreditPackage::create($validated);

        return back()->with('success', 'Credit package created successfully.');
    }

    public function update(Request $request, CreditPackage $creditPackage)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:500',
            'price_millicents' => 'sometimes|integer|min:0',
            'credit_millicents' => 'sometimes|integer|min:0',
            'paddle_price_id' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $creditPackage->update($validated);

        return back()->with('success', 'Credit package updated successfully.');
    }

    public function destroy(CreditPackage $creditPackage)
    {
        $creditPackage->delete();

        return back()->with('success', 'Credit package deleted successfully.');
    }
}
