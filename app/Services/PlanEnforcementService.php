<?php

namespace App\Services;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\KnowledgeBase;
use App\Models\Lead;
use App\Models\MediaAsset;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

class PlanEnforcementService
{
    public function canCreateTeam(Tenant $tenant): bool
    {
        $plan = $tenant->plan;

        if (! $plan || $plan->max_teams === null) {
            return true;
        }

        return $tenant->teams()->count() < $plan->max_teams;
    }

    public function canAddMember(Tenant $tenant): bool
    {
        $plan = $tenant->plan;

        if (! $plan || $plan->max_members === null) {
            return true;
        }

        return $tenant->users()->count() < $plan->max_members;
    }

    public function canCreateLead(Tenant $tenant): bool
    {
        $plan = $tenant->plan;

        if (! $plan || $plan->max_leads === null) {
            return true;
        }

        return Lead::where('tenant_id', $tenant->id)->count() < $plan->max_leads;
    }

    public function canCreateAgent(Tenant $tenant): bool
    {
        $plan = $tenant->plan;

        if (! $plan || $plan->max_agents === null) {
            return true;
        }

        return AgentConfig::where('tenant_id', $tenant->id)->count() < $plan->max_agents;
    }

    public function canCreateInstance(Tenant $tenant): bool
    {
        $plan = $tenant->plan;

        if (! $plan || $plan->max_instances === null) {
            return true;
        }

        return EvolutionInstance::where('tenant_id', $tenant->id)->count() < $plan->max_instances;
    }

    public function canUseCredit(Tenant $tenant, int $millicents): bool
    {
        $plan = $tenant->plan;

        if (! $plan || $plan->dollar_limit === null) {
            return true;
        }

        return $tenant->credit_millicents >= $millicents;
    }

    public function canUseFeature(Tenant $tenant, string $feature): bool
    {
        return $tenant->plan?->features[$feature] ?? false;
    }

    public static function getAvailableFeatures(): array
    {
        return [
            'media_library',
            'qualification_lead',
            'faq',
            'talk_from_lead',
            'reports',
            'knowledge_base',
            'lead_export',
            'agent_clone',
            'advanced_analytics',
            'custom_roles',
            'test_ia',
        ];
    }

    public function canStore(Tenant $tenant, int $bytes): bool
    {
        $plan = $tenant->plan;

        if (! $plan || $plan->max_storage_mb === null) {
            return true;
        }

        $usedBytes = DB::table('media')
            ->where(function ($q) use ($tenant) {
                $q->where('model_type', MediaAsset::class)
                    ->whereIn('model_id', MediaAsset::where('tenant_id', $tenant->id)->select('id'));
            })
            ->orWhere(function ($q) use ($tenant) {
                $q->where('model_type', KnowledgeBase::class)
                    ->whereIn('model_id', KnowledgeBase::where('tenant_id', $tenant->id)->select('id'));
            })
            ->sum('size');

        $limitBytes = $plan->max_storage_mb * 1024 * 1024;

        return ($usedBytes + $bytes) <= $limitBytes;
    }

    public function getLimitsForTenant(Tenant $tenant): array
    {
        $plan = $tenant->plan;

        return [
            'teams' => $plan?->max_teams ?? null,
            'members' => $plan?->max_members ?? null,
            'leads' => $plan?->max_leads ?? null,
            'agents' => $plan?->max_agents ?? null,
            'instances' => $plan?->max_instances ?? null,
            'max_storage_mb' => $plan?->max_storage_mb ?? null,
            'features' => $plan?->features ?? [],
        ];
    }
}
