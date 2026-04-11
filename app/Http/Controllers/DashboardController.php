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
        $leadsByAiQualification = $leads->groupBy('ai_qualification_status')->map(fn ($group) => $group->count());
        $leadsByQualificationResult = $leads->groupBy('qualification_result')->map(fn ($group) => $group->count());
        $leadsByTreatmentStatus = $leads->groupBy('treatment_status')->map(fn ($group) => $group->count());

        // Recent leads (last 7 days)
        $recentLeads = Lead::where('tenant_id', $tenantId)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        // New today
        $leadsToday = Lead::where('tenant_id', $tenantId)
            ->whereDate('created_at', today())
            ->count();

        // Media Stats
        // $totalMedia = MediaAsset::where('tenant_id', $tenantId)->count();
        // totale Size
        $media = MediaAsset::where('tenant_id', $tenantId)->get();
        $totalMedia = $media->count();
        $totalSize = 0;
        foreach ($media as $m) {
            $mediaFiles = $m->getMedia('assets');
            foreach ($mediaFiles as $file) {
                $totalSize += $file->size;
            }
        }

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
                    'byAiQualification' => $leadsByAiQualification,
                    'byQualificationResult' => $leadsByQualificationResult,
                    'byTreatmentStatus' => $leadsByTreatmentStatus,
                    'recent' => $recentLeads,
                    'today' => $leadsToday,
                ],
                'media' => [
                    'total' => $totalMedia,
                    'totalSize' => $totalSize,
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
