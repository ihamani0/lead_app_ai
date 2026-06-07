<?php

namespace Tests\Feature;

use App\Models\EvolutionInstance;
use App\Models\Team;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class WizardWelcomeDismissedTest extends TestCase
{
    use RefreshDatabase;

    protected function createUser(): User
    {
        $tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => fake()->unique()->slug(),
            'plan' => 'free',
            'is_active' => true,
        ]);

        return User::factory()->create([
            'tenant_id' => $tenant->id,
        ]);
    }

    protected function createTeam(User $user, array $overrides = []): Team
    {
        return Team::factory()->create(array_merge([
            'user_id' => $user->id,
        ], $overrides));
    }

    protected function createInstance(User $user, Team $team, array $overrides = []): EvolutionInstance
    {
        return EvolutionInstance::create(array_merge([
            'tenant_id' => $user->tenant_id,
            'team_id' => $team->id,
            'instance_name' => 'test-instance-'.fake()->unique()->word(),
            'display_name' => 'Test Instance',
            'status' => 'disconnected',
        ], $overrides));
    }

    public function test_fresh_user_has_null_welcome_dismissed_at(): void
    {
        $user = $this->createUser();

        $this->assertNull($user->fresh()->welcome_dismissed_at);
    }

    public function test_dismiss_welcome_endpoint_sets_welcome_dismissed_at(): void
    {
        $user = $this->createUser();
        $team = $this->createTeam($user);
        $this->actingAs($user);

        $this->assertNull($user->fresh()->welcome_dismissed_at);

        $response = $this->postJson(route('workspaces.wizard.dismiss-welcome', [
            'slug' => $team->slug,
        ]));

        $response->assertOk()->assertJson(['success' => true]);

        $this->assertNotNull($user->fresh()->welcome_dismissed_at);
    }

    public function test_wizard_complete_sets_welcome_dismissed_at(): void
    {
        $user = $this->createUser();
        $team = $this->createTeam($user);
        $instance = $this->createInstance($user, $team, ['status' => 'disconnected']);
        $this->actingAs($user);

        $this->assertNull($user->fresh()->welcome_dismissed_at);

        $response = $this->post(route('workspaces.wizard.complete', [
            'slug' => $team->slug,
        ]), [
            'instance_id' => $instance->id,
            'agent_name' => 'Test Agent',
            'languages' => ['francais'],
            'main_objective' => 'generer_leads',
            'tone' => 'professionnel',
            'response_style' => 'equilibree',
            'knowledge_mode' => 'strict',
        ]);

        $response->assertRedirect();
        $this->assertNotNull($user->fresh()->welcome_dismissed_at);
    }

    public function test_inertia_shared_prop_exposes_welcome_dismissed_at_for_fresh_user(): void
    {
        $user = $this->createUser();
        $team = $this->createTeam($user);
        $this->actingAs($user);

        $this->assertNull($user->fresh()->welcome_dismissed_at);

        $response = $this->get(route('workspaces.dashboard', $team->slug));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            ->where('auth.user.welcome_dismissed_at', null)
        );
    }

    public function test_inertia_shared_prop_exposes_welcome_dismissed_at_after_dismiss(): void
    {
        $user = $this->createUser();
        $team = $this->createTeam($user);
        $this->actingAs($user);

        $this->postJson(route('workspaces.wizard.dismiss-welcome', [
            'slug' => $team->slug,
        ]))->assertOk();

        $dismissedAt = $user->fresh()->welcome_dismissed_at;
        $this->assertNotNull($dismissedAt);

        $response = $this->get(route('workspaces.dashboard', $team->slug));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            ->where('auth.user.welcome_dismissed_at', $dismissedAt->toIsoString())
        );
    }
}
