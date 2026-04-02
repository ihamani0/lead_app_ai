<?php

namespace App\Http\Controllers;

use App\Models\AgentConfig;
use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class KnowledgeBaseController extends Controller
{
    public function index(Request $request)
    {
        $tenant_id = Auth::user()->tenant_id;

        $query = KnowledgeBase::with('agent')->where('tenant_id', $tenant_id)->latest();

        // Filter by agent if provided
        if ($request->filled('agent_id')) {
            $query->where('agent_config_id', $request->agent_id);
        }

        $documents = $query->get();

        $agents = AgentConfig::where('tenant_id', $tenant_id)
            ->select('id', 'name')
            ->get();

        return Inertia::render('KnowledgeBase/Index', [
            'documents' => $documents,
            'agents' => $agents,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,docx|max:30720',
            'name' => 'required|string|max:255',
            'agent_config_id' => 'required|ulid|exists:agent_configs,id',
        ]);

        // Verify agent belongs to tenant
        $agent = AgentConfig::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($request->agent_config_id);

        $document = KnowledgeBase::create([
            'tenant_id' => $request->user()->tenant_id,
            'name' => $request->name,
            'agent_config_id' => $request->agent_config_id,
            'status' => 'processing',
        ]);

        $document->addMediaFromRequest('file')->toMediaCollection('documents');

        $n8nWebhookUrl = config('services.n8n.n8n_base_url').'/webhook/ingest-document';

        try {
            Http::withHeaders([
                'X-N8N-API-KEY' => config('services.n8n.api_key'),
            ])
                ->post($n8nWebhookUrl, [
                    'document_id' => $document->id,
                    'tenant_id' => (string) $document->tenant_id,
                    'agent_config_id' => $document->agent_config_id,
                    'file_name' => $request->file('file')->getClientOriginalName(),
                ]);

            return back()->with('success', __('messages.success.document_uploaded'));
        } catch (\Exception $e) {
            $document->update(['status' => 'failed']);

            return back()->withErrors(['error' => __('messages.error.document_uploaded')]);
        }
    }

    public function download(Request $request, $id)
    {
        $document = KnowledgeBase::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($id);

        $file_path = $document->getFirstMediaPath('documents');

        return response()->download($file_path);
    }

    public function destroy(Request $request, $id)
    {
        $document = KnowledgeBase::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($id);

        // Clean up vector embeddings in document_chunks
        try {
            DB::statement(
                "DELETE FROM document_chunks WHERE metadata->>'document_id' = ?",
                [$document->id]
            );
        } catch (\Exception $e) {
            Log::warning('Failed to clean up document_chunks for document '.$document->id.': '.$e->getMessage());
        }

        $document->delete();

        return back()->with('success', __('messages.success.document_deleted'));
    }
}
