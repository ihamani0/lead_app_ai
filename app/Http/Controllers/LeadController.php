<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\WorkspaceScoped;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use Ihamani0\LaravelEvolutionApi\Facades\EvolutionApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class LeadController extends Controller
{
    use WorkspaceScoped;

    public function index(Request $request)
    {
        $filters = $request->only([
            'search', 'status', 'temperature', 'date_from', 'date_to', 'min_score', 'instance_id',
        ]);

        $instances = $this->scopedQuery($request, EvolutionInstance::class)
            ->select('id', 'instance_name', 'phone_number')
            ->get();

        $leads = $this->scopedQuery($request, Lead::class)
            ->with(['instance:id,instance_name,phone_number'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            // New Filter: Instance Name
            ->when($request->instance_id, fn ($q, $instance) => $q->where('instance_id', $instance))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->temperature, function ($q, $temp) {
                if ($temp === 'UNQUALIFIED') {
                    return $q->where(function ($sub) {
                        $sub->where('is_new', true)
                            ->orWhere('ai_qualification_status', 'NON_QUALIFIE')
                            ->orWhereNull('ai_qualification_status');
                    });
                }

                return $q->where('qualification_result', $temp);
            })
            ->when($request->date_from, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($request->min_score, fn ($q, $score) => $q->where('qualification_score', '>=', $score))
            ->orderBy('updated_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $roleCode = $this->getRoleCode($request);

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
            'filters' => $filters,
            'instances' => $instances,
            'canManage' => in_array($roleCode, ['owner', 'admin']),
        ]);
    }

    public function show(Request $request, string $slug, $lead)
    {
        $lead = $this->scopedQuery($request, Lead::class)
            ->with(['instance:id,instance_name,phone_number,display_name,status'])
            ->findOrFail($lead);

        return Inertia::render('Leads/Show', [
            'lead' => $lead,
            'similarLeads' => Inertia::defer(fn () => $this->findSimilarLeads($request, $lead)),
        ]);
    }

    private function findSimilarLeads(Request $request, Lead $lead): array
    {
        $customData = $lead->custom_data ?? [];

        $quartier = $customData['quartier'] ?? $customData['zone'] ?? $customData['area'] ?? null;

        $query = $this->scopedQuery($request, Lead::class)
            ->where('id', '!=', $lead->id)
            ->select('id', 'name', 'phone', 'status', 'qualification_result', 'qualification_score', 'last_activity_at')
            ->limit(5);

        if ($quartier) {
            $query->where(function ($q) use ($quartier) {
                $q->where('custom_data->quartier', $quartier)
                    ->orWhere('custom_data->zone', $quartier)
                    ->orWhere('custom_data->area', $quartier);
            });
        }

        $query->orderBy('last_activity_at', 'desc');

        return $query->get()->toArray();
    }

    public function export(Request $request, string $slug)
    {
        $this->authorizeRole($request, ['owner', 'admin']);

        $leads = $this->scopedQuery($request, Lead::class)
            ->with(['instance:id,instance_name,phone_number'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->instance_id, fn ($q, $instance) => $q->where('instance_id', $instance))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->temperature, function ($q, $temp) {
                if ($temp === 'UNQUALIFIED') {
                    return $q->where(function ($sub) {
                        $sub->where('is_new', true)
                            ->orWhere('ai_qualification_status', 'NON_QUALIFIE')
                            ->orWhereNull('ai_qualification_status');
                    });
                }

                return $q->where('qualification_result', $temp);
            })
            ->when($request->date_from, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($request->min_score, fn ($q, $score) => $q->where('qualification_score', '>=', $score))
            ->orderBy('updated_at', 'desc')
            ->get();

        $filename = 'leads-'.now()->format('Y-m-d_His').'.csv';

        return response()->streamDownload(function () use ($leads) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, [
                'Nom', 'Téléphone', 'Statut', 'Résultat', 'Score IA',
                'Instance', 'Date création', 'Dernière activité',
            ]);

            foreach ($leads as $lead) {
                fputcsv($handle, [
                    $lead->name,
                    $lead->phone,
                    $lead->status,
                    $lead->qualification_result,
                    $lead->qualification_score,
                    $lead->instance?->instance_name ?? '',
                    $lead->created_at?->format('d/m/Y H:i'),
                    $lead->last_activity_at?->format('d/m/Y H:i'),
                ]);
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    // Optional: Allow manual override
    public function update(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin']);

        $lead = $this->findScoped($request, Lead::class, $request->route('id'));

        $lead->update($request->only([
            'name',
            'status',
            'temperature',
            'qualification_result',
            'qualification_score',
            'treatment_status',
            'notes',
            'is_new',
        ]));

        if ($request->has('custom_data')) {
            $lead->custom_data = array_merge($lead->custom_data ?? [], $request->custom_data);
            $lead->save();
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back()->with('success', __('messages.success.lead_udated_manually'));
    }

    public function triggerQualification(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin']);

        $lead = $this->scopedQuery($request, Lead::class)->with('instance')->findOrFail($request->route('id'));

        // Set status to QUALIFYING before calling N8n
        $lead->update(['status' => 'QUALIFYING']);

        $webhookUrl = config('services.n8n.n8n_base_url').'/webhook/lead/qualification';
        // http://127.0.0.1:5678/webhook-test/lead/qualification
        $response = Http::withHeaders([
            'X-N8N-API-KEY' => config('services.n8n.api_key'),
        ])->post($webhookUrl, [
            'instanceName' => $lead->instance->instance_name,
            'phone' => $lead->phone,
        ]);

        return back()->with('success', __('messages.success.qualification_in_progress'));
    }

    public function bulkQualify(Request $request)
    {
        $this->authorizeRole($request, ['owner', 'admin']);

        $leadIds = $request->input('lead_ids', []);

        $leads = $this->scopedQuery($request, Lead::class)
            ->whereIn('id', $leadIds)
            ->with('instance')
            ->get();

        $successCount = 0;
        $failedCount = 0;

        foreach ($leads as $lead) {
            try {
                $webhookUrl = config('services.n8n.n8n_base_url').'/webhook/lead/qualification';

                $response = Http::withHeaders([
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
                } else {
                    $failedCount++;
                }

                usleep(500000);

            } catch (\Exception $e) {
                $failedCount++;
            }
        }

        $message = "Qualification déclenchée: {$successCount} succès, {$failedCount} échecs.";

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => $message]);
        }

        return back()->with('success', $message);
    }

    public function profile(Request $request, string $slug, Lead $lead)
    {
        $lead->loadMissing('instance');

        $instance = $lead->instance;
        if (! $instance || ! $instance->api_token) {
            return response()->json(['profile' => null, 'error' => 'No instance configured'], 404);
        }

        $instanceName = $instance->instance_name;
        $token = $instance->api_token;
        $phoneWithSuffix = $lead->phone.'@s.whatsapp.net';

        try {
            // /user/info — returns data.Users keyed by phone@sid
            $info = EvolutionApi::setInstance($instanceName, $token)
                ->user()
                ->info([$phoneWithSuffix]);

            // /user/avatar — returns data.url (direct WhatsApp CDN link)
            $avatar = EvolutionApi::setInstance($instanceName, $token)
                ->user()
                ->avatar($phoneWithSuffix, true);
        } catch (\Exception $e) {
            return response()->json(['profile' => null, 'error' => $e->getMessage()], 500);
        }

        // Parse info response: data.Users -> { "213697096705@s.whatsapp.net": {...} }
        $users = $info['data']['Users'] ?? [];
        $userData = $users[$phoneWithSuffix] ?? reset($users) ?: null;

        return response()->json([
            'profile' => [
                'name' => $userData['pushName'] ?? $lead->name,
                'phone' => $lead->phone,
                'about' => $userData['about'] ?? $userData['Status'] ?? null,
                'picture' => $avatar['data']['url'] ?? null,
                'isBusiness' => $userData['isBusiness'] ?? false,
                'verified' => $userData['VerifiedName'] ?? null,
                'lid' => $userData['LID'] ?? null,
            ],
        ]);
    }

    public function block(Request $request, string $slug, Lead $lead)
    {
        $lead->loadMissing('instance.agentConfig');

        $instance = $lead->instance;
        if (! $instance || ! $instance->api_token) {
            return response()->json(['error' => 'No instance configured'], 400);
        }

        $agentConfig = $instance->agentConfig;
        if (! $agentConfig?->evo_integration_id) {
            return response()->json(['error' => 'No bot configured for this instance'], 400);
        }

        $instanceName = $instance->instance_name;
        $token = $instance->api_token;
        $remoteJid = $lead->phone.'@s.whatsapp.net';

        try {
            // Pause bot session
            EvolutionApi::setInstance($instanceName, $token)
                ->n8n()
                ->changeSessionStatus($remoteJid, 'paused');

            // Add to ignore list
            EvolutionApi::setInstance($instanceName, $token)
                ->n8n()
                ->ignoreJid($agentConfig->evo_integration_id, $remoteJid, 'add');

            // TODO: Evolution API user()->block() not working yet
            // EvolutionApi::setInstance($instanceName, $token)
            //     ->user()
            //     ->block($lead->phone);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
