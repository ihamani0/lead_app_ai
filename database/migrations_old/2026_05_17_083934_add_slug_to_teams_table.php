<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn(Config::get('teams.tables.teams', 'teams'), 'slug')) {
            Schema::table(Config::get('teams.tables.teams', 'teams'), function (Blueprint $table) {
                $table->string('slug')->nullable()->unique()->after('name');
            });
        }
    }

    public function down(): void
    {
        Schema::table(Config::get('teams.tables.teams', 'teams'), function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
