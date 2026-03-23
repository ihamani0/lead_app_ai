<?php

namespace App\Http\Controllers\Api;

use App\Events\InstanceConnectionUpdated;
use App\Events\QrCodeUpdated;
use App\Http\Controllers\Controller;
use App\Jobs\ReconcileInstanceStatus;
use App\Models\EvolutionInstance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// Evolution Webhook:                                                           │
// [logs] └ POST: /webhooks/evolution • Auth ID: guest
// • event: connection.update
// • instance: ha-hamani-issam-edone-mXzT
// • data: array ( 'instance' => 'ha-hamani-issam-edone-mXzT', 'wuid' => '213697096705@s.whatsapp.net', 'profilePictureUrl' => NULL, 'state' => 'open', 'statusReason' => 200, )
// • destination: http://172.21.0.1:8000/webhooks/evolution
// • date_time: 2026-02-22T20:13:47.486Z
// • sender: 213697096705@s.whatsapp.net
// • server_url: http://localhost:8080 • apikey: NULL ┘

class EvolutionWebhookController extends Controller
{
    //
    public function handle(Request $request)
    {
        // 1. Log payload for debugging (check storage/logs/laravel.log)
        Log::info('Evolution Webhook:', $request->all());

        $payload = $request->all();
        $event = $payload['event'] ?? null;
        $instanceName = $payload['instance'] ?? null;

        if (! $instanceName) {
            return response()->json(['error' => 'No instance specified'], 400);
        }

        /*
        |--------------------------------------------------------------------------
        | QR UPDATED
        |--------------------------------------------------------------------------
        */

        if ($event === 'qrcode.updated') {

            // Extract the QR code correctly from the nested structure
            $qrData = $payload['data']['qrcode'] ?? null;

            if (! $qrData) {
                Log::warning('QR code data missing in webhook', ['payload' => $payload]);

                return response()->json(['error' => 'QR data missing'], 400);
            }

            // Use the base64 image data (ready to display)

            // Or use the raw code if you want to generate QR yourself
            $qrCode = $qrData['code'] ?? null;

            broadcast(new QrCodeUpdated(
                $instanceName,
                $qrCode // This now contains the actual QR data!

            ));

        }

        /*
        |--------------------------------------------------------------------------
        | CONNECTION UPDATED
        |--------------------------------------------------------------------------
        */
        if ($event === 'connection.update') {

            $webhookTime = \Carbon\Carbon::parse($payload['date_time'] ?? now(), 'UTC');

            // Ignore webhooks older than 10 seconds
            if ($webhookTime->diffInSeconds(now('UTC')) > 10) {
                Log::info("Skipping stale webhook for {$instanceName}", [
                    'age_seconds' => $webhookTime->diffInSeconds(now()),
                    'state' => $payload['data']['state'] ?? null,
                ]);
                return response()->json(['status' => 'skipped_stale']);
            }

            
            $state = $payload['data']['state'] ?? 'close';

            // Map Evolution state to your DB status
            // 'open' = connected, 'close' = disconnected, 'connecting' = connecting
            $status = match ($state) {
                'open' => 'connected',
                'close' => 'disconnected',
                'connecting' => 'connecting',
                default => 'disconnected',
            };

            // 3. Update Database
            $instance = EvolutionInstance::where('instance_name', $instanceName)->first();

            if ($instance) {
                // Only update if status actually changed - reduces DB writes and broadcasts
                if ($instance->status !== $status) {
                    // Update was_connected in settings JSON
                    $settings = $instance->settings ?? [];
                    if ($status === 'connected') {
                        $settings['was_connected'] = true;
                    }

                    $instance->update([
                        'status' => $status,
                        'connected_at' => $status === 'connected' ? now() : null,
                        'phone_number' => $status === 'connected' ? explode('@', $payload['data']['wuid'])[0] : null,
                        'settings' => $settings,
                    ]);

                    
                    broadcast(new InstanceConnectionUpdated($instance));

                    // Start reconciliation polling if stuck in connecting
                    if ($status === 'connecting') {
                        ReconcileInstanceStatus::dispatch($instance->id)
                            ->delay(now()->addSeconds(5));
                    }

                    Log::info("Instance {$instanceName} updated to {$status}");
                }
                // If status unchanged - silently skip (no DB write, no broadcast)
            }
        }

        return response()->json(['status' => 'success']);
    }
}
