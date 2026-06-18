<?php

namespace App\Services;

use App\Jobs\IngestKnowledgeBaseJob;
use App\Models\KnowledgeBase;
use DB;
use DOMDocument;
use DOMXPath;
use Exception;
use Illuminate\Http\UploadedFile;
use Log;
use Smalot\PdfParser\Parser as PdfParser;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use ZipArchive;

class KnowledgeBaseService
{
    public function store(array $data, UploadedFile $file): KnowledgeBase
    {
        $document = KnowledgeBase::create([
            'tenant_id' => $data['tenant_id'],
            'team_id' => $data['team_id'] ?? null,
            'name' => $data['name'],
            'agent_config_id' => $data['agent_config_id'],
            'file_size' => $file->getSize(),
            'status' => 'processing',
        ]);

        $originalMedia = $document->addMedia($file)->toMediaCollection('documents');

        try {
            $extension = $file->getClientOriginalExtension();
            $extractedText = $this->extractText($originalMedia->getPath(), $extension);

            // Save the normalized text file locally
            $document->addMediaFromString($extractedText)
                ->setName($document->name.' (Normalized)')
                ->setFileName($document->id.'.txt')
                ->toMediaCollection('normalized');

            // Dispatch the background queue job to handle the chunking and embedding generation
            IngestKnowledgeBaseJob::dispatch($document, $extractedText);

            return $document;
        } catch (Exception $e) {
            $document->update(['status' => 'failed']);
            Log::error('KnowledgeBase ingestion failed: '.$e->getMessage());

            throw $e;
        }
    }

    protected function extractText(string $path, string $extension): string
    {
        return match (strtolower($extension)) {
            'txt' => file_get_contents($path),
            'pdf' => $this->extractTextFromPdf($path),
            'docx' => $this->extractTextFromDocx($path),
            default => throw new Exception("Unsupported file extension: {$extension}"),
        };
    }

    protected function extractTextFromPdf(string $path): string
    {
        $parser = new PdfParser;

        return $parser->parseFile($path)->getText();
    }

    protected function extractTextFromDocx(string $path): string
    {
        $zip = new ZipArchive;

        if ($zip->open($path) !== true) {
            throw new Exception('Cannot open DOCX file as ZIP archive: '.$path);
        }

        $xml = $zip->getFromName('word/document.xml');
        $zip->close();

        if ($xml === false) {
            throw new Exception('word/document.xml not found in DOCX archive.');
        }

        $dom = new DOMDocument;
        $loaded = $dom->loadXML($xml);
        if (! $loaded) {
            throw new Exception('Failed to parse word/document.xml.');
        }

        $xpath = new DOMXPath($dom);
        $namespace = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        $xpath->registerNamespace('w', $namespace);

        $paragraphs = [];
        $paragraphNodes = $xpath->query('//w:p');

        foreach ($paragraphNodes as $p) {
            $text = '';
            $textNodes = $xpath->query('.//w:t', $p);
            foreach ($textNodes as $t) {
                $text .= $t->nodeValue;
            }
            $paragraphs[] = trim($text);
        }

        $result = implode("\n", array_filter($paragraphs));

        if (trim($result) === '') {
            Log::warning('Extracted empty text from DOCX file: '.basename($path));
            throw new Exception('Extracted empty text from DOCX file.');
        }

        return $result;
    }

    /**
     * Retrieve the file for downloading (either normalized or original).
     */
    public function download(KnowledgeBase $document, bool $normalized = false): BinaryFileResponse
    {
        $collection = $normalized ? 'normalized' : 'documents';
        $media = $document->getFirstMedia($collection);

        if (! $media) {
            abort(404, 'File not found');
        }

        return response()->download($media->getPath(), $media->file_name);
    }

    /**
     * Delete the document and its associated media and database vector chunks.
     */
    public function destroy(KnowledgeBase $document): void
    {
        try {
            DB::transaction(function () use ($document) {
                // 1. Delete associated chunks from the LangChain embedding table
                DB::table('langchain_pg_embedding')
                    ->whereRaw("cmetadata->>'document_id' = ?", [(string) $document->id])
                    ->delete();

                // 2. Clean up collection if no embeddings remain for this agent
                $collection = DB::table('langchain_pg_collection')
                    ->where('name', 'agent_'.$document->agent_config_id)
                    ->first();

                if ($collection) {
                    $remaining = DB::table('langchain_pg_embedding')
                        ->where('collection_id', $collection->uuid)
                        ->count();

                    if ($remaining === 0) {
                        DB::table('langchain_pg_collection')
                            ->where('uuid', $collection->uuid)
                            ->delete();
                    }
                }

                // 3. Clear Spatie Media Library file collections
                $document->clearMediaCollection('documents');
                $document->clearMediaCollection('normalized');

                // 4. Delete the parent document model
                $document->delete();
            });
        } catch (Exception $e) {
            Log::error("Failed to delete KnowledgeBase document ID {$document->id}: ".$e->getMessage());
            throw $e;
        }
    }
}
