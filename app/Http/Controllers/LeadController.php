<?php

namespace App\Http\Controllers;

use App\Models\EvolutionInstance;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        // 1. Capture the current filters from the URL
        $filters = $request->only([
            'search', 'status', 'temperature', 'date_from', 'date_to', 'min_score', 'instance_id',
        ]);

        // 2. Fetch all instances for this tenant to populate the Dropdown
        $instances = EvolutionInstance::where('tenant_id', $tenant_id)
            ->select('id', 'instance_name', 'phone_number')
            ->get();

        // 3. Build the query
        $leads = Lead::where('tenant_id', $tenant_id)
            ->with(['instance:id,instance_name,phone_number'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            // New Filter: Instance Name
            ->when($request->instance_id, fn ($q, $instance) => $q->where('instance_id', $instance))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->temperature, function ($q, $temp) {
                if ($temp === 'UNQUALIFIED') {
                    return $q->where(function ($sub) {
                        $sub->where('is_new', true)
                            ->orWhere('ai_qualification_status', 'NON_QUALIFIE')
                            ->orWhereNull('ai_qualification_status');
                    });
                }

                return $q->where('qualification_result', $temp);
            })
            ->when($request->date_from, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($request->min_score, fn ($q, $score) => $q->where('qualification_score', '>=', $score))
            ->orderBy('updated_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
            'filters' => $filters, // Pass filters back to UI so inputs stay populated
            'instances' => $instances,
        ]);
    }

    // Optional: Allow manual override
    public function update(Request $request, $id)
    {
        $lead = Lead::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        $lead->update($request->only([
            'name',
            'status',
            'temperature',
            'qualification_result',
            'qualification_score',
            'treatment_status',
            'notes',
        ]));

        return back()->with('success', __('messages.success.lead_udated_manually'));
    }

    public function triggerQualification(Request $request, $id)
    {
        $lead = Lead::where('tenant_id', $request->user()->tenant_id)->with('instance')->findOrFail($id);

        // Set status to QUALIFYING before calling N8n
        $lead->update(['status' => 'QUALIFYING']);

        $webhookUrl = config('services.n8n.n8n_base_url').'/webhook/lead/qualification';
        // http://127.0.0.1:5678/webhook-test/lead/qualification
        $response = Http::withHeaders([
            'X-N8N-API-KEY' => config('services.n8n.api_key'),
        ])->post($webhookUrl, [
            'instanceName' => $lead->instance->instance_name,
            'phone' => $lead->phone,
        ]);

        return back()->with('success', __('messages.success.qualification_in_progress'));
    }

    public function bulkQualify(Request $request)
    {
        $leadIds = $request->input('lead_ids', []);

        $leads = Lead::where('tenant_id', $request->user()->tenant_id)
            ->whereIn('id', $leadIds)
            ->with('instance')
            ->get();

        $successCount = 0;
        $failedCount = 0;

        foreach ($leads as $lead) {
            try {
                $webhookUrl = config('services.n8n.n8n_base_url').'/webhook/lead/qualification';

                $response = Http::withHeaders([
                    'X-N8N-API-KEY' => config('services.n8n.api_key'),
                ])->post($webhookUrl, [
                    'instanceName' => $lead->instance->instance_name,
                    'phone' => $lead->phone,
                ]);

                if ($response->successful()) {
                    $lead->update([
                        'is_new' => false,
                        'last_qualification_attempt_at' => now(),
                    ]);
                    $successCount++;
                } else {
                    $failedCount++;
                }

                usleep(500000);

            } catch (\Exception $e) {
                $failedCount++;
            }
        }

        $message = "Qualification déclenchée: {$successCount} succès, {$failedCount} échecs.";

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => $message]);
        }

        return back()->with('success', $message);
    }
}
