<?php

namespace Tests\Feature\Settings;

use App\Models\AgentConversation;
use App\Models\AgentConversationMessage;
use App\Models\KnowledgeBase;
use App\Models\Lead;
use App\Models\MediaAsset;
use App\Models\Team;
use App\Models\Tenant;
use App\Models\TourProgress;
use App\Models\User;
use App\Services\TeamService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function createUser(array $overrides = []): User
    {
        $tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => fake()->unique()->slug(),
            'plan' => 'free',
            'is_active' => true,
        ]);

        return User::factory()->create(array_merge([
            'tenant_id' => $tenant->id,
            'has_password' => true,
        ], $overrides));
    }

    public function test_profile_page_is_displayed()
    {
        $user = $this->createUser();

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated()
    {
        $user = $this->createUser();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = $this->createUser();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => $user->name,
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account()
    {
        $user = $this->createUser();

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = $this->createUser();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->fresh());
    }

    public function test_user_without_password_can_delete_their_account()
    {
        $user = $this->createUser([
            'has_password' => false,
            'password' => Str::random(32),
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_shared_inertia_user_includes_has_password_true()
    {
        $user = $this->createUser([
            'has_password' => true,
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('settings/profile')
            ->where('auth.user.has_password', true)
        );
    }

    public function test_shared_inertia_user_includes_has_password_false()
    {
        $user = $this->createUser([
            'has_password' => false,
            'password' => Str::random(32),
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('settings/profile')
            ->where('auth.user.has_password', false)
        );
    }

    public function test_user_with_team_membership_can_delete_their_account()
    {
        $user = $this->createUser();
        $tenant = Tenant::find($user->tenant_id);
        $teamOwner = User::factory()->create([
            'tenant_id' => $tenant->id,
            'has_password' => true,
        ]);
        $team = Team::factory()->create([
            'user_id' => $teamOwner->id,
        ]);
        app(TeamService::class)->createDefaultRoles($team);
        $team->addUser($user, 'member');

        $this->assertDatabaseHas('team_user', ['user_id' => $user->id, 'team_id' => $team->id]);

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
        $this->assertDatabaseMissing('team_user', ['user_id' => $user->id]);
    }

    public function test_user_without_password_and_with_team_can_still_delete()
    {
        $user = $this->createUser([
            'has_password' => false,
            'password' => Str::random(32),
        ]);
        $tenant = Tenant::find($user->tenant_id);
        $teamOwner = User::factory()->create([
            'tenant_id' => $tenant->id,
            'has_password' => true,
        ]);
        $team = Team::factory()->create([
            'user_id' => $teamOwner->id,
        ]);
        app(TeamService::class)->createDefaultRoles($team);
        $team->addUser($user, 'member');

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'));

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_user_deletion_nulls_tenant_owner_id_and_keeps_tenant()
    {
        $user = $this->createUser();
        $tenant = Tenant::find($user->tenant_id);
        $tenant->forceFill(['owner_id' => $user->id])->save();

        $this->assertSame($user->id, $tenant->fresh()->owner_id);

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response->assertSessionHasNoErrors();

        $this->assertNull($user->fresh());
        $tenant->refresh();
        $this->assertNull($tenant->owner_id);
        $this->assertNotNull($tenant->id);
        $this->assertSame('Test Tenant', $tenant->name);
    }

    public function test_user_deletion_does_not_delete_leads_knowledge_bases_agents_instances_or_media()
    {
        $user = $this->createUser();
        $tenant = Tenant::find($user->tenant_id);
        $team = Team::factory()->create(['user_id' => $user->id]);
        app(TeamService::class)->createDefaultRoles($team);

        $lead = Lead::create([
            'tenant_id' => $tenant->id,
            'team_id' => $team->id,
            'name' => 'John Doe',
            'phone' => '+33600000000',
        ]);

        $knowledgeBase = KnowledgeBase::create([
            'tenant_id' => $tenant->id,
            'team_id' => $team->id,
            'name' => 'kb.txt',
        ]);

        $mediaAsset = MediaAsset::create([
            'tenant_id' => $tenant->id,
            'team_id' => $team->id,
            'category' => 'pool',
            'type' => 'image',
            'external_url' => 'https://example.com/img.png',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response->assertSessionHasNoErrors();

        $this->assertNull($user->fresh());
        $this->assertNotNull($lead->fresh());
        $this->assertNotNull($knowledgeBase->fresh());
        $this->assertNotNull($mediaAsset->fresh());
    }

    public function test_user_deletion_cascades_to_tour_progress_and_group_user()
    {
        $user = $this->createUser();

        TourProgress::create([
            'user_id' => $user->id,
            'tour_name' => 'dashboard',
        ]);

        $groupId = DB::table('groups')->insertGetId([
            'team_id' => null,
            'code' => 'test',
            'name' => 'Test',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('group_user')->insert([
            'user_id' => $user->id,
            'group_id' => $groupId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertDatabaseHas('tour_progress', ['user_id' => $user->id]);
        $this->assertDatabaseHas('group_user', ['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response->assertSessionHasNoErrors();

        $this->assertNull($user->fresh());
        $this->assertDatabaseMissing('tour_progress', ['user_id' => $user->id]);
        $this->assertDatabaseMissing('group_user', ['user_id' => $user->id]);
    }

    public function test_user_deletion_removes_agent_conversations_and_messages()
    {
        $user = $this->createUser();

        $conversation = AgentConversation::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'title' => 'Test chat',
        ]);

        AgentConversationMessage::create([
            'id' => (string) Str::uuid(),
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'agent' => 'test',
            'role' => 'user',
            'content' => 'hello',
            'attachments' => '',
            'tool_calls' => '',
            'tool_results' => '',
            'usage' => '',
            'meta' => '',
        ]);

        $this->assertDatabaseHas('agent_conversations', ['user_id' => $user->id]);
        $this->assertDatabaseHas('agent_conversation_messages', ['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response->assertSessionHasNoErrors();

        $this->assertNull($user->fresh());
        $this->assertDatabaseMissing('agent_conversations', ['user_id' => $user->id]);
        $this->assertDatabaseMissing('agent_conversation_messages', ['user_id' => $user->id]);
    }

    public function test_user_deletion_revokes_sanctum_tokens()
    {
        $user = $this->createUser();

        Sanctum::actingAs($user, ['*'], 'web');
        $token = $user->createToken('test-token');

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'name' => 'test-token',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response->assertSessionHasNoErrors();

        $this->assertNull($user->fresh());
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }
}
