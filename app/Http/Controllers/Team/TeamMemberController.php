<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Jurager\Teams\Models\Owner;

class TeamMemberController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request, string $slug)
    {
        $user = $request->user();

        $team = Team::with([
            'owner',
            'users',
            'roles.permissions',
            'invitations.role',
        ])->where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($user)) {
            abort(403);
        }

        if ($user->id === $team->user_id) {
            $workspaceRole = new Owner;
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

        $members = $team->users->map(fn ($teamUser) => [
            'id' => $teamUser->id,
            'user_id' => $teamUser->id,
            'workspace_id' => (string) $team->id,
            'role_id' => $teamUser->membership->role_id,
            'user' => $teamUser,
            'role' => $team->roles()->find($teamUser->membership->role_id),
            'created_at' => $teamUser->membership->created_at->toISOString(),
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

        return Inertia::render('Workspace/Members/Index', [
            'workspace' => $team,
            'members' => $members,
            'roles' => $roles,
            'canInvite' => in_array($workspaceRole?->code, ['owner', 'admin']),
            'invitations' => $team->invitations,
        ]);
    }

    public function updateRole(Request $request, string $slug, User $user)
    {
        $validated = $request->validate([
            'role_code' => 'required|string',
        ]);

        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($request->user())) {
            abort(403);
        }

        $role = $team->userAuthorization($request->user());

        if (! in_array($role?->code, ['owner', 'admin'])) {
            abort(403);
        }

        if (! $team->hasUser($user)) {
            return back()->with('error', __('messages.error.user_not_member'));
        }

        if (! $team->hasRole($validated['role_code'])) {
            return back()->with('error', __('messages.error.role_not_found'));
        }

        // Prevent self-role-change for non-owner admins
        if ($user->id === $request->user()->id && $role?->code !== 'owner') {
            return back()->with('error', 'You cannot change your own role.');
        }

        $team->updateUser($user, $validated['role_code']);

        return back()->with('success', __('messages.success.member_role_updated'));
    }

    public function destroy(Request $request, string $slug, User $user)
    {
        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($request->user())) {
            abort(403);
        }

        $role = $team->userAuthorization($request->user());

        if (! in_array($role?->code, ['owner', 'admin'])) {
            abort(403);
        }

        if ($user->id === $team->user_id) {
            return back()->with('error', __('messages.error.cannot_remove_owner'));
        }

        if (! $team->hasUser($user)) {
            return back()->with('error', __('messages.error.user_not_member'));
        }

        $team->deleteUser($user);

        return back()->with('success', __('messages.success.member_removed'));
    }
}
