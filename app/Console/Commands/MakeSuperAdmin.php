<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeSuperAdmin extends Command
{
    protected $signature = 'super-admin:make 
        {identifier? : Email or User ID} 
        {--remove : Remove super admin privileges} 
        {--list : List all super admins}';

    protected $description = 'Promote or demote a user to/from super admin';

    public function handle()
    {
        if ($this->option('list')) {
            return $this->listSuperAdmins();
        }

        $identifier = $this->argument('identifier');

        if (! $identifier) {
            $this->error('Please provide a user email/ID or use --list flag.');

            return 1;
        }

        $user = $this->findUser($identifier);

        if (! $user) {
            $this->error("User not found: {$identifier}");

            return 1;
        }

        if ($this->option('remove')) {
            return $this->removeSuperAdmin($user);
        }

        return $this->makeSuperAdmin($user);
    }

    protected function findUser(string $identifier): ?User
    {
        return is_numeric($identifier)
            ? User::find($identifier)
            : User::where('email', $identifier)->first();
    }

    protected function listSuperAdmins(): int
    {
        $users = User::where('is_super_admin', true)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'created_at']);

        if ($users->isEmpty()) {
            $this->warn('No super admins found.');

            return 0;
        }

        $this->info('Super Admins:');
        $this->table(
            ['ID', 'Name', 'Email', 'Created'],
            $users->toArray()
        );

        return 0;
    }

    protected function makeSuperAdmin(User $user): int
    {
        if ($user->is_super_admin) {
            $this->warn("User {$user->email} is already a super admin.");

            return 0;
        }

        $user->is_super_admin = true;
        $user->save();

        $this->info("✅ User {$user->name} ({$user->email}) is now a super admin.");

        return 0;
    }

    protected function removeSuperAdmin(User $user): int
    {
        if (! $user->is_super_admin) {
            $this->warn("User {$user->email} is not a super admin.");

            return 0;
        }

        $user->is_super_admin = false;
        $user->save();

        $this->info("✅ Removed super admin from {$user->name} ({$user->email}).");

        return 0;
    }
}
