<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class AgentConfig extends Model
{
    //
    use HasUlids;

    protected $guarded = [];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function instance()
    {
        return $this->belongsTo(EvolutionInstance::class, 'evolution_instance_id');
    }
}
