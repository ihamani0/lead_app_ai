<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = 'en';

        if (Auth::check() && Auth::user()->tenant) {
            $settings = Auth::user()->tenant->settings ?? [];
            $locale = $settings['locale'] ?? 'en';
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
