<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Config;
use Jurager\Teams\Support\Facades\Teams as TeamsFacade;

class Invitation extends Model
{
    protected $fillable = ['team_id', 'role_id', 'email'];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->fillable[] = Config::get('teams.foreign_keys.team_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(TeamsFacade::model('team'), Config::get('teams.foreign_keys.team_id'));
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(TeamsFacade::model('role'), 'role_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(TeamsFacade::model('user'), 'email', 'email');
    }
}
