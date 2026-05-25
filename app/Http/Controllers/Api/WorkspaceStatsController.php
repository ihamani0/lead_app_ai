<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class WorkspaceStatsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $cacheKey = "workspace_stats_{$user->id}";

            $stats = Cache::remember($cacheKey, 300, function () use ($user) {
                $teamIds = $user->allTeams()->pluck('id');

                return Team::whereIn('id', $teamIds)
                    ->withCount(['leads'])
                    ->withCount(['leads as qualified_leads_count' => function ($query) {
                        $query->whereIn('qualification_result', ['HOT', 'WARM', 'COLD']);
                    }])
                    ->withCount(['users as team_count'])
                    ->get()
                    ->map(function ($team) {
                        $total = $team->leads_count;
                        $qualified = $team->qualified_leads_count;
                        $rate = $total > 0 ? round(($qualified / $total) * 100) : 0;

                        return [
                            'workspace_id' => $team->id,
                            'leads_count' => $total,
                            'qualified_count' => $qualified,
                            'qualification_rate' => $rate,
                            'team_count' => $team->team_count,
                        ];
                    });
            });

            return response()->json(['data' => $stats]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
