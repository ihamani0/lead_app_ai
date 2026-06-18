<?php

namespace App\Jobs;

use App\Events\LeadMessageUpdated;
use App\Models\EvolutionInstance;
use App\Models\Lead;
use App\Models\LeadMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProcessLeadMessage implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public array $payload,
    ) {}

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

    private function detectType(array $messageData): string
    {
        if (isset($messageData['imageMessage'])) {
            return 'image';
        }
        if (isset($messageData['videoMessage'])) {
            return 'video';
        }
        if (isset($messageData['audioMessage'])) {
            return 'audio';
        }
        if (isset($messageData['documentMessage'])) {
            return 'document';
        }

        return 'text';
    }

    private function buildMetadata(array $messageData): array
    {
        $meta = [];

        if (isset($messageData['base64'])) {
            $meta['base64'] = $messageData['base64'];
        }

        foreach (['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'] as $key) {
            if (isset($messageData[$key])) {
                foreach (['mimetype', 'fileName', 'fileLength', 'seconds', 'ptt', 'waveform', 'mediaKey', 'url', 'directPath'] as $field) {
                    if (isset($messageData[$key][$field])) {
                        $meta[$field] = $messageData[$key][$field];
                    }
                }
            }
        }

        return $meta;
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

    public function handle(): void
    {
        $data = $this->payload['data'] ?? [];
        $info = $data['Info'] ?? [];
        $message = $data['Message'] ?? [];

        $remoteId = $info['ID'] ?? null;
        if ($remoteId) {
            $exists = LeadMessage::where('remote_id', $remoteId)->exists();
            if ($exists) {
                return;
            }
        }

        $isFromMe = $info['IsFromMe'] ?? true;
        $direction = $isFromMe ? 'from_agent' : 'from_lead';

        $phone = $isFromMe
            ? $this->normalizePhone($info['RecipientAlt'] ?? $info['Chat'] ?? null)
            : $this->normalizePhone($info['Sender'] ?? $info['Chat'] ?? null);

        if (! $phone) {
            return;
        }

        $lead = Lead::where('phone', $phone)->orWhere('phone', 'like', $phone.'%')->first();
        if (! $lead) {
            Log::warning('ProcessLeadMessage: Lead not found', [
                'phone' => $phone,
                'sender' => $info['Sender'] ?? null,
                'chat' => $info['Chat'] ?? null,
            ]);

            return;
        }

        $apiKey = $this->payload['instanceToken'] ?? null;
        if ($apiKey && ! $lead->instance_id) {
            $evoInstance = EvolutionInstance::where('api_token', $apiKey)->first();
            if ($evoInstance) {
                $lead->update(['instance_id' => $evoInstance->id]);
                Log::debug('ProcessLeadMessage: set instance_id', [
                    'lead_id' => $lead->id,
                    'instance_id' => $evoInstance->id,
                ]);
            }
        }

        Log::debug('ProcessLeadMessage: Lead found', [
            'lead_id' => $lead->id,
            'phone' => $lead->phone,
            'remote_id' => $remoteId,
            'direction' => $direction,
        ]);

        $content = $this->extractMessageText($message);
        $type = $this->detectType($message);
        $metadata = $this->buildMetadata($message);

        if (! $content && $type === 'text') {
            Log::warning('ProcessLeadMessage: empty text message skipped', [
                'lead_id' => $lead->id,
                'remote_id' => $remoteId,
            ]);

            return;
        }

        if ($type !== 'text' && ! empty($message['base64'])) {
            $extension = match ($type) {
                'image' => 'jpg',
                'video' => 'mp4',
                'audio' => 'ogg',
                'document' => 'bin',
                default => 'bin',
            };

            $filename = 'media/'.Str::ulid()->toBase32().'.'.$extension;

            Storage::disk('s3')->put($filename, base64_decode($message['base64'], true));

            $metadata['local_url'] = Storage::disk('s3')->url($filename);

            unset($metadata['base64']);

            Log::debug('ProcessLeadMessage: media saved to S3', [
                'filename' => $filename,
                'local_url' => $metadata['local_url'],
            ]);
        }

        $senderType = $isFromMe ? 'bot' : 'lead';

        $leadMessage = $lead->messages()->create([
            'remote_id' => $remoteId,
            'direction' => $direction,
            'sender_type' => $senderType,
            'content' => $content,
            'type' => $type,
            'status' => 'sent',
            'metadata' => $metadata,
        ]);

        Log::debug('ProcessLeadMessage: message created', [
            'message_id' => $leadMessage->id,
            'lead_id' => $lead->id,
            'content' => $content,
            'sender_type' => $senderType,
        ]);

        $lead->update(['last_activity_at' => now()]);

        broadcast(new LeadMessageUpdated($lead, $leadMessage));
    }
}
