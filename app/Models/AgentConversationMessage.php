<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentConversationMessage extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'agent_conversation_messages';

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function conversation()
    {
        return $this->belongsTo(AgentConversation::class, 'conversation_id');
    }
}
