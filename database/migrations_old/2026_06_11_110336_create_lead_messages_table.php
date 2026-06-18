<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('lead_id')->constrained()->cascadeOnDelete();
            $table->string('remote_id')->nullable()->index();
            $table->string('direction');
            $table->text('content')->nullable();
            $table->string('type')->default('text');
            $table->string('status')->default('sent');
            $table->string('sender_type', 20)->default('lead');

            $table->jsonb('metadata')->nullable();
            $table->timestamps();

            $table->index(['lead_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_messages');
    }
};
