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
        Schema::table('tenants', function (Blueprint $table) {
            $table->ulid('llm_model_id')->nullable();
            $table->foreign('llm_model_id')->references('id')->on('llm_models')->nullOnDelete();
            $table->bigInteger('credit_millicents')->default(0);
            $table->bigInteger('dollar_limit')->default(100)->after('credit_millicents');
            $table->boolean('is_low_credit')->default(false)->after('dollar_limit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropForeign(['llm_model_id']);
            $table->dropColumn(['credit_millicents', 'llm_model_id', 'dollar_limit', 'is_low_credit']);
        });
    }
};
