<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\TokenTransactionDaily;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request)
    {
        $tab = $request->input('tab', 'leads');

        $data = [];

        if ($tab === 'leads') {
            $data['leads'] = $this->getLeadsReport($request);
        } elseif ($tab === 'instances') {
            $data['instances'] = $this->getInstancesReport($request);
        } elseif ($tab === 'agents') {
            $data['agents'] = $this->getAgentsReport($request);
        } elseif ($tab === 'tokens') {
            $data['tokens'] = $this->getTokenTransactionsReport($request);
        }

        return Inertia::render('reports/Index', [
            'reportData' => $data,
            'activeTab' => $tab,
        ]);
    }

    private function getLeadsReport(Request $request): array
    {
        $leads = $this->scopedQuery($request, Lead::class)->get();

        $byAiQualification = $leads->groupBy('ai_qualification_status')->map(fn ($g) => $g->count());
        $byQualificationResult = $leads->groupBy('qualification_result')->map(fn ($g) => $g->count());
        $byTreatmentStatus = $leads->groupBy('treatment_status')->map(fn ($g) => $g->count());
        $byInstance = $leads->groupBy('instance_id')
            ->map(fn ($g) => $g->count())
            ->mapWithKeys(function ($count, $instanceId) use ($request) {
                $instance = $this->scopedQuery($request, EvolutionInstance::class)->find($instanceId);
                $name = $instance?->instance_name ?? 'Unknown';

                return [$name => $count];
            });

        $last30Days = $leads->filter(fn ($lead) => $lead->created_at >= now()->subDays(30));
        $last7Days = $leads->filter(fn ($lead) => $lead->created_at >= now()->subDays(7));

        $leadsOverTime = $last30Days
            ->groupBy(fn ($lead) => $lead->created_at->format('M d'))
            ->map(function ($group) {
                $first = $group->first();

                return [
                    'date' => $first->created_at->format('M d'),
                    'count' => $group->count(),
                ];
            })
            ->values()
            ->toArray();

        return [
            'summary' => [
                'total' => $leads->count(),
                'last7days' => $last7Days->count(),
                'last30days' => $last30Days->count(),
                'avgPerDay' => $last30Days->count() > 0 ? round($last30Days->count() / 30, 1) : 0,
            ],
            'byAiQualification' => $byAiQualification,
            'byQualificationResult' => $byQualificationResult,
            'byTreatmentStatus' => $byTreatmentStatus,
            'byInstance' => $byInstance,
            'leadsOverTime' => $leadsOverTime,
        ];
    }

    private function getInstancesReport(Request $request): array
    {
        $instances = $this->scopedQuery($request, EvolutionInstance::class)->get();

        $byStatus = $instances->groupBy('status')->map(fn ($g) => $g->count());

        $leadsByInstance = [];
        foreach ($instances as $instance) {
            $leadsByInstance[$instance->instance_name] = $this->scopedQuery($request, Lead::class)->where('instance_id', $instance->id)->count();
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

    private function getAgentsReport(Request $request): array
    {
        $tenantId = $request->user()->tenant_id;
        $team = $request->attributes->get('active_team');

        $agents = $this->scopedQuery($request, AgentConfig::class)
            ->with('instance')
            ->get();

        $agentIds = $agents->pluck('id')->filter()->values()->toArray();

        $tokenUsage = [];
        if ($agentIds) {
            $tokenQuery = DB::table('token_transactions_daily')
                ->where('tenant_id', $tenantId)
                ->whereIn('agent_config_id', $agentIds)
                ->whereNotNull('agent_config_id');

            if ($team) {
                $tokenQuery->where(function ($q) use ($team) {
                    $q->where('team_id', $team->id)->orWhereNull('team_id');
                });
            }

            $tokenUsage = $tokenQuery
                ->select(
                    'agent_config_id',
                    DB::raw('SUM(total_tokens_used) as total_tokens'),
                    DB::raw('ROUND(SUM(total_cost_millicents) / 100000.0, 2) as total_cost'),
                    DB::raw('SUM(transaction_count) as transaction_count')
                )
                ->groupBy('agent_config_id')
                ->get()
                ->keyBy('agent_config_id');
        }

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
            'agents' => $agents->map(function ($a) use ($tokenUsage) {
                $usage = $tokenUsage->get($a->id);

                return [
                    'id' => $a->id,
                    'name' => $a->name ?? 'Unnamed Agent',
                    'instance_name' => $a->instance?->instance_name,
                    'is_active' => $a->is_active,
                    'created_at' => $a->created_at->toIsoString(),
                    'total_tokens' => (int) ($usage->total_tokens ?? 0),
                    'total_cost' => (float) ($usage->total_cost ?? 0),
                    'transaction_count' => (int) ($usage->transaction_count ?? 0),
                ];
            }),
        ];
    }

    private function getTokenTransactionsReport(Request $request): array
    {
        $tenantId = $request->user()->tenant_id;
        $team = $request->attributes->get('active_team');

        $baseQuery = TokenTransactionDaily::where('token_transactions_daily.tenant_id', $tenantId);
        if ($team) {
            $baseQuery->where(function ($q) use ($team) {
                $q->where('token_transactions_daily.team_id', $team->id)->orWhereNull('token_transactions_daily.team_id');
            });
        }

        $dailyRecords = (clone $baseQuery)
            ->where('date', '>=', now()->subDays(30))
            ->orderBy('date')
            ->get();

        $allRecords = (clone $baseQuery)->get();

        $totalInputTokens = $dailyRecords->sum('input_tokens_used');
        $totalOutputTokens = $dailyRecords->sum('output_tokens_used');
        $totalTokens = $dailyRecords->sum('total_tokens_used');
        $totalCost = $dailyRecords->sum('total_cost_millicents') / 100_000;
        $totalTransactions = $dailyRecords->sum('transaction_count');

        $daily = $dailyRecords->map(fn ($record) => [
            'date' => $record->date->format('M d'),
            'input_tokens' => $record->input_tokens_used,
            'output_tokens' => $record->output_tokens_used,
            'total_tokens' => $record->total_tokens_used,
            'input_cost' => round($record->input_cost_millicents / 100_000, 2),
            'output_cost' => round($record->output_cost_millicents / 100_000, 2),
            'total_cost' => round($record->total_cost_millicents / 100_000, 2),
            'transaction_count' => $record->transaction_count,
        ])->toArray();

        $monthly = $allRecords->groupBy(fn ($record) => $record->date->format('Y-m'))
            ->map(function ($records, $month) {
                return [
                    'month' => Carbon::parse($month.'-01')->format('M Y'),
                    'input_tokens' => $records->sum('input_tokens_used'),
                    'output_tokens' => $records->sum('output_tokens_used'),
                    'total_tokens' => $records->sum('total_tokens_used'),
                    'input_cost' => round($records->sum('input_cost_millicents') / 100_000, 2),
                    'output_cost' => round($records->sum('output_cost_millicents') / 100_000, 2),
                    'total_cost' => round($records->sum('total_cost_millicents') / 100_000, 2),
                    'transaction_count' => $records->sum('transaction_count'),
                ];
            })
            ->values()
            ->toArray();

        $byAgent = (clone $baseQuery)
            ->join('agent_configs', 'agent_configs.id', '=', 'token_transactions_daily.agent_config_id')
            ->select(
                'agent_configs.name as agent_name',
                DB::raw('SUM(input_tokens_used) as input_tokens'),
                DB::raw('SUM(output_tokens_used) as output_tokens'),
                DB::raw('SUM(total_tokens_used) as total_tokens'),
                DB::raw('ROUND(SUM(total_cost_millicents) / 100000.0, 2) as total_cost'),
                DB::raw('SUM(transaction_count) as transaction_count')
            )
            ->whereNotNull('token_transactions_daily.agent_config_id')
            ->groupBy('agent_configs.name')
            ->orderByDesc('total_tokens')
            ->get()
            ->toArray();

        return [
            'summary' => [
                'total_tokens' => $totalTokens,
                'total_cost' => round($totalCost, 2),
                'input_tokens' => $totalInputTokens,
                'output_tokens' => $totalOutputTokens,
                'transaction_count' => $totalTransactions,
            ],
            'daily' => $daily,
            'monthly' => $monthly,
            'byAgent' => $byAgent,
        ];
    }
}
