<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed plans first
        $this->call([PlanSeeder::class, LlmModelSeeder::class]);

        // 2. Find the default plan
        $defaultPlan = Plan::default()->first();

        // 5. Create super admin with its own tenant
        $adminTenant = Tenant::create([
            'name' => 'Admin Tenant',
            'slug' => 'admin-tenant',
            'plan_id' => $defaultPlan->id,
            'is_active' => true,
            'settings' => [],
        ]);

        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'super-admin@crewflare.site',
            'password' => bcrypt('issamhamani19@'),
            'tenant_id' => $adminTenant->id,
        ]);
        $superAdmin->is_super_admin = true;
        $superAdmin->save();
    }
}
