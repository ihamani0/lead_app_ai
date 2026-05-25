<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Team;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Jurager\Teams\Support\Facades\Teams;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        // Check if there's an invitation id
        $invitationId = request()->query('invitation');

        if ($invitationId) {
            $invitationModel = Teams::model('invitation');
            $invitation = $invitationModel::find($invitationId);

            if ($invitation) {
                if (User::where('email', $input['email'])->exists()) {
                    throw ValidationException::withMessages([
                        'email' => __('messages.error.user_exist'),
                    ]);
                }

                $invitingTeam = $invitation->team;

                $userTenant = Tenant::create([
                    'name' => $input['name'],
                    'slug' => Str::slug($input['name']),
                    'plan' => 'starter',
                    'is_active' => true,
                    'settings' => [],
                ]);

                $user = User::create([
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'password' => $input['password'],
                    'tenant_id' => $userTenant->id,
                    'email_verified_at' => now(),
                    'has_password' => true,
                ]);

                try {
                    $invitingTeam->addUser($user, $invitation->role_id);
                    $invitation->delete();
                } catch (\RuntimeException $e) {
                    // User already belongs to team, ignore
                }

                return $user;
            }
        }

        $newTenant = Tenant::create([
            'name' => $input['name'],
            'slug' => Str::slug($input['name']),
            'plan' => 'starter',
            'is_active' => true,
            'settings' => [],
        ]);

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'tenant_id' => $newTenant->id,
            'has_password' => true,
        ]);

        return $user;
    }
}
