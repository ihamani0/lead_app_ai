<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\Team;
use App\Models\User;
use App\Services\TeamService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Jurager\Teams\Models\Owner;

class TeamController extends Controller
{
    public function __construct(protected TeamService $teamService) {}

    public function index(Request $request)
    {
        $user = $request->user();

        $teamIds = $user->allTeams()->pluck('id');
        $teams = Team::with(['owner', 'users', 'roles'])
            ->whereIn('id', $teamIds)
            ->get()
            ->map(function ($team) use ($user) {
                $role = $team->userAuthorization($user);

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'description' => $team->description,
                    'slug' => $team->slug,
                    'owner_id' => $team->user_id,
                    'created_at' => $team->created_at,
                    'updated_at' => $team->updated_at,
                    'owner' => $team->owner,
                    'members_count' => $team->users->count(),
                    'user_role' => $role ? [
                        'name' => $role->name,
                        'code' => $role->code,
                        'description' => $role->description ?? '',
                    ] : null,
                ];
            });

        // Page-level KPIs
        $totalLeads = Lead::where('tenant_id', $user->tenant_id)->count();
        $hotLeads = Lead::where('tenant_id', $user->tenant_id)
            ->where('qualification_result', 'HOT')
            ->count();
        $connectedInstances = EvolutionInstance::where('tenant_id', $user->tenant_id)
            ->where('status', 'connected')
            ->count();
        $activeAgents = AgentConfig::where('tenant_id', $user->tenant_id)
            ->where('is_active', true)
            ->count();

            

        return Inertia::render('Workspace/Index', [
            'workspaces' => $teams,
            'canCreate' => true,
            'stats' => [
                'total_workspaces' => $teams->count(),
                'total_leads' => $totalLeads,
                'hot_leads' => $hotLeads,
                'connected_instances' => $connectedInstances,
                'active_agents' => $activeAgents,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        $team = Team::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        $this->teamService->createDefaultRoles($team);

        return redirect()->route('workspaces.dashboard', $team->slug)
            ->with('success', __('messages.success.workspace_created'));
    }

    // | Relation | Purpose |
    // |----------|---------|
    // | owner | Who created the team |
    // | users.user | Members with their profile data |
    // | roles | Available roles (e.g., "admin", "editor") |
    // | invitations | Only pending invitations (not accepted, not expired) |

    public function show(Request $request, $slug)
    {
        $user = $request->user();

        $team = Team::with([
            'owner',
            'users',
            'roles.permissions',
            'invitations.role',
        ])->where('slug', $slug)->first();

        if (! $team->hasUser($user)) {
            abort(403);
        }

        if ($user->id === $team->user_id) {
            $workspaceRole = new Owner;
            $workspaceRole->description = 'Team owner';
        } else {
            $pivot = $team->users()->where('user_id', $user->id)->first();
            $workspaceRole = $pivot ? $team->roles()->find($pivot->membership->role_id) : null;
        }

        $roles = $team->roles->map(function ($role) use ($team) {
            return [
                'id' => $role->id,
                'workspace_id' => (string) $team->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->permissions->map(fn ($perm) => [
                    'code' => $perm->code,
                    'name' => $perm->name,
                ])->values()->toArray(),
                'is_default' => in_array($role->code, ['owner', 'admin', 'member', 'viewer']),
            ];
        });

        $ownerRole = $team->roles()->where('code', 'owner')->first();

        $members = $team->users->map(fn ($user) => [
            'id' => $user->id,
            'user_id' => $user->id,
            'workspace_id' => (string) $team->id,
            'role_id' => $user->membership->role_id,
            'user' => $user,
            'role' => $team->roles()->find($user->membership->role_id),
            'created_at' => $user->membership->created_at->toISOString(),
        ]);

        $members->prepend([
            'id' => $team->owner->id,
            'user_id' => $team->owner->id,
            'workspace_id' => (string) $team->id,
            'role_id' => $ownerRole?->id,
            'user' => $team->owner,
            'role' => [
                'id' => $ownerRole?->id,
                'code' => 'owner',
                'name' => 'Owner',
                'description' => 'Team owner',
            ],
            'created_at' => $team->created_at->toISOString(),
        ]);

        return Inertia::render('Workspace/Show', [
            'workspace' => $team,
            'workspaceRole' => $workspaceRole,
            'members' => $members,
            'roles' => $roles,
            'canManageTeam' => in_array($workspaceRole?->code, ['owner', 'admin']),
            'canInvite' => in_array($workspaceRole?->code, ['owner', 'admin']),
        ]);
    }

    public function update(Request $request, $slug)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($user)) {
            abort(403);
        }

        $role = $team->userAuthorization($user);

        if (! in_array($role?->code, ['owner', 'admin'])) {
            abort(403);
        }

        $team->update($validated);

        return back();
    }

    public function destroy(Request $request, $slug)
    {
        $user = $request->user();
        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($user)) {
            abort(403);
        }

        if ($user->id !== $team->user_id) {
            abort(403);
        }

        $team->purge();

        return redirect()->route('teams.index');
    }

    public function invite(Request $request, $slug)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'role_code' => 'required|string',
        ]);

        $user = $request->user();
        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($user)) {
            abort(403);
        }

        $role = $team->userAuthorization($user);

        if (! in_array($role?->code, ['owner', 'admin'])) {
            abort(403);
        }

        if (! $team->hasRole($validated['role_code'])) {
            return back()->with('error', __('messages.error.role_not_found'));
        }

        $email = $validated['email'];
        $existingUser = User::where('email', $email)->first();

        // if ($existingUser && $existingUser->tenant_id !== $user->tenant_id) {
        //     return back()->with('error', __('messages.error.cross_tenant_invite_not_allowed'));
        // }

        if ($existingUser && $team->hasUser($existingUser)) {
            return back()->with('error', __('messages.error.user_already_member'));
        }

        $team->inviteUser($email, $validated['role_code']);

        return back()->with('success', __('messages.success.invitation_sent'));
    }
}
