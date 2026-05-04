<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SuperAdminDashboardController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_tenants' => Tenant::count(),
            'active_tenants' => Tenant::where('is_active', true)->count(),
            'inactive_tenants' => Tenant::where('is_active', false)->count(),
            'total_users' => User::count(),
            'total_tokens' => Tenant::sum('token_balance'),
            'tenants_with_low_tokens' => Tenant::where('token_balance', '<', 10000)->count(),
        ];

        $planDistribution = Tenant::select('plan', DB::raw('count(*) as count'))
            ->groupBy('plan')
            ->pluck('count', 'plan')
            ->toArray();

        $recentTenants = Tenant::withCount('users')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => $stats,
            'plan_distribution' => $planDistribution,
            'recent_tenants' => $recentTenants,
            'token_rate' => 833333,
        ]);
    }
}
