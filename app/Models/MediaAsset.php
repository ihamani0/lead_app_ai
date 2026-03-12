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

    protected $appends = ['resolved_url'];

    public function getResolvedUrlAttribute()
    {
        // If they provided a direct link, use it.
        if ($this->external_url) {
            return $this->external_url;
        }

        // Otherwise, get the URL of the uploaded file via Spatie
        return $this->getFirstMediaUrl('assets');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('assets')->singleFile();
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
