<?php

namespace App\Jobs;

use App\Ai\Agents\FaqAnalyzer;
use App\Models\AgentConfig;
use App\Models\Faq;
use App\Models\n8nChatMessage;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Laravel\Ai\Messages\Message;

class AnalyzeAgentFaqsJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(
        public AgentConfig $agentConfig,
    ) {}

    public function handle(): void
    {
        $tenantId = $this->agentConfig->tenant_id;
        $agentId = $this->agentConfig->id;

        Log::info("[FAQ Analyzer] Starting analysis for agent: {$agentId}", [
            'agent_name' => $this->agentConfig->name,
            'tenant_id' => $tenantId,
        ]);

        // 1. Fetch messages for this agent
        //    Production: match additional_kwargs.agent_config_id (from n8n workflow)
        //    Test fallback: match test_session_id_{agentId}
        $messages = n8nChatMessage::where(function ($query) use ($agentId) {
            $query->whereRaw(
                "message->'data'->'additional_kwargs'->>'agent_config_id' = ?",
                [$agentId]
            )->orWhere('session_id', 'test_session_id_'.$agentId);
        })->orderBy('session_id')
            ->orderBy('id')
            ->get();

        Log::info("[FAQ Analyzer] Found {$messages->count()} raw messages for agent", [
            'agent_id' => $agentId,
        ]);

        if ($messages->isEmpty()) {
            Log::info('[FAQ Analyzer] No messages found, skipping agent', [
                'agent_id' => $agentId,
            ]);

            return;
        }

        // 2. Format messages as Message objects for the AI agent
        //    Two possible formats:
        //      Production (LangChain): {data: {content, type, additional_kwargs}, type}
        //      Test (flat):            {content, type, additional_kwargs}
        $formatted = [];
        $skipped = 0;
        foreach ($messages as $msg) {
            $messageData = $msg->message;

            // Try flat format first, fallback to LangChain nested format
            $rawType = $messageData['type'] ?? $messageData['data']['type'] ?? 'human';
            $content = $messageData['content'] ?? $messageData['data']['content'] ?? '';

            $role = match ($rawType) {
                'ai', 'assistant' => 'assistant',
                default => 'user',
            };

            if (! empty($content)) {
                $formatted[] = new Message($role, (string) $content);
            } else {
                $skipped++;
            }
        }

        Log::info('[FAQ Analyzer] Formatted '.count($formatted)." messages for AI (skipped {$skipped} empty)", [
            'agent_id' => $agentId,
            'total_parsed' => count($formatted),
            'skipped' => $skipped,
        ]);

        if (empty($formatted)) {
            Log::info('[FAQ Analyzer] No valid messages to analyze, skipping', [
                'agent_id' => $agentId,
            ]);

            return;
        }

        // 3. Send to AI via FaqAnalyzer
        Log::info('[FAQ Analyzer] Calling FaqAnalyzer...', [
            'agent_id' => $agentId,
            'message_count' => count($formatted),
        ]);

        try {
            $response = (new FaqAnalyzer($formatted))->prompt(
                'Analyze these 5 conversations. Look for questions that users ask repeatedly across different conversations (e.g. opening hours, services offered, contact info). Group similar questions even if worded differently. Return them as FAQ suggestions.',
                timeout: 300,
            );
        } catch (\Exception $e) {
            Log::error("[FAQ Analyzer] AI call failed for agent {$agentId}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return;
        }

        $suggestions = $this->parseSuggestions($response->text);

        if (empty($suggestions)) {
            Log::info('[FAQ Analyzer] No suggestions from AI, skipping', [
                'agent_id' => $agentId,
            ]);

            return;
        }

        // 4. Get existing questions to avoid duplicates
        $existingQuestions = Faq::where('agent_config_id', $agentId)
            ->pluck('question')
            ->map(fn ($q) => mb_strtolower(trim($q)))
            ->toArray();

        // 5. Create FAQ entries
        $created = 0;
        $duplicates = 0;
        foreach ($suggestions as $suggestion) {
            $question = trim($suggestion['question']);

            // Dedup: skip if similar question already exists
            $questionLower = mb_strtolower($question);
            $isDuplicate = false;
            foreach ($existingQuestions as $existing) {
                similar_text($questionLower, $existing, $percent);
                if ($percent > 80) {
                    $isDuplicate = true;
                    break;
                }
            }

            if ($isDuplicate) {
                $duplicates++;

                continue;
            }

            Faq::create([
                'tenant_id' => $tenantId,
                'team_id' => $this->agentConfig->team_id,
                'agent_config_id' => $agentId,
                'question' => $question,
                'answer' => $suggestion['answer'] ?? null,
                'category' => $suggestion['category'] ?? null,
                'is_suggestion' => true,
                'suggestion_data' => [
                    'confidence' => $suggestion['confidence'] ?? 0.5,
                    'source_count' => count($formatted),
                ],
            ]);
            $created++;
        }

        Log::info("[FAQ Analyzer] Analysis complete for agent {$agentId}", [
            'agent_id' => $agentId,
            'suggestions_returned' => count($suggestions),
            'new_faqs_created' => $created,
            'duplicates_skipped' => $duplicates,
        ]);
    }

    private function parseSuggestions(string $text): array
    {
        $text = trim($text);

        $text = preg_replace('/^.*?```(?:json)?\s*/s', '', $text);
        $text = preg_replace('/```.*$/s', '', $text);
        $text = trim($text);

        $firstBrace = strpos($text, '{');
        $firstBracket = strpos($text, '[');
        $start = false;
        if ($firstBrace !== false && $firstBracket !== false) {
            $start = min($firstBrace, $firstBracket);
        } elseif ($firstBrace !== false) {
            $start = $firstBrace;
        } elseif ($firstBracket !== false) {
            $start = $firstBracket;
        }

        if ($start === false) {
            return [];
        }

        $text = mb_substr($text, $start);

        $decoded = json_decode($text, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [];
        }

        if (isset($decoded['suggestions']) && is_array($decoded['suggestions'])) {
            return $decoded['suggestions'];
        }

        if (isset($decoded[0]) && is_array($decoded)) {
            return $decoded;
        }

        return [];
    }
}
