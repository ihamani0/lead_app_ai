<?php

namespace Database\Seeders;

use App\Models\LlmModel;
use Illuminate\Database\Seeder;

class LlmModelSeeder extends Seeder
{
    public function run(): void
    {
        LlmModel::updateOrCreate(
            ['name' => 'deepseek'],
            [
                'display_name' => 'DeepSeek',
                'provider' => 'deepseek',
                'input_rate_per_million_millicents' => 24000,
                'output_rate_per_million_millicents' => 38000,
                'cost_input_per_million_millicents' => 14000,
                'cost_output_per_million_millicents' => 28000,
                'is_active' => true,
            ]
        );
    }
}
