<?php

namespace App\Http\Controllers\Api;

use App\Events\InstanceConnectionUpdated;
use App\Events\LeadMessageUpdated;
use App\Events\QrCodeUpdated;
use App\Http\Controllers\Controller;
use App\Models\EvolutionInstance;
use App\Models\Lead;
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

        /*
        |--------------------------------------------------------------------------
        | QR CODE
        |--------------------------------------------------------------------------
        */
        if ($event === 'QRCode') {
            $data = $payload['data'] ?? [];
            $qrCode = $data['code'] ?? null;

            broadcast(new QrCodeUpdated($instanceName, $qrCode));

            if ($qrCode) {
                Log::info("QR code received for instance {$instanceName}");
            }

            return response()->json(['status' => 'success']);
        }

        /*
        |--------------------------------------------------------------------------
        | CONNECTION EVENTS
        |--------------------------------------------------------------------------
        */
        if ($event === 'Connected') {
            $data = $payload['data'] ?? [];
            $status = $data['status'] ?? 'open';
            $jid = $data['jid'] ?? null;
            $pushName = $data['pushName'] ?? null;

            $phone = $jid ? explode(':', explode('@', $jid)[0])[0] : null;

            $instance->update([
                'status' => 'connected',
                'phone_number' => $phone,
                'connected_at' => now(),
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Instance {$instanceName} connected");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'PairSuccess') {
            $data = $payload['data'] ?? [];
            $jid = $data['jid'] ?? null;
            $pushName = $data['pushName'] ?? '';

            $phone = $jid ? explode(':', explode('@', $jid)[0])[0] : null;

            $instance->update([
                'status' => 'connected',
                'phone_number' => $phone,
                'connected_at' => now(),
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Instance {$instanceName} paired successfully");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'LoggedOut') {
            $instance->update([
                'status' => 'disconnected',
                'phone_number' => null,
                'connected_at' => null,
            ]);

            broadcast(new InstanceConnectionUpdated($instance));
            Log::info("Instance {$instanceName} logged out");

            return response()->json(['status' => 'success']);
        }

        if ($event === 'OfflineSyncCompleted') {
            Log::info("Instance {$instanceName} offline sync completed", $payload['data'] ?? []);

            return response()->json(['status' => 'success']);
        }

        /*
        |--------------------------------------------------------------------------
        | MESSAGE EVENTS
        |--------------------------------------------------------------------------
        */
        if ($event === 'Message' || $event === 'SendMessage') {
            $data = $payload['data'] ?? [];
            $info = $data['Info'] ?? [];
            $message = $data['Message'] ?? [];

            $isFromMe = $info['IsFromMe'] ?? true;
            $direction = $isFromMe ? 'ai' : 'client';

            $messageText = $this->extractMessageText($message);

            if ($messageText) {
                $phone = $this->normalizePhone($info['Chat'] ?? null);

                if ($phone) {
                    $this->saveMessage($phone, $direction, $messageText);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }

    private function extractMessageText(array $messageData): ?string
    {
        if (isset($messageData['conversation'])) {
            return $messageData['conversation'];
        }

        if (isset($messageData['extendedTextMessage']['text'])) {
            return $messageData['extendedTextMessage']['text'];
        }

        if (isset($messageData['imageMessage']['caption'])) {
            return $messageData['imageMessage']['caption'];
        }

        if (isset($messageData['videoMessage']['caption'])) {
            return $messageData['videoMessage']['caption'];
        }

        return null;
    }

    private function normalizePhone(?string $remoteJid): ?string
    {
        if (! $remoteJid) {
            return null;
        }

        $phone = preg_replace('/@.*$/', '', $remoteJid);

        if (! $phone) {
            return null;
        }

        $digits = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }

        return $digits;
    }

    private function saveMessage(string $phone, string $direction, string $messageText): void
    {
        $lead = Lead::where(function ($query) use ($phone) {
            $query->where('phone', $phone)
                ->orWhere('phone', 'like', $phone.'%');
        })->first();

        if (! $lead) {
            Log::warning("Lead not found for phone: {$phone}");

            return;
        }

        $newMessage = [
            'direction' => $direction,
            'message' => $messageText,
            'timestamp' => now()->toISOString(),
        ];

        $recentMessages = $lead->recent_messages ?? [];
        array_unshift($recentMessages, $newMessage);
        $recentMessages = array_slice($recentMessages, 0, 5);

        $lead->update([
            'last_activity_at' => now(),
            'recent_messages' => $recentMessages,
        ]);

        event(new LeadMessageUpdated($lead));
        Log::info("Lead {$lead->id} message updated from {$direction}: ".substr($messageText, 0, 50));
    }
}
