<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('plans')) {
            Schema::create('plans', function (Blueprint $table) {
                $table->id();
                $table->string('slug', 50)->unique();
                $table->string('name');
                $table->text('description')->nullable();
                $table->bigInteger('price_millicents')->default(0);
                $table->integer('max_teams')->nullable();
                $table->integer('max_members')->nullable();
                $table->integer('max_leads')->nullable();
                $table->integer('max_agents')->nullable();
                $table->integer('max_instances')->nullable();
                $table->integer('max_storage_mb')->nullable();
                $table->bigInteger('dollar_limit')->nullable();
                $table->jsonb('features')->nullable();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_default')->default(false);
                $table->timestamps();
            });

            return;
        }

        Schema::table('plans', function (Blueprint $table) {
            if (! Schema::hasColumn('plans', 'max_storage_mb')) {
                $table->integer('max_storage_mb')->nullable();
            }

            if (! Schema::hasColumn('plans', 'is_default')) {
                $table->boolean('is_default')->default(false);
            }
        });
    }
};
