<?php

namespace App\Models;

use Database\Factories\FaqFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    /** @use HasFactory<FaqFactory> */
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_suggestion' => 'boolean',
            'usage_count' => 'integer',
            'suggestion_data' => 'array',
        ];
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function agentConfig()
    {
        return $this->belongsTo(AgentConfig::class, 'agent_config_id');
    }
}
