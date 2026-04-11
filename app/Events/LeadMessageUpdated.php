<?php

namespace App\Events;

use App\Models\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadMessageUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Lead $lead) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('lead.'.$this->lead->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'lead' => [
                'id' => $this->lead->id,
                'last_activity_at' => $this->lead->last_activity_at?->toISOString(),
                'recent_messages' => $this->lead->recent_messages,
            ],
        ];
    }
}
