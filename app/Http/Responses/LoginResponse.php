<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if (session('invitation_id')) {
            $invitationId = session('invitation_id');
            session()->forget('invitation_id');

            return redirect()->route('teams.invitations.accept', ['invitation' => $invitationId]);
        }

        return redirect()->intended(config('fortify.home'));
    }
}
