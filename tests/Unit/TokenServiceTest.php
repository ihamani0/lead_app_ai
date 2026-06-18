<?php

namespace Tests\Unit;

use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\LlmModel;
use App\Models\Tenant;
use App\Models\TokenTransaction;
use App\Models\TokenTransactionDaily;
use App\Services\TokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TokenServiceTest extends TestCase
{
    use RefreshDatabase;

    private TokenService $service;

    private Tenant $tenant;

    private AgentConfig $agentConfig;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TokenService;

        $this->tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => 'test-tenant',
            'plan' => 'basic',
            'is_active' => true,
            'credit_millicents' => 100_000_00,
            'dollar_limit' => 10_000,
        ]);

        $model = LlmModel::create([
            'name' => 'deepseek',
            'display_name' => 'DeepSeek',
            'provider' => 'deepseek',
            'input_rate_per_million_millicents' => 24000,
            'output_rate_per_million_millicents' => 38000,
            'cost_input_per_million_millicents' => 14000,
            'cost_output_per_million_millicents' => 28000,
            'is_active' => true,
        ]);

        $this->tenant->update(['llm_model_id' => $model->id]);

        $instance = EvolutionInstance::create([
            'tenant_id' => $this->tenant->id,
            'instance_name' => 'test-instance',
            'phone_number' => '+1234567890',
            'status' => 'connected',
        ]);

        $this->agentConfig = AgentConfig::create([
            'tenant_id' => $this->tenant->id,
            'evolution_instance_id' => $instance->id,
            'name' => 'Test Agent',
            'is_active' => true,
            'provider' => 'n8n',
        ]);
    }

    public function test_deduct_usage_reduces_credit_and_logs_transaction(): void
    {
        $initialCredit = (int) $this->tenant->credit_millicents;
        $input = 1000000;
        $output = 500000;

        $this->service->deductUsage($this->agentConfig->id, $input, $output);

        $this->tenant->refresh();
        $expectedDeduction = 43000;
        $this->assertEquals($initialCredit - $expectedDeduction, (int) $this->tenant->credit_millicents);

        $this->assertDatabaseHas('token_transactions', [
            'tenant_id' => $this->tenant->id,
            'agent_config_id' => $this->agentConfig->id,
            'type' => 'deduction',
            'input_tokens' => $input,
            'output_tokens' => $output,
            'total_tokens' => $input + $output,
        ]);

        $this->assertDatabaseHas('token_transactions_daily', [
            'tenant_id' => $this->tenant->id,
            'agent_config_id' => $this->agentConfig->id,
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

        $this->service->deductUsage($this->agentConfig->id, 2000000, 1000000);
    }

    public function test_deduct_usage_stores_agent_config_id(): void
    {
        $this->service->deductUsage($this->agentConfig->id, 100, 50);

        $transaction = TokenTransaction::where('agent_config_id', $this->agentConfig->id)->first();
        $this->assertNotNull($transaction);
        $this->assertEquals($this->agentConfig->id, $transaction->agent_config_id);

        $daily = TokenTransactionDaily::where('agent_config_id', $this->agentConfig->id)->first();
        $this->assertNotNull($daily);
        $this->assertEquals($this->agentConfig->id, $daily->agent_config_id);
    }
}
