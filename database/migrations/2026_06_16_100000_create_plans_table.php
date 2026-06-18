<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
            $table->bigInteger('dollar_limit')->nullable();
            $table->jsonb('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
