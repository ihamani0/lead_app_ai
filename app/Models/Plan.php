<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'description',
        'price_millicents',
        'price_yearly_millicents',
        'max_teams',
        'max_members',
        'max_leads',
        'max_agents',
        'max_instances',
        'max_storage_mb',
        'dollar_limit',
        'features',
        'is_active',
        'is_default',
        'paddle_price_id',
        'paddle_price_id_yearly',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'price_millicents' => 'integer',
        'max_teams' => 'integer',
        'max_members' => 'integer',
        'max_leads' => 'integer',
        'max_agents' => 'integer',
        'max_instances' => 'integer',
        'max_storage_mb' => 'integer',
        'dollar_limit' => 'integer',
    ];

    public function tenants()
    {
        return $this->hasMany(Tenant::class, 'plan_id');
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
