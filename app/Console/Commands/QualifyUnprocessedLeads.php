<?php

namespace App\Console\Commands;

use App\Models\Lead;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QualifyUnprocessedLeads extends Command
{
    protected $signature = 'leads:qualify-unprocessed 
                            {--limit=50 : Number of leads to process per run}
                            {--dry-run : Preview leads without triggering qualification}
                            {--force : Process even if recently attempted}';

    protected $description = 'Automatically trigger AI qualification for unprocessed leads';

    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        $dryRun = $this->option('dry-run');
        $force = $this->option('force');

        $query = Lead::where(function ($q) {
            $q->where('is_new', true)
                ->orWhereNull('ai_qualification_status')
                ->orWhere('ai_qualification_status', 'NON_QUALIFIE');
        })
            ->whereNotNull('instance_id')
            ->whereHas('instance', function ($q) {
                $q->where('status', 'connected');
            });

        if (! $force) {
            $query->where(function ($q) {
                $q->whereNull('last_qualification_attempt_at')
                    ->orWhere('last_qualification_attempt_at', '<', now()->subHours(24));
            });
        }

        $leads = $query->limit($limit)->get();

        if ($leads->isEmpty()) {
            $this->info('No unprocessed leads found.');

            return Command::SUCCESS;
        }

        $this->info("Found {$leads->count()} unprocessed leads.");

        if ($dryRun) {
            $this->warn('DRY RUN - No actual qualification will be triggered.');
            $this->table(
                ['ID', 'Name', 'Phone', 'Instance', 'Created At'],
                $leads->map(fn ($lead) => [
                    $lead->id,
                    $lead->name,
                    $lead->phone,
                    $lead->instance?->instance_name ?? 'N/A',
                    $lead->created_at->toDateTimeString(),
                ])
            );

            return Command::SUCCESS;
        }

        $successCount = 0;
        $failedCount = 0;

        foreach ($leads as $lead) {
            try {
                $webhookUrl = config('services.n8n.n8n_base_url').'/webhook/lead/qualification';

                $response = Http::timeout(30)->withHeaders([
                    'X-N8N-API-KEY' => config('services.n8n.api_key'),
                ])->post($webhookUrl, [
                    'instanceName' => $lead->instance->instance_name,
                    'phone' => $lead->phone,
                ]);

                if ($response->successful()) {
                    $lead->update([
                        'is_new' => false,
                        'last_qualification_attempt_at' => now(),
                    ]);
                    $successCount++;
                    $this->line("✅ Qualified lead: {$lead->name} ({$lead->phone})");
                    Log::info("Auto-qualified lead {$lead->id}", [
                        'phone' => $lead->phone,
                        'instance' => $lead->instance->instance_name,
                    ]);
                } else {
                    $failedCount++;
                    $this->error("❌ Failed for lead {$lead->id}: HTTP {$response->status()}");
                    Log::warning("Failed to qualify lead {$lead->id}", [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                }

                // Rate limiting - wait between calls
                usleep(500000); // 0.5 second delay

            } catch (\Exception $e) {
                $failedCount++;
                $this->error("❌ Exception for lead {$lead->id}: {$e->getMessage()}");
                Log::error("Qualification exception for lead {$lead->id}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Completed: {$successCount} success, {$failedCount} failed.");
        Log::info('Qualification batch completed', [
            'total' => $leads->count(),
            'success' => $successCount,
            'failed' => $failedCount,
        ]);

        return $failedCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
