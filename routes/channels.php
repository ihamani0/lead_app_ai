<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('instance.{instanceName}', function ($user, $instanceName) {
    Log::info('info', [$user, $instanceName]);

    return true;
});

Broadcast::channel('lead', function ($user) {
    Log::info('info', [$user]);

    return true;
});
