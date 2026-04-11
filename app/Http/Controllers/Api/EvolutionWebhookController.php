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

            // Evolution API provides base64 image data directly
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

            // State Machine Logic
            $status = match ($state) {
                'open' => 'connected',
                'connecting' => 'connecting',
                // 401 or 'device_removed' means the user explicitly logged out from their phone.
                // Any other code (like 428, 500) is a temporary network drop, Evolution will auto-reconnect.
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
        | MESSAGES UPSERT - Update last activity & conversation history
        |--------------------------------------------------------------------------
        */
        if ($event === 'messages.upsert') {
            $messages = $payload['data']['messages'] ?? [];

            foreach ($messages as $msg) {
                // Extract message content from various message types
                $messageText = null;
                $messageData = $msg['message'] ?? [];

                // Try different message types
                if (isset($messageData['conversation'])) {
                    $messageText = $messageData['conversation'];
                } elseif (isset($messageData['extendedTextMessage']['text'])) {
                    $messageText = $messageData['extendedTextMessage']['text'];
                } elseif (isset($messageData['imageMessage']['caption'])) {
                    $messageText = $messageData['imageMessage']['caption'];
                } elseif (isset($messageData['videoMessage']['caption'])) {
                    $messageText = $messageData['videoMessage']['caption'];
                }

                if (! $messageText) {
                    continue;
                }

                // Determine direction: fromMe = false means client message
                $direction = ($msg['key']['fromMe'] ?? true) ? 'ai' : 'client';

                // Extract phone from remoteJid
                $phone = $msg['key']['remoteJid'] ?? null;
                $phone = $phone ? preg_replace('/@.*$/', '', $phone) : null;

                if ($phone) {
                    // Find lead by phone (match last 10 digits to handle various formats)
                    $lead = Lead::where('phone', 'like', "%{$phone}")->first();

                    if ($lead) {
                        // Build new message entry
                        $newMessage = [
                            'direction' => $direction,
                            'message' => $messageText,
                            'timestamp' => now()->toISOString(),
                        ];

                        // Get existing messages, prepend new, keep last 5
                        $recentMessages = $lead->recent_messages ?? [];
                        array_unshift($recentMessages, $newMessage);
                        $recentMessages = array_slice($recentMessages, 0, 5);

                        $lead->update([
                            'last_activity_at' => now(),
                            'recent_messages' => $recentMessages,
                        ]);

                        // Broadcast real-time update
                        event(new LeadMessageUpdated($lead));
                        Log::info("Lead {$lead->id} message updated from {$direction}");
                    }
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
