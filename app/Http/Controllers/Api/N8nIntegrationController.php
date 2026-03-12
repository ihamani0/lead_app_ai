<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class N8nIntegrationController extends Controller
{
    private function getTenantId($instanceName)
    {
        return EvolutionInstance::where('instance_name', $instanceName)->value('tenant_id');
    }

    // 1. AI TOOL: Update CRM (Qualification)
    public function updateLead(Request $request)
    {
        // n8n sends: { "instance": "...", "phone": "...", "temperature": "HOT", "score": 85, "summary": "Wants a pool" }
        $tenantId = $this->getTenantId($request->instance);

        $lead = Lead::where('tenant_id', $tenantId)->where('phone', $request->phone)->first();

        if ($lead) {
            $lead->update([
                'temperature' => $request->temperature ?? $lead->temperature,
                'qualification_score' => $request->score ?? $lead->qualification_score,
                'ai_summary' => $request->summary ?? $lead->ai_summary,
                'status' => 'IN_PROGRESS',
            ]);

            // Example of merging custom data (e.g., budget extracted by AI)
            if ($request->has('custom_data')) {
                $custom = $lead->custom_data ?? [];
                $custom = [...$custom, ...$request->custom_data];
                $lead->update(['custom_data' => $custom]);
            }
        }

        return response()->json(['status' => 'success']);
    }

    // 2. AI TOOL: Fetch Media
    public function getMedia(Request $request)
    {
        Log::info('request media', $request->all());
        // n8n sends: { "instance": "...", "category": "pool" }

        // Defensive: unwrap if AI sent {"category": "..."} as string
        $categoryRaw = $request->category;

        if (is_string($categoryRaw)) {
            $decoded = json_decode($categoryRaw, true);
            $category = is_array($decoded) && isset($decoded['category'])
                ? $decoded['category']
                : $categoryRaw;
        } else {
            $category = $categoryRaw;
        }

        $tenantId = $this->getTenantId($request->instance);

        $assets = MediaAsset::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->where('category', $category)  // ✅ always clean value
            ->get();

        $formattedAssets = $assets->map(fn ($asset) => [
            'type' => $asset->type,
            'url' => $asset->resolved_url,
            'caption' => $asset->caption,
        ]);

        Log::info('category resolved', ['raw' => $request->category, 'clean' => $category]);
        Log::info('tenant found', ['tenant_id' => $tenantId]);
        Log::info('assets count', ['count' => $assets->count()]);

        return response()->json(['assets' => $formattedAssets]);
    }
}
