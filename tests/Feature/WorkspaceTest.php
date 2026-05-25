<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\Tenant;
use App\Models\User;
use App\Services\TeamService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class WorkspaceTest extends TestCase
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
        $team = Team::factory()->create(array_merge([
            'user_id' => $user->id,
        ], $overrides));

        app(TeamService::class)->createDefaultRoles($team);

        return $team;
    }

    public function test_guest_cannot_access_workspaces(): void
    {
        $this->get(route('teams.index'))->assertRedirect(route('login'));
        $this->get(route('teams.show', 'test'))->assertRedirect(route('login'));
    }

    public function test_user_can_create_workspace(): void
    {
        $user = $this->createUser();
        $this->actingAs($user);

        $response = $this->post(route('teams.store'), [
            'name' => 'My Workspace',
            'description' => 'A test workspace',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('teams', [
            'user_id' => $user->id,
            'name' => 'My Workspace',
            'description' => 'A test workspace',
        ]);

        $team = Team::where('user_id', $user->id)->first();
        $response->assertRedirect(route('workspaces.dashboard', $team->slug));
        $response->assertSessionHas('success');
    }

    public function test_user_can_list_workspaces(): void
    {
        $user = $this->createUser();
        $this->actingAs($user);

        $team = $this->createTeam($user);

        $response = $this->get(route('teams.index'));

        $response->assertOk();
    }

    public function test_user_can_view_workspace(): void
    {
        $user = $this->createUser();
        $this->actingAs($user);

        $team = $this->createTeam($user);

        $response = $this->get(route('teams.show', $team->slug));

        $response->assertOk();
    }

    public function test_owner_can_invite_existing_user(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $invitedUser = $this->createUser();

        $response = $this->post(route('teams.invite', $team->slug), [
            'email' => $invitedUser->email,
            'role_code' => 'member',
        ]);

        $response->assertSessionHas('success');
        $this->assertTrue($team->fresh()->hasUser($invitedUser));
    }

    public function test_owner_can_invite_new_user(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $response = $this->post(route('teams.invite', $team->slug), [
            'email' => 'newuser@example.com',
            'role_code' => 'member',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('invitations', [
            'team_id' => $team->id,
            'email' => 'newuser@example.com',
        ]);
    }

    public function test_non_admin_cannot_invite(): void
    {
        $owner = $this->createUser();
        $team = $this->createTeam($owner);

        $viewer = $this->createUser();
        $viewerRole = $team->roles()->where('code', 'viewer')->first();
        $team->addUser($viewer, $viewerRole->code);

        $this->actingAs($viewer);

        $response = $this->post(route('teams.invite', $team->slug), [
            'email' => 'anyone@example.com',
            'role_code' => 'member',
        ]);

        $response->assertForbidden();
    }

    public function test_owner_can_cancel_invitation(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $role = $team->roles()->where('code', 'member')->first();
        $invitation = $team->invitations()->create([
            'email' => 'invited@example.com',
            'role_id' => $role->id,
        ]);

        $response = $this->delete(route('teams.invitations.destroy', [
            'slug' => $team->slug,
            'invitation' => $invitation->id,
        ]));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('invitations', ['id' => $invitation->id]);
    }

    public function test_user_can_accept_invitation(): void
    {
        $owner = $this->createUser();
        $team = $this->createTeam($owner);

        $invitedUser = $this->createUser();
        $role = $team->roles()->where('code', 'member')->first();

        $invitation = $team->invitations()->create([
            'email' => $invitedUser->email,
            'role_id' => $role->id,
        ]);

        $signedUrl = URL::signedRoute('teams.invitations.accept', ['invitation' => $invitation->id]);
        $this->actingAs($invitedUser);

        $response = $this->get($signedUrl);

        $response->assertRedirect(route('teams.show', $team->slug));
        $response->assertSessionHas('success');
        $this->assertTrue($team->fresh()->hasUser($invitedUser));
    }

    public function test_used_invitation_returns_404(): void
    {
        $owner = $this->createUser();
        $team = $this->createTeam($owner);

        $invitedUser = $this->createUser();
        $role = $team->roles()->where('code', 'member')->first();

        $invitation = $team->invitations()->create([
            'email' => $invitedUser->email,
            'role_id' => $role->id,
        ]);

        $team->inviteAccept($invitation->id);

        $signedUrl = URL::signedRoute('teams.invitations.accept', ['invitation' => $invitation->id]);
        $this->actingAs($invitedUser);

        $response = $this->get($signedUrl);

        $response->assertNotFound();
    }

    public function test_owner_can_update_member_role(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $member = $this->createUser();
        $memberRole = $team->roles()->where('code', 'member')->first();
        $team->addUser($member, $memberRole->code);

        $response = $this->put(route('teams.members.update-role', [
            'slug' => $team->slug,
            'user' => $member->id,
        ]), [
            'role_code' => 'admin',
        ]);

        $response->assertSessionHas('success');
    }

    public function test_owner_can_remove_member(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $member = $this->createUser();
        $memberRole = $team->roles()->where('code', 'member')->first();
        $team->addUser($member, $memberRole->code);

        $response = $this->delete(route('teams.members.destroy', [
            'slug' => $team->slug,
            'user' => $member->id,
        ]));

        $response->assertSessionHas('success');
        $this->assertFalse($team->fresh()->hasUser($member));
    }

    public function test_cannot_remove_owner(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $response = $this->delete(route('teams.members.destroy', [
            'slug' => $team->slug,
            'user' => $owner->id,
        ]));

        $response->assertSessionHas('error', __('messages.error.cannot_remove_owner'));
    }

    public function test_owner_can_create_role(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $response = $this->post(route('teams.roles.store', $team->slug), [
            'name' => 'Editor',
            'code' => 'editor',
            'description' => 'Can edit content',
            'permissions' => ['leads.view', 'leads.edit'],
        ]);

        $response->assertSessionHas('success', __('messages.success.role_created'));
        $this->assertDatabaseHas('roles', [
            'team_id' => $team->id,
            'code' => 'editor',
            'name' => 'Editor',
        ]);
    }

    public function test_owner_can_update_workspace(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $response = $this->put(route('teams.update', $team->slug), [
            'name' => 'Updated Workspace Name',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('teams', [
            'id' => $team->id,
            'name' => 'Updated Workspace Name',
        ]);
    }

    public function test_owner_can_delete_workspace(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $response = $this->delete(route('teams.destroy', $team->slug));

        $response->assertRedirect(route('teams.index'));
        $this->assertDatabaseMissing('teams', ['id' => $team->id]);
    }

    public function test_guest_cannot_access_members_page(): void
    {
        $owner = $this->createUser();
        $team = $this->createTeam($owner);

        $this->get(route('workspaces.members.index', $team->slug))
            ->assertRedirect(route('login'));
    }

    public function test_member_can_view_members_page(): void
    {
        $owner = $this->createUser();
        $this->actingAs($owner);

        $team = $this->createTeam($owner);

        $response = $this->get(route('workspaces.members.index', $team->slug));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Workspace/Members/Index')
            ->has('workspace')
            ->has('members')
            ->has('roles')
            ->has('canInvite')
        );
    }

    public function test_non_member_cannot_access_members_page(): void
    {
        $owner = $this->createUser();
        $team = $this->createTeam($owner);

        $otherUser = $this->createUser();
        $this->actingAs($otherUser);

        $this->get(route('workspaces.members.index', $team->slug))
            ->assertForbidden();
    }

    public function test_viewer_cannot_invite_on_members_page(): void
    {
        $owner = $this->createUser();
        $team = $this->createTeam($owner);

        $viewer = $this->createUser();
        $viewerRole = $team->roles()->where('code', 'viewer')->first();
        $team->addUser($viewer, $viewerRole->code);

        $this->actingAs($viewer);

        $response = $this->get(route('workspaces.members.index', $team->slug));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('canInvite', false)
        );
    }
}
