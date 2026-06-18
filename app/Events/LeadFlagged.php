<?php

namespace App\Events;

use App\Models\Lead;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadFlagged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Lead $lead,
        public string $reason,
        public string $severity,
        public ?string $agentName = null,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('notifications.team.'.$this->lead->team_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'lead_id' => $this->lead->id,
            'lead_name' => $this->lead->name,
            'lead_phone' => $this->lead->phone,
            'reason' => $this->reason,
            'severity' => $this->severity,
            'agent_name' => $this->agentName,
            'team_id' => $this->lead->team_id,
            'flagged_at' => $this->lead->flagged_at?->toIsoString(),
        ];
    }
}
