<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function superAdmin(): User
    {
        $plan = Plan::factory()->create();
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        return User::factory()->create([
            'tenant_id' => $tenant->id,
            'is_super_admin' => true,
        ]);
    }

    public function test_guest_cannot_access_plans(): void
    {
        $this->get(route('admin.plan.index'))->assertRedirect(route('login'));
    }

    public function test_non_super_admin_cannot_access_plans(): void
    {
        $plan = Plan::factory()->create();
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);
        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'is_super_admin' => false,
        ]);

        $this->actingAs($user)
            ->get(route('admin.plan.index'))
            ->assertStatus(403);
    }

    public function test_index_lists_all_plans(): void
    {
        $admin = $this->superAdmin();
        Plan::factory()->count(3)->create();

        $response = $this->actingAs($admin)
            ->get(route('admin.plan.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('SuperAdmin/Plans/Index')
            ->has('plans', 4)
        );
    }

    public function test_store_creates_plan(): void
    {
        $admin = $this->superAdmin();

        $response = $this->actingAs($admin)
            ->post(route('admin.plan.store'), [
                'slug' => 'test-plan',
                'name' => 'Test Plan',
                'price_millicents' => 999_000,
                'max_teams' => 3,
                'max_members' => 10,
                'is_active' => true,
            ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('plans', [
            'slug' => 'test-plan',
            'name' => 'Test Plan',
            'price_millicents' => 999_000,
            'max_teams' => 3,
            'max_members' => 10,
        ]);
    }

    public function test_store_validates_required_fields(): void
    {
        $admin = $this->superAdmin();

        $response = $this->actingAs($admin)
            ->post(route('admin.plan.store'), []);

        $response->assertSessionHasErrors(['slug', 'name', 'price_millicents']);
    }

    public function test_store_validates_unique_slug(): void
    {
        $admin = $this->superAdmin();
        Plan::factory()->create(['slug' => 'existing-slug']);

        $response = $this->actingAs($admin)
            ->post(route('admin.plan.store'), [
                'slug' => 'existing-slug',
                'name' => 'Test',
                'price_millicents' => 0,
            ]);

        $response->assertSessionHasErrors(['slug']);
    }

    public function test_store_marks_as_default(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)->post(route('admin.plan.store'), [
            'slug' => 'default-plan',
            'name' => 'Default Plan',
            'price_millicents' => 0,
            'is_default' => true,
        ]);

        $this->assertDatabaseHas('plans', [
            'slug' => 'default-plan',
            'is_default' => true,
        ]);
    }

    public function test_store_toggles_previous_default_off(): void
    {
        $admin = $this->superAdmin();
        Plan::factory()->create(['slug' => 'current-default', 'is_default' => true]);

        $this->actingAs($admin)->post(route('admin.plan.store'), [
            'slug' => 'new-default',
            'name' => 'New Default',
            'price_millicents' => 0,
            'is_default' => true,
        ]);

        $this->assertDatabaseHas('plans', ['slug' => 'current-default', 'is_default' => false]);
        $this->assertDatabaseHas('plans', ['slug' => 'new-default', 'is_default' => true]);
    }

    public function test_update_modifies_plan(): void
    {
        $admin = $this->superAdmin();
        $plan = Plan::factory()->create(['slug' => 'original', 'name' => 'Original']);

        $response = $this->actingAs($admin)
            ->post(route('admin.plan.update', $plan->id), [
                'slug' => 'updated',
                'name' => 'Updated Plan',
                'price_millicents' => 500_000,
            ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('plans', [
            'id' => $plan->id,
            'slug' => 'updated',
            'name' => 'Updated Plan',
            'price_millicents' => 500_000,
        ]);
    }

    public function test_update_toggles_default(): void
    {
        $admin = $this->superAdmin();
        $default = Plan::factory()->create(['slug' => 'default', 'is_default' => true]);
        $other = Plan::factory()->create(['slug' => 'other', 'is_default' => false]);

        $this->actingAs($admin)
            ->post(route('admin.plan.update', $other->id), ['is_default' => true]);

        $this->assertDatabaseHas('plans', ['id' => $default->id, 'is_default' => false]);
        $this->assertDatabaseHas('plans', ['id' => $other->id, 'is_default' => true]);
    }

    public function test_destroy_removes_plan_without_tenants(): void
    {
        $admin = $this->superAdmin();
        $plan = Plan::factory()->create();

        $response = $this->actingAs($admin)
            ->delete(route('admin.plan.destroy', $plan->id));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('plans', ['id' => $plan->id]);
    }

    public function test_destroy_fails_if_plan_has_tenants(): void
    {
        $admin = $this->superAdmin();
        $plan = Plan::factory()->create();
        Tenant::factory()->create(['plan_id' => $plan->id]);

        $response = $this->actingAs($admin)
            ->delete(route('admin.plan.destroy', $plan->id));

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('plans', ['id' => $plan->id]);
    }

    public function test_destroy_validates_all_limit_fields(): void
    {
        $admin = $this->superAdmin();

        $response = $this->actingAs($admin)->post(route('admin.plan.store'), [
            'slug' => 'full-featured',
            'name' => 'Full Plan',
            'price_millicents' => 1000,
            'max_teams' => 10,
            'max_members' => 50,
            'max_leads' => 1000,
            'max_agents' => 20,
            'max_instances' => 5,
            'dollar_limit' => 200,
            'features' => ['media_library' => true],
            'is_active' => true,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('plans', [
            'slug' => 'full-featured',
            'max_teams' => 10,
            'max_members' => 50,
            'max_leads' => 1000,
            'max_agents' => 20,
            'max_instances' => 5,
            'dollar_limit' => 200,
        ]);
    }

    public function test_store_rejects_negative_limits(): void
    {
        $admin = $this->superAdmin();

        $response = $this->actingAs($admin)->post(route('admin.plan.store'), [
            'slug' => 'bad-limits',
            'name' => 'Bad',
            'price_millicents' => 0,
            'max_teams' => -1,
        ]);

        $response->assertSessionHasErrors(['max_teams']);
    }
}
