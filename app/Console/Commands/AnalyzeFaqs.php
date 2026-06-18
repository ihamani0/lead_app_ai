<?php

namespace App\Console\Commands;

use App\Jobs\AnalyzeAgentFaqsJob;
use App\Models\AgentConfig;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Bus;

class AnalyzeFaqs extends Command
{
    protected $signature = 'faqs:analyze {--agent= : Specific agent_config_id to analyze}';

    protected $description = 'Analyze conversations and generate FAQ suggestions for all active agents';

    public function handle(): void
    {
        $query = AgentConfig::where('is_active', true);

        if ($agentId = $this->option('agent')) {
            $query->where('id', $agentId);
        }

        $agents = $query->get();

        if ($agents->isEmpty()) {
            $this->warn('No active agents found.');

            return;
        }

        $jobs = $agents->map(fn ($agent) => new AnalyzeAgentFaqsJob($agent));

        Bus::batch($jobs)
            ->name('FAQ Analysis - '.now()->toDateTimeString())
            ->allowFailures()
            ->dispatch();

        $this->info("Dispatched {$jobs->count()} FAQ analysis jobs.");
    }
}
