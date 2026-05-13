<?php

namespace Tests\Feature;

use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TokenApiTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => 'test-tenant',
            'plan' => 'basic',
            'is_active' => true,
            'token_balance' => 10000,
        ]);
        // Create Sanctum token for N8N auth
        $this->token = $this->tenant->createToken('n8n-token')->plainTextToken;
    }

    public function test_token_status_returns_correct_data(): void
    {
        $response = $this->withToken($this->token)
            ->getJson('/api/n8n/token-status?tenant_slug=test-tenant');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'has_sufficient_tokens',
                'balance',
                'is_low_balance',
                'threshold',
            ]);
    }

    public function test_token_usage_deducts_balance(): void
    {
        $initialBalance = $this->tenant->token_balance;

        $response = $this->withToken($this->token)
            ->postJson('/api/n8n/token-usage', [
                'tenant_slug' => 'test-tenant',
                'total_tokens' => 500,
                'input_tokens' => 300,
                'output_tokens' => 200,
                'reference_type' => 'n8n_workflow',
                'reference_id' => 'wflow_123',
            ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);

        $this->tenant->refresh();
        $this->assertEquals($initialBalance - 500, $this->tenant->token_balance);
    }

    public function test_token_usage_insufficient_tokens_returns_402(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/n8n/token-usage', [
                'tenant_slug' => 'test-tenant',
                'total_tokens' => 15000, // More than balance
            ]);

        $response->assertStatus(402)
            ->assertJson(['error' => 'Insufficient tokens']);
    }

    public function test_token_status_returns_false_for_low_balance(): void
    {
        // Set balance below threshold
        $this->tenant->update(['token_balance' => 1000]);
        $this->tenant->refresh();

        $response = $this->withToken($this->token)
            ->getJson('/api/n8n/token-status?tenant_slug=test-tenant');

        $response->assertStatus(200)
            ->assertJson([
                'has_sufficient_tokens' => false,
                'is_low_balance' => true,
            ]);
    }
}
