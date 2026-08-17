<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TokenTransactionDaily;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TokenUsageController extends Controller
{
    public function index(Request $request)
    {
        $dateFrom = $request->date_from ?: now()->subDays(30)->format('Y-m-d');
        $dateTo = $request->date_to ?: now()->format('Y-m-d');
        $search = $request->search;

        $tenantQuery = Tenant::query()
            ->when($search, fn ($q, $v) => $q->where('name', 'ilike', "%{$v}%"));

        $tenants = $tenantQuery->orderBy('name')->get(['id', 'name', 'slug', 'credit_millicents', 'is_active']);

        $dailyRows = TokenTransactionDaily::whereBetween('date', [$dateFrom, $dateTo])
            ->selectRaw('date, sum(total_tokens_used) as total_tokens, sum(total_cost_millicents) as total_cost, sum(millicents_recharged) as recharges')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $tenantTotals = TokenTransactionDaily::whereBetween('date', [$dateFrom, $dateTo])
            ->whereIn('tenant_id', $tenants->pluck('id'))
            ->selectRaw('tenant_id, sum(input_tokens_used) as input_tokens, sum(output_tokens_used) as output_tokens, sum(total_tokens_used) as total_tokens, sum(total_cost_millicents) as total_cost, sum(millicents_recharged) as recharges, sum(transaction_count) as tx_count')
            ->groupBy('tenant_id')
            ->get()
            ->keyBy('tenant_id');

        $tenantRows = $tenants->map(fn ($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'slug' => $t->slug,
            'is_active' => $t->is_active,
            'balance' => round($t->credit_millicents / 100_000, 2),
            'input_tokens' => (int) ($tenantTotals[$t->id]->input_tokens ?? 0),
            'output_tokens' => (int) ($tenantTotals[$t->id]->output_tokens ?? 0),
            'total_tokens' => (int) ($tenantTotals[$t->id]->total_tokens ?? 0),
            'total_cost' => round(($tenantTotals[$t->id]->total_cost ?? 0) / 100_000, 2),
            'recharges' => round(($tenantTotals[$t->id]->recharges ?? 0) / 100_000, 2),
        ]);

        $totals = [
            'total_tokens' => $tenantRows->sum('total_tokens'),
            'total_cost' => round($tenantRows->sum('total_cost'), 2),
            'total_recharges' => round($tenantRows->sum('recharges'), 2),
            'low_credit_count' => Tenant::where('credit_millicents', '<',
                config('services.token.threshold', 10) * 1000)->count(),
        ];

        $dailyData = $dailyRows->map(fn ($r) => [
            'date' => $r->date,
            'total_tokens' => (int) $r->total_tokens,
            'total_cost' => round($r->total_cost / 100_000, 2),
            'recharges' => round($r->recharges / 100_000, 2),
        ]);

        return Inertia::render('SuperAdmin/TokenUsage', [
            'totals' => $totals,
            'dailyData' => $dailyData,
            'tenants' => $tenantRows,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'search' => $search ?? '',
            ],
        ]);
    }
}
