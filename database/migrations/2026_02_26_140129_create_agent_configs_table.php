<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_configs', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();

            $table->string('name')->nullable();

            // Link to the WhatsApp Instance
            $table->foreignId('evolution_instance_id')->nullable()->constrained()->nullOnDelete();

            // Connection Settings
            $table->boolean('is_active')->default(false);
            $table->string('webhook_url')->nullable();

            // Provider Settings
            $table->string('provider')->default('n8n'); // 'n8n', 'typebot', 'dify'
            $table->string('provider_id')->nullable();

            // Evolution API integration ID (needed to disconnect the bot via API)
            $table->string('evo_integration_id')->nullable();

            // Evolution Specific Settings (delayMessage, keywordFinish, etc.)
            $table->jsonb('settings')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_configs');
    }
};
