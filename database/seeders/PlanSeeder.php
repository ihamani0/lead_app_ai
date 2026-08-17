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
                'slug' => 'free',
                'name' => 'Free',
                'description' => 'For individuals and small teams',
                'price_millicents' => 0,
                'max_teams' => 1,
                'max_members' => 5,
                'max_leads' => null,
                'max_agents' => 1,
                'max_instances' => 1,
                'max_storage_mb' => 50,
                'dollar_limit' => 50,
                'is_default' => true,
                'features' => [
                    'media_library' => true,
                    'qualification_lead' => true,
                    'faq' => true,
                    'talk_from_lead' => true,
                    'reports' => true,
                    'knowledge_base' => true,
                    'lead_export' => true,
                    'agent_clone' => true,
                    'advanced_analytics' => true,
                    'custom_roles' => false,
                    'test_ia' => false,
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
                'max_storage_mb' => 1024,
                'dollar_limit' => 200,
                'features' => [
                    'media_library' => true,
                    'qualification_lead' => true,
                    'faq' => true,
                    'talk_from_lead' => true,
                    'reports' => true,
                    'knowledge_base' => true,
                    'lead_export' => true,
                    'agent_clone' => true,
                    'advanced_analytics' => true,
                    'custom_roles' => false,
                    'test_ia' => true,
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
                'max_storage_mb' => null,
                'dollar_limit' => 1000,
                'features' => [
                    'media_library' => true,
                    'qualification_lead' => true,
                    'faq' => true,
                    'talk_from_lead' => true,
                    'reports' => true,
                    'knowledge_base' => true,
                    'lead_export' => true,
                    'agent_clone' => true,
                    'advanced_analytics' => true,
                    'custom_roles' => true,
                    'test_ia' => true,
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
