<?php

namespace Tests\Unit;

use App\Models\LlmModel;
use App\Models\Tenant;
use App\Models\TokenTransactionDaily;
use App\Services\TokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TokenServiceTest extends TestCase
{
    use RefreshDatabase;

    private TokenService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TokenService;

        $this->tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => 'test-tenant',
            'plan' => 'basic',
            'is_active' => true,
            'credit_millicents' => 100_000_00, // $100 in millicents
            'dollar_limit' => 10_000, // $10 in millicents
        ]);

        LlmModel::create([
            'name' => 'deepseek',
            'display_name' => 'DeepSeek',
            'provider' => 'deepseek',
            'input_rate_per_million_millicents' => 24000,
            'output_rate_per_million_millicents' => 38000,
            'cost_input_per_million_millicents' => 14000,
            'cost_output_per_million_millicents' => 28000,
            'is_active' => true,
        ]);
    }

    public function test_deduct_usage_reduces_credit_and_logs_transaction(): void
    {
        $initialCredit = (int) $this->tenant->credit_millicents;
        $input = 1000000;
        $output = 500000;

        $this->service->deductUsage($this->tenant, $input, $output);

        $this->tenant->refresh();
        // Cost: 1M * 24000/1M = 24000 + 500K * 38000/1M = 19000 = 43000 millicents
        $expectedDeduction = 43000;
        $this->assertEquals($initialCredit - $expectedDeduction, (int) $this->tenant->credit_millicents);

        $this->assertDatabaseHas('token_transactions', [
            'tenant_id' => $this->tenant->id,
            'type' => 'deduction',
            'input_tokens' => $input,
            'output_tokens' => $output,
            'total_tokens' => $input + $output,
        ]);

        $this->assertDatabaseHas('token_transactions_daily', [
            'tenant_id' => $this->tenant->id,
            'total_tokens_used' => $input + $output,
            'input_tokens_used' => $input,
            'output_tokens_used' => $output,
            'transaction_count' => 1,
        ]);
    }

    public function test_add_dollars_increases_credit_and_logs_recharge(): void
    {
        $initialCredit = (int) $this->tenant->credit_millicents;
        $dollarsToAdd = 50.00;

        $this->service->addDollars($this->tenant, $dollarsToAdd, 'Test Recharge');

        $this->tenant->refresh();
        // $50 = 50 * 100 * 1000 = 5,000,000 millicents
        $this->assertEquals($initialCredit + 5_000_000, (int) $this->tenant->credit_millicents);

        $this->assertDatabaseHas('token_transactions', [
            'tenant_id' => $this->tenant->id,
            'type' => 'recharge',
            'total_cost_millicents' => 5_000_000,
        ]);

        $daily = TokenTransactionDaily::where('tenant_id', $this->tenant->id)->first();
        $this->assertEquals(0, $daily->total_tokens_used);
        $this->assertEquals(1, $daily->transaction_count);
    }

    public function test_insufficient_credit_throws_exception(): void
    {
        $this->tenant->update(['credit_millicents' => 1000]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient credit');

        // Cost: 2M * 24000/1M + 1M * 38000/1M = 48000 + 38000 = 86000 millicents
        $this->service->deductUsage($this->tenant, 2000000, 1000000);
    }
}
