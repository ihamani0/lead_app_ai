<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'price_millicents',
        'max_teams',
        'max_members',
        'max_leads',
        'max_agents',
        'max_instances',
        'dollar_limit',
        'features',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'price_millicents' => 'integer',
        'max_teams' => 'integer',
        'max_members' => 'integer',
        'max_leads' => 'integer',
        'max_agents' => 'integer',
        'max_instances' => 'integer',
        'dollar_limit' => 'integer',
    ];

    public function tenants()
    {
        return $this->hasMany(Tenant::class, 'plan', 'slug');
    }
}
