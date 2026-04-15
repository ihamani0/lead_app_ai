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
            $qrData = $payload['data']['qrcode'] ?? null;

            if (! $qrData) {
                Log::warning('QR code data missing in webhook', ['payload' => $payload]);

                return response()->json(['error' => 'QR data missing'], 400);
            }

            $qrCode = $qrData['code'] ?? null;

            broadcast(new QrCodeUpdated($instanceName, $qrCode));

            return response()->json(['status' => 'success']);
        }

        /*
        |--------------------------------------------------------------------------
        | CONNECTION UPDATED
        |--------------------------------------------------------------------------
        */
        if ($event === 'connection.update') {
            $state = $payload['data']['state'] ?? 'close';
            $statusReason = $payload['data']['statusReason'] ?? null;

            $status = match ($state) {
                'open' => 'connected',
                'connecting' => 'connecting',
                'close' => ($statusReason == 401 || $statusReason === 'device_removed') ? 'disconnected' : 'connecting',
                default => 'disconnected',
            };

            $instance = EvolutionInstance::where('instance_name', $instanceName)->first();

            if ($instance && $instance->status !== $status) {
                $settings = $instance->settings ?? [];

                if ($status === 'connected') {
                    $settings['was_connected'] = true;
                } elseif ($status === 'disconnected') {
                    $settings['was_connected'] = false;
                }

                $instance->update([
                    'status' => $status,
                    'connected_at' => $status === 'connected' ? now() : $instance->connected_at,
                    'phone_number' => $status === 'connected' && isset($payload['data']['wuid'])
                        ? explode('@', $payload['data']['wuid'])[0]
                        : ($status === 'disconnected' ? null : $instance->phone_number),
                    'settings' => $settings,
                ]);

                broadcast(new InstanceConnectionUpdated($instance));
                Log::info("Instance {$instanceName} updated to {$status} (Reason: {$statusReason})");
            }
        }

        /*
        |--------------------------------------------------------------------------
        | MESSAGES UPSERT - Incoming messages from clients
        |--------------------------------------------------------------------------
        */
        if ($event === 'messages.upsert') {
            $msg = $payload['data'] ?? [];

            $messageText = $this->extractMessageText($msg['message'] ?? []);

            if ($messageText) {
                $direction = ($msg['key']['fromMe'] ?? true) ? 'ai' : 'client';
                $phone = $this->normalizePhone($msg['key']['remoteJid'] ?? null);

                if ($phone) {
                    $this->saveMessage($phone, $direction, $messageText);
                }
            }
        }

        /*
        |--------------------------------------------------------------------------
        | SEND MESSAGE - Outgoing AI messages
        |--------------------------------------------------------------------------
        */
        if ($event === 'send.message') {
            $msg = $payload['data'] ?? [];
            $messageText = $this->extractMessageText($msg['message'] ?? []);

            if (! $messageText) {
                return response()->json(['status' => 'success']);
            }

            $phone = $this->normalizePhone($msg['key']['remoteJid'] ?? null);

            if ($phone) {
                $this->saveMessage($phone, 'ai', $messageText);
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

        // Remove all non-digits
        $digits = preg_replace('/[^0-9]/', '', $phone);

        // Remove leading 0
        if (str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }

        // Return clean digits without + to match DB format (e.g., "213697096705")
        return $digits;
    }

    private function saveMessage(string $phone, string $direction, string $messageText): void
    {
        // Match exact phone or phone with country code prefix
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
