<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();

            $table->foreignId('instance_id')
                ->nullable()
                ->constrained('evolution_instances')
                ->onDelete('restrict');

            $table->string('name', 255);
            $table->string('phone', 30);
            $table->string('email', 255)->nullable();

            $table->string('status')->default('NEW')->index(); // NEW, IN_PROGRESS, CLOSED
            $table->enum('contact_status', ['REPONDU', 'ATTENTE_REPONSE'])->default('ATTENTE_REPONSE');

            // AI Qualification Fields
            $table->string('temperature', 20)->default('COLD'); // HOT, WARM, COLD
            $table->enum('ai_qualification_status', ['NON_QUALIFIE', 'QUALIFIE'])->nullable();
            $table->enum('qualification_result', ['HOT', 'WARM', 'COLD'])->nullable();
            $table->enum('treatment_status', ['TRAITE', 'NON_TRAITE'])->nullable();
            $table->integer('qualification_score')->default(0); // 0 to 100
            $table->text('ai_summary')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_new')->default(true);

            $table->timestamp('qualified_at')->nullable();
            $table->timestamp('last_qualification_attempt_at')->nullable();

            // Flag fields
            $table->timestamp('flagged_at')->nullable();
            $table->text('flag_reason')->nullable();
            $table->string('flag_severity')->nullable();

            // Flexible Data (Budget, Quartier, Source, etc.)
            $table->jsonb('custom_data')->nullable();
            $table->json('recent_messages')->nullable();

            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'phone']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
