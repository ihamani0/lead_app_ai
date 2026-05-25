<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Team;
use App\Models\User;
use App\Services\TeamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamInvitationController extends Controller
{
    protected $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function destroy(Request $request, string $slug, Invitation $invitation)
    {
        $team = Team::where('slug', $slug)->firstOrFail();

        if (! $team->hasUser($request->user())) {
            abort(403);
        }

        $role = $team->userAuthorization($request->user());

        if (! in_array($role?->code, ['owner', 'admin'])) {
            abort(403);
        }

        if ($invitation->team_id !== $team->id) {
            abort(403);
        }

        $invitation->delete();

        return back()->with('success', __('messages.success.invitation_removed'));
    }

    public function accept(Request $request, Invitation $invitation)
    {
        $team = $invitation->team;

        if (Auth::check()) {
            try {
                $team->inviteAccept($invitation->id);
            } catch (\RuntimeException $e) {
                return redirect()->route('teams.index')
                    ->with('info', __('messages.error.invitation_accept_failed', ['message' => $e->getMessage()]));
            }

            return redirect()->route('teams.show', $team->slug)
                ->with('success', __('messages.success.joined_team'));
        }

        // Not logged in — check if a user with this email already exists
        if (User::where('email', $invitation->email)->exists()) {
            session()->put('invitation_id', $invitation->id);

            return redirect()->route('login');
        }

        return redirect()->route('register', ['invitation' => $invitation->id]);
    }
}
