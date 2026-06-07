<?php

namespace App\Http\Controllers\Api;

use App\Events\QulificationUpdate;
use App\Http\Controllers\Controller;
use App\Models\AgentConfig;
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
    // public function getMedia(Request $request,AgentConfig $agent )
    // {
    //     // Defensive: unwrap double-encoded category
    //     $categoryRaw = $request->query('category') ?? "project_general";
    //     if (is_string($categoryRaw)) {
    //         $decoded = json_decode($categoryRaw, true);
    //         $category = is_array($decoded) && isset($decoded['category'])
    //             ? $decoded['category']
    //             : $categoryRaw;
    //     } else {
    //         $category = $categoryRaw;
    //     }

    //     $query = MediaAsset::where('agent_config_id', $agent->id)
    //         ->where('team_id', $agent->team_id)
    //         ->where('is_active', true);

    //     if (! empty($category)) {
    //         $query->where('category', 'LIKE', '%'.$category.'%');
    //     }

    //     $assets = $query->get();

    //     if ($assets->isEmpty()) {
    //         $assets = MediaAsset::whereNull('agent_config_id')
    //             ->where('team_id', $agent->team_id)
    //             ->where('is_active', true)
    //             ->where('is_default', true)
    //             ->limit(5)
    //             ->get();
    //     }

    //     $formattedAssets = $assets->map(fn ($asset) => [
    //         'type' => $asset->type,
    //         'url' => $asset->resolved_url,
    //         'caption' => $asset->caption,
    //     ]);

    //     return response()->json(['assets' => $formattedAssets]);
    // }

    public function getMedia(Request $request, AgentConfig $agent)
    {
        Log::info('agent', [
            'agent id ' => $agent->id,
            'team id' => $agent->team_id,
        ]);

        $categoryRaw = $request->query('category');

        if (is_string($categoryRaw)) {
            $decoded = json_decode($categoryRaw, true);
            $category = is_array($decoded) && isset($decoded['category'])
                ? $decoded['category']
                : $categoryRaw;
        } else {
            $category = $categoryRaw;
        }

        Log::info('[getMedia] Category resolved', [
            'raw' => $categoryRaw,
            'clean' => $category ?? '(null)',
        ]);

        Log::info('[getMedia] Agent resolved', [
            'agent_config_id' => $agent->id,
            'team_id' => $agent->team_id,
        ]);

        $query = MediaAsset::where('agent_config_id', $agent->id)
            ->where('team_id', $agent->team_id)
            ->where('is_active', true);

        if (! empty($category)) {
            $query->where('category', 'LIKE', '%'.$category.'%');
        }

        // Log the SQL for debugging
        $sql = $query->toSql();
        $bindings = $query->getBindings();
        Log::info('[getMedia] SQL query', ['sql' => $sql, 'bindings' => $bindings]);

        $assets = $query->get();

        Log::info('[getMedia] Query result', ['count' => $assets->count()]);

        if ($assets->isEmpty()) {
            Log::info('[getMedia] No assets found, falling back to team defaults', [
                'team_id' => $agent->team_id,
            ]);

            $assets = MediaAsset::where('agent_config_id', $agent->id)
                ->where('team_id', $agent->team_id)
                ->where('is_active', true)
                ->where('is_default', true)
                ->get();

            Log::info('[getMedia] Fallback result', ['count' => $assets->count()]);
        }

        $formattedAssets = $assets->map(fn ($asset) => [
            'type' => $asset->type,
            'url' => $asset->resolved_url,
            'caption' => $asset->caption,
        ]);

        Log::info('[getMedia] Response', ['assets_count' => count($formattedAssets)]);

        return response()->json(['assets' => $formattedAssets]);
    }

    public function download(Request $request, $id)
    {
        Log::info('download request', ['document_id' => $id, 'tenant_id' => $request->tenant_id]);

        $document = KnowledgeBase::where('tenant_id', $request->tenant_id)
            ->findOrFail($id);

        $file_path = $document->getFirstMediaPath('documents');

        Log::info('file path found', ['path' => $file_path]);

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
