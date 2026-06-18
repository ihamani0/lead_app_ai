<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('agent_system_prompt_history');

        Schema::table('agent_configs', function (Blueprint $table) {
            $table->dropColumn(['system_prompt', 'default_system_prompt', 'system_prompt_hash']);
        });
    }

    public function down(): void
    {
        Schema::table('agent_configs', function (Blueprint $table) {
            $table->text('system_prompt')->nullable();
            $table->text('default_system_prompt')->nullable();
            $table->string('system_prompt_hash', 32)->nullable();
        });

        Schema::create('agent_system_prompt_history', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('agent_config_id')->constrained('agent_configs')->cascadeOnDelete();
            $table->text('system_prompt');
            $table->integer('version');
            $table->string('description', 500)->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['agent_config_id', 'version']);
            $table->index(['agent_config_id', 'created_at']);
        });
    }
};
