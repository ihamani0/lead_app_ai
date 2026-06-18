<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\AgentConfig;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\MediaAsset;
use App\Models\Team;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use WorkspaceScoped;

    public function __invoke(Request $request)
    {
        $scope = $this->scope($request);
        $team = $request->attributes->get('active_team');
        $tenantId = $request->user()->tenant_id;

        return Inertia::render('dashboard', [
            'stats' => [
                'instances' => $this->getInstanceStats($scope),
                'leads' => $this->getLeadStats($scope),
                'media' => $this->getMediaStats($scope),
                'agents' => $this->getAgentStats($team, $tenantId),
            ],
            'recentLeads' => $this->getRecentLeadsList($scope),
            'token_stats' => $this->getTokenStats($request),
            'workspace' => $this->getWorkspaceData($team, $request, $scope),
        ]);
    }

    private function getInstanceStats(array $scope): array
    {
        $instances = EvolutionInstance::where($scope)->get();

        return [
            'total' => $instances->count(),
            'connected' => $instances->where('status', 'connected')->count(),
            'disconnected' => $instances->where('status', '!=', 'connected')->count(),
        ];
    }

    private function getLeadStats(array $scope): array
    {
        $leads = Lead::where($scope)->get();

        return [
            'total' => $leads->count(),
            'byAiQualification' => $leads->groupBy('ai_qualification_status')->map(fn ($g) => $g->count()),
            'byQualificationResult' => $leads->groupBy('qualification_result')->map(fn ($g) => $g->count()),
            'byTreatmentStatus' => $leads->groupBy('treatment_status')->map(fn ($g) => $g->count()),
            'recent' => Lead::where($scope)->where('created_at', '>=', now()->subDays(7))->count(),
            'today' => Lead::where($scope)->whereDate('created_at', today())->count(),
        ];
    }

    private function getRecentLeadsList(array $scope): Collection
    {
        return Lead::where($scope)
            ->with('instance')
            ->latest()
            ->limit(10)
            ->get();
    }

    private function getMediaStats(array $scope): array
    {
        $media = MediaAsset::where($scope)->get();

        $totalSizeKb = $media->sum(fn ($m) => $m->size ?? 0);

        return [
            'total' => $media->count(),
            'totalSize' => (int) $totalSizeKb * 1024,
        ];
    }

    private function getAgentStats(?Team $team, string $tenantId): array
    {
        $query = AgentConfig::when($team, fn ($q) => $q->where('team_id', $team->id))
            ->whereHas('instance', fn ($q) => $q->where('tenant_id', $tenantId));

        return [
            'total' => (clone $query)->count(),
            'active' => (clone $query)->where('is_active', true)->count(),
        ];
    }

    private function getTokenStats(Request $request): array
    {
        $tenant = Tenant::find($request->user()->tenant_id);

        return [
            'credit' => (int) $tenant->credit_millicents,
            'is_low_credit' => (bool) $tenant->is_low_credit,
            'threshold' => config('services.token.threshold', 10) * 1000,
            'model' => $tenant->llmModel?->display_name ?? 'DeepSeek (Default)',
        ];
    }

    private function getWorkspaceData(?Team $team, Request $request, array $scope): ?array
    {
        if (! $team) {
            return null;
        }

        $team->loadMissing(['users', 'owner', 'roles']);

        $leadCount = Lead::where($scope)->count();

        $mediaItems = MediaAsset::where($scope)->get();
        $totalSizeKb = $mediaItems->sum(fn ($m) => $m->size ?? 0);

        $members = collect();
        foreach ($team->users as $user) {
            $members->push($this->formatMember($user, $team, $request));
        }
        if (! $members->firstWhere('id', $team->user_id)) {
            $members->push($this->formatMember($team->owner, $team, $request));
        }

        return [
            'name' => $team->name,
            'description' => $team->description ?? '',
            'status' => 'Actif',
            'created_at' => $team->created_at->format('d/m/Y'),
            'owner_name' => $team->owner?->name ?? '',
            'usage' => [
                'leads_used' => $leadCount,
                'storage_used_bytes' => (int) $totalSizeKb * 1024,
            ],
            'members' => $members->values()->toArray(),
        ];
    }

    private function formatMember($user, Team $team, Request $request): array
    {
        $isOwner = $user->id === $team->user_id;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'initials' => $this->getInitials($user->name),
            'role' => $isOwner
                ? 'Propriétaire'
                : ($team->roles->firstWhere('id', $user->membership?->role_id)?->name ?? 'Membre'),
            'is_current_user' => $user->id === $request->user()->id,
            'color' => $this->getAvatarColor($user->name),
        ];
    }

    private function getInitials(string $name): string
    {
        return collect(explode(' ', $name))
            ->map(fn ($part) => strtoupper($part[0] ?? ''))
            ->take(2)
            ->join('');
    }

    private function getAvatarColor(string $name): string
    {
        $colors = ['purple', 'teal', 'coral', 'blue', 'amber'];
        $index = abs(crc32($name)) % count($colors);

        return $colors[$index];
    }
}
