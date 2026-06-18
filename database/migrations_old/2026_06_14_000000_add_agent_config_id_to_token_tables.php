<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('token_transactions', function (Blueprint $table) {
            $table->foreignUlid('agent_config_id')->nullable()->constrained('agent_configs')->nullOnDelete();
        });

        Schema::table('token_transactions_daily', function (Blueprint $table) {
            $table->foreignUlid('agent_config_id')->nullable()->constrained('agent_configs')->nullOnDelete();
            $table->dropUnique(['tenant_id', 'instance_id', 'date']);
            $table->unique(['tenant_id', 'agent_config_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::table('token_transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('agent_config_id');
        });

        Schema::table('token_transactions_daily', function (Blueprint $table) {
            $table->dropUnique(['tenant_id', 'agent_config_id', 'date']);
            $table->dropConstrainedForeignId('agent_config_id');
            $table->unique(['tenant_id', 'instance_id', 'date']);
        });
    }
};
