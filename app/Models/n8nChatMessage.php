<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class n8nChatMessage extends Model
{
    use Prunable;
    //
    protected $table = "n8n_chat_messages";
    protected $fillable = [
        'session_id',
        'message',
    ];

    protected $casts = [
        'message' => 'array',
    ];

    public function getMessagesBySession($sessionId)
    {
        return $this->where('session_id', $sessionId)->get();
    }

    public function prunable()
    {
        return static::where('created_at', '<=', now()->subDays(30));
    }
}
