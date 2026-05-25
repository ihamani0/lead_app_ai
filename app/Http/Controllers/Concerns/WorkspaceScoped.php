<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

trait WorkspaceScoped
{
    protected function scope(Request $request): array
    {

        $team = $request->attributes->get('active_team');

        return $team
            ? ['team_id' => $team->id]
            : ['tenant_id' => $request->user()->tenant_id];
    }

    protected function findScoped(Request $request, string $model, mixed $id)
    {
        $query = $model::where($this->scope($request));

        if (in_array(SoftDeletes::class, class_uses_recursive($model))) {
            $query->withTrashed();
        }

        return $query->findOrFail($id);
    }

    protected function scopedQuery(Request $request, string $model)
    {
        return $model::where($this->scope($request));
    }

    protected function withTeam(Request $request, array $data): array
    {
        $team = $request->attributes->get('active_team');

        if ($team) {
            $data['team_id'] = $team->id;
        }

        return $data;
    }

    protected function authorizeWorkspace(Request $request, $model): void
    {
        if ($model->tenant_id !== $request->user()->tenant_id) {
            abort(403);
        }

        $team = $request->attributes->get('active_team');

        if ($team && $model->team_id !== $team->id) {
            abort(403);
        }
    }

    protected function authorizeRole(Request $request, array $allowedCodes): void
    {
        $team = $request->attributes->get('active_team');

        if (! $team) {
            return;
        }

        $role = $team->userAuthorization($request->user());

        if (! in_array($role?->code, $allowedCodes)) {
            abort(403);
        }
    }

    protected function getRoleCode(Request $request): ?string
    {
        $team = $request->attributes->get('active_team');

        if (! $team) {
            return null;
        }

        return $team->userAuthorization($request->user())?->code;
    }
}
