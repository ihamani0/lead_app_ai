<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TokenTransactionDaily extends Model
{
    protected $table = 'token_transactions_daily';

    protected $fillable = [
        'tenant_id',
        'instance_id',
        'agent_config_id',
        'llm_model_id',
        'team_id',
        'date',
        'input_tokens_used',
        'output_tokens_used',
        'total_tokens_used',
        'input_cost_millicents',
        'output_cost_millicents',
        'total_cost_millicents',
        'millicents_recharged',
        'transaction_count',
    ];

    protected $casts = [
        'date' => 'date',
        'input_tokens_used' => 'integer',
        'output_tokens_used' => 'integer',
        'total_tokens_used' => 'integer',
        'input_cost_millicents' => 'integer',
        'output_cost_millicents' => 'integer',
        'total_cost_millicents' => 'integer',
        'millicents_recharged' => 'integer',
        'transaction_count' => 'integer',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function instance(): BelongsTo
    {
        return $this->belongsTo(EvolutionInstance::class, 'instance_id');
    }

    public function agentConfig(): BelongsTo
    {
        return $this->belongsTo(AgentConfig::class);
    }

    public function llmModel(): BelongsTo
    {
        return $this->belongsTo(LlmModel::class, 'llm_model_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
