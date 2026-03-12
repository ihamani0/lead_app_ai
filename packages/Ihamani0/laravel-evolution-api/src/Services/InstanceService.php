<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

use Ihamani0\LaravelEvolutionApi\Contracts\InstanceServiceInterface;

class InstanceService extends BaseService implements InstanceServiceInterface
{
    /**
     * Create a new Evolution WhatsApp Instance.
     *
     * @param  string  $instanceName  The name of the instance
     * @param array{
     *     token?: string,
     *     qrcode?: bool,
     *     number?: string,
     *     rejectCall?: bool,
     *     msgCall?: string,
     *     groupsIgnore?: bool,
     *     alwaysOnline?: bool,
     *     readMessages?: bool,
     *     readStatus?: bool,
     *     syncFullHistory?: bool,
     *     webhook?: array{
     *         url: string,
     *         byEvents: bool,
     *         base64?: bool,
     *         headers?: array<string, string>,
     *         events: array<string>
     *     },
     *     rabbitmq?: array{enabled: bool, events: array<string>},
     *     chatwootAccountId?: int,
     *     chatwootToken?: string,
     *     chatwootUrl?: string,
     *     chatwootSignMsg?: bool,
     *     chatwootReopenConversation?: bool,
     *     chatwootConversationPending?: bool
     * } $options Optional configuration parameters (Evolution API format).
     */
    public function create(string $instanceName, array $options = []): array
    {

        $defaults = [
            'instanceName' => $instanceName,
            'integration' => 'WHATSAPP-BAILEYS',
            'qrcode' => false,
        ];

        $payload = array_replace_recursive($defaults, $options);

        return $this->client->post('instance/create', $payload);
    }

    /**
     * Fetch all instances registered on the Evolution API server.
     *
     * @param  string|null  $instanceName  Optional. Filter results by a specific instance name.
     * @return array List of instances.
     */
    public function all(?string $instanceName = null): array
    {
        $endpoint = 'instance/fetchInstances';

        if ($instanceName) {
            $endpoint .= '?instanceName='.$instanceName;
        }

        return $this->client->get($endpoint);
    }

    /**
     * Connect an instance to WhatsApp and retrieve its QR code.
     *
     * Use this when the instance exists but is not yet connected to WhatsApp,
     * or when it was previously disconnected. The returned QR code must be
     * scanned using the WhatsApp mobile app.
     *
     * Requires an active instance to be set via setInstance().
     *
     * @return array The API response containing the QR code or pairing info.
     */
    public function connect(): array
    {
        return $this->client->get("instance/connect/{$this->client->getInstance()}");
    }

    /**
     * Restart the instance process on the Evolution API server.
     *
     * Use this when an instance is stuck or frozen but was previously connected.
     * After restarting, you may need to call connect() again if the session expired.
     *
     * Requires an active instance to be set via setInstance().
     *
     * @return array The API response.
     */
    public function restart(): array
    {
        return $this->client->post("instance/restart/{$this->client->getInstance()}", []);
    }

    /**
     * Set the presence (online/offline status) of a connected instance.
     *
     * The instance must already be connected to WhatsApp for this to work.
     * This does NOT reconnect a disconnected instance — use connect() for that.
     *
     * Requires an active instance to be set via setInstance().
     *
     * @param  string  $presence  The desired presence state. Accepted values: 'available', 'unavailable'.
     * @return array The API response.
     */
    public function setPresence(string $presence): array
    {
        return $this->client->post("instance/setPresence/{$this->client->getInstance()}", [
            'presence' => $presence,
        ]);
    }

    /**
     * Check the current connection state of the instance.
     *
     * Requires an active instance to be set via setInstance().
     *
     * @return array The API response containing the connection state.
     */
    public function status(): array
    {
        return $this->client->get("instance/connectionState/{$this->client->getInstance()}");
    }

    /**
     * Logout (disconnect) the instance from WhatsApp.
     *
     * This disconnects the WhatsApp session but does NOT delete the instance.
     * You can reconnect later by calling connect() again.
     *
     * Requires an active instance to be set via setInstance().
     *
     * @return array The API response.
     */
    public function logout(): array
    {
        return $this->client->delete("instance/logout/{$this->client->getInstance()}");
    }

    /**
     * Permanently delete the instance from the Evolution API server.
     *
     * This cannot be undone. The instance will need to be re-created with create().
     *
     * Requires an active instance to be set via setInstance().
     *
     * @return array The API response.
     */
    public function delete(): array
    {
        return $this->client->delete("instance/delete/{$this->client->getInstance()}");
    }
}
