<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqsController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'agent_config_id' => 'required|string|exists:agent_configs,id',
        ]);

        $faqs = Faq::where('agent_config_id', $request->agent_config_id)
            ->where('is_active', true)
            ->where('is_suggestion', false)
            ->limit(100)
            ->get(['id', 'question', 'answer', 'category', 'usage_count']);

        // Increment usage count for retrieved FAQs
        if ($faqs->isNotEmpty()) {
            Faq::whereIn('id', $faqs->pluck('id'))->increment('usage_count');
        }

        return response()->json($faqs);
    }
}
