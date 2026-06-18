<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_conversations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('agent_config_id')->constrained()->cascadeOnDelete();
            $table->json('messages')->default('[]');
            $table->timestamps();

            $table->unique('agent_config_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_conversations');
    }
};
