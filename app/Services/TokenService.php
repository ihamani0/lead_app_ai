<?php

namespace App\Services;

use App\Models\AgentConfig;
use App\Models\LlmModel;
use App\Models\Tenant;
use App\Models\TokenTransaction;
use Illuminate\Support\Facades\DB;

class TokenService
{
    public static function dollarsToMillicents(float $dollars): int
    {
        return (int) round($dollars * 100 * 1000);
    }

    public static function millicentsToDisplayCents(int $millicents): float
    {
        return $millicents / 1000;
    }

    public static function millicentsToDisplayDollars(int $millicents): float
    {
        return $millicents / 100_000;
    }

    private function calculateCost(int $tokens, int $ratePerMillionMillicents): int
    {
        return (int) round($tokens * $ratePerMillionMillicents / 1_000_000);
    }

    public function deductUsage(
        string $agentConfigId,
        int $inputTokens,
        int $outputTokens,
        array $metadata = [],
    ): void {
        $agentConfig = AgentConfig::with(['tenant.llmModel', 'instance'])->findOrFail($agentConfigId);
        $tenant = $agentConfig->tenant;

        $model = $tenant->llmModel ?? LlmModel::where('is_active', true)->first();

        if (! $model) {
            throw new \Exception('No active LLM model found');
        }

        $inputCost = $this->calculateCost($inputTokens, $model->input_rate_per_million_millicents);
        $outputCost = $this->calculateCost($outputTokens, $model->output_rate_per_million_millicents);
        $totalCost = max(1, $inputCost + $outputCost);

        $tenantId = $tenant->id;
        $instanceId = $agentConfig->evolution_instance_id;
        $teamId = $agentConfig->team_id;

        DB::transaction(function () use ($tenantId, $agentConfigId, $instanceId, $teamId, $inputTokens, $outputTokens, $metadata, $model, $inputCost, $outputCost, $totalCost) {
            $tenant = Tenant::lockForUpdate()->find($tenantId);

            if ($tenant->credit_millicents < $totalCost) {
                throw new \Exception('Insufficient credit');
            }

            $tenant->decrement('credit_millicents', $totalCost);

            TokenTransaction::create([
                'tenant_id' => $tenantId,
                'agent_config_id' => $agentConfigId,
                'instance_id' => $instanceId,
                'llm_model_id' => $model->id,
                'date' => now()->toDateString(),
                'input_tokens' => $inputTokens,
                'output_tokens' => $outputTokens,
                'total_tokens' => $inputTokens + $outputTokens,
                'input_cost_millicents' => $inputCost,
                'output_cost_millicents' => $outputCost,
                'total_cost_millicents' => $totalCost,
                'type' => 'deduction',
                'reference_type' => $metadata['reference_type'] ?? 'n8n_workflow',
                'reference_id' => $metadata['reference_id'] ?? null,
            ]);

            DB::table('token_transactions_daily')->upsert(
                [
                    'tenant_id' => $tenantId,
                    'agent_config_id' => $agentConfigId,
                    'date' => now()->toDateString(),
                    'instance_id' => $instanceId,
                    'team_id' => $teamId,
                    'llm_model_id' => $model->id,
                    'input_tokens_used' => $inputTokens,
                    'output_tokens_used' => $outputTokens,
                    'total_tokens_used' => $inputTokens + $outputTokens,
                    'input_cost_millicents' => $inputCost,
                    'output_cost_millicents' => $outputCost,
                    'total_cost_millicents' => $totalCost,
                    'transaction_count' => 1,
                ],
                ['tenant_id', 'agent_config_id', 'date'],
                [
                    'instance_id' => $instanceId,
                    'team_id' => $teamId,
                    'llm_model_id' => $model->id,
                    'input_tokens_used' => DB::raw('input_tokens_used + '.$inputTokens),
                    'output_tokens_used' => DB::raw('output_tokens_used + '.$outputTokens),
                    'total_tokens_used' => DB::raw('total_tokens_used + '.($inputTokens + $outputTokens)),
                    'input_cost_millicents' => DB::raw('input_cost_millicents + '.$inputCost),
                    'output_cost_millicents' => DB::raw('output_cost_millicents + '.$outputCost),
                    'total_cost_millicents' => DB::raw('total_cost_millicents + '.$totalCost),
                    'transaction_count' => DB::raw('transaction_count + 1'),
                ]
            );
        });
    }

    public function addDollars(Tenant $tenant, float $dollars, string $description, ?int $teamId = null): void
    {
        $millicents = self::dollarsToMillicents($dollars);

        DB::transaction(function () use ($tenant, $description, $millicents) {
            $tenant->increment('credit_millicents', $millicents);

            TokenTransaction::create([
                'tenant_id' => $tenant->id,
                'date' => now()->toDateString(),
                'input_tokens' => 0,
                'output_tokens' => 0,
                'total_tokens' => 0,
                'input_cost_millicents' => 0,
                'output_cost_millicents' => 0,
                'total_cost_millicents' => $millicents,
                'type' => 'recharge',
                'reference_type' => 'admin_recharge',
                'reference_id' => $description,
            ]);

            $exists = DB::table('token_transactions_daily')
                ->where('tenant_id', $tenant->id)
                ->where('date', now()->toDateString())
                ->exists();

            if ($exists) {
                DB::table('token_transactions_daily')
                    ->where('tenant_id', $tenant->id)
                    ->where('date', now()->toDateString())
                    ->update([
                        'millicents_recharged' => DB::raw('millicents_recharged + '.$millicents),
                        'transaction_count' => DB::raw('transaction_count + 1'),
                    ]);
            } else {
                DB::table('token_transactions_daily')->insert([
                    'tenant_id' => $tenant->id,
                    'date' => now()->toDateString(),
                    'millicents_recharged' => $millicents,
                    'transaction_count' => 1,
                ]);
            }
        });
    }
}
