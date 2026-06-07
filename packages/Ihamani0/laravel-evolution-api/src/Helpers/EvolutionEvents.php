<?php

namespace Ihamani0\LaravelEvolutionApi\Helpers;

class EvolutionEvents
{
    const MESSAGE = 'Message';

    const SEND_MESSAGE = 'SendMessage';

    const CONNECTED = 'Connected';

    const PAIR_SUCCESS = 'PairSuccess';

    const LOGGED_OUT = 'LoggedOut';

    const OFFLINE_SYNC_COMPLETED = 'OfflineSyncCompleted';

    const QR_CODE = 'QRCode';

    const QR_TIMEOUT = 'QRTimeout';

    const QR_SUCCESS = 'QRSuccess';

    const RECEIPT = 'Receipt';

    const PRESENCE = 'Presence';

    const CALL_OFFER = 'CallOffer';

    const CALL_RELAY_LATENCY = 'CallRelayLatency';

    const CALL_TERMINATE = 'CallTerminate';

    const HISTORY_SYNC = 'HistorySync';

    const CHAT_PRESENCE = 'ChatPresence';

    const LABEL_EDIT = 'LabelEdit';

    const LABEL_ASSOCIATION_CHAT = 'LabelAssociationChat';

    const LABEL_ASSOCIATION_MESSAGE = 'LabelAssociationMessage';

    const CONTACT = 'Contact';

    const PUSH_NAME = 'PushName';

    const GROUP_INFO = 'GroupInfo';

    const JOINED_GROUP = 'JoinedGroup';

    const NEWSLETTER_JOIN = 'NewsletterJoin';

    const NEWSLETTER_LEAVE = 'NewsletterLeave';

    /**
     * Get all available events.
     *
     * @return array<string>
     */
    public static function all(): array
    {
        return [
            self::MESSAGE,
            self::SEND_MESSAGE,
            self::CONNECTED,
            self::PAIR_SUCCESS,
            self::LOGGED_OUT,
            self::OFFLINE_SYNC_COMPLETED,
            self::QR_CODE,
            self::QR_TIMEOUT,
            self::QR_SUCCESS,
            self::RECEIPT,
            self::PRESENCE,
            self::CALL_OFFER,
            self::CALL_RELAY_LATENCY,
            self::CALL_TERMINATE,
            self::HISTORY_SYNC,
            self::CHAT_PRESENCE,
            self::LABEL_EDIT,
            self::LABEL_ASSOCIATION_CHAT,
            self::LABEL_ASSOCIATION_MESSAGE,
            self::CONTACT,
            self::PUSH_NAME,
            self::GROUP_INFO,
            self::JOINED_GROUP,
            self::NEWSLETTER_JOIN,
            self::NEWSLETTER_LEAVE,
        ];
    }
}
