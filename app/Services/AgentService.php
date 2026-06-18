<?php

namespace App\Services;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\Tenant;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AgentService
{
    public function __construct(
        private EvolutionService $evolutionService,
    ) {}

    public function findForWorkspace(array $scope, mixed $agentId): AgentConfig
    {
        return AgentConfig::where($scope)->findOrFail($agentId);
    }

    public function create(array $data): AgentConfig
    {
        return AgentConfig::create($data);
    }

    public function update(AgentConfig $agent, array $data): void
    {
        $agent->update($data);
    }

    public function clone(AgentConfig $agent, ?string $name = null): AgentConfig
    {
        $cloned = $agent->replicate();
        $cloned->name = $name ?? $agent->name.' (Copy)';
        $cloned->evolution_instance_id = null;
        $cloned->is_active = false;
        $cloned->webhook_url = null;
        $cloned->evo_integration_id = null;
        $cloned->save();

        return $cloned;
    }

    public function toggle(AgentConfig $agent): void
    {
        $newStatus = ! $agent->is_active;

        if ($agent->isLinked() && $agent->instance) {
            $this->evolutionService->toggleN8nBot($agent->instance, $agent, $newStatus);
        }

        $agent->update(['is_active' => $newStatus]);
    }

    public function updateSettings(AgentConfig $agent, array $settings): void
    {
        DB::transaction(function () use ($agent, $settings) {
            $currentSettings = $agent->settings ?? [];
            $oldBlocklist = $currentSettings['blocklist'] ?? [];
            $mergedSettings = array_merge($currentSettings, $settings);

            if (isset($settings['blocklist'])) {
                $mergedSettings['blocklist'] = array_values(array_unique($settings['blocklist']));
            }

            $agent->settings = $mergedSettings;
            $agent->save();

            if ($agent->isLinked() && $agent->is_active) {
                $this->evolutionService->updateN8nSettings($agent->instance, $agent, $oldBlocklist);
            }
        });
    }

    public function linkInstance(AgentConfig $agent, EvolutionInstance $instance): void
    {
        DB::transaction(function () use ($agent, $instance) {
            if ($agent->isLinked() && $agent->instance) {
                try {
                    $this->evolutionService->deleteN8nBot($agent->instance, $agent);
                } catch (Exception $e) {
                    Log::warning('Failed to delete old n8n bot during relink', [
                        'agent_id' => $agent->id,
                        'instance_id' => $agent->evolution_instance_id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            $agent->update([
                'evolution_instance_id' => $instance->id,
                'webhook_url' => config('services.whatsapp.webhook_url'),
                'is_active' => true,
            ]);

            try {
                $evoResponse = $this->evolutionService->connectN8nBot($instance, $agent);
                $agent->update(['evo_integration_id' => $evoResponse['bot']['id'] ?? null]);
            } catch (Exception $e) {
                if (str_contains($e->getMessage(), 'bot already exists')) {
                    if ($agent->evo_integration_id) {
                        $this->evolutionService->deleteN8nBot($instance, $agent);
                        $agent->update(['evo_integration_id' => null]);
                    } else {
                        throw new Exception(
                            "Bot already exists for instance {$instance->instance_name} but no evo_integration_id available to delete it."
                        );
                    }

                    $evoResponse = $this->evolutionService->connectN8nBot($instance, $agent);
                    $agent->update(['evo_integration_id' => $evoResponse['bot']['id'] ?? null]);
                } else {
                    throw $e;
                }
            }
        });
    }

    public function unlinkInstance(AgentConfig $agent): void
    {
        if (! $agent->isLinked()) {
            return;
        }

        DB::transaction(function () use ($agent) {
            if ($agent->instance && $agent->evo_integration_id) {
                try {
                    $this->evolutionService->deleteN8nBot($agent->instance, $agent);
                } catch (Exception $e) {
                    Log::error('Failed to delete n8n bot during unlink', [
                        'agent_id' => $agent->id,
                        'instance_id' => $agent->evolution_instance_id,
                        'evo_integration_id' => $agent->evo_integration_id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            $agent->update([
                'evolution_instance_id' => null,
                'is_active' => false,
                'evo_integration_id' => null,
                'webhook_url' => null,
            ]);
        });
    }

    public function getStats(AgentConfig $agent): array
    {
        if (! $agent->evolution_instance_id) {
            return [
                'total_conversations' => 0,
                'qualified_leads' => 0,
                'satisfaction_rate' => null,
                'last_activity' => null,
                'messages_today' => 0,
            ];
        }

        $leadQuery = Lead::where('instance_id', $agent->evolution_instance_id);
        $total = (clone $leadQuery)->count();
        $qualified = (clone $leadQuery)->qualified()->count();
        $today = (clone $leadQuery)->whereDate('created_at', today())->count();

        return [
            'total_conversations' => $total,
            'qualified_leads' => $qualified,
            'satisfaction_rate' => $total > 0 ? round(($qualified / $total) * 100) : 0,
            'last_activity' => (clone $leadQuery)->max('last_activity_at'),
            'messages_today' => $today,
        ];
    }

    public function hasIdentitySettings(array $settings): bool
    {
        $identityFields = [
            'sector', 'tone', 'languages', 'main_objective',
            'response_style', 'greeting_message', 'call_to_action',
            'max_response_length', 'knowledge_mode',
            'google_maps_url', 'calendar_url', 'additional_info', 'custom_prompt',
        ];

        return ! empty(array_intersect_key($settings, array_flip($identityFields)));
    }

    public function generateInstanceName(Tenant $tenant, ?string $displayName = null): string
    {
        $tenantSlug = $tenant->slug ?? 'tenant';
        $baseName = Str::slug($displayName ?? 'instance');
        $uniquePart = Str::random(6);

        return "{$tenantSlug}-{$baseName}-{$uniquePart}";
    }
}
