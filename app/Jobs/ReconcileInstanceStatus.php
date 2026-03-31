<?php

namespace App\Jobs;

use App\Events\InstanceConnectionUpdated;
use App\Models\EvolutionInstance;
use App\Services\EvolutionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ReconcileInstanceStatus implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 10;

    public int $backoff = 5;

    public function __construct(public int $instanceId) {}

    public function uniqueId(): string
    {
        return 'reconcile_instance_'.$this->instanceId;
    }

    public int $uniqueFor = 120;

    public function handle(EvolutionService $evolutionService): void
    {
        $instance = EvolutionInstance::findOrFail($this->instanceId);

        if ($instance->status === 'connected') {
            return;
        }

        $response = $evolutionService->getInstanceStatus($instance->instance_name);
        $state = $response['instance']['state'] ?? 'close';

        if ($state === 'open') {
            $instance->update([
                'status' => 'connected',
                'connected_at' => now(),
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Reconciled: {$instance->instance_name} → connected");
        } elseif ($state === 'close') {
            $instance->update(['status' => 'disconnected']);
            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Reconciled: {$instance->instance_name} → disconnected");
        } else {
            $this->release($this->backoff);
        }
    }

    public function failed(\Throwable $e): void
    {
        $instance = EvolutionInstance::find($this->instanceId);

        if ($instance) {
            $instance->update(['status' => 'disconnected']);
            broadcast(new InstanceConnectionUpdated($instance));

            try {
                app(EvolutionService::class)->disconnectInstance($instance->instance_name);
                Log::info("Force disconnect sent for: {$instance->instance_name}");
            } catch (\Throwable $th) {
                Log::warning("Failed to force disconnect: {$instance->instance_name}", [
                    'error' => $th->getMessage(),
                ]);
            }
        }
    }
}
