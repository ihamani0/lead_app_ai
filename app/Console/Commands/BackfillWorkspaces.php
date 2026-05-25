<?php

namespace App\Console\Commands;

use App\Models\Team;
use App\Models\User;
use App\Services\TeamService;
use Illuminate\Console\Command;

class BackfillWorkspaces extends Command
{
    protected $signature = 'teams:backfill';

    protected $description = 'Create a default workspace for existing users who do not own one';

    public function handle(TeamService $teamService): void
    {
        $users = User::all();
        $created = 0;
        $skipped = 0;

        foreach ($users as $user) {
            if ($user->ownedTeams()->exists()) {
                $this->warn("Skipped {$user->email} — already owns a workspace.");
                $skipped++;

                continue;
            }

            $team = Team::create([
                'user_id' => $user->id,
                'name' => "{$user->name}'s workspace",
                'description' => "Personal workspace for {$user->name}",
            ]);

            $teamService->createDefaultRoles($team);

            $this->info("Created workspace '{$team->name}' for {$user->email}");
            $created++;
        }

        $this->newLine();
        $this->info("Done! {$created} created, {$skipped} skipped.");
    }
}
