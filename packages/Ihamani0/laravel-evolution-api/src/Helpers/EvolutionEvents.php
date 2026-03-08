<?php

namespace Ihamani0\LaravelEvolutionApi\Helpers;


class EvolutionEvents {
    const APPLICATION_STARTUP       = 'APPLICATION_STARTUP';
    const QRCODE_UPDATED            = 'QRCODE_UPDATED';
    const MESSAGES_SET              = 'MESSAGES_SET';
    const MESSAGES_UPSERT           = 'MESSAGES_UPSERT';
    const MESSAGES_UPDATE           = 'MESSAGES_UPDATE';
    const MESSAGES_DELETE           = 'MESSAGES_DELETE';
    const SEND_MESSAGE              = 'SEND_MESSAGE';
    const CONTACTS_SET              = 'CONTACTS_SET';
    const CONTACTS_UPSERT           = 'CONTACTS_UPSERT';
    const CONTACTS_UPDATE           = 'CONTACTS_UPDATE';
    const PRESENCE_UPDATE           = 'PRESENCE_UPDATE';
    const CHATS_SET                 = 'CHATS_SET';
    const CHATS_UPSERT              = 'CHATS_UPSERT';
    const CHATS_UPDATE              = 'CHATS_UPDATE';
    const CHATS_DELETE              = 'CHATS_DELETE';
    const GROUPS_UPSERT             = 'GROUPS_UPSERT';
    const GROUP_UPDATE              = 'GROUP_UPDATE';
    const GROUP_PARTICIPANTS_UPDATE = 'GROUP_PARTICIPANTS_UPDATE';
    const CONNECTION_UPDATE         = 'CONNECTION_UPDATE';
    const LABELS_EDIT               = 'LABELS_EDIT';
    const LABELS_ASSOCIATION        = 'LABELS_ASSOCIATION';
    const CALL                      = 'CALL';
    const TYPEBOT_START             = 'TYPEBOT_START';
    const TYPEBOT_CHANGE_STATUS     = 'TYPEBOT_CHANGE_STATUS';



    /**
     * Get all available events.
     *
     * @return array<string>
     */
    public static function all(): array
    {
        return [
            self::APPLICATION_STARTUP,
            self::QRCODE_UPDATED,
            self::MESSAGES_SET,
            self::MESSAGES_UPSERT,
            self::MESSAGES_UPDATE,
            self::MESSAGES_DELETE,
            self::SEND_MESSAGE,
            self::CONTACTS_SET,
            self::CONTACTS_UPSERT,
            self::CONTACTS_UPDATE,
            self::PRESENCE_UPDATE,
            self::CHATS_SET,
            self::CHATS_UPSERT,
            self::CHATS_UPDATE,
            self::CHATS_DELETE,
            self::GROUPS_UPSERT,
            self::GROUP_UPDATE,
            self::GROUP_PARTICIPANTS_UPDATE,
            self::CONNECTION_UPDATE,
            self::LABELS_EDIT,
            self::LABELS_ASSOCIATION,
            self::CALL,
            self::TYPEBOT_START,
            self::TYPEBOT_CHANGE_STATUS,
        ];
    }
}