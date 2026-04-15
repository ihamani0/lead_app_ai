<?php

namespace App\Http\Controllers\Api;

use App\Events\QulificationUpdate;
use App\Http\Controllers\Controller;
use App\Models\EvolutionInstance;
use App\Models\KnowledgeBase;
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
        Log::info('request updateLead', $request->all());

        $request->validate([
            'instance' => 'required',
            'phone' => 'required',
        ]);
        $tenantId = $this->getTenantId($request->instance);

        $lead = Lead::where('tenant_id', $tenantId)->where('phone', $request->phone)->first();

        if (! $lead) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lead not found',
            ], 404);
        }

        // 0-10
        $score = $request->qualification_score ?? $lead->qualification_score;

        $data = [
            'qualification_result' => $request->qualification_result ?? $lead->qualification_result,
            'qualification_score' => $score,
            'ai_summary' => $request->ai_summary ?? $lead->ai_summary,
            'ai_qualification_status' => $request->ai_qualification_status ?? $lead->ai_qualification_status,
            'is_new' => false,
            'qualified_at' => now(),
        ];

        if ($request->has('custom_data')) {
            $custom = is_array($lead->custom_data)
                ? $lead->custom_data
                : json_decode($lead->custom_data ?? '[]', true);

            $data['custom_data'] = array_merge($custom, $request->custom_data);
        }

        $lead->update($data);

        event(new QulificationUpdate($lead));

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

        $query = MediaAsset::where('tenant_id', $tenantId)
            ->where('is_active', true);

        if (! empty($category)) {
            $query->where('category', 'LIKE', '%'.$category.'%');
        }

        $assets = $query->get();

        if ($assets->isEmpty()) {
            $assets = MediaAsset::where('tenant_id', $tenantId)
                ->where('is_active', true)
                ->where('is_default', true)
                ->limit(5)
                ->get();
        }

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

    public function download(Request $request, $id)
    {
        $document = KnowledgeBase::where('tenant_id', $request->tenant_id)
            ->findOrFail($id);

        $file_path = $document->getFirstMediaPath('documents');

        return response()->download($file_path);
    }

    public function markAsIndexed(Request $request)
    {
        $document = KnowledgeBase::where('tenant_id', $request->tenant_id)
            ->findOrFail($request->document_id);
        $document->update(['status' => 'indexed']);

        return response()->json(['success' => true]);
    }
}
