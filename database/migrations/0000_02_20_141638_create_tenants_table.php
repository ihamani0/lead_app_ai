<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name', 255);
            $table->string('slug', 100)->unique();
            $table->string('plan', 50)->default('starter'); // starter | pro | enterprise
            $table->boolean('is_active')->default(true);
            $table->jsonb('settings')->nullable();

            // owner — nullable FK; no constraint because tenants runs before users in timestamp order
            $table->foreignId('owner_id')->nullable()->index();

            // token / billing fields
            // llm_model_id — nullable FK; no constraint because tenants runs before llm_models
            $table->ulid('llm_model_id')->nullable()->index();
            // Cached balance — source of truth is sum(token_transactions)
            $table->bigInteger('credit_millicents')->default(0);
            // Per-tenant credit limit (config, not balance)
            $table->bigInteger('dollar_limit')->default(100);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
