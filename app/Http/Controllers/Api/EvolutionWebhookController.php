<?php

namespace App\Http\Controllers\Api;

use App\Events\InstanceConnectionUpdated;
use App\Events\QrCodeUpdated;
use App\Http\Controllers\Controller;
use App\Jobs\ProcessLeadMessage;
use App\Jobs\ProcessMessageReceipt;
use App\Models\EvolutionInstance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EvolutionWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('Evolution Webhook received', ['payload' => $request->all()]);

        $payload = $request->all();
        $event = $payload['event'] ?? null;
        $instanceId = $payload['instanceId'] ?? null;

        if (! $instanceId) {
            return response()->json(['error' => 'No instanceId specified'], 400);
        }

        $instance = EvolutionInstance::where('uuid', $instanceId)->first();
        if (! $instance) {
            Log::warning("Instance not found for uuid: {$instanceId}");

            return response()->json(['status' => 'success']);
        }

        $instanceName = $instance->instance_name;

        if ($event === 'QRCode') {
            $data = $payload['data'] ?? [];
            $qrCode = $data['code'] ?? null;

            $instance->update(['qr_code' => $qrCode]);
            broadcast(new QrCodeUpdated($instanceName, $qrCode));

            if ($qrCode) {
                Log::info("QR code received for instance {$instanceName}");
            }

            return response()->json(['status' => 'success']);
        }

        if ($event === 'Connected') {
            $data = $payload['data'] ?? [];
            $jid = $data['jid'] ?? null;

            $phone = $jid ? explode(':', explode('@', $jid)[0])[0] : null;

            $instance->update([
                'status' => 'connected',
                'phone_number' => $phone,
                'connected_at' => now(),
                'qr_code' => null,
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Instance {$instanceName} connected");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'PairSuccess') {
            $data = $payload['data'] ?? [];
            $jid = $data['jid'] ?? null;

            $phone = $jid ? explode(':', explode('@', $jid)[0])[0] : null;

            $instance->update([
                'status' => 'connected',
                'phone_number' => $phone,
                'connected_at' => now(),
                'qr_code' => null,
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Instance {$instanceName} paired successfully");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'LoggedOut') {
            $data = $payload['data'] ?? [];
            $reason = $data['Reason'] ?? $data['reason'] ?? '';

            $instance->update([
                'status' => 'disconnected',
                'phone_number' => null,
                'connected_at' => null,
                'qr_code' => null,
                'settings' => array_merge($instance->settings ?? [], ['disconnect_reason' => $reason]),
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::warning("Instance {$instanceName} logged out: {$reason}");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'Disconnected') {
            $instance->update(['status' => 'connecting']);
            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Instance {$instanceName} disconnected, evo-go will auto-reconnect");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'ConnectFailure') {
            $data = $payload['data'] ?? [];
            $reason = $data['reason'] ?? '';
            $code = $this->extractFailureCode($reason);

            if (in_array($code, [401, 403, 406, 400, 402])) {
                $instance->update([
                    'status' => 'disconnected',
                    'qr_code' => null,
                    'settings' => array_merge($instance->settings ?? [], ['disconnect_reason' => $reason]),
                ]);
            } else {
                $instance->update([
                    'status' => 'connecting',
                    'settings' => array_merge($instance->settings ?? [], ['disconnect_reason' => $reason]),
                ]);
            }

            broadcast(new InstanceConnectionUpdated($instance));
            Log::warning("Instance {$instanceName} connection failed: {$reason} (code: {$code})");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'OfflineSyncCompleted') {
            Log::info("Instance {$instanceName} offline sync completed", $payload['data'] ?? []);

            return response()->json(['status' => 'success']);
        }

        if ($event === 'Message' || $event === 'SendMessage') {
            ProcessLeadMessage::dispatch($payload);

            return response()->json(['status' => 'queued']);
        }

        if ($event === 'Receipt') {
            ProcessMessageReceipt::dispatch($payload);

            return response()->json(['status' => 'queued']);
        }

        return response()->json(['status' => 'success']);
    }

    private function extractFailureCode(?string $reason): ?int
    {
        if ($reason === null || $reason === '') {
            return null;
        }

        if (preg_match('/^(\d{3})/', $reason, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }
}
