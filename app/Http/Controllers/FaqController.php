<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Http\Requests\AnalyzeFaqsRequest;
use App\Http\Requests\FaqRequest;
use App\Models\AgentConfig;
use App\Models\Faq;
use App\Services\PlanEnforcementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class FaqController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request, string $slug)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member', 'viewer']);

        if (! app(PlanEnforcementService::class)->canUseFeature($request->user()->tenant, 'faq')) {
            return response()->json(['faqs' => [], 'suggestions' => [], 'agents' => [], 'canCreate' => false, 'canManage' => false]);
        }

        $faqs = $this->scopedQuery($request, Faq::class)
            ->where('is_suggestion', false)
            ->latest()
            ->paginate(20);

        $suggestions = $this->scopedQuery($request, Faq::class)
            ->where('is_suggestion', true)
            ->latest()
            ->get();

        $agents = AgentConfig::where('tenant_id', $request->user()->tenant_id)
            ->where('is_active', true)
            ->get(['id', 'name']);

        $roleCode = $this->getRoleCode($request);
        $canManage = in_array($roleCode, ['owner', 'admin', 'member']);

        return response()->json([
            'faqs' => $faqs,
            'suggestions' => $suggestions,
            'agents' => $agents,
            'canCreate' => $canManage,
            'canManage' => $canManage,
        ]);
    }

    public function store(FaqRequest $request, string $slug)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        if (! app(PlanEnforcementService::class)->canUseFeature($request->user()->tenant, 'faq')) {
            return back()->with('error', __('messages.error.plan_feature_unavailable'));
        }

        Faq::create($this->withTeam($request, [
            'tenant_id' => $request->user()->tenant_id,
            'agent_config_id' => $request->agent_config_id,
            'question' => $request->question,
            'answer' => $request->answer,
            'category' => $request->category,
            'is_active' => $request->boolean('is_active', true),
        ]));

        return back();
    }

    public function update(FaqRequest $request, string $slug, Faq $faq)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);
        $this->findScoped($request, Faq::class, $faq->id);

        if (! app(PlanEnforcementService::class)->canUseFeature($request->user()->tenant, 'faq')) {
            return back()->with('error', __('messages.error.plan_feature_unavailable'));
        }

        $faq->update([
            'question' => $request->question,
            'answer' => $request->answer,
            'category' => $request->category,
            'is_active' => $request->boolean('is_active', $faq->is_active),
        ]);

        return back();
    }

    public function destroy(Request $request, string $slug, Faq $faq)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);
        $this->findScoped($request, Faq::class, $faq->id);

        if (! app(PlanEnforcementService::class)->canUseFeature($request->user()->tenant, 'faq')) {
            return back()->with('error', __('messages.error.plan_feature_unavailable'));
        }

        $faq->delete();

        return back();
    }

    public function toggle(Request $request, string $slug, Faq $faq)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);
        $this->findScoped($request, Faq::class, $faq->id);

        if (! app(PlanEnforcementService::class)->canUseFeature($request->user()->tenant, 'faq')) {
            return back()->with('error', __('messages.error.plan_feature_unavailable'));
        }

        $faq->update(['is_active' => ! $faq->is_active]);

        return back();
    }

    public function accept(Request $request, string $slug, Faq $faq)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);
        $this->findScoped($request, Faq::class, $faq->id);

        if (! app(PlanEnforcementService::class)->canUseFeature($request->user()->tenant, 'faq')) {
            return back()->with('error', __('messages.error.plan_feature_unavailable'));
        }

        $faq->update([
            'is_suggestion' => false,
            'suggestion_data' => null,
        ]);

        return back();
    }

    public function triggerAnalysis(AnalyzeFaqsRequest $request, string $slug)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        if (! app(PlanEnforcementService::class)->canUseFeature($request->user()->tenant, 'faq')) {
            return back()->with('error', __('messages.error.plan_feature_unavailable'));
        }

        $params = $request->filled('agent_config_id')
            ? ['--agent' => $request->agent_config_id]
            : [];

        Artisan::queue('faqs:analyze', $params);

        return back();
    }
}
