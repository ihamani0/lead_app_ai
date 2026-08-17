<?php

namespace Database\Seeders;

use App\Models\CreditPackage;
use Illuminate\Database\Seeder;

class CreditPackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Starter Pack',
                'description' => '500 credits for $5',
                'price_millicents' => 5_00_000,
                'credit_millicents' => 5_00_000,
                'paddle_price_id' => null,
                'is_active' => false,
            ],
            [
                'name' => 'Basic Pack',
                'description' => '1,000 credits for $10',
                'price_millicents' => 10_00_000,
                'credit_millicents' => 10_00_000,
                'paddle_price_id' => null,
                'is_active' => false,
            ],
            [
                'name' => 'Growth Pack',
                'description' => '2,500 credits for $25 (plus 500 bonus)',
                'price_millicents' => 25_00_000,
                'credit_millicents' => 30_00_000,
                'paddle_price_id' => null,
                'is_active' => false,
            ],
            [
                'name' => 'Pro Pack',
                'description' => '5,000 credits for $50 (plus 1,500 bonus)',
                'price_millicents' => 50_00_000,
                'credit_millicents' => 65_00_000,
                'paddle_price_id' => null,
                'is_active' => false,
            ],
            [
                'name' => 'Enterprise Pack',
                'description' => '10,000 credits for $100 (plus 5,000 bonus)',
                'price_millicents' => 100_00_000,
                'credit_millicents' => 150_00_000,
                'paddle_price_id' => null,
                'is_active' => false,
            ],
        ];

        foreach ($packages as $package) {
            CreditPackage::updateOrCreate(
                ['name' => $package['name']],
                $package,
            );
        }
    }
}
