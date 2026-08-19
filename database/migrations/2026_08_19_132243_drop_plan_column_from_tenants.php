<?php

use App\Models\Plan;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('tenants', 'plan')) {
            return;
        }

        $planIds = [
            'free' => Plan::where('slug', 'free')->value('id'),
            'pro' => Plan::where('slug', 'pro')->value('id'),
            'enterprise' => Plan::where('slug', 'enterprise')->value('id'),
        ];

        foreach (['starter' => 'free', 'pro' => 'pro', 'enterprise' => 'enterprise'] as $legacy => $current) {
            DB::table('tenants')
                ->whereNull('plan_id')
                ->where('plan', $legacy)
                ->update(['plan_id' => $planIds[$current] ?? null]);
        }

        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn('plan');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('tenants', 'plan')) {
            Schema::table('tenants', function (Blueprint $table) {
                $table->string('plan', 50)->nullable();
            });
        }
    }
};
