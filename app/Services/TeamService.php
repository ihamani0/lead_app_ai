<?php

namespace App\Services;

use App\Models\Team;
use App\Models\Tenant;
use App\Models\User;

class TeamService
{
    // Create team with default roles
    public function createTeam(Tenant $tenant, User $user, array $data): Team
    {
        return $tenant->teams()->create([
            'user_id' => $user->id,
            'name' => $data['name'],
        ]);
    }

    // Check if tenant can create more teams (plan limits)
    public function canCreateTeam(Tenant $tenant): bool
    {
        $limits = $this->getPlanLimits($tenant->plan);

        return $tenant->teams()->count() < $limits['teams'];
    }

    // Get plan limits
    public function getPlanLimits(string $plan): array
    {
        return [
            'teams' => 1,
            'members' => 5,
        ];
    }
}
