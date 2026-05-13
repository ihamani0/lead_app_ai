<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TokenTransactionDaily;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SuperAdminDashboardController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_tenants' => Tenant::count(),
            'active_tenants' => Tenant::where('is_active', true)->count(),
            'tenants_with_low_credit' => Tenant::where('credit_millicents', '<', config('services.token.threshold', 10) * 1000)->count(),
            'avg_daily_cost' => TokenTransactionDaily::where('date', '>=', now()->subDays(7)->toDateString())
                ->avg(DB::raw('total_cost_millicents')) ?? 0,
            'total_dollars_recharged' => TokenTransactionDaily::where('date', '>=', now()->subDays(30)->toDateString())
                ->sum('millicents_recharged'),
        ];

        $planDistribution = Tenant::select('plan', DB::raw('count(*) as count'))
            ->groupBy('plan')
            ->pluck('count', 'plan')
            ->toArray();

        $topConsumers = TokenTransactionDaily::with('tenant')
            ->selectRaw('tenant_id, SUM(total_cost_millicents) as total')
            ->where('date', '>=', now()->subDays(30)->toDateString())
            ->groupBy('tenant_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $recentTenants = Tenant::withCount('users')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => $stats,
            'plan_distribution' => $planDistribution,
            'top_consumers' => $topConsumers,
            'recent_tenants' => $recentTenants,
        ]);
    }
}
