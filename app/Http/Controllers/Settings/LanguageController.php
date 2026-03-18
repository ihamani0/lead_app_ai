<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class LanguageController extends Controller
{
    public function update(Request $request)
    {

        
        $validated = $request->validate([
            'locale' => 'required|string|in:en,fr',
        ]);

        $tenant = Auth::user()->tenant;

        if (! $tenant) {
            return back()->with('error', 'Tenant not found.');
        }

        $settings = $tenant->settings ?? [];
        $settings['locale'] = $validated['locale'];
        $tenant->settings = $settings;
        $tenant->save();

        app()->setLocale($validated['locale']);

        Cache::forget("translations.{$validated['locale']}.version");
        Cache::forget("translations.{$validated['locale']}");

        return back();
    }
}
