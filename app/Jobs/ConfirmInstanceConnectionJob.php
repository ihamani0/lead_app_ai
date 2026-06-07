<?php

namespace App\Jobs;

use App\Events\InstanceConnectionUpdated;
use App\Models\EvolutionInstance;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ConfirmInstanceConnectionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public string $instanceName) {}

    public function handle(): void
    {
        if (! cache()->has("evo_reconnecting_{$this->instanceName}")) {
            Log::info("ConfirmInstanceConnectionJob: {$this->instanceName} already resolved via event.");

            return;
        }

        $instance = EvolutionInstance::where('instance_name', $this->instanceName)->first();
        if (! $instance || ! $instance->api_token) {
            Log::warning("ConfirmInstanceConnectionJob: instance {$this->instanceName} not found or no token.");

            return;
        }

        $response = EvolutionApi::setInstance($instance->api_token)
            ->instance()
            ->status();

        $liveState = $response['status'] ?? null;
        Log::info("ConfirmInstanceConnectionJob: {$this->instanceName} live state = {$liveState}");

        $newStatus = match ($liveState) {
            'open' => 'connected',
            'close' => 'disconnected',
            default => null,
        };

        if ($newStatus && $instance->status !== $newStatus) {
            $settings = $instance->settings ?? [];
            $settings['was_connected'] = $newStatus === 'connected';

            $instance->update([
                'status' => $newStatus,
                'settings' => $settings,
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("ConfirmInstanceConnectionJob: forced {$this->instanceName} to {$newStatus}");
        }

        cache()->forget("evo_reconnecting_{$this->instanceName}");
    }
}
