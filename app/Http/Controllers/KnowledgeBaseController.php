<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class KnowledgeBaseController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request)
    {
        $query = $this->scopedQuery($request, KnowledgeBase::class)
            ->with('agent')
            ->latest();

        if ($request->filled('agent_id')) {
            $query->where('agent_config_id', $request->agent_id);
        }

        $documents = $query->get();

        $agents = $this->scopedQuery($request, AgentConfig::class)
            ->select('id', 'name')
            ->get();

        $roleCode = $this->getRoleCode($request);
        $canManage = in_array($roleCode, ['owner', 'admin', 'member']);

        return Inertia::render('KnowledgeBase/Index', [
            'documents' => $documents,
            'agents' => $agents,
            'canCreate' => $canManage,
            'canManage' => $canManage,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,docx|max:30720',
            'name' => 'required|string|max:255',
            'agent_config_id' => 'required|ulid|exists:agent_configs,id',
        ]);

        $this->findScoped($request, AgentConfig::class, $request->agent_config_id);

        $document = KnowledgeBase::create($this->withTeam($request, [
            'tenant_id' => $request->user()->tenant_id,
            'name' => $request->name,
            'agent_config_id' => $request->agent_config_id,
            'status' => 'processing',
        ]));

        $document->addMediaFromRequest('file')->toMediaCollection('documents');

        $DocumentWebhookUrl = config('services.document.webhook_url');

        try {
            Http::withHeaders([
                'X-N8N-API-KEY' => config('services.n8n.api_key'),
            ])
                ->post($DocumentWebhookUrl, [
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

    public function download(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member', 'viewer']);

        $document = $this->findScoped($request, KnowledgeBase::class, $request->route('id'));

        $file_path = $document->getFirstMediaPath('documents');

        return response()->download($file_path);
    }

    public function destroy(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $document = $this->findScoped($request, KnowledgeBase::class, $request->route('id'));

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
