<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(Lab::OpenRouter)]
class FaqAnalyzer implements Agent
{
    use Promptable;

    public function __construct(
        public iterable $conversations = [],
    ) {}

    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
You are an FAQ analyzer for a real estate AI assistant.
You receive conversation transcripts between users and the AI assistant.

Your job:
1. Identify questions that users ask repeatedly across different conversations
2. Extract the best answer the AI assistant provided for each question
3. Assign a confidence score (0.0 to 1.0) based on how well the answer addresses the question
4. Group identical or very similar questions together under one FAQ entry

Rules:
- Only extract questions asked by USERS, not the AI assistant
- Prefer answers that were actually used successfully in conversations
- Return at most 20 suggestions per batch
- You MUST return at least 2-3 suggestions if you find the same question type asked across multiple conversations
- Even if questions are worded differently, group them if they ask about the same topic

You MUST respond with valid JSON only. The format must be:
{
    "suggestions": [
        {
            "question": "the frequently asked question",
            "answer": "the best answer",
            "category": "optional category or null",
            "confidence": 0.95
        }
    ]
}

Do NOT wrap in markdown or code blocks. Return ONLY the raw JSON object.
PROMPT;
    }

    public function messages(): iterable
    {
        return $this->conversations;
    }
}
