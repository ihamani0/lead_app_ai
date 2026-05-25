<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Jurager\Teams\Support\Facades\Teams;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        if ($request->has('invitation')) {
            session(['invitation_id' => $request->invitation]);
        }

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
                'has_password' => false,
            ]);
        }

        $user->update([
            'google_token' => $googleUser->token,
            'google_refresh_token' => $googleUser->refreshToken,
            'email_verified_at' => $user->email_verified_at ?? now(),
        ]);

        Auth::login($user);

        $this->acceptPendingInvitation($user);

        return redirect()->intended(route('teams.index'));
    }

    private function acceptPendingInvitation(User $user): void
    {
        if (! session('invitation_id')) {
            return;
        }

        $invitationModel = Teams::model('invitation');
        $invitation = $invitationModel::find(session('invitation_id'));

        if ($invitation) {
            try {
                $invitation->team->addUser($user, $invitation->role_id);
                $invitation->delete();
            } catch (\RuntimeException $e) {
                // Already a member, ignore
            }
        }

        session()->forget('invitation_id');
    }
}
