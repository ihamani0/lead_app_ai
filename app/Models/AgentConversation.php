<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentConversation extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'agent_conversations';

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function messages()
    {
        return $this->hasMany(AgentConversationMessage::class, 'conversation_id');
    }
}
