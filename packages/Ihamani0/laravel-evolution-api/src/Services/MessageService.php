<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

/**
 * MessageService
 *
 * Provides methods for managing messages (react, presence, mark read,
 * download, status, delete, edit) via the Evolution API.
 * All methods require an active instance and its token via setInstance().
 */
class MessageService extends BaseService
{
    /**
     * React to a message with an emoji.
     *
     * @param  string  $number  The recipient's phone number (e.g. '5511999999999').
     * @param  string  $id  The message ID to react to.
     * @param  string  $reaction  The emoji reaction (e.g. '🔥').
     * @return array The API response.
     */
    public function react(string $number, string $id, string $reaction): array
    {
        return $this->client->post('message/react', [
            'number' => $number,
            'id' => $id,
            'reaction' => $reaction,
        ], $this->client->getToken());
    }

    /**
     * Send a presence/composing indicator.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $state  Presence state: 'composing' or 'recording'.
     * @param  bool  $isAudio  Whether the recording is an audio message. Only relevant when state is 'recording'.
     * @return array The API response.
     */
    public function presence(string $number, string $state, bool $isAudio = false): array
    {
        return $this->client->post('message/presence', [
            'number' => $number,
            'state' => $state,
            'isAudio' => $isAudio,
        ], $this->client->getToken());
    }

    /**
     * Mark one or more messages as read.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  array<string>  $id  List of message IDs to mark as read.
     * @return array The API response.
     */
    public function markRead(string $number, array $id = []): array
    {
        return $this->client->post('message/markRead', [
            'number' => $number,
            'id' => $id,
        ], $this->client->getToken());
    }

    /**
     * Download a media message by providing its raw message data.
     *
     * @param  array{imageMessage?: array, videoMessage?: array, audioMessage?: array, documentMessage?: array}  $message  The raw message object containing media metadata (URL, directPath, mediaKey, mimetype, etc.).
     * @return array The API response containing the downloaded media.
     */
    public function downloadMedia(array $message): array
    {
        return $this->client->post('message/downloadMedia', [
            'message' => $message,
        ], $this->client->getToken());
    }

    /**
     * Get the delivery status of a message.
     *
     * @param  string  $id  The message ID.
     * @return array The API response with status details.
     */
    public function status(string $id): array
    {
        return $this->client->post('message/status', [
            'id' => $id,
        ], $this->client->getToken());
    }

    /**
     * Delete a message for everyone.
     *
     * @param  string  $chat  The chat JID (e.g. '5511999999999@s.whatsapp.net').
     * @param  string  $messageId  The message ID to delete.
     * @return array The API response.
     */
    public function delete(string $chat, string $messageId): array
    {
        return $this->client->post('message/delete', [
            'chat' => $chat,
            'messageId' => $messageId,
        ], $this->client->getToken());
    }

    /**
     * Edit an already-sent message.
     *
     * @param  string  $chat  The chat JID (e.g. '5511999999999@s.whatsapp.net').
     * @param  string  $messageId  The ID of the message to edit.
     * @param  string  $message  The new message text content.
     * @return array The API response.
     */
    public function edit(string $chat, string $messageId, string $message): array
    {
        return $this->client->post('message/edit', [
            'chat' => $chat,
            'messageId' => $messageId,
            'message' => $message,
        ], $this->client->getToken());
    }
}
