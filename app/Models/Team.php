<?php

namespace App\Models;

use Database\Factories\TeamFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;
use Jurager\Teams\Models\Owner;
use Jurager\Teams\Traits\HasMembers;

class Team extends Model
{
    /** @use HasFactory<TeamFactory> */
    use HasFactory, HasMembers;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = ['user_id', 'name', 'slug', 'description'];

    protected $with = ['roles.permissions', 'groups.permissions'];

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

        return $pivot ? $this->roles()->find($pivot->membership->role_id) : null;
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    public function instances()
    {
        return $this->hasMany(EvolutionInstance::class);
    }

    public function agents()
    {
        return $this->hasMany(AgentConfig::class);
    }
}
