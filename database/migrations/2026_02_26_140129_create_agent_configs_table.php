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
        Schema::create('agent_configs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->cascadeOnDelete();

            // Link to the WhatsApp Instance
            // (If the instance is deleted, the bot config is deleted)
            $table->foreignId('evolution_instance_id')->constrained()->cascadeOnDelete();
            $table->string('instance_name')->unique();

            // 2. Connection Settings
            $table->boolean('is_active')->default(false); // Can toggle bot on/off
            $table->string('webhook_url')->nullable(); // Where Evolution sends messages

            // where laravel post the system pompte to n8n
            $table->string('config_webhook_url')->nullable();

            // 3. Provider Settings (Future Proofing)
            $table->string('provider')->default('n8n');  // 'n8n', 'typebot', 'dify'
            $table->string('provider_id')->nullable(); // e.g., n8n workflow ID (for later)

            // Evolution API returns this when you connect the bot.
            // WE NEED THIS to disconnect the bot later via API!
            $table->string('evo_integration_id')->nullable();

            // 4. AI Brain
            $table->text('system_prompt')->nullable();

            // 5. Evolution Specific Settings (delayMessage, keywordFinish, etc.)
            $table->jsonb('settings')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_configs');
    }
};
