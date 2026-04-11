<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class AgentSystemPromptHistory extends Model
{
    use HasUlids;

    protected $table = 'agent_system_prompt_history';
    protected $guarded = [];

    protected $casts = [
        'version' => 'integer',
    ];

    public const MAX_VERSIONS = 5;

    public function agentConfig()
    {
        return $this->belongsTo(AgentConfig::class, 'agent_config_id');
    }

    public static function record(AgentConfig $agent, ?string $description = null): self
    {
        $currentVersion = $agent->history()
            ->max('version') ?? 0;

        $history = $agent->history()->create([
            'system_prompt' => $agent->system_prompt,
            'version' => $currentVersion + 1,
            'description' => $description,
        ]);

        $agent->history()
            ->where('version', '<', $currentVersion + 1 - self::MAX_VERSIONS)
            ->delete();

        return $history;
    }
}
