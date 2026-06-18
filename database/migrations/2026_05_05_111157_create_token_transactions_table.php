<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('token_transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignId('instance_id')->nullable()->constrained('evolution_instances')->nullOnDelete();

            $table->ulid('llm_model_id')->nullable();
            $table->foreign('llm_model_id')->references('id')->on('llm_models')->nullOnDelete();

            $table->foreignUlid('agent_config_id')->nullable()->constrained('agent_configs')->nullOnDelete();

            $table->date('date')->index();
            $table->integer('input_tokens')->default(0);
            $table->integer('output_tokens')->default(0);
            $table->integer('total_tokens')->default(0);

            $table->integer('input_cost_millicents')->default(0);
            $table->integer('output_cost_millicents')->default(0);
            $table->integer('total_cost_millicents')->default(0);

            $table->string('type'); // deduction or recharge
            $table->string('reference_type')->nullable();
            $table->string('reference_id')->nullable();

            $table->timestamps();

            $table->index(['tenant_id', 'date']);
            $table->index(['instance_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('token_transactions');
    }
};
