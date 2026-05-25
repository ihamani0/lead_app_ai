<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\MediaAsset;
use App\Models\Team;
use App\Models\Tenant;
use App\Models\TokenTransaction;
use App\Models\TokenTransactionDaily;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use WorkspaceScoped;

    public function __invoke(Request $request)
    {
        $scope = $this->scope($request);
        $team = $request->attributes->get('active_team');
        $tenantId = $request->user()->tenant_id;

        return Inertia::render('dashboard', [
            'stats' => [
                'instances' => $this->getInstanceStats($scope),
                'leads' => $this->getLeadStats($scope),
                'media' => $this->getMediaStats($scope),
                'agents' => $this->getAgentStats($team, $tenantId),
            ],
            'recentLeads' => $this->getRecentLeadsList($scope),
            'token_stats' => $this->getTokenStats($request),
            'token_daily_usage' => $this->getTokenDailyUsage($scope),
            'token_transactions' => $this->getRecentTransactions($scope),
        ]);
    }

    private function getInstanceStats(array $scope): array
    {
        $instances = EvolutionInstance::where($scope)->get();

        return [
            'total' => $instances->count(),
            'connected' => $instances->where('status', 'connected')->count(),
            'disconnected' => $instances->where('status', '!=', 'connected')->count(),
        ];
    }

    private function getLeadStats(array $scope): array
    {
        $leads = Lead::where($scope)->get();

        return [
            'total' => $leads->count(),
            'byAiQualification' => $leads->groupBy('ai_qualification_status')->map(fn ($g) => $g->count()),
            'byQualificationResult' => $leads->groupBy('qualification_result')->map(fn ($g) => $g->count()),
            'byTreatmentStatus' => $leads->groupBy('treatment_status')->map(fn ($g) => $g->count()),
            'recent' => Lead::where($scope)->where('created_at', '>=', now()->subDays(7))->count(),
            'today' => Lead::where($scope)->whereDate('created_at', today())->count(),
        ];
    }

    private function getRecentLeadsList(array $scope): Collection
    {
        return Lead::where($scope)
            ->with('instance')
            ->latest()
            ->limit(10)
            ->get();
    }

    private function getMediaStats(array $scope): array
    {
        $media = MediaAsset::where($scope)->get();

        $totalSize = 0;
        foreach ($media as $m) {
            foreach ($m->getMedia('assets') as $file) {
                $totalSize += $file->size;
            }
        }

        return [
            'total' => $media->count(),
            'totalSize' => $totalSize,
        ];
    }

    private function getAgentStats(?Team $team, string $tenantId): array
    {
        $query = AgentConfig::when($team, fn ($q) => $q->where('team_id', $team->id))
            ->whereHas('instance', fn ($q) => $q->where('tenant_id', $tenantId));

        return [
            'total' => (clone $query)->count(),
            'active' => (clone $query)->where('is_active', true)->count(),
        ];
    }

    private function getTokenStats(Request $request): array
    {
        $tenant = Tenant::find($request->user()->tenant_id);

        return [
            'credit' => (int) $tenant->credit_millicents,
            'is_low_credit' => (bool) $tenant->is_low_credit,
            'threshold' => config('services.token.threshold', 10) * 1000,
            'model' => $tenant->llmModel?->display_name ?? 'DeepSeek (Default)',
        ];
    }

    private function getTokenDailyUsage(array $scope): Collection
    {
        return TokenTransactionDaily::where($scope)
            ->where('date', '>=', now()->subDays(30)->toDateString())
            ->orderBy('date')
            ->get();
    }

    private function getRecentTransactions(array $scope): Collection
    {
        return TokenTransaction::where($scope)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    }
}
