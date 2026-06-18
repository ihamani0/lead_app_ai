<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

/**
 * UserService
 *
 * Provides methods for managing WhatsApp user/contact data (info, avatar,
 * contacts, privacy, blocking, profile) via the Evolution API.
 * All methods require an active instance and its token via setInstance().
 */
class UserService extends BaseService
{
    /**
     * Get user info for one or more phone numbers.
     *
     * @param  array<string>  $number  List of phone numbers to query.
     * @return array The API response with user info.
     */
    public function info(array $number = []): array
    {
        return $this->client->post('user/info', [
            'number' => $number,
        ], $this->client->getToken());
    }

    /**
     * Check whether one or more phone numbers are registered on WhatsApp.
     *
     * @param  array<string>  $number  List of phone numbers to check.
     * @return array The API response with registration status.
     */
    public function check(array $number = []): array
    {
        return $this->client->post('user/check', [
            'number' => $number,
        ], $this->client->getToken());
    }

    /**
     * Get the profile avatar of a contact.
     *
     * @param  string  $number  The phone number.
     * @param  bool  $preview  Whether to return a low-resolution preview.
     * @return array The API response with avatar URL.
     */
    public function avatar(string $number, bool $preview = false): array
    {
        return $this->client->post('user/avatar', [
            'number' => $number,
            'preview' => $preview,
        ], $this->client->getToken());
    }

    /**
     * Get the contact list from the device.
     *
     * @return array The API response with contacts.
     */
    public function contacts(): array
    {
        return $this->client->get('user/contacts', $this->client->getToken());
    }

    /**
     * Get the current privacy settings.
     *
     * @return array The API response with privacy settings.
     */
    public function privacy(): array
    {
        return $this->client->get('user/privacy', $this->client->getToken());
    }

    /**
     * Block a contact.
     *
     * @param  string  $number  The phone number to block.
     * @return array The API response.
     */
    public function block(string $number): array
    {
        return $this->client->post('user/block', [
            'number' => $number,
        ], $this->client->getToken());
    }

    /**
     * Unblock a previously blocked contact.
     *
     * @param  string  $number  The phone number to unblock.
     * @return array The API response.
     */
    public function unblock(string $number): array
    {
        return $this->client->post('user/unblock', [
            'number' => $number,
        ], $this->client->getToken());
    }

    /**
     * Get the list of blocked contacts.
     *
     * @return array The API response with blocked contacts.
     */
    public function blockList(): array
    {
        return $this->client->get('user/blocklist', $this->client->getToken());
    }

    /**
     * Set the profile picture from a URL.
     *
     * @param  string  $image  Public URL of the profile picture.
     * @return array The API response.
     */
    public function profilePicture(string $image): array
    {
        return $this->client->post('user/profilePicture', [
            'image' => $image,
        ], $this->client->getToken());
    }

    /**
     * Set the profile display name.
     *
     * @param  string  $name  The new profile name.
     * @return array The API response.
     */
    public function profileName(string $name): array
    {
        return $this->client->post('user/profileName', [
            'name' => $name,
        ], $this->client->getToken());
    }

    /**
     * Set the profile status text.
     *
     * @param  string  $status  The new profile status (e.g. 'Disponível').
     * @return array The API response.
     */
    public function profileStatus(string $status): array
    {
        return $this->client->post('user/profileStatus', [
            'status' => $status,
        ], $this->client->getToken());
    }
}
