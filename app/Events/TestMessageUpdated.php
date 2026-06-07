<?php

namespace App\Events;

use App\Models\TestConversation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestMessageUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public TestConversation $conversation,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('test-conversation.'.$this->conversation->agent_config_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'conversation' => [
                'messages' => $this->conversation->messages,
            ],
        ];
    }
}
