<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Mail\TeamInvitationMail;
use App\Models\Invitation;
use App\Models\Team;
use App\Models\Tenant;
use App\Models\User;
use App\Services\TeamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class TeamInvitationController extends Controller
{
    protected $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index(Request $request, $teamId)
    {
        $team = Team::findOrFail($teamId);
        $invitations = $team->invitations()
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->get();

        return inertia('Teams/Invitations', [
            'invitations' => $invitations,
        ]);
    }

    public function store(Request $request, $teamId)
    {

        $request->validate([
            'email' => 'required|email',
            'role_id' => 'required|exists:team_roles,id',
        ]);

        $team = Team::findOrFail($teamId);

        $email = $request->email;

        // Check if user already exists in system
        $existingUser = User::where('email', $email)->first();

        // Scenario 1: User exists in SAME tenant → add directly
        if ($existingUser && $existingUser->tenant_id === $team->tenant_id) {

            if ($team->hasUser($existingUser)) {
                return back()->with('error', __('messages.error.user_already_member'));
            }

            $team->addUser($existingUser, $request->role_id);

            return back()->with('success', __('messages.success.user_added_to_team'));
        }

        // Scenario 2: User exists in DIFFERENT tenant → reject
        if ($existingUser) {
            return back()->with('error', __('messages.error.user_belongs_to_another_organization'));
        }

        // Scenario 3: New user → create invitation
        $invitation = $team->invitations()->create([
            'email' => $email,
            'role_id' => $request->role_id,
            'token' => Str::random(64),
            'expires_at' => now()->addDays(7),
        ]);

        // Send invitation email (Mailable)
        Mail::to($email)->send(new TeamInvitationMail($invitation));

        return back()->with('success', __('messages.success.invitation_sent'));
    }

    /**
     * Cancel/Delete invitation
     */
    public function destroy(Request $request, $teamId, $invitationId)
    {
        $team = Team::findOrFail($teamId);
        $invitation = $team->invitations()->findOrFail($invitationId);
        $invitation->delete();

        return back()->with('success', __('messages.success.invitation_removed'));
    }

    public function accept(Invitation $invitation)
    {

        $team = $invitation->team;
        $roleCode = $invitation->role->code;

        // If logged in, add to team directly
        if (Auth::check()) {

            $user = Auth::user();
            // Check if same tenant
            if ($user->tenant_id !== $team->tenant_id) {
                return redirect()->route('login')
                    ->with('error', 'You belong to different organization');
            }

            $team->addUser($user, $roleCode);

            $invitation->update(['accepted_at' => now()]);

            // return redirect()->route('teams.show', $team->id)
            //     ->with('success', 'You joined the team!');
            return redirect()->route('dashboard')
                ->with('success', 'You joined the team!');
        }

        // If not logged in, redirect to register with token
        return redirect()->route('register', ['invitation' => $invitation->token]);
    }
}
