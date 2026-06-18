<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignUlid('agent_config_id')
                ->nullable()
                ->constrained('agent_configs')
                ->cascadeOnDelete();

            $table->string('category', 100)->index(); // 'pool', 'facade', 'apartment_f4'
            $table->string('type', 20); // 'image', 'video', 'document'
            $table->text('external_url')->nullable();
            $table->text('caption')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
