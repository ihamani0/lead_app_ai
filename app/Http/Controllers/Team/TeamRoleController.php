<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Jurager\Teams\Models\Role;

class TeamRoleController extends Controller
{
    public function store(Request $request, string $slug)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|alpha_dash',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($request->user())) {
            abort(403);
        }

        $role = $team->userAuthorization($request->user());

        if (! in_array($role?->code, ['owner', 'admin'])) {
            abort(403);
        }

        try {
            $team->addRole(
                code: $validated['code'],
                permissions: $validated['permissions'] ?? [],
                name: $validated['name'],
                description: $validated['description'] ?? null,
            );
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', __('messages.success.role_created'));
    }

    public function update(Request $request, string $slug, Role $role)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($request->user())) {
            abort(403);
        }

        $userRole = $team->userAuthorization($request->user());

        if (! in_array($userRole?->code, ['owner', 'admin'])) {
            abort(403);
        }

        if ($role->team_id !== $team->id) {
            abort(403);
        }

        try {
            $team->updateRole(
                keyword: $role->id,
                permissions: $validated['permissions'] ?? $role->permissions->pluck('code')->toArray(),
                name: $validated['name'] ?? null,
                description: $validated['description'] ?? null,
            );
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', __('messages.success.role_updated'));
    }

    public function destroy(Request $request, string $slug, Role $role)
    {
        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($request->user())) {
            abort(403);
        }

        $userRole = $team->userAuthorization($request->user());

        if (! in_array($userRole?->code, ['owner', 'admin'])) {
            abort(403);
        }

        if ($role->team_id !== $team->id) {
            abort(403);
        }

        if ($role->code === 'owner') {
            return back()->with('error', __('messages.error.cannot_delete_owner_role'));
        }

        try {
            $team->deleteRole($role->id);
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', __('messages.success.role_deleted'));
    }
}
