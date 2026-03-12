<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Tenant extends Authenticatable
{
    use HasApiTokens , HasUlids;
    //

    protected $table = 'tenants';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'plan',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function instances()
    {
        return $this->hasMany(EvolutionInstance::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}
