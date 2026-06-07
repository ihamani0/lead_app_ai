<?php

return [

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'evolution' => [
        'base_url' => env('EVOLUTION_API_URL'),
        'admin_key' => env('EVOLUTION_KEY'),
        'webhook_url' => env('EVOLUTION_WEBHOOK_URL'),
    ],

    'n8n' => [
        'n8n_base_url' => env('N8N_BASE_URL'),
        'api_key' => env('N8N_API_KEY'),
    ],

    'token' => [
        'threshold' => 10,
    ],

    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY'),
    ],

    'whatsapp' => [
        'webhook_url' => env('WHATSAPP_WEBHOOK_URL'),
    ],

    'document' => [
        'webhook_url' => env('DOCUMENT_WEBHOOK_URL'),
    ],
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],
];
