<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class MediaAsset extends Model implements HasMedia
{
    use HasUlids, InteractsWithMedia;

    protected $guarded = [];

    protected $appends = ['resolved_url', 'size'];

    public function getResolvedUrlAttribute()
    {
        if ($this->external_url) {
            return $this->external_url;
        }

        return $this->getFirstMediaUrl('assets');
    }

    public function getSizeAttribute(): ?int
    {
        $mediaItem = $this->getMedia('assets')->first();

        return $mediaItem ? (int) round($mediaItem->size / 1024) : null;
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('assets')->singleFile();
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function agentConfig()
    {
        return $this->belongsTo(AgentConfig::class, 'agent_config_id');
    }
}
