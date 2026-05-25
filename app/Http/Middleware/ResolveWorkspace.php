<?php

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;

class ResolveWorkspace
{
    public function handle(Request $request, Closure $next)
    {
        $slug = $request->route('slug');

        if ($slug) {
            $team = Team::where('slug', $slug)->firstOrFail();

            if (! $team->hasUser($request->user())) {
                // check prevents a user from accessing another team's workspace by guessing the slug.
                // If you navigate to /workspaces/competitor-team/dashboard, the middleware finds the team, then verifies you're a member — and returns 403 Forbidden if you're not.
                abort(403);
            }

            $request->attributes->set('active_team', $team);
        }

        return $next($request);
    }
}
