<?php

namespace App\Http\Controllers;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $tab = $request->input('tab', 'leads');

        $data = [];

        if ($tab === 'leads') {
            $data['leads'] = $this->getLeadsReport($tenantId);
        } elseif ($tab === 'instances') {
            $data['instances'] = $this->getInstancesReport($tenantId);
        } elseif ($tab === 'agents') {
            $data['agents'] = $this->getAgentsReport($tenantId);
        } elseif ($tab === 'media') {
            $data['media'] = $this->getMediaReport($tenantId);
        }

        return Inertia::render('reports/Index', [
            'reportData' => $data,
            'activeTab' => $tab,
        ]);
    }

    private function getLeadsReport(string $tenantId): array
    {
        $leads = Lead::where('tenant_id', $tenantId)->get();

        $byStatus = $leads->groupBy('status')->map(fn ($g) => $g->count());
        $byTemperature = $leads->groupBy('temperature')->map(fn ($g) => $g->count());
        $bySource = $leads->groupBy('source')->map(fn ($g) => $g->count());
        $byInstance = $leads->groupBy('instance_id')
            ->map(fn ($g) => $g->count())
            ->mapWithKeys(function ($count, $instanceId) {
                $instance = EvolutionInstance::find($instanceId);
                $name = $instance?->instance_name ?? 'Unknown';

                return [$name => $count];
            });

        $last30Days = $leads->filter(fn ($lead) => $lead->created_at >= now()->subDays(30));
        $last7Days = $leads->filter(fn ($lead) => $lead->created_at >= now()->subDays(7));

        return [
            'summary' => [
                'total' => $leads->count(),
                'last7days' => $last7Days->count(),
                'last30days' => $last30Days->count(),
                'avgPerDay' => $last30Days->count() > 0 ? round($last30Days->count() / 30, 1) : 0,
            ],
            'byStatus' => $byStatus,
            'byTemperature' => $byTemperature,
            'bySource' => $bySource,
            'byInstance' => $byInstance,
        ];
    }

    private function getInstancesReport(string $tenantId): array
    {
        $instances = EvolutionInstance::where('tenant_id', $tenantId)->get();

        $byStatus = $instances->groupBy('status')->map(fn ($g) => $g->count());

        $leadsByInstance = [];
        foreach ($instances as $instance) {
            $leadsByInstance[$instance->instance_name] = Lead::where('instance_id', $instance->id)->count();
        }

        return [
            'summary' => [
                'total' => $instances->count(),
                'connected' => $instances->where('status', 'connected')->count(),
                'disconnected' => $instances->where('status', '!=', 'connected')->count(),
            ],
            'byStatus' => $byStatus,
            'leadsByInstance' => $leadsByInstance,
            'instances' => $instances->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->instance_name,
                'phone' => $i->phone_number,
                'status' => $i->status,
                'connected_at' => $i->connected_at?->toIsoString(),
            ]),
        ];
    }

    private function getAgentsReport(string $tenantId): array
    {
        $agents = AgentConfig::whereHas('instance', function ($query) use ($tenantId) {
            $query->where('tenant_id', $tenantId);
        })->with('instance')->get();

        return [
            'summary' => [
                'total' => $agents->count(),
                'active' => $agents->where('is_active', true)->count(),
                'inactive' => $agents->where('is_active', false)->count(),
            ],
            'byStatus' => [
                'active' => $agents->where('is_active', true)->count(),
                'inactive' => $agents->where('is_active', false)->count(),
            ],
            'agents' => $agents->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name ?? 'Unnamed Agent',
                'instance_name' => $a->instance?->instance_name,
                'is_active' => $a->is_active,
                'created_at' => $a->created_at->toIsoString(),
            ]),
        ];
    }

    private function getMediaReport(string $tenantId): array
    {
        $media = MediaAsset::where('tenant_id', $tenantId)->get();

        $byType = $media->groupBy('type')->map(fn ($g) => $g->count());

        $totalSize = 0;
        foreach ($media as $m) {
            $mediaFiles = $m->getMedia('assets');
            foreach ($mediaFiles as $file) {
                $totalSize += $file->size;
            }
        }

        $avgSize = $media->count() > 0 ? round($totalSize / $media->count()) : 0;

        return [
            'summary' => [
                'total' => $media->count(),
                'totalSize' => $totalSize,
                'avgSize' => $avgSize,
            ],
            'byType' => $byType,
            'recentMedia' => MediaAsset::where('tenant_id', $tenantId)->latest()->limit(10)->get()->map(fn ($m) => [
                'id' => $m->id,
                'filename' => $m->category,
                'mime_type' => $m->type,
                'created_at' => $m->created_at->toIsoString(),
            ]),
        ];
    }
}
