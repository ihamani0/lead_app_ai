<?php


namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeadController extends Controller{

    public function index()
    {
        $tenant_id = Auth::user()->tenant_id;
        $leads = Lead::where('tenant_id', $tenant_id)
            ->orderBy('updated_at', 'desc')
            ->paginate(15); // Use pagination for CRM

        return Inertia::render('Leads/Index', ['leads' => $leads]);
    }

    public function show(Request $request, $id)
    {
        $lead = Lead::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        return Inertia::render('Leads/Show', [
            'lead' => $lead
        ]);
    }
    
    // Optional: Allow manual override
    public function update(Request $request, $id)
    {
        $lead = Lead::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $lead->update($request->only(['status', 'temperature']));
        return back()->with('success', 'Lead updated manually.');
    }


}