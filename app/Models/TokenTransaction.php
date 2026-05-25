<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TokenTransaction extends Model
{
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'instance_id',
        'llm_model_id',
        'date',
        'input_tokens',
        'output_tokens',
        'total_tokens',
        'input_cost_millicents',
        'output_cost_millicents',
        'total_cost_millicents',
        'type',
        'reference_type',
        'reference_id',
    ];

    protected $casts = [
        'date' => 'date',
        'input_tokens' => 'integer',
        'output_tokens' => 'integer',
        'total_tokens' => 'integer',
        'input_cost_millicents' => 'integer',
        'output_cost_millicents' => 'integer',
        'total_cost_millicents' => 'integer',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function instance(): BelongsTo
    {
        return $this->belongsTo(EvolutionInstance::class, 'instance_id');
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
