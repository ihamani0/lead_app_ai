<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Jobs\SendLeadMessage;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadMessageController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request, string $slug, Lead $lead)
    {
        $lead = $this->findScoped($request, Lead::class, $lead->id);

        $messages = $lead->messages()
            ->orderBy('created_at', 'desc')
            ->paginate(50, ['*'], 'page', $request->integer('page', 1));

        return response()->json($messages);
    }

    public function send(Request $request, string $slug, Lead $lead)
    {
        $this->authorizeRole($request, ['owner', 'admin']);

        $lead = $this->findScoped($request, Lead::class, $lead->id);

        $validated = $request->validate([
            'message' => 'required|string|max:4096',
        ]);

        dispatch(new SendLeadMessage($lead, $validated['message']));

        return back()->with('success', __('messages.success.message_sent'));
    }
}
