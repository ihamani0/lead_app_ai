<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Jurager\Teams\Models\Owner;
use Jurager\Teams\Traits\HasMembers;

class Team extends Model
{
    use HasMembers;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = ['user_id', 'tenant_id', 'name', 'slug'];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['roles.permissions', 'groups.permissions'];

    /**
     * Creates a new instance of the model.
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = Config::get('teams.tables.teams', 'teams');
    }

    protected static function booted(): void
    {
        static::creating(function (Team $team) {
            if (empty($team->slug)) {
                $team->slug = Str::slug($team->name).'-'.
                            $team->tenant_id.'-'.
                            now()->format('ymdHis');
            }
        });
    }

    public function userAuthorization(object $user): ?object
    {
        if ($user->id === $this->user_id) {
            return new Owner;
        }
        $pivot = $this->users()->where('user_id', $user->id)->first();

        return $pivot ? $this->roles()->find($pivot->pivot->role_id) : null;
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }
}
