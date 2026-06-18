<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Faq>
 */
class FaqFactory extends Factory
{
    protected $model = Faq::class;

    public function definition(): array
    {
        $categories = ['Prix', 'Localisation', 'Processus', 'Finance', 'Technique', 'Général'];

        return [
            'question' => $this->faker->sentence(6).' ?',
            'answer' => $this->faker->paragraph(3),
            'category' => $this->faker->randomElement($categories),
            'is_active' => $this->faker->boolean(80),
            'usage_count' => $this->faker->numberBetween(0, 100),
        ];
    }
}
