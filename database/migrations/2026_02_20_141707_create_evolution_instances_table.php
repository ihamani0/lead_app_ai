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
        Schema::create('evolution_instances', function (Blueprint $table) {
            $table->id();
            
            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
             

            $table->string('instance_name', 100)->unique();
            $table->string('phone_number', 30)->nullable();

            $table->string('status', 50)->default('disconnected'); // connected | connecting | disconnected
            $table->text('qr_code')->nullable();
            $table->text('webhook_url')->nullable();
            $table->jsonb('settings')->nullable();
            $table->timestamp('connected_at')->nullable();
            $table->timestamps();

            $table->index('tenant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evolution_instances');
    }
};
