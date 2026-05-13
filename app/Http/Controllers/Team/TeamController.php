<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
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
        $tenant = $user->tenant;

        $teams = Team::where('tenant_id', $tenant->id)
            ->with(['owner', 'users', 'roles'])
            ->get();

        // dd($teams);
        return Inertia::render('Workspace/Index', [
            'workspaces' => $teams,
            'canCreate' => true,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $tenant = $user->tenant;

        $team = Team::create([
            'user_id' => $user->id, // / Package automatically adds user as OWNER here
            'tenant_id' => $tenant->id,
            'name' => $validated['name'],
        ]);

        return redirect()->route('teams.show', $team->slug);
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
            'owner',                           // The team owner (user_id)
            'users.user',                      // All members + their user data
            'roles.permissions',                           // Team roles (admin, editor, etc.)
            'invitations' => function ($query) {  // Pending invitations only
                $query->whereNull('accepted_at')
                    ->where('expires_at', '>', now());
            },
        ])->where('slug', $slug)->first();

        // Ensures the user can only access teams within their own tenant.
        if ($team->tenant_id !== $user->tenant_id) {
            abort(403);
        }

        if ($user->id === $team->user_id) {
            $workspaceRole = new Owner;
            $workspaceRole->description = 'Team owner';
        } else {
            $pivot = $team->users()->where('user_id', $user->id)->first();
            $workspaceRole = $pivot ? $team->roles()->find($pivot->pivot->role_id) : null;
        }

        $roles = $team->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->permissions->pluck('code')->toArray(),
            ];
        });

        return Inertia::render('Workspace/Show', [
            'workspace' => $team,
            'workspaceRole' => $workspaceRole,
            'members' => $team->users,      // Members with pivot data
            'roles' => $roles,        // Available roles
            'canManageTeam' => in_array($workspaceRole?->code, ['owner', 'admin']),
            'canInvite' => in_array($workspaceRole?->code, ['owner', 'admin']),
        ]);
    }

    public function update(Request $request, $slug)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();

        $team = Team::where('slug', $slug)->firstOrFail();

        if ($team->tenant_id !== $user->tenant_id) {
            abort(403);
        }

        $role = $team->userAuthorization($user);

        if (! in_array($role?->code, ['owner', 'admin'])) {
            abort(403);
        }

        $team->update(['name' => $validated['name']]);

        return back();
    }

    public function destroy(Request $request, $slug)
    {
        $user = $request->user();
        $team = Team::where('slug', $slug)->firstOrFail();

        if ($team->tenant_id !== $user->tenant_id) {
            abort(403);
        }

        // Owner check (no pivot check needed - only owner can delete)
        if ($user->id !== $team->user_id) {
            abort(403);
        }

        $team->purge();  // Built-in method: detaches users + deletes team

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

        if ($team->tenant_id !== $user->tenant_id) {
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

        if ($existingUser && $existingUser->tenant_id === $team->tenant_id) {

            if ($team->hasUser($existingUser)) {
                return back()->with('error', __('messages.error.user_already_member'));
            }

            $team->addUser($existingUser, $validated['role_code']);

            return back()->with('success', __('messages.success.user_added_to_team'));
        }

        if ($existingUser) {
            return back()->with('error', __('messages.error.user_belongs_to_another_organization'));
        }

        $team->inviteUser($email, $validated['role_code']);

        return back()->with('success', __('messages.success.invitation_sent'));
    }
}
