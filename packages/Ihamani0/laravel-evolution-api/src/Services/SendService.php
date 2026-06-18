<?php

namespace Ihamani0\LaravelEvolutionApi\Services;

/**
 * SendService
 *
 * Provides methods for sending various message types via the Evolution API.
 * All methods require an active instance and its token via setInstance().
 */
class SendService extends BaseService
{
    /**
     * Send a plain text message.
     *
     * @param  string  $number  The recipient's phone number (e.g. '5511999999999').
     * @param  string  $text  The message text content.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function text(string $number, string $text, int $delay = 1000): array
    {
        return $this->client->post('send/text', [
            'number' => $number,
            'text' => $text,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send a text message containing a link.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $text  The message text including the URL.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function link(string $number, string $text, int $delay = 1000): array
    {
        return $this->client->post('send/link', [
            'number' => $number,
            'text' => $text,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send a media file (document, image, audio, or video) from a URL.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $url  Public URL of the media file.
     * @param  string  $caption  Caption text for the media.
     * @param  string  $filename  Display filename for the media.
     * @param  string  $type  Media type: 'document'|'image'|'audio'|'video'.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function media(string $number, string $url, string $caption, string $filename, string $type, int $delay = 1000): array
    {
        return $this->client->post('send/media', [
            'number' => $number,
            'url' => $url,
            'caption' => $caption,
            'filename' => $filename,
            'type' => $type,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send a poll (list of selectable options).
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $question  The poll question text.
     * @param  int  $maxAnswers  Maximum number of selectable answers.
     * @param  array<string>  $options  List of answer options.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function poll(string $number, string $question, int $maxAnswers = 1, array $options = [], int $delay = 1000): array
    {
        return $this->client->post('send/poll', [
            'number' => $number,
            'question' => $question,
            'maxAnswers' => $maxAnswers,
            'options' => $options,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send a sticker image from a URL.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $sticker  Public URL of the sticker image.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function sticker(string $number, string $sticker, int $delay = 1000): array
    {
        return $this->client->post('send/sticker', [
            'number' => $number,
            'sticker' => $sticker,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send a location pin.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $name  The location name (e.g. 'Bora Bora').
     * @param  string  $address  The location address description.
     * @param  float  $latitude  Latitude coordinate.
     * @param  float  $longitude  Longitude coordinate.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function location(string $number, string $name, string $address, float $latitude, float $longitude, int $delay = 1000): array
    {
        return $this->client->post('send/location', [
            'number' => $number,
            'name' => $name,
            'address' => $address,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send a vCard contact.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  array{fullName?: string, organization?: string, phone?: string}  $vcard  Contact details with fullName, organization, and phone.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function contact(string $number, array $vcard, int $delay = 1000): array
    {
        return $this->client->post('send/contact', [
            'number' => $number,
            'vcard' => $vcard,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send an interactive button message.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $title  The button message title.
     * @param  string  $description  Descriptive text above the buttons.
     * @param  string  $footer  Footer text below the buttons.
     * @param  array<int, array{type: string, currency?: string, name?: string, keyType?: string, key?: string}>  $buttons  List of button configurations.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function button(string $number, string $title, string $description, string $footer, array $buttons = [], int $delay = 1000): array
    {
        return $this->client->post('send/button', [
            'number' => $number,
            'title' => $title,
            'description' => $description,
            'footer' => $footer,
            'buttons' => $buttons,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send an interactive list message with selectable rows.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $title  The list title.
     * @param  string  $description  Descriptive text.
     * @param  string  $buttonText  Text for the call-to-action button.
     * @param  string  $footerText  Footer text.
     * @param  array<int, array{title: string, rows: array<int, array{title: string, description?: string, rowId: string}>}>  $sections  Sections containing rows of items.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function list(string $number, string $title, string $description, string $buttonText, string $footerText, array $sections = [], int $delay = 1000): array
    {
        return $this->client->post('send/list', [
            'number' => $number,
            'title' => $title,
            'description' => $description,
            'buttonText' => $buttonText,
            'footerText' => $footerText,
            'sections' => $sections,
            'delay' => $delay,
        ], $this->client->getToken());
    }

    /**
     * Send a carousel message with multiple cards.
     *
     * @param  string  $number  The recipient's phone number.
     * @param  string  $text  Header text for the carousel.
     * @param  array<int, array{image?: string, text?: string, footer?: string, buttons?: array}>  $cards  List of card configurations.
     * @param  int  $delay  Delay in milliseconds before sending.
     * @return array The API response.
     */
    public function carousel(string $number, string $text, array $cards = [], int $delay = 1000): array
    {
        return $this->client->post('send/carousel', [
            'number' => $number,
            'text' => $text,
            'cards' => $cards,
            'delay' => $delay,
        ], $this->client->getToken());
    }
}
