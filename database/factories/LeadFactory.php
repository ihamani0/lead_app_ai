<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'team_id' => 2,
            'instance_id' => 2,
            'name' => $this->faker->name(),
            'phone' => '2126'.$this->faker->numerify('########'),
            'email' => $this->faker->optional(0.7)->email(),
            'status' => $this->faker->randomElement(['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED']),
            'contact_status' => $this->faker->randomElement(['REPONDU', 'ATTENTE_REPONSE']),
            'temperature' => $this->faker->randomElement(['COLD', 'WARM', 'HOT']),
            'ai_qualification_status' => $this->faker->optional(0.5)->randomElement(['NON_QUALIFIE', 'QUALIFIE']),
            'qualification_result' => $this->faker->optional(0.5)->randomElement(['HOT', 'WARM', 'COLD']),
            'treatment_status' => $this->faker->optional(0.5)->randomElement(['TRAITE', 'NON_TRAITE']),
            'qualification_score' => $this->faker->numberBetween(0, 100),
            'ai_summary' => $this->faker->optional(0.3)->sentence(),
            'notes' => $this->faker->optional(0.2)->text(200),
            'is_new' => $this->faker->boolean(40),
            'qualified_at' => $this->faker->optional(0.4)->dateTimeBetween('-30 days', 'now'),
            'last_activity_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'custom_data' => $this->faker->boolean(30) ? ['source' => 'website', 'campaign' => 'spring_2026'] : null,
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => now(),
        ];
    }

    public function fresh(): static
    {
        return $this->state(fn () => [
            'is_new' => true,
            'ai_qualification_status' => null,
            'qualification_result' => null,
            'treatment_status' => null,
            'qualification_score' => 0,
            'qualified_at' => null,
        ]);
    }

    public function hot(): static
    {
        return $this->state(fn () => [
            'temperature' => 'HOT',
            'is_new' => false,
            'ai_qualification_status' => 'QUALIFIE',
            'qualification_result' => 'HOT',
            'treatment_status' => 'NON_TRAITE',
            'qualification_score' => $this->faker->numberBetween(70, 100),
        ]);
    }

    public function cold(): static
    {
        return $this->state(fn () => [
            'temperature' => 'COLD',
            'is_new' => true,
            'ai_qualification_status' => 'NON_QUALIFIE',
            'qualification_result' => 'COLD',
            'treatment_status' => 'TRAITE',
            'qualification_score' => $this->faker->numberBetween(0, 30),
        ]);
    }
}
