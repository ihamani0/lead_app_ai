<?php

namespace App\Events;

use App\Models\Lead;
use App\Models\LeadMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadMessageUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Lead $lead,
        public LeadMessage $message,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('lead.'.$this->lead->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->message->toArray(),
            'lead_id' => $this->lead->id,
            'lead' => [
                'id' => $this->lead->id,
                'last_activity_at' => $this->lead->last_activity_at?->toISOString(),
            ],
        ];
    }
}
