<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenRouterController extends Controller
{
    public function fetchCredits()
    {
        $apiKey = config('services.openrouter.api_key');

        if (! $apiKey) {
            return response()->json([
                'error' => 'OpenRouter API key not configured',
            ], 422);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$apiKey,
            ])->get('https://openrouter.ai/api/v1/credits');

            if ($response->failed()) {
                Log::error('OpenRouter API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'error' => 'Failed to fetch credits from OpenRouter',
                ], $response->status());
            }

            $data = $response->json();

            return response()->json([
                'total_credits' => $data['data']['total_credits'] ?? 0,
                'total_usage' => $data['data']['total_usage'] ?? 0,
            ]);
        } catch (\Exception $e) {
            Log::error('OpenRouter exception', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
