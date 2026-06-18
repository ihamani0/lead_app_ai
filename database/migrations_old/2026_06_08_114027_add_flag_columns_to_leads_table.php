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
        Schema::table('leads', function (Blueprint $table) {
            $table->timestamp('flagged_at')->nullable()->after('last_qualification_attempt_at');
            $table->text('flag_reason')->nullable()->after('flagged_at');
            $table->string('flag_severity')->nullable()->after('flag_reason');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['flagged_at', 'flag_reason', 'flag_severity']);
        });
    }
};
