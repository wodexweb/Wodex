<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $table = "galleries";

    protected $fillable = [
        'event_id',
        'title',
        'image',
    ];

    // Optional: Event relation
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    // Optional: direct image URL
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }
}
