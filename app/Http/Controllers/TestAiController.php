<?php

namespace App\Http\Controllers;

use App\Events\TestAgentTyping;
use App\Events\TestMessageUpdated;
use App\Models\AgentConfig;
use App\Models\n8nChatMessage;
use App\Models\TestConversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Log;

class TestAiController extends Controller
{
    public function send(Request $request, string $slug, string $agent)
    {

        $agentConfig = AgentConfig::with('instance')->findOrFail($agent);

        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $message = $request->input('message');

        $conversation = TestConversation::firstOrCreate(
            ['agent_config_id' => $agentConfig->id],
            ['messages' => []],
        );

        $messages = $conversation->messages ?? [];
        $messages[] = [
            'role' => 'user',
            'content' => $message,
            'timestamp' => now()->toISOString(),
        ];

        $conversation->update(['messages' => $messages]);

        broadcast(new TestMessageUpdated($conversation));

        $this->forwardToN8n($agentConfig, $message);

        return response()->json([
            'conversation' => $conversation->fresh(),
        ]);
    }

    public function callback(Request $request)
    {
        $validated = $request->validate([
            'agent_id' => 'required|string',
            'response' => 'required|string',
            'assets' => 'nullable|array',
            'assets.*.url' => 'required|url',
            'assets.*.type' => 'required|in:image,video',
            'assets.*.caption' => 'nullable|string',
        ]);

        $conversation = TestConversation::where('agent_config_id', $validated['agent_id'])->first();

        if (! $conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        $messages = $conversation->messages ?? [];
        $messages[] = [
            'role' => 'assistant',
            'content' => $validated['response'],
            'assets' => $validated['assets'] ?? [],
            'timestamp' => now()->toISOString(),
        ];

        $conversation->update(['messages' => $messages]);

        broadcast(new TestMessageUpdated($conversation));

        return response()->json(['status' => 'ok']);
    }

    public function typing(Request $request)
    {
        $validated = $request->validate([
            'agent_id' => 'required|string',
            'stage' => 'required|string|in:starting,thinking,searching,parsing,completed',
            'is_typing' => 'required|boolean',
        ]);

        broadcast(new TestAgentTyping(
            agentId: $validated['agent_id'],
            stage: $validated['stage'],
            isTyping: $validated['is_typing'],
        ));

        return response()->json(['status' => 'ok']);
    }

    public function clear(Request $request, string $slug, string $agent)
    {
        $agentConfig = AgentConfig::findOrFail($agent);

        $conversation = TestConversation::where('agent_config_id', $agentConfig->id)->first();

        if ($conversation) {
            $conversation->update(['messages' => []]);

            broadcast(new TestMessageUpdated($conversation));
        }

        n8nChatMessage::where('session_id', 'test_session_id_'.$agentConfig->id)->delete();

        return response()->json(['sucess' => 'message cleared sucessfully']);
    }

    private function forwardToN8n(AgentConfig $agent, string $message): void
    {
        $webhookTestAgentUrl = config('services.whatsapp.test_webhook_url');

        Log::info('Forwarding message to n8n', [
            'message' => $message,
            'agent_id' => $agent->id,
            'session_id' => 'test_session_id_'.$agent->id,
            'name' => $agent->name,
            'settings' => $agent->settings,
            'test_mode' => true,
        ]);
        
        Http::timeout(30)
            ->post($webhookTestAgentUrl, [
                'message' => $message,
                'agent_id' => $agent->id,
                'session_id' => 'test_session_id_'.$agent->id,
                'name' => $agent->name,
                'settings' => array_merge($agent->settings ?? [], ['name' => $agent->name]),
                'test_mode' => true,
            ]);
    }
}
