<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LeadFlaggedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Lead $lead,
        public string $reason,
        public string $severity,
        public ?string $agentName = null,
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'lead_flagged',
            'lead_id' => $this->lead->id,
            'lead_name' => $this->lead->name,
            'lead_phone' => $this->lead->phone,
            'reason' => $this->reason,
            'severity' => $this->severity,
            'agent_name' => $this->agentName,
            'message' => "Lead {$this->lead->name} ({$this->lead->phone}) flagged: {$this->reason}",
        ];
    }
}
