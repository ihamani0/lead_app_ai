<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class AgentConfig extends Model
{
    use HasUlids;

    protected $guarded = [];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function instance()
    {
        return $this->belongsTo(EvolutionInstance::class, 'evolution_instance_id');
    }

    public function knowledgeBases()
    {
        return $this->hasMany(KnowledgeBase::class, 'agent_config_id');
    }

    public function history()
    {
        return $this->hasMany(AgentSystemPromptHistory::class, 'agent_config_id')->orderBy('version', 'desc');
    }

    public function isLinked(): bool
    {
        return $this->evolution_instance_id !== null;
    }

    public function isActiveWithInstance(): bool
    {
        return $this->is_active && $this->isLinked();
    }

    public function setSystemPromptAttribute(?string $value): void
    {
        $this->attributes['system_prompt'] = $value;
        $this->attributes['system_prompt_hash'] = $value ? md5($value) : null;
    }

    public function hasSystemPromptChanged(?string $newPrompt): bool
    {
        return md5($newPrompt ?? '') !== ($this->system_prompt_hash ?? '');
    }
}
