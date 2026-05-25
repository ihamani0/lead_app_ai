<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class AccountSettingsController extends Controller
{
    /**
     * Show the account settings page with all sections.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/account', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'requiresCurrentPassword' => $user?->hasPassword() ?? true,
            'twoFactorEnabled' => $user?->hasEnabledTwoFactorAuthentication() ?? false,
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
        ]);
    }
}
