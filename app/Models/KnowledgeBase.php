<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class KnowledgeBase extends Model implements HasMedia
{
    use HasUlids, InteractsWithMedia;
    protected $guarded = [];   


    
}
