<?php

namespace App\Http\Controllers;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        // Instance Stats
        $instances = EvolutionInstance::where('tenant_id', $tenantId)->get();
        $totalInstances = $instances->count();
        $connectedInstances = $instances->where('status', 'connected')->count();
        $disconnectedInstances = $instances->where('status', '!=', 'connected')->count();

        // Lead Stats
        $leads = Lead::where('tenant_id', $tenantId)->get();
        $totalLeads = $leads->count();
        $leadsByStatus = $leads->groupBy('status')->map(fn ($group) => $group->count());
        $leadsByTemperature = $leads->groupBy('temperature')->map(fn ($group) => $group->count());

        // Recent leads (last 7 days)
        $recentLeads = Lead::where('tenant_id', $tenantId)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        // New today
        $leadsToday = Lead::where('tenant_id', $tenantId)
            ->whereDate('created_at', today())
            ->count();

        // Media Stats
        $totalMedia = MediaAsset::where('tenant_id', $tenantId)->count();

        // Agent Stats
        $totalAgents = AgentConfig::whereHas('instance', function ($query) use ($tenantId) {
            $query->where('tenant_id', $tenantId);
        })->count();

        $activeAgents = AgentConfig::whereHas('instance', function ($query) use ($tenantId) {
            $query->where('tenant_id', $tenantId);
        })->where('is_active', true)->count();

        // Recent leads for the list
        $recentLeadsList = Lead::where('tenant_id', $tenantId)
            ->with('instance')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'instances' => [
                    'total' => $totalInstances,
                    'connected' => $connectedInstances,
                    'disconnected' => $disconnectedInstances,
                ],
                'leads' => [
                    'total' => $totalLeads,
                    'byStatus' => $leadsByStatus,
                    'byTemperature' => $leadsByTemperature,
                    'recent' => $recentLeads,
                    'today' => $leadsToday,
                ],
                'media' => [
                    'total' => $totalMedia,
                ],
                'agents' => [
                    'total' => $totalAgents,
                    'active' => $activeAgents,
                ],
            ],
            'recentLeads' => $recentLeadsList,
        ]);
    }
}
