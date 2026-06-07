<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class TestConversation extends Model
{
    use HasUlids;

    protected $guarded = [];

    protected $casts = [
        'messages' => 'array',
    ];

    public function agent()
    {
        return $this->belongsTo(AgentConfig::class, 'agent_config_id');
    }
}
