<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TestAgentTyping implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $agentId,
        public string $stage,
        public bool $isTyping,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('test-conversation.'.$this->agentId),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'agent_id' => $this->agentId,
            'stage' => $this->stage,
            'is_typing' => $this->isTyping,
        ];
    }
}
