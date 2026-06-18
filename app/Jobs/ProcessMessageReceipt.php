<?php

namespace App\Jobs;

use App\Models\LeadMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessMessageReceipt implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public array $payload,
    ) {}

    public function handle(): void
    {
        $data = $this->payload['data'] ?? [];
        $state = $this->payload['state'] ?? null;

        $status = match ($state) {
            'Read' => 'read',
            'Delivered' => 'delivered',
            default => null,
        };

        if (! $status) {
            return;
        }

        $messageIds = $data['MessageIDs'] ?? [];
        if (empty($messageIds)) {
            Log::warning('ProcessMessageReceipt: no MessageIDs', [
                'state' => $state,
                'data' => $data,
            ]);

            return;
        }

        Log::debug('ProcessMessageReceipt', [
            'message_ids' => $messageIds,
            'status' => $status,
        ]);

        $updated = LeadMessage::whereIn('remote_id', $messageIds)
            ->where('status', '!=', $status)
            ->update(['status' => $status]);

        Log::debug('ProcessMessageReceipt: updated', ['count' => $updated]);
    }
}
