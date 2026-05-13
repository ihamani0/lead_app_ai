<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class LlmModel extends Model
{
    use HasUlids;

    protected $table = 'llm_models';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'display_name',
        'provider',
        'input_rate_per_million_millicents',
        'output_rate_per_million_millicents',
        'cost_input_per_million_millicents',
        'cost_output_per_million_millicents',
        'is_active',
    ];

    protected $casts = [
        'input_rate_per_million_millicents' => 'integer',
        'output_rate_per_million_millicents' => 'integer',
        'cost_input_per_million_millicents' => 'integer',
        'cost_output_per_million_millicents' => 'integer',
        'is_active' => 'boolean',
    ];

    public function tenants()
    {
        return $this->hasMany(Tenant::class);
    }

    public function getInputRateDollarsAttribute(): float
    {
        return $this->input_rate_per_million_millicents / 1000;
    }

    public function getOutputRateDollarsAttribute(): float
    {
        return $this->output_rate_per_million_millicents / 1000;
    }

    public function getCostInputDollarsAttribute(): float
    {
        return $this->cost_input_per_million_millicents / 1000;
    }

    public function getCostOutputDollarsAttribute(): float
    {
        return $this->cost_output_per_million_millicents / 1000;
    }

    public function calculateCost(int $inputTokens, int $outputTokens): int
    {
        $inputCost = (int) round($inputTokens * $this->cost_input_per_million_millicents / 1_000_000);
        $outputCost = (int) round($outputTokens * $this->cost_output_per_million_millicents / 1_000_000);

        return $inputCost + $outputCost;
    }

    public function calculateCharge(int $inputTokens, int $outputTokens): int
    {
        $inputCharge = (int) round($inputTokens * $this->input_rate_per_million_millicents / 1_000_000);
        $outputCharge = (int) round($outputTokens * $this->output_rate_per_million_millicents / 1_000_000);

        return $inputCharge + $outputCharge;
    }
}
