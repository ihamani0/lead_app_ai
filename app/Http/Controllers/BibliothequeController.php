<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Faq;
use App\Models\KnowledgeBase;
use App\Models\MediaAsset;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BibliothequeController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request)
    {
        $scope = $this->scope($request);
        $roleCode = $this->getRoleCode($request);
        $canManage = in_array($roleCode, ['owner', 'admin', 'member']);
        $tenantId = $request->user()->tenant_id;

        // ─── Documents (KnowledgeBase) ───────────────────────────────
        $documents = $this->scopedQuery($request, KnowledgeBase::class)
            ->with('agent')
            ->latest()
            ->get()
            ->map(function ($doc) {
                $ext = strtolower(pathinfo($doc->name, PATHINFO_EXTENSION));
                $doc->file_type = match ($ext) {
                    'pdf' => 'PDF',
                    'xlsx', 'xls' => 'XLSX',
                    'docx', 'doc' => 'DOCX',
                    'txt' => 'TXT',
                    default => '—',
                };
                $doc->file_size_formatted = $doc->file_size ? self::formatBytes($doc->file_size) : '—';
                $doc->folder = $doc->agent?->name ?? 'Général';
                $doc->usage_count = 0;

                return $doc;
            });

        $totalSize = $documents->sum('file_size');
        $totalWords = $documents->sum(fn ($d) => $d->file_size ? (int) ($d->file_size / 2) : 0);

        $documentStats = [
            'total' => $documents->count(),
            'words_analyzed' => $totalWords,
            'size_bytes' => $totalSize,
            'size_gb' => $totalSize > 0 ? round($totalSize / 1073741824, 1) : 0,
            'sources' => $documents->pluck('agent_config_id')->filter()->unique()->count(),
        ];

        $indexedCount = $documents->where('status', 'indexed')->count();
        $qualityScore = $documents->count() > 0
            ? (int) round(($indexedCount / $documents->count()) * 100)
            : 0;

        // ─── FAQ ─────────────────────────────────────────────────────
        $faqsQuery = $this->scopedQuery($request, Faq::class)
            ->where('is_suggestion', false)
            ->latest();

        $perPage = (int) $request->input('per_page', 20);
        $page = (int) $request->input('page', 1);
        $faqs = $faqsQuery->paginate($perPage, ['*'], 'page', $page);

        $suggestions = $this->scopedQuery($request, Faq::class)
            ->where('is_suggestion', true)
            ->latest()
            ->get();

        // ─── WhatsApp Instances ──────────────────────────────────────
        $instances = $this->scopedQuery($request, EvolutionInstance::class)
            ->active()
            ->withCount('leads')
            ->with('agentConfig')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($instance) {
                $latestLeads = $instance->leads()
                    ->whereDate('created_at', Carbon::today())
                    ->count();

                $instance->messages_today = $latestLeads;
                $instance->connection_quality = match ($instance->status) {
                    'connected' => 'excellente',
                    'connecting' => 'bonne',
                    default => 'faible',
                };

                return $instance;
            });

        $connectedCount = $instances->where('status', 'connected')->count();
        $whatsappStats = [
            'connected' => $connectedCount,
            'total' => $instances->count(),
            'messages_today' => $instances->sum('messages_today'),
        ];

        // ─── Media Assets ────────────────────────────────────────────
        $assets = MediaAsset::where($scope)
            ->latest()
            ->get()
            ->map(function ($asset) {
                $asset->url = $asset->resolved_url;
                $media = $asset->getMedia('assets')->first();
                $asset->name = $media?->name ?? $asset->caption;
                $asset->mime_type = $media?->mime_type;

                return $asset;
            });

        // ─── Available agents for media linking ────────────────────
        $agents = $this->scopedQuery($request, AgentConfig::class)
            ->select(['id', 'name'])
            ->get();

        return Inertia::render('Bibliotheque/Index', [
            'documents' => $documents,
            'documentStats' => $documentStats,
            'qualityScore' => $qualityScore,
            'faqs' => $faqs,
            'suggestions' => $suggestions,
            'agents' => $agents,
            'instances' => $instances,
            'whatsappStats' => $whatsappStats,
            'assets' => $assets,
            'canCreate' => $canManage,
            'canManage' => $canManage,
            'tenantId' => $tenantId,
        ]);
    }

    private static function formatBytes(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' o';
        }

        if ($bytes < 1048576) {
            return round($bytes / 1024, 1).' Ko';
        }

        return round($bytes / 1048576, 1).' Mo';
    }
}
