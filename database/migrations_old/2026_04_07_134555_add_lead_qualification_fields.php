<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->enum('ai_qualification_status', ['NON_QUALIFIE', 'QUALIFIE'])->nullable()->after('temperature');
            $table->enum('qualification_result', ['HOT', 'WARM', 'COLD'])->nullable()->after('ai_qualification_status');
            $table->enum('treatment_status', ['TRAITE', 'NON_TRAITE'])->nullable()->after('qualification_result');
            $table->text('notes')->nullable()->after('treatment_status');
            $table->boolean('is_new')->default(true)->after('notes');
            $table->timestamp('qualified_at')->nullable()->after('is_new');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn([
                'ai_qualification_status',
                'qualification_result',
                'treatment_status',
                'notes',
                'is_new',
                'qualified_at',
            ]);
        });
    }
};
