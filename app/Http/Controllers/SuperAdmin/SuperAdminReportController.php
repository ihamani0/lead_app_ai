<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Tenant;
use App\Models\TokenTransactionDaily;
use App\Models\User;
use Inertia\Inertia;

class SuperAdminReportController extends Controller
{
    public function index()
    {
        return Inertia::render('SuperAdmin/Reports', [
            'summary' => $this->getSummary(),
            'tenantGrowth' => $this->getTenantGrowth(),
            'planDistribution' => $this->getPlanDistribution(),
            'leadGeneration' => $this->getLeadGeneration(),
            'topTenants' => $this->getTopTenants(),
            'dailyTokenCost' => $this->getDailyTokenCost(),
        ]);
    }

    private function getSummary(): array
    {
        $tenantIds = Tenant::whereDoesntHave('users', fn ($u) => $u->where('is_super_admin', true))
            ->pluck('id');

        return [
            'total_tenants' => Tenant::count(),
            'active_tenants' => Tenant::where('is_active', true)->count(),
            'total_leads' => Lead::whereIn('tenant_id', $tenantIds)->count(),
            'total_users' => User::where('is_super_admin', false)->count(),
        ];
    }

    private function getTenantGrowth(): array
    {
        return Tenant::where('created_at', '>=', now()->subYear())
            ->get()
            ->groupBy(fn ($t) => $t->created_at->format('Y-m'))
            ->map(fn ($items, $month) => [
                'month' => $month,
                'count' => $items->count(),
            ])
            ->sortBy('month')
            ->values()
            ->toArray();
    }

    private function getPlanDistribution(): array
    {
        return Tenant::select('plan_id')
            ->with('plan:id,name,slug')
            ->get()
            ->groupBy(fn ($t) => $t->plan?->name ?? 'No Plan')
            ->map(fn ($items, $name) => [
                'name' => $name,
                'count' => $items->count(),
            ])
            ->sortByDesc('count')
            ->values()
            ->toArray();
    }

    private function getLeadGeneration(): array
    {
        $tenantIds = Tenant::whereDoesntHave('users', fn ($u) => $u->where('is_super_admin', true))
            ->pluck('id');

        return Lead::whereIn('tenant_id', $tenantIds)
            ->where('created_at', '>=', now()->subYear())
            ->get()
            ->groupBy(fn ($l) => $l->created_at->format('Y-m'))
            ->map(fn ($items, $month) => [
                'month' => $month,
                'count' => $items->count(),
            ])
            ->sortBy('month')
            ->values()
            ->toArray();
    }

    private function getTopTenants(): array
    {
        $rows = TokenTransactionDaily::where('date', '>=', now()->subDays(30))
            ->selectRaw('tenant_id, sum(total_cost_millicents) as total_cost, sum(total_tokens_used) as total_tokens')
            ->groupBy('tenant_id')
            ->orderByDesc('total_cost')
            ->limit(10)
            ->get();

        $tenantNames = Tenant::whereIn('id', $rows->pluck('tenant_id'))
            ->pluck('name', 'id');

        return $rows->map(fn ($row) => [
            'tenant_name' => $tenantNames->get($row->tenant_id, 'Unknown'),
            'total_cost' => round($row->total_cost / 100_000, 2),
            'total_tokens' => (int) $row->total_tokens,
        ])->toArray();
    }

    private function getDailyTokenCost(): array
    {
        return TokenTransactionDaily::where('date', '>=', now()->subDays(30))
            ->selectRaw('date, sum(total_cost_millicents) as total_cost, sum(total_tokens_used) as total_tokens')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'total_cost' => round($row->total_cost / 100_000, 2),
                'total_tokens' => (int) $row->total_tokens,
            ])
            ->toArray();
    }
}
