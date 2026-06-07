<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\KnowledgeBase;
use App\Services\KnowledgeBaseService;
use Illuminate\Http\Request;
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
            'tenantId' => $request->user()->tenant_id,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $request->validate([
            'file' => 'required|file|mimes:pdf,txt,docx|max:30720',
            'name' => 'required|string|max:255',
            'agent_config_id' => 'required|ulid|exists:agent_configs,id',
        ]);

        $this->findScoped($request, AgentConfig::class, $request->agent_config_id);

        try {
            $downloadUrl = route('workspaces.knowledge.web.download', [
                'slug' => $request->route('slug'),
                'id' => '{id}',
            ]).'?normalized';

            app(KnowledgeBaseService::class)->store(
                $this->withTeam($request, [
                    'tenant_id' => $request->user()->tenant_id,
                    'name' => $request->name,
                    'agent_config_id' => $request->agent_config_id,
                    'download_url' => $downloadUrl,
                ]),
                $request->file('file'),
            );

            return back()->with('success', __('messages.success.document_uploaded'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('messages.error.document_uploaded')]);
        }
    }

    public function download(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member', 'viewer']);

        $document = $this->findScoped($request, KnowledgeBase::class, $request->route('id'));

        $normalized = $request->has('normalized')
            || str_contains($request->header('User-Agent', ''), 'n8n');

        return app(KnowledgeBaseService::class)->download($document, $normalized);
    }

    public function destroy(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $document = $this->findScoped($request, KnowledgeBase::class, $request->route('id'));

        app(KnowledgeBaseService::class)->destroy($document);

        return back()->with('success', __('messages.success.document_deleted'));
    }
}
