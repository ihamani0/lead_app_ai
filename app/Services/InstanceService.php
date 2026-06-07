<?php

namespace App\Services;

use App\Events\InstanceConnectionUpdated;
use App\Models\EvolutionInstance;
use App\Models\Tenant;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class InstanceService
{
    public function __construct(
        private EvolutionService $evolutionService,
    ) {}

    public function create(array $data, Tenant $tenant, ?int $teamId = null): EvolutionInstance
    {
        $instanceName = $this->generateInstanceName($tenant, $data['display_name'] ?? $data['instance_name']);
        $token = Str::random(32);

        $response = $this->evolutionService->createInstance($instanceName, $token);

        if (isset($response['error'])) {
            throw new Exception(
                data_get($response, 'response.message.0', 'Evolution API error')
            );
        }

        $instanceToken = $response['data']['token'] ?? $token;
        $uuid = $response['data']['id'] ?? null;

        $instance = EvolutionInstance::create(array_merge($data, [
            'tenant_id' => $tenant->id,
            'team_id' => $teamId,
            'instance_name' => $instanceName,
            'status' => 'disconnected',
            'api_token' => $instanceToken,
            'uuid' => $uuid,
            'settings' => [],
        ]));

        $this->evolutionService->connectInstance($instance);

        return $instance;
    }

    public function fetchQr(EvolutionInstance $instance): void
    {
        $instance->update([
            'status' => 'connecting',
        ]);

        $this->evolutionService->fetchQrCode($instance);
    }

    public function restart(EvolutionInstance $instance): void
    {
        $this->evolutionService->restartInstance($instance);

        $instance->update(['status' => 'connecting']);
        broadcast(new InstanceConnectionUpdated($instance));
    }

    public function disconnect(EvolutionInstance $instance): void
    {
        if ($instance->status === 'disconnected') {
            return;
        }

        DB::transaction(function () use ($instance) {
            try {
                $this->evolutionService->logoutInstance($instance);
            } catch (Exception $e) {
                Log::warning("Evolution API logout failed for {$instance->instance_name}: ".$e->getMessage());
            }

            $settings = $instance->settings ?? [];
            $settings['previous_phones'] = array_merge(
                $settings['previous_phones'] ?? [],
                [$instance->phone_number => now()->toIso8601String()]
            );

            $instance->update([
                'status' => 'disconnected',
                'phone_number' => null,
                'connected_at' => null,
                'qr_code' => null,
                'settings' => $settings,
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
        });
    }

    public function softDelete(EvolutionInstance $instance): void
    {
        DB::transaction(function () use ($instance) {
            try {
                if ($instance->status !== 'disconnected') {
                    $this->evolutionService->logoutInstance($instance);
                }
                $this->evolutionService->deleteInstance($instance);
            } catch (Exception $e) {
                Log::warning('Evolution delete failed: '.$e->getMessage());
            }

            $settings = $instance->settings ?? [];
            $settings['needs_recreation'] = true;
            $settings['previous_instance_name'] = $instance->instance_name;
            $settings['reserved_instance_name'] = $this->generateInstanceName(
                tenant: $instance->tenant,
                displayName: $instance->display_name,
                suffix: 'restored'
            );

            $instance->update([
                'settings' => $settings,
                'status' => 'disconnected',
            ]);

            $instance->delete();
        });
    }

    public function forceDelete(EvolutionInstance $instance): void
    {
        $this->evolutionService->deleteInstance($instance);
        $instance->forceDelete();
    }

    public function restore(EvolutionInstance $instance): void
    {
        DB::transaction(function () use ($instance) {
            $settings = $instance->settings ?? [];

            if ($settings['needs_recreation'] ?? false) {
                $newInstanceName = $settings['reserved_instance_name']
                    ?? $this->generateInstanceName(
                        tenant: $instance->tenant,
                        displayName: $instance->display_name,
                        suffix: 'restored'
                    );

                $newToken = Str::random(32);

                $response = $this->evolutionService->createInstance($newInstanceName, $newToken);

                if (isset($response['error'])) {
                    throw new Exception(__('messages.error.instance_recreate', [
                        'message' => data_get($response, 'response.message.0', 'Unknown error'),
                    ]));
                }

                $instance->instance_name = $newInstanceName;
                $instance->api_token = $response['token'] ?? $newToken;
                $instance->uuid = $response['instanceId'] ?? $response['id'] ?? null;
                $settings['recreated_at'] = now()->toIso8601String();
                $settings['original_instance_name'] = $settings['previous_instance_name'] ?? null;
                unset($settings['needs_recreation'], $settings['reserved_instance_name']);
            }

            $instance->restore();
            $instance->update([
                'status' => 'disconnected',
                'api_token' => $instance->api_token,
                'uuid' => $instance->uuid,
                'settings' => $settings,
            ]);
        });
    }

    private function generateInstanceName(Tenant $tenant, ?string $displayName = null, ?string $suffix = null): string
    {
        $tenantSlug = $tenant->slug ?? 'tenant';
        $baseName = Str::slug($displayName ?? 'instance');
        $uniquePart = Str::random(6);

        if ($suffix) {
            return "{$tenantSlug}-{$baseName}-{$uniquePart}-{$suffix}";
        }

        return "{$tenantSlug}-{$baseName}-{$uniquePart}";
    }
}
