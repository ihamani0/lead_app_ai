<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('llm_models', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->string('provider');
            $table->bigInteger('input_rate_per_million_millicents');
            $table->bigInteger('output_rate_per_million_millicents');
            $table->bigInteger('cost_input_per_million_millicents');
            $table->bigInteger('cost_output_per_million_millicents');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('llm_models');
    }
};
