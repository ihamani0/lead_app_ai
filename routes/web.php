<?php

use App\Http\Controllers\Team\TeamInvitationController;
use Illuminate\Support\Facades\Route;

/*
 * ─────────────────────────────────────────────────────────────┐
 * │  PUBLIC & NON-AUTH ROUTES                                   │
 * │  No authentication required                                 │
 * └─────────────────────────────────────────────────────────────┘
 */
require __DIR__.'/auth.php';
require __DIR__.'/public.php';
require __DIR__.'/webhooks.php';

/*
 * Signed route — invitation acceptance (no auth, URL signed by server)
 */
Route::get('/invitation/{invitation}/accept', [TeamInvitationController::class, 'accept'])
    ->name('teams.invitations.accept')
    ->middleware('signed');

/*
 * ┌─────────────────────────────────────────────────────────────┐
 * │  AUTHENTICATED ROUTES                                       │
 * │  Require auth + email verification                          │
 * └─────────────────────────────────────────────────────────────┘
 */
Route::middleware(['auth', 'verified'])->group(function () {

    // Root redirect → workspace list
    Route::get('/', fn () => redirect()->route('teams.index'));

    // Workspace-scoped features (leads, agents, instances, media, knowledge, reports, team mgmt)
    require __DIR__.'/workspace.php';

    // Team (Workspace) CRUD — root level
    require __DIR__.'/team.php';

    // Tour onboarding
    require __DIR__.'/tour.php';
});

/*
 * Settings routes (auth with various sub-middleware groups)
 */
require __DIR__.'/settings.php';

/*
 * Dev / utility routes
 */
require __DIR__.'/dev.php';
