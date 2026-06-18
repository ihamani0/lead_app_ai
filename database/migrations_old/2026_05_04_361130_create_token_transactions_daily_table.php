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
        Schema::create('token_transactions_daily', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('instance_id')->nullable()->constrained('evolution_instances')->nullOnDelete();

            $table->ulid('llm_model_id')->nullable()->after('instance_id');
            $table->foreign('llm_model_id')->references('id')->on('llm_models')->nullOnDelete();

            $table->date('date');

            $table->integer('input_tokens_used')->default(0);
            $table->integer('output_tokens_used')->default(0);
            $table->integer('total_tokens_used')->default(0);

            $table->integer('input_cost_millicents')->default(0);
            $table->integer('output_cost_millicents')->default(0);
            $table->integer('total_cost_millicents')->default(0);

            $table->integer('millicents_recharged')->default(0);
            $table->integer('transaction_count')->default(0);

            $table->timestamps();
            $table->unique(['tenant_id', 'instance_id', 'date']);
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('token_transactions_daily');
    }
};
