<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvolutionInstance;
use App\Models\Tenant;
use App\Services\TokenService;
use Illuminate\Http\Request;

class TokenUsageController extends Controller
{
    public function store(Request $request, TokenService $tokenService)
    {
        $validated = $request->validate([
            'instance_name' => 'required|string',
            'tenant_slug' => 'sometimes|string',
            'total_tokens' => 'sometimes|integer|min:1',
            'input_tokens' => 'required|integer|min:0',
            'output_tokens' => 'required|integer|min:0',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|string',
        ]);

        $instance = EvolutionInstance::where('instance_name', $validated['instance_name'])->firstOrFail();
        $tenant = Tenant::findOrFail($instance->tenant_id);

        $totalTokens = $validated['total_tokens'] ?? ($validated['input_tokens'] + $validated['output_tokens']);

        try {
            $tokenService->deductUsage(
                $tenant,
                $validated['input_tokens'],
                $validated['output_tokens'],
                [
                    'reference_type' => $validated['reference_type'] ?? 'n8n_workflow',
                    'reference_id' => $validated['reference_id'] ?? null,
                ],
                $instance->id
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 402);
        }

        return response()->json(['status' => 'success']);
    }
}
