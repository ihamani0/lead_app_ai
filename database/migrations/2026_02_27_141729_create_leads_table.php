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
        Schema::create('leads', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');

            $table->foreignId('instance_id')->nullable()->constrained('evolution_instances');


            $table->string('name', 255);
            $table->string('phone', 30);
            $table->string('email', 255)->nullable();

            $table->string('status')->default('NEW')->index(); // NEW, IN_PROGRESS, CLOSED // new | contacted | qualified | hot | rdv | lost

            $table->enum('contact_status' ,  ['REPONDU' , "ATTENTE_REPONSE"])->default("ATTENTE_REPONSE");



                // AI Qualification Fields
            $table->string('temperature', 20)->default('COLD'); // HOT, WARM, COLD
            $table->integer('qualification_score')->default(0); // 0 to 100
            $table->text('ai_summary')->nullable(); // AI writes a summary of the chat


            // Flexible Data (Budget, Quartier, Source, etc.)
            $table->jsonb('custom_data')->nullable(); 

            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'phone']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
