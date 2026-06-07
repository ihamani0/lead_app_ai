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
        Schema::table('evolution_instances', function (Blueprint $table) {
            $table->string('api_token', 100)->nullable()->after('webhook_url');
            $table->string('uuid', 100)->nullable()->after('api_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('evolution_instances', function (Blueprint $table) {
            $table->dropColumn('api_token');
            $table->dropColumn('uuid');
        });
    }
};
