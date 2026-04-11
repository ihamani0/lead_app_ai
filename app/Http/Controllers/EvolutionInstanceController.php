<?php

namespace App\Http\Controllers;

use App\Events\InstanceConnectionUpdated;
use App\Models\EvolutionInstance;
use App\Models\Tenant;
use App\Services\EvolutionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EvolutionInstanceController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $instances = EvolutionInstance::active()
            ->where('tenant_id', $tenantId)
            ->orderByDesc('created_at')
            ->get([
                'id',
                'instance_name',
                'display_name',
                'status',
                'phone_number',
                'created_at',
            ]);

        $deletedInstances = EvolutionInstance::onlyTrashed()
            ->where('tenant_id', $tenantId)
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

        return Inertia::render('Profil/Index', [
            'instances' => $instances,
            'deletedInstances' => $deletedInstances,
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

        $instanceToken = Str::random(32);

        try {
            DB::transaction(function () use ($request, $evolutionService, $evolutionInstanceName, $instanceToken, $user) {
                $response = $evolutionService->createInstance($evolutionInstanceName, $instanceToken);

                if (isset($response['error'])) {
                    throw new Exception(
                        data_get($response, 'response.message.0', 'Evolution API error')
                    );
                }

                EvolutionInstance::create([
                    'tenant_id' => $user->tenant_id,
                    'instance_name' => $evolutionInstanceName,
                    'display_name' => $request->display_name,
                    'phone_number' => $request->phone_number,
                    'settings' => [
                        'token' => $instanceToken,
                    ],
                ]);

                return back()->with('success', __('messages.success.instance_create'));
            });
        } catch (Exception $e) {
            return back()->withErrors(['error' => __('messages.error.instance_create').$e->getMessage()]);
        }
    }

    public function show(Request $request, $id)
    {
        $instance = EvolutionInstance::with('agentConfig')
            ->where('tenant_id', $request->user()->tenant_id)
            ->where('instance_name', $id)->first();

        return Inertia::render('Profil/Show', [
            'instance' => $instance,
        ]);
    }

    public function fetchQr(Request $request, $id, EvolutionService $service)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($id);

        $settings = $instance->settings ?? [];
        $settings['was_connected'] = false;
        $instance->update([
            'settings' => $settings,
            'status' => 'connecting',
        ]);

        $service->fetchQrCode($instance->instance_name);

        return back();
    }

    public function restart(Request $request, $id, EvolutionService $evolutionService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);

        $response = $evolutionService->restartInstance($instance->instance_name);

        $instance->update(['status' => 'connecting']);
        broadcast(new InstanceConnectionUpdated($instance));

        return back()->with('success', __('messages.success.instance_restarting'));
    }

    public function disconnect(Request $request, $id, EvolutionService $evolutionService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($id);

        if ($instance->status === 'disconnected') {
            return back()->with('info', __('messages.success.instance_already_disconnected'));
        }

        try {
            DB::transaction(function () use ($instance, $evolutionService) {
                try {
                    $evolutionService->logoutInstance($instance->instance_name);
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

    public function destroy(Request $request, $id, EvolutionService $evolutionService)
    {
        $instance = EvolutionInstance::where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($id);

        try {
            DB::transaction(function () use ($instance, $evolutionService) {
                try {
                    if ($instance->status !== 'disconnected') {
                        $evolutionService->logoutInstance($instance->instance_name);
                    }
                    $evolutionService->deleteInstance($instance->instance_name);
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

    public function forceDestroy(Request $request, $id, EvolutionService $evolutionService)
    {
        $instance = EvolutionInstance::withTrashed()
            ->where('tenant_id', $request->user()->tenant_id)
            ->findOrFail($id);

        try {
            $evolutionService->deleteInstance($instance->instance_name);
            $instance->forceDelete();

            return back()->with('success', __('messages.success.instance_force_deleted'));
        } catch (Exception $e) {
            return back()->withErrors(['error' => __('messages.error.instance_force_destroy', ['message' => $e->getMessage()])]);
        }
    }

    /**
     * RESTORE: Re-create in Evolution behind the scenes
     */
    public function restore(Request $request, $id, EvolutionService $evolutionService)
    {
        $instance = EvolutionInstance::withTrashed()
            ->where('tenant_id', $request->user()->tenant_id)
            ->where('instance_name', $id)->first();

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
                    $settings['token'] = $newToken;
                    $settings['recreated_at'] = now()->toIso8601String();
                    $settings['original_instance_name'] = $settings['previous_instance_name'] ?? null;
                    unset($settings['needs_recreation'], $settings['reserved_instance_name']);
                }

                $instance->restore();

                $instance->update([
                    'status' => 'disconnected',
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
