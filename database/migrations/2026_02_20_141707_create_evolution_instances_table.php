<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evolution_instances', function (Blueprint $table) {
            $table->id();

            $table->foreignUlid('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();

            $table->string('instance_name', 100)->unique();
            $table->string('display_name', 100)->nullable();
            $table->string('phone_number', 30)->nullable();

            $table->string('status', 50)->default('disconnected'); // connected | connecting | disconnected

            $table->text('qr_code')->nullable();
            $table->text('webhook_url')->nullable();
            $table->string('api_token', 100)->nullable();
            $table->string('uuid', 100)->nullable();
            $table->jsonb('settings')->nullable();

            $table->softDeletes();

            $table->timestamp('connected_at')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'instance_name']);
            $table->index('tenant_id');
            $table->index(['uuid', 'api_token']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evolution_instances');
    }
};
