<?php

/*
 * Workspace-scoped feature routes (auth + workspace middleware required)
 * All routes are prefixed with /workspaces/{slug} and inherit the workspace
 * middleware which resolves the team and sets the active workspace context.
 *
 * Sections:
 * - Dashboard
 * - Leads (CRM)
 * - Agents (AI bot configuration)
 * - Instances (WhatsApp Evolution API connections)
 * - Media (asset catalog)
 * - Reports (aggregated analytics)
 * - Knowledge Base (document ingestion for agents)
 * - Per-workspace team management (invite, members, roles, invitations)
 */
use App\Http\Controllers\AgentController;
use App\Http\Controllers\Api\WorkspaceStatsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EvolutionInstanceController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\MediaAssetController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Team\TeamController;
use App\Http\Controllers\Team\TeamInvitationController;
use App\Http\Controllers\Team\TeamMemberController;
use App\Http\Controllers\Team\TeamRoleController;
use App\Http\Controllers\TestAiController;
use Illuminate\Support\Facades\Route;

/*
 *  Workspace stats for worksspace Home
 */

Route::get('/workspaces/stats', [WorkspaceStatsController::class, 'index'])
    ->name('workspaces.stats');

Route::prefix('workspaces/{slug}')->middleware('workspace')->group(function () {

    /*
     * Dashboard
     */
    Route::get('/dashboard', DashboardController::class)
        ->name('workspaces.dashboard');

    /*
     * Leads — CRM
     */
    Route::get('/leads', [LeadController::class, 'index'])->name('workspaces.leads.index');
    Route::put('/leads/{id}', [LeadController::class, 'update'])->name('workspaces.leads.update');
    Route::post('/leads/{id}/trigger-qualification', [LeadController::class, 'triggerQualification'])->name('workspaces.leads.trigger-qualification');
    Route::post('/leads/bulk-qualify', [LeadController::class, 'bulkQualify'])->name('workspaces.leads.bulk-qualify');

    /*
     * Agents — AI bot configuration
     */
    Route::get('/agents', [AgentController::class, 'index'])->name('workspaces.agents.index');
    Route::post('/agents', [AgentController::class, 'store'])->name('workspaces.agents.store');
    Route::get('/agents/{agent}/prompt-history', [AgentController::class, 'promptHistory'])->name('workspaces.agents.prompt-history');
    Route::post('/agents/{agent}/link-instance', [AgentController::class, 'linkInstance'])->name('workspaces.agents.link-instance');
    Route::post('/agents/{agent}/unlink-instance', [AgentController::class, 'unlinkInstance'])->name('workspaces.agents.unlink-instance');
    Route::post('/agents/{agent}/clone', [AgentController::class, 'clone'])->name('workspaces.agents.clone');
    Route::patch('/agents/{agent}/toggle', [AgentController::class, 'toggle'])->name('workspaces.agents.toggle');
    Route::patch('/agents/{agent}/settings', [AgentController::class, 'updateSettings'])->name('workspaces.agents.update-settings');
    Route::post('/agents/{agent}/reset-prompt', [AgentController::class, 'resetSystemPrompt'])->name('workspaces.agents.reset-prompt');
    Route::post('/agents/{agent}/restore-identity/{version}', [AgentController::class, 'restoreIdentitySettings'])->name('workspaces.agents.restore-identity');
    Route::delete('/agents/{agent}', [AgentController::class, 'destroy'])->name('workspaces.agents.destroy');
    Route::put('/agents/{agent}', [AgentController::class, 'update'])->name('workspaces.agents.update');
    Route::get('/agents/{agent}', [AgentController::class, 'show'])->name('workspaces.agents.show');

    // Agent-scoped test IA
    Route::post('/agents/{agent}/test/send', [TestAiController::class, 'send'])->name('workspaces.agents.test.send');
    Route::post('/agents/{agent}/test/clear', [TestAiController::class, 'clear'])->name('workspaces.agents.test.clear');

    // Agent-scoped instance connection (axios-based)
    Route::post('/agents/{agent}/qr', [AgentController::class, 'fetchQr'])->name('workspaces.agents.qr');
    Route::post('/agents/{agent}/disconnect', [AgentController::class, 'disconnect'])->name('workspaces.agents.disconnect');
    Route::put('/agents/{agent}/restart', [AgentController::class, 'restart'])->name('workspaces.agents.restart');
    Route::post('/agents/{agent}/create-instance', [AgentController::class, 'createInstance'])->name('workspaces.agents.create-instance');

    // Agent-scoped knowledge routes
    Route::post('/agents/{agent}/knowledge', [AgentController::class, 'knowledgeStore'])->name('workspaces.agents.knowledge.store');
    Route::delete('/agents/{agent}/knowledge/{id}', [AgentController::class, 'knowledgeDestroy'])->name('workspaces.agents.knowledge.destroy');
    Route::get('/agents/{agent}/knowledge/{id}/download', [AgentController::class, 'knowledgeDownload'])->name('workspaces.agents.document.download');

    /*
     * Wizard — Guided agent setup flow
     */
    Route::prefix('wizard')->group(function () {
        Route::get('/', [AgentController::class, 'wizardIndex'])->name('workspaces.wizard.index');
        Route::post('/instance', [AgentController::class, 'wizardCreateInstance'])->name('workspaces.wizard.instance');
        Route::post('/qr', [AgentController::class, 'wizardFetchQr'])->name('workspaces.wizard.qr');
        Route::post('/complete', [AgentController::class, 'completeSetup'])->name('workspaces.wizard.complete');
        Route::post('/dismiss-welcome', [AgentController::class, 'dismissWelcome'])->name('workspaces.wizard.dismiss-welcome');
    });

    /*
     * Instances — WhatsApp Evolution API connections
     */
    Route::get('/instances', [EvolutionInstanceController::class, 'index'])->name('workspaces.instances.index');
    Route::post('/instances', [EvolutionInstanceController::class, 'store'])->name('workspaces.instances.store');
    Route::get('/instances/{id}', [EvolutionInstanceController::class, 'show'])->name('workspaces.instances.show');
    Route::post('/instances/{id}/qr', [EvolutionInstanceController::class, 'fetchQr'])->name('workspaces.instances.fetch-qr');
    Route::post('/instances/{id}/disconnect', [EvolutionInstanceController::class, 'disconnect'])->name('workspaces.instances.disconnect');
    Route::put('/instances/{id}/restart', [EvolutionInstanceController::class, 'restart'])->name('workspaces.instances.restart');
    Route::post('/instances/{id}/restore', [EvolutionInstanceController::class, 'restore'])->name('workspaces.instances.restore');
    Route::delete('/instances/{id}', [EvolutionInstanceController::class, 'destroy'])->name('workspaces.instances.destroy');
    Route::delete('/instances/{id}/force', [EvolutionInstanceController::class, 'forceDestroy'])->name('workspaces.instances.force-destroy');

    /*
     * Media — Asset catalog (images/videos for AI agents)
     */
    Route::get('/media', [MediaAssetController::class, 'index'])->name('workspaces.media.index');
    Route::post('/media', [MediaAssetController::class, 'store'])->name('workspaces.media.store');

    Route::put('/media/{id}', [MediaAssetController::class, 'update'])->name('workspaces.media.update');
    Route::delete('/media/{id}', [MediaAssetController::class, 'destroy'])->name('workspaces.media.destroy');
    Route::post('/media/{id}/toggle-default', [MediaAssetController::class, 'toggleDefault'])->name('workspaces.media.toggle-default');

    Route::post('/media/presign', [MediaAssetController::class, 'presign'])->name('workspaces.media.presign');
    Route::post('/media/finalize', [MediaAssetController::class, 'finalize'])->name('workspaces.media.finalize');

    /*
     * Reports — Aggregated analytics
     */
    Route::get('/reports', [ReportController::class, 'index'])->name('workspaces.reports.index');

    /*
     * Knowledge Base — Document ingestion for agents
     */
    Route::get('/knowledge', [KnowledgeBaseController::class, 'index'])->name('workspaces.knowledge.index');
    Route::post('/knowledge', [KnowledgeBaseController::class, 'store'])->name('workspaces.knowledge.store');
    Route::delete('/knowledge/{id}', [KnowledgeBaseController::class, 'destroy'])->name('workspaces.knowledge.destroy');
    Route::get('/knowledge/download/{id}', [KnowledgeBaseController::class, 'download'])->name('workspaces.knowledge.web.download');

    /*
     * Members — Workspace member management
     */
    Route::get('/members', [TeamMemberController::class, 'index'])->name('workspaces.members.index');

    /*
     * Per-workspace team management
     */
    Route::post('/invite', [TeamController::class, 'invite'])->name('teams.invite');

    Route::put('/members/{user}', [TeamMemberController::class, 'updateRole'])->name('teams.members.update-role');
    Route::delete('/members/{user}', [TeamMemberController::class, 'destroy'])->name('teams.members.destroy');

    Route::post('/roles', [TeamRoleController::class, 'store'])->name('teams.roles.store');
    Route::put('/roles/{role}', [TeamRoleController::class, 'update'])->name('teams.roles.update');
    Route::delete('/roles/{role}', [TeamRoleController::class, 'destroy'])->name('teams.roles.destroy');

    Route::delete('/invitations/{invitation}', [TeamInvitationController::class, 'destroy'])->name('teams.invitations.destroy');
});
