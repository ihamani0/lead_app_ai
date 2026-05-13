<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowBalanceNotification extends Notification
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $threshold = config('services.token.threshold', 10);

        return [
            'type' => 'low_credit',
            'message' => 'Your credit is below $'.$threshold.'. Please recharge to continue using workflows.',
            'credit' => $notifiable->credit_millicents / 100_000,
            'threshold' => $threshold,
        ];
    }
}
