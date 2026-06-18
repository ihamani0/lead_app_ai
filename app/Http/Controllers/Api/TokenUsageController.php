<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TokenService;
use Illuminate\Http\Request;

class TokenUsageController extends Controller
{
    public function store(Request $request, TokenService $tokenService)
    {
        $validated = $request->validate([
            'agent_config_id' => 'required|string|exists:agent_configs,id',
            'total_tokens' => 'sometimes|integer|min:1',
            'input_tokens' => 'required|integer|min:0',
            'output_tokens' => 'required|integer|min:0',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|string',
        ]);

        try {
            $tokenService->deductUsage(
                $validated['agent_config_id'],
                $validated['input_tokens'],
                $validated['output_tokens'],
                [
                    'reference_type' => $validated['reference_type'] ?? 'n8n_workflow',
                    'reference_id' => $validated['reference_id'] ?? null,
                ]
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() , 'code' => $e->getCode(), 'line'=> $e->getLine()]);
        }

        return response()->json(['status' => 'success']);
    }
}
