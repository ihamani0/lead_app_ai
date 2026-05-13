<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourProgress extends Model
{
    protected $fillable = [
        'user_id',
        'tour_name',
        'completed',
        'completed_steps',
        'skipped_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_steps' => 'array',
        'skipped_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForTour($query, string $tourName)
    {
        return $query->where('tour_name', $tourName);
    }
}
