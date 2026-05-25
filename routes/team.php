<?php

/*
 * Team (Workspace) CRUD — root-level routes (auth + verified required)
 * These operate on the workspace entity itself, outside the workspace scope.
 *
 * Routes:
 * - GET  /workspaces       → List user's workspaces
 * - POST /workspaces       → Create a new workspace
 * - GET  /workspaces/{slug} → Show workspace details (with workspace middleware)
 * - PUT  /workspaces/{slug} → Update workspace settings
 * - DELETE /workspaces/{slug} → Delete a workspace
 */
use App\Http\Controllers\Team\TeamController;
use Illuminate\Support\Facades\Route;

Route::get('/workspaces', [TeamController::class, 'index'])->name('teams.index');
Route::post('/workspaces', [TeamController::class, 'store'])->name('teams.store');
Route::get('/workspaces/{slug}', [TeamController::class, 'show'])->name('teams.show')->middleware('workspace');
Route::put('/workspaces/{slug}', [TeamController::class, 'update'])->name('teams.update');
Route::delete('/workspaces/{slug}', [TeamController::class, 'destroy'])->name('teams.destroy');
