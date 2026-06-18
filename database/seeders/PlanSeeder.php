<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'slug' => 'starter',
                'name' => 'Starter',
                'description' => 'For small teams getting started',
                'price_millicents' => 0,
                'max_teams' => 1,
                'max_members' => 5,
                'max_leads' => 500,
                'max_agents' => 2,
                'max_instances' => 1,
                'dollar_limit' => 50,
                'features' => [
                    'basic_analytics' => true,
                    'api_access' => false,
                    'custom_roles' => false,
                    'priority_support' => false,
                ],
            ],
            [
                'slug' => 'pro',
                'name' => 'Professional',
                'description' => 'For growing businesses',
                'price_millicents' => 29_99_000,
                'max_teams' => 5,
                'max_members' => 20,
                'max_leads' => null,
                'max_agents' => 10,
                'max_instances' => 5,
                'dollar_limit' => 200,
                'features' => [
                    'basic_analytics' => true,
                    'advanced_analytics' => true,
                    'api_access' => true,
                    'custom_roles' => true,
                    'priority_support' => false,
                ],
            ],
            [
                'slug' => 'enterprise',
                'name' => 'Enterprise',
                'description' => 'For large organizations with custom needs',
                'price_millicents' => 99_99_000,
                'max_teams' => null,
                'max_members' => null,
                'max_leads' => null,
                'max_agents' => null,
                'max_instances' => null,
                'dollar_limit' => 1000,
                'features' => [
                    'basic_analytics' => true,
                    'advanced_analytics' => true,
                    'api_access' => true,
                    'custom_roles' => true,
                    'priority_support' => true,
                    'sla_guarantee' => true,
                ],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan,
            );
        }
    }
}
