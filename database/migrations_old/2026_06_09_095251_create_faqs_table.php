<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {

            $table->id();
            $table->foreignUlid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('agent_config_id')->constrained('agent_configs')->cascadeOnDelete();
            $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
            $table->text('question');
            $table->text('answer')->nullable();
            $table->string('category', 100)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_suggestion')->default(false);
            $table->unsignedInteger('usage_count')->default(0);
            $table->json('suggestion_data')->nullable(); // {confidence, source_count}
            $table->timestamps();
            $table->index(['agent_config_id', 'is_active']);
            $table->index(['agent_config_id', 'is_suggestion']);

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
