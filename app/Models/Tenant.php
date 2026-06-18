<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Tenant extends Authenticatable
{
    use HasApiTokens, HasUlids, Notifiable;

    protected $table = 'tenants';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'plan',
        'is_active',
        'settings',
        'credit_millicents',
        'dollar_limit',
        'llm_model_id',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'credit_millicents' => 'integer',
        'dollar_limit' => 'integer',
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

    public function tokenTransactions()
    {
        return $this->hasMany(TokenTransaction::class);
    }

    public function llmModel()
    {
        return $this->belongsTo(LlmModel::class, 'llm_model_id');
    }

    public function getCreditInDollarsAttribute(): float
    {
        return $this->credit_millicents / 100_000;
    }

    public function getIsLowCreditAttribute(): bool
    {
        return $this->credit_millicents < (config('services.token.threshold', 10) * 1000);
    }

    public function isBelowThreshold(): bool
    {
        return $this->is_low_credit;
    }
}
