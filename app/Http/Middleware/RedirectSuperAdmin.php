<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectSuperAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && $user->isSuperAdmin() && $request->routeIs('dashboard')) {
            return redirect()->route('super-admin.dashboard');
        }

        return $next($request);
    }
}
