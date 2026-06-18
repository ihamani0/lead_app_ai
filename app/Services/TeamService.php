<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Team;
use App\Models\Tenant;
use App\Models\User;

class TeamService
{
    public function createTeam(Tenant $tenant, User $user, array $data): Team
    {
        return $tenant->teams()->create([
            'user_id' => $user->id,
            'name' => $data['name'],
        ]);
    }

    public function canCreateTeam(Tenant $tenant): bool
    {
        $plan = Plan::where('slug', $tenant->plan)->first();

        if (! $plan || $plan->max_teams === null) {
            return true;
        }

        return $tenant->teams()->count() < $plan->max_teams;
    }

    public function createDefaultWorkspace(User $user, Tenant $tenant): Team
    {
        $team = Team::create([
            'user_id' => $user->id,
            'name' => "{$user->name}'s Workspace",
        ]);

        $this->createDefaultRoles($team);

        return $team;
    }

    public function getPlanLimits(string $planSlug): array
    {
        $plan = Plan::where('slug', $planSlug)->first();

        if (! $plan) {
            return [
                'teams' => 1,
                'members' => 5,
            ];
        }

        return [
            'teams' => $plan->max_teams ?? PHP_INT_MAX,
            'members' => $plan->max_members ?? PHP_INT_MAX,
        ];
    }

    public function createDefaultRoles(Team $team): void
    {
        if ($team->roles()->exists()) {
            return;
        }

        $team->addRole(
            code: 'owner',
            permissions: ['*'],
            name: 'Owner',
            description: 'Full access to all features and settings',
        );

        $team->addRole(
            code: 'admin',
            permissions: [
                'leads.*',
                'instances.*',
                'agents.*',
                'media.*',
                'reports.*',
                'knowledge.*',
                'team.*',
            ],
            name: 'Admin',
            description: 'Full access to all features and team management',
        );

        $team->addRole(
            code: 'member',
            permissions: [
                'leads.view',
                'instances.*',
                'agents.*',
                'media.view',
                'reports.view',
                'knowledge.view',
            ],
            name: 'Member',
            description: 'Can manage instances and agents',
        );

        $team->addRole(
            code: 'viewer',
            permissions: [
                'leads.view',
                'instances.view',
                'agents.view',
                'media.view',
                'reports.view',
                'knowledge.view',
            ],
            name: 'Viewer',
            description: 'Read-only access',
        );
    }
}
