<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('agent_system_prompt_history', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('agent_config_id')->constrained('agent_configs')->cascadeOnDelete();
            $table->text('system_prompt');
            $table->integer('version');
            $table->string('description', 500)->nullable();
            $table->timestamps();

            $table->unique(['agent_config_id', 'version']);
            $table->index(['agent_config_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_system_prompt_history');
    }
};
