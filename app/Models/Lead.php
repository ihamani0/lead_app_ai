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
        'ai_qualification_status' => 'string',
        'qualification_result' => 'string',
        'treatment_status' => 'string',
        'is_new' => 'boolean',
        'qualified_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'recent_messages' => 'array',
        'last_qualification_attempt_at' => 'datetime',
    ];

    public const AI_QUALIFICATION_STATUS = [
        'NON_QUALIFIE' => 'Non qualifié',
        'QUALIFIE' => 'Qualifié',
    ];

    public const QUALIFICATION_RESULTS = [
        'HOT' => 'Hot',
        'WARM' => 'Warm',
        'COLD' => 'Cold',
    ];

    public const TREATMENT_STATUSES = [
        'TRAITE' => 'Traité',
        'NON_TRAITE' => 'Non traité',
    ];

    // Scopes
    public function scopeHot($query)
    {
        return $query->where('qualification_result', 'HOT');
    }

    public function scopeByQualificationResult($query, $result)
    {
        return $query->where('qualification_result', $result);
    }

    public function scopeQualified($query)
    {
        return $query->whereIn('qualification_result', ['HOT', 'WARM', 'COLD']);
    }

    public function scopeNewLeads($query)
    {
        return $query->where('is_new', true);
    }

    public function scopeProcessed($query)
    {
        return $query->where('is_new', false);
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
