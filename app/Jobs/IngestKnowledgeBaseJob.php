<?php

namespace App\Jobs;

use App\Events\DocumentStatusUpdated;
use App\Models\KnowledgeBase;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Enums\Lab;

class IngestKnowledgeBaseJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected KnowledgeBase $document,
        protected string $extractedText
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("KnowledgeBase [{$this->document->id}]: starting ingestion");

            $chunks = $this->splitText($this->extractedText);
            Log::info("KnowledgeBase [{$this->document->id}]: split into ".count($chunks).' chunks');

            if (empty($chunks)) {
                $this->document->update(['status' => 'indexed']);
                Log::info("KnowledgeBase [{$this->document->id}]: no chunks to process, marked indexed");

                return;
            }

            Log::info("KnowledgeBase [{$this->document->id}]: generating embeddings via Gemini...");

            $response = Embeddings::for($chunks)
                ->dimensions(3072)
                ->generate(Lab::Gemini, 'gemini-embedding-001');

            Log::info("KnowledgeBase [{$this->document->id}]: received ".count($response->embeddings)." embeddings, {$response->tokens} tokens used");

            $collectionUuid = $this->getOrCreateCollection(
                name: 'agent_'.$this->document->agent_config_id,
                metadata: [
                    'tenant_id' => (string) $this->document->tenant_id,
                    'agent_config_id' => (string) $this->document->agent_config_id,
                ]
            );
            Log::info("KnowledgeBase [{$this->document->id}]: using collection {$collectionUuid}");

            foreach ($chunks as $index => $chunkText) {
                $vector = $response->embeddings[$index] ?? null;

                if ($vector) {
                    $this->insertChunkToStore($chunkText, $vector, $collectionUuid);
                } else {
                    Log::warning("KnowledgeBase [{$this->document->id}]: missing embedding at index {$index}");
                }
            }

            $this->document->update(['status' => 'indexed']);
            Log::info("KnowledgeBase [{$this->document->id}]: successfully indexed");

            DocumentStatusUpdated::dispatch(
                documentId: $this->document->id,
                status: 'indexed',
                documentName: $this->document->name,
                tenantId: $this->document->tenant_id,
                agentConfigId: $this->document->agent_config_id,
                teamId: $this->document->team_id,
            );

        } catch (Exception $e) {
            $this->document->update(['status' => 'failed']);

            DocumentStatusUpdated::dispatch(
                documentId: $this->document->id,
                status: 'failed',
                documentName: $this->document->name,
                tenantId: $this->document->tenant_id,
                agentConfigId: $this->document->agent_config_id,
                teamId: $this->document->team_id,
            );
            Log::error("KnowledgeBase [{$this->document->id}] FAILED at step: ".$e->getMessage(), [
                'exception_class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Dynamically retrieve or create a LangChain collection by its name.
     */
    protected function getOrCreateCollection(string $name, array $metadata = []): string
    {
        $collection = DB::table('langchain_pg_collection')
            ->where('name', $name)
            ->first();

        if ($collection) {
            return $collection->uuid;
        }

        $uuid = (string) Str::uuid();

        DB::table('langchain_pg_collection')->insert([
            'uuid' => $uuid,
            'name' => $name,
            'cmetadata' => json_encode($metadata),
        ]);

        return $uuid;
    }

    /**
     * Store the text chunk and vector in both your active and future tables.
     */
    protected function insertChunkToStore(string $text, array $vector, string $collectionUuid): void
    {
        $vectorString = '['.implode(',', $vector).']';
        $metadataJson = json_encode([
            'tenant_id' => (string) $this->document->tenant_id,
            'document_id' => (string) $this->document->id,
            'agent_config_id' => (string) $this->document->agent_config_id,
        ]);

        // 1. Current custom schema table
        DB::table('document_chunks')->insert([
            'text' => $text,
            'metadata' => $metadataJson,
            'embedding' => $vectorString,
        ]);

        // 2. Scalable LangChain schema table
        DB::table('langchain_pg_embedding')->insert([
            'id' => (string) Str::uuid(),
            'collection_id' => $collectionUuid,
            'embedding' => $vectorString,
            'document' => $text,
            'cmetadata' => $metadataJson,
        ]);
    }

    /**
     * Utility method for recursive text splitting.
     */
    protected function splitText(string $text, int $chunkSize = 1000, int $chunkOverlap = 200): array
    {
        $chunks = [];
        $length = mb_strlen($text);
        $startIndex = 0;

        while ($startIndex < $length) {
            if ($startIndex + $chunkSize < $length) {
                $substring = mb_substr($text, $startIndex, $chunkSize);
                $lastSpace = mb_strrpos($substring, ' ');
                $lastNewline = mb_strrpos($substring, "\n");
                $splitAt = max($lastSpace, $lastNewline);

                if ($splitAt !== false && $splitAt > ($chunkSize / 2)) {
                    $chunks[] = trim(mb_substr($text, $startIndex, $splitAt));
                    $startIndex += $splitAt - $chunkOverlap;
                } else {
                    $chunks[] = trim($substring);
                    $startIndex += $chunkSize - $chunkOverlap;
                }
            } else {
                $chunks[] = trim(mb_substr($text, $startIndex));
                $startIndex = $length;
            }
        }

        return array_filter($chunks);
    }
}
