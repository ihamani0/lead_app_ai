<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DocumentStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $documentId,
        public string $status,
        public string $documentName,
        public string $tenantId,
        public string $agentConfigId,
        public ?string $teamId = null,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('knowledge-base.'.$this->tenantId),
            new PrivateChannel('knowledge-base.agent.'.$this->agentConfigId),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'documentId' => $this->documentId,
            'status' => $this->status,
            'documentName' => $this->documentName,
        ];
    }
}
