<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Google authentication failed. Please try again.',
            ]);
        }

        $user = User::where('google_id', $googleUser->id)->first();

        if (! $user) {
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                $user->update([
                    'google_id' => $googleUser->id,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
            }
        }

        if (! $user) {
            $tenant = Tenant::create([
                'name' => $googleUser->name,
                'slug' => Str::slug($googleUser->name).'-'.Str::random(4),
                'plan' => 'starter',
                'is_active' => true,
                'settings' => [],
            ]);

            $user = User::create([
                'tenant_id' => $tenant->id,
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'email_verified_at' => now(),
                'google_id' => $googleUser->id,
                'password' => Str::random(32),
            ]);
        }

        $user->update([
            'google_token' => $googleUser->token,
            'google_refresh_token' => $googleUser->refreshToken,
            'email_verified_at' => $user->email_verified_at ?? now(),
        ]);

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
