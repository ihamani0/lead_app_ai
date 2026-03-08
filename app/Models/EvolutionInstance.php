<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvolutionInstance extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'instance_name',
        'phone_number',
        'status',
        'qr_code',
        'webhook_url',
        'settings',
        'connected_at',
    ];


    protected $casts = [
        'settings' => 'array',
        'connected_at' => 'datetime',
    ];


    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class, 'instance_id');
    }

    public function agentConfig()
    {
        return $this->hasOne(AgentConfig::class, 'evolution_instance_id');
    }

}
