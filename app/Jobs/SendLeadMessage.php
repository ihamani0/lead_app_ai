<?php

namespace App\Jobs;

use App\Events\LeadMessageUpdated;
use App\Models\Lead;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendLeadMessage implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Lead $lead,
        public string $content,
    ) {}

    public function handle(): void
    {
        $this->lead->loadMissing('instance');
        $instance = $this->lead->instance;

        Log::debug('SendLeadMessage', [
            'lead_id' => $this->lead->id,
            'phone' => $this->lead->phone,
            'has_instance' => (bool) $instance,
            'has_token' => (bool) $instance?->api_token,
        ]);

        if (! $instance || ! $instance->api_token) {
            Log::warning('SendLeadMessage aborted: no instance or token', [
                'lead_id' => $this->lead->id,
            ]);

            return;
        }

        $number = $this->lead->phone;
        $number = ltrim($number, '+');

        $response = EvolutionApi::setInstance($instance->api_token)
            ->send()
            ->text($number, $this->content);

        $remoteId = $response['data']['Info']['ID'] ?? null;

        $leadMessage = $this->lead->messages()->create([
            'remote_id' => $remoteId,
            'direction' => 'from_agent',
            'sender_type' => 'agent',
            'content' => $this->content,
            'type' => 'text',
            'status' => 'sent',
        ]);

        $this->lead->update(['last_activity_at' => now()]);

        broadcast(new LeadMessageUpdated($this->lead, $leadMessage));
    }
}
