<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory ,HasUlids;

    protected $guarded = [];

    protected $casts = [
        'custom_data' => 'array',
        'qualification_score' => 'integer',
    ];

    // Scopes
    public function scopeHot($query)
    {
        return $query->where('status', 'hot');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeQualified($query)
    {
        return $query->whereIn('temperature', ['HOT', 'WARM', 'COLD']);
    }

    public function scopeNewLeads($query)
    {
        return $query->where('status', 'NEW');
    }

    // Relations
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function instance()
    {
        return $this->belongsTo(EvolutionInstance::class, 'instance_id', 'id');
    }
}
