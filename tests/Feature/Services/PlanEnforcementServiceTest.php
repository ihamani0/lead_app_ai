<?php

namespace Tests\Feature\Services;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Plan;
use App\Models\Team;
use App\Models\Tenant;
use App\Models\User;
use App\Services\PlanEnforcementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanEnforcementServiceTest extends TestCase
{
    use RefreshDatabase;

    private PlanEnforcementService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(PlanEnforcementService::class);
    }

    public function test_can_create_team_when_unlimited(): void
    {
        $plan = Plan::factory()->create(['max_teams' => null]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        $this->assertTrue($this->service->canCreateTeam($tenant));
    }

    public function test_can_create_team_when_under_limit(): void
    {
        $plan = Plan::factory()->create(['max_teams' => 3]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        $this->assertTrue($this->service->canCreateTeam($tenant));
    }

    public function test_cannot_create_team_when_at_limit(): void
    {
        $plan = Plan::factory()->create(['max_teams' => 1]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        Team::create(['user_id' => $user->id, 'name' => 'Team 1']);

        $this->assertFalse($this->service->canCreateTeam($tenant));
    }

    public function test_can_create_agent_when_under_limit(): void
    {
        $plan = Plan::factory()->create(['max_agents' => 2]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        $this->assertTrue($this->service->canCreateAgent($tenant));
    }

    public function test_cannot_create_agent_when_at_limit(): void
    {
        $plan = Plan::factory()->create(['max_agents' => 1]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);
        AgentConfig::create([
            'tenant_id' => $tenant->id,
            'name' => 'Agent 1',
        ]);

        $this->assertFalse($this->service->canCreateAgent($tenant));
    }

    public function test_can_create_instance_when_under_limit(): void
    {
        $plan = Plan::factory()->create(['max_instances' => 2]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        $this->assertTrue($this->service->canCreateInstance($tenant));
    }

    public function test_cannot_create_instance_when_at_limit(): void
    {
        $plan = Plan::factory()->create(['max_instances' => 1]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);
        EvolutionInstance::create([
            'tenant_id' => $tenant->id,
            'instance_name' => 'Test Instance',
        ]);

        $this->assertFalse($this->service->canCreateInstance($tenant));
    }

    public function test_can_add_member_when_under_limit(): void
    {
        $plan = Plan::factory()->create(['max_members' => 5]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        $this->assertTrue($this->service->canAddMember($tenant));
    }

    public function test_can_add_member_when_limit_is_null(): void
    {
        $plan = Plan::factory()->create(['max_members' => null]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        $this->assertTrue($this->service->canAddMember($tenant));
    }

    public function test_returns_correct_limits(): void
    {
        $plan = Plan::factory()->create([
            'max_teams' => 3,
            'max_members' => 10,
            'max_leads' => null,
            'max_agents' => 5,
            'max_instances' => 2,
        ]);
        $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

        $limits = $this->service->getLimitsForTenant($tenant);

        $this->assertEquals(3, $limits['teams']);
        $this->assertEquals(10, $limits['members']);
        $this->assertNull($limits['leads']);
        $this->assertEquals(5, $limits['agents']);
        $this->assertEquals(2, $limits['instances']);
    }
}
