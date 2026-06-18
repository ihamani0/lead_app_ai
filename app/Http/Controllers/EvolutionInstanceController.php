<?php

namespace App\Http\Controllers;

use App\Events\InstanceConnectionUpdated;
use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\EvolutionInstance;
use App\Models\Tenant;
use App\Services\EvolutionService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EvolutionInstanceController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $team = $request->attributes->get('active_team');
        $scope = $team ? [['tenant_id', $tenantId], ['team_id', $team->id]] : [['tenant_id', $tenantId]];
        $instances = $this->scopedQuery($request, EvolutionInstance::class)
            ->active()
            ->orderByDesc('created_at')
            ->get([
                'id',
                'instance_name',
                'display_name',
                'status',
                'phone_number',
                'created_at',
            ]);

        $deletedInstances = $this->scopedQuery($request, EvolutionInstance::class)
            ->onlyTrashed()
            ->orderByDesc('deleted_at')
            ->get([
                'id',
                'instance_name',
                'display_name',
                'phone_number',
                'deleted_at',
                'settings',
                'created_at',
            ]);

        $roleCode = $this->getRoleCode($request);
        $canManage = in_array($roleCode, ['owner', 'admin', 'member']);

        return Inertia::render('Profil/Index', [
            'instances' => $instances,
            'deletedInstances' => $deletedInstances,
            'canCreate' => $canManage,
            'canManage' => $canManage,
        ]);
    }

    public function store(Request $request, EvolutionService $evolutionService)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'display_name' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $evolutionInstanceName = $this->generateInstanceName(
            tenant: $user->tenant,
            displayName: $request->display_name ?? $request->name
        );

        $instanceToken = (string) Str::uuid();

        try {
            DB::transaction(function () use ($request, $evolutionService, $evolutionInstanceName, $instanceToken, $user) {
                $response = $evolutionService->createInstance($evolutionInstanceName, $instanceToken);

                if (isset($response['error'])) {
                    throw new Exception(
                        data_get($response, 'response.message.0', 'Evolution API error')
                    );
                }

                $responseData = $response['data'];
                $apiToken = $responseData['token'] ?? $instanceToken;
                $uuid = $responseData['id'];

                // 3. Create DB record
                $instance = EvolutionInstance::create($this->withTeam($request, [
                    'tenant_id' => $user->tenant_id,
                    'instance_name' => $evolutionInstanceName,
                    'display_name' => $request->display_name,
                    'phone_number' => $request->phone_number,
                    'api_token' => $apiToken,
                    'uuid' => $uuid,
                ]));

                // 4. Connect immediately — configures webhook + subscribes to ALL events
                $evolutionService->connectInstance($instance);

                return back()->with('success', __('messages.success.instance_create'));
            });
        } catch (Exception $e) {
            return back()->withErrors(['error' => __('messages.error.instance_create').$e->getMessage()]);
        }
    }

    public function update(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $validated = $request->validate([
            'display_name' => 'nullable|string|max:50',
        ]);

        $instance = $this->findScoped($request, EvolutionInstance::class, $request->route('id'));
        $instance->update($validated);

        return back()->with('success', 'Instance updated successfully.');
    }

    public function show(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member', 'viewer']);

        $instance = $this->scopedQuery($request, EvolutionInstance::class)
            ->with('agentConfig')
            ->where('instance_name', $request->route('id'))->firstOrFail();

        $instance->messages_today = $instance->leads()
            ->whereDate('created_at', Carbon::today())
            ->count();

        $instance->leads_count = $instance->leads()->count();

        $instance->connection_quality = match ($instance->status) {
            'connected' => 'excellente',
            'connecting' => 'bonne',
            default => 'faible',
        };

        return Inertia::render('Profil/Show', [
            'instance' => $instance,
        ]);
    }

    public function fetchQr(Request $request, EvolutionService $service)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $instance = $this->findScoped($request, EvolutionInstance::class, $request->route('id'));

        $instance->update([
            'status' => 'connecting',
        ]);

        // $service->connectInstance($instance);
        $service->fetchQrCode($instance);

        return back();
    }

    public function restart(Request $request, EvolutionService $evolutionService)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $instance = $this->findScoped($request, EvolutionInstance::class, $request->route('id'));

        $response = $evolutionService->restartInstance($instance);

        $instance->update(['status' => 'connecting']);
        broadcast(new InstanceConnectionUpdated($instance));

        return back()->with('success', __('messages.success.instance_restarting'));
    }

    public function disconnect(Request $request, EvolutionService $evolutionService)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $instance = $this->findScoped($request, EvolutionInstance::class, $request->route('id'));

        if ($instance->status === 'disconnected') {
            return back()->with('info', __('messages.success.instance_already_disconnected'));
        }

        try {
            DB::transaction(function () use ($instance, $evolutionService) {
                try {
                    $evolutionService->logoutInstance($instance);
                } catch (Exception $e) {
                    Log::warning("Evolution API logout failed for {$instance->instance_name}: ".$e->getMessage());
                }

                $settings = $instance->settings ?? [];
                $settings['previous_phones'] = array_merge(
                    $settings['previous_phones'] ?? [],
                    [$instance->phone_number => now()->toIso8601String()]
                );

                $instance->update([
                    'status' => 'disconnected',
                    'phone_number' => null,
                    'connected_at' => null,
                    'qr_code' => null,
                    'settings' => $settings,
                ]);

                broadcast(new InstanceConnectionUpdated($instance));
            });

            return back()->with('success', __('messages.success.instance_disconnected'));
        } catch (Exception $e) {
            Log::error('Disconnect failed: '.$e->getMessage());

            return back()->withErrors(['error' => __('messages.error.instance_disconnect')]);
        }
    }

    public function destroy(Request $request, EvolutionService $evolutionService)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $instance = $this->findScoped($request, EvolutionInstance::class, $request->route('id'));

        try {
            DB::transaction(function () use ($instance, $evolutionService) {
                try {
                    if ($instance->status !== 'disconnected') {
                        $evolutionService->logoutInstance($instance);
                    }
                    $evolutionService->deleteInstance($instance);
                } catch (Exception $e) {
                    Log::warning('Evolution delete failed: '.$e->getMessage());
                }

                $settings = $instance->settings ?? [];
                $settings['needs_recreation'] = true;
                $settings['previous_instance_name'] = $instance->instance_name;

                $settings['reserved_instance_name'] = $this->generateInstanceName(
                    tenant: $instance->tenant,
                    displayName: $instance->display_name,
                    suffix: 'restored'
                );

                $instance->update([
                    'settings' => $settings,
                    'status' => 'disconnected',
                ]);

                $instance->delete();
            });

            return back()->with('success', __('messages.success.instance_deleted'));
        } catch (Exception $e) {
            Log::error('Destroy failed: '.$e->getMessage());

            return back()->withErrors(['error' => __('messages.error.instance_destroy')]);
        }
    }

    public function forceDestroy(Request $request, EvolutionService $evolutionService)
    {
        $this->authorizeRole($request, ['owner', 'admin']);

        $instance = EvolutionInstance::withTrashed()
            ->where($this->scope($request))
            ->findOrFail($request->route('id'));

        try {
            $evolutionService->deleteInstance($instance);
            $instance->forceDelete();

            return back()->with('success', __('messages.success.instance_force_deleted'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => __('messages.error.instance_force_destroy', ['message' => $e->getMessage()])]);
        }
    }

    /**
     * RESTORE: Re-create in Evolution behind the scenes
     */
    public function restore(Request $request, EvolutionService $evolutionService)
    {
        $this->authorizeRole($request, ['owner', 'admin', 'member']);

        $instance = EvolutionInstance::withTrashed()
            ->where($this->scope($request))
            ->where('instance_name', $request->route('id'))->first();

        if (! $instance->trashed()) {
            return back()->with('info', __('messages.success.instance_not_deleted'));
        }

        try {
            DB::transaction(function () use ($instance, $evolutionService) {
                $settings = $instance->settings ?? [];

                if ($settings['needs_recreation'] ?? false) {
                    $newInstanceName = $settings['reserved_instance_name']
                        ?? $this->generateInstanceName(
                            tenant: $instance->tenant,
                            displayName: $instance->display_name,
                            suffix: 'restored'
                        );

                    $newToken = Str::random(32);

                    $response = $evolutionService->createInstance($newInstanceName, $newToken);

                    if (isset($response['error'])) {
                        throw new Exception(__('messages.error.instance_recreate', [
                            'message' => data_get($response, 'response.message.0', 'Unknown error'),
                        ]));
                    }

                    $instance->instance_name = $newInstanceName;
                    $instance->api_token = $response['token'] ?? $newToken;
                    $instance->uuid = $response['instanceId'] ?? $response['id'] ?? null;
                    $settings['recreated_at'] = now()->toIso8601String();
                    $settings['original_instance_name'] = $settings['previous_instance_name'] ?? null;
                    unset($settings['needs_recreation'], $settings['reserved_instance_name']);
                }

                $instance->restore();

                $instance->update([
                    'status' => 'disconnected',
                    'api_token' => $instance->api_token,
                    'uuid' => $instance->uuid,
                    'settings' => $settings,
                ]);
            });

            return back()
                ->with('success', __('messages.success.instance_restor'));
        } catch (Exception $e) {
            Log::error('Restore failed: '.$e->getMessage());

            return back()->withErrors(['error' => __('messages.error.instance_restor')]);
        }
    }

    /**
     * Generate unique instance name for Evolution API
     *
     * Format: {tenant-slug}-{display-name}-{random|suffix}
     *
     * @param  string|null  $suffix  Custom suffix instead of random (e.g., 'restored')
     */
    private function generateInstanceName(Tenant $tenant, ?string $displayName = null, ?string $suffix = null): string
    {
        $tenantSlug = $tenant->slug ?? 'tenant';
        $baseName = Str::slug($displayName ?? 'instance');

        // Use provided suffix or generate random
        $uniquePart = Str::random(6);

        if ($suffix) {
            return "{$tenantSlug}-{$baseName}-{$uniquePart}-{$suffix}";
        }

        return "{$tenantSlug}-{$baseName}-{$uniquePart}";
    }
}
