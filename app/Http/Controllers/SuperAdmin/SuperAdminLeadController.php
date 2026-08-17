<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminLeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with('tenant:id,name,slug', 'team:id,name', 'instance:id,instance_name')
            ->whereHas('tenant', function ($q) {
                $q->whereDoesntHave('users', fn ($u) => $u->where('is_super_admin', true));
            })
            ->when($request->tenant_id, fn ($q, $v) => $q->where('tenant_id', $v))
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->when($request->temperature, fn ($q, $v) => $q->where('temperature', $v))
            ->when($request->qualification, fn ($q, $v) => $q->where('qualification_result', $v))
            ->when($request->search, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('name', 'ilike', "%{$v}%")
                    ->orWhere('phone', 'ilike', "%{$v}%")
                    ->orWhere('email', 'ilike', "%{$v}%");
            }))
            ->when($request->date_from, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($request->date_to, fn ($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->latest();

        $paginator = $query->paginate(25)->withQueryString();

        $tenants = Tenant::whereDoesntHave('users', fn ($u) => $u->where('is_super_admin', true))
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('SuperAdmin/Leads/Index', [
            'leads' => $paginator->items(),
            'pagination' => [
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'links' => $paginator->linkCollection()->toArray(),
            ],
            'tenants' => $tenants,
            'filters' => $request->only(['tenant_id', 'status', 'temperature', 'qualification', 'search', 'date_from', 'date_to']),
        ]);
    }

    public function export(Request $request)
    {
        $leads = Lead::with('tenant:id,name,slug', 'team:id,name')
            ->whereHas('tenant', function ($q) {
                $q->whereDoesntHave('users', fn ($u) => $u->where('is_super_admin', true));
            })
            ->when($request->tenant_id, fn ($q, $v) => $q->where('tenant_id', $v))
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->when($request->temperature, fn ($q, $v) => $q->where('temperature', $v))
            ->when($request->qualification, fn ($q, $v) => $q->where('qualification_result', $v))
            ->when($request->search, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('name', 'ilike', "%{$v}%")
                    ->orWhere('phone', 'ilike', "%{$v}%")
                    ->orWhere('email', 'ilike', "%{$v}%");
            }))
            ->when($request->date_from, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($request->date_to, fn ($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->latest()
            ->cursor();

        $headers = [
            'Tenant', 'Team', 'Name', 'Phone', 'Email', 'Status',
            'Temperature', 'Contact Status', 'Qualification', 'Score',
            'AI Summary', 'Notes', 'Is New', 'Created At', 'Last Activity',
        ];

        return response()->streamDownload(function () use ($leads, $headers) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, $headers);

            foreach ($leads as $lead) {
                fputcsv($handle, [
                    $lead->tenant?->name,
                    $lead->team?->name,
                    $lead->name,
                    $lead->phone,
                    $lead->email,
                    $lead->status,
                    $lead->temperature,
                    $lead->contact_status,
                    $lead->qualification_result,
                    $lead->qualification_score,
                    $lead->ai_summary,
                    $lead->notes,
                    $lead->is_new ? 'Yes' : 'No',
                    $lead->created_at,
                    $lead->last_activity_at,
                ]);
            }

            fclose($handle);
        }, 'leads-export.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
