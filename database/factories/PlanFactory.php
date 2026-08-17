<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(),
            'name' => fake()->word(),
            'description' => fake()->sentence(),
            'price_millicents' => 0,
            'max_teams' => 5,
            'max_members' => 10,
            'max_leads' => 100,
            'max_agents' => 3,
            'max_instances' => 3,
            'max_storage_mb' => 100,
            'dollar_limit' => 1000,
            'features' => ['media_library' => true, 'qualification_lead' => true, 'faq' => true, 'talk_from_lead' => true, 'reports' => true, 'knowledge_base' => true, 'lead_export' => true, 'agent_clone' => true, 'advanced_analytics' => true, 'custom_roles' => true, 'test_ia' => true],
            'is_active' => true,
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }

    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'free',
            'name' => 'Free',
            'price_millicents' => 0,
            'max_teams' => 1,
            'max_members' => 3,
            'max_leads' => null,
            'max_agents' => 1,
            'max_instances' => 1,
            'max_storage_mb' => 50,
            'dollar_limit' => 100,
            'features' => ['media_library' => false, 'qualification_lead' => false, 'test_ia' => false],
        ]);
    }

    public function basic(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'basic',
            'name' => 'Basic',
            'price_millicents' => 99900,
            'max_teams' => 3,
            'max_members' => 10,
            'max_leads' => null,
            'max_agents' => 3,
            'max_instances' => 3,
            'max_storage_mb' => 500,
            'dollar_limit' => 500,
            'features' => ['media_library' => false, 'qualification_lead' => false],
        ]);
    }

    public function pro(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'pro',
            'name' => 'Professional',
            'price_millicents' => 299900,
            'max_teams' => 10,
            'max_members' => 50,
            'max_leads' => null,
            'max_agents' => 10,
            'max_instances' => 10,
            'max_storage_mb' => 1024,
            'dollar_limit' => 2000,
            'features' => ['media_library' => true, 'qualification_lead' => true, 'advanced_analytics' => true, 'custom_roles' => true, 'test_ia' => true],
        ]);
    }
}
