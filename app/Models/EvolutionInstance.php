<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EvolutionInstance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'instance_name',
        'display_name',
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
        'deleted_at' => 'datetime',
    ];

    // ==========================================
    // RELATIONSHIPS
    // ==========================================
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

    public function hasAgent(): bool
    {
        return $this->agentConfig !== null;
    }

    public function getFriendlyNameAttribute(): string
    {
        if ($this->display_name) {
            return $this->display_name;
        }

        // Fallback: extract readable part from instance_name (e.g., "tenant-main-xK9p" → "Main")
        $parts = explode('-', $this->instance_name);
        if (count($parts) >= 2) {
            return ucfirst($parts[1]);
        }

        return 'Instance';
    }

    // ==========================================
    // SCOPES
    // ==========================================

    /**
     * Active instances (not soft deleted)
     */
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    /**
     * All visible instances (not soft deleted)
     */
    public function scopeVisible($query)
    {
        return $query->whereNull('deleted_at');
    }

    // ==========================================
    // ACCESSORS
    // ==========================================

    public function getStateAttribute(): string
    {
        if ($this->deleted_at) {
            return 'deleted';
        }

        return 'active';
    }

    // ==========================================
    // ACTIONS
    // ==========================================

    /**
     * Permanent delete (only if no leads attached)
     */
    public function forceDeleteSafely(): bool
    {
        if ($this->leads()->exists()) {
            throw new \Exception('Cannot delete: instance has associated leads');
        }

        return parent::forceDelete();
    }

    public function canConnect(): bool
    {
        return ! $this->trashed()
            && ! ($this->settings['evolution_deleted'] ?? false);
    }
}
