<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Run the pruning command daily at 2:00 AM
Schedule::command('model:prune')->dailyAt('02:00');

// Auto-qualify unprocessed leads daily at 2:00 AM
Schedule::command('leads:qualify-unprocessed')->dailyAt('02:00');

// Analyze conversations and generate FAQ suggestions daily at 3:00 AM
Schedule::command('faqs:analyze')->dailyAt('03:00');
