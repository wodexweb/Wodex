<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaFile extends Model
{
    // THIS IS THE MOST LIKELY FIX
    protected $fillable = [
        'media_name', 
        'file_path', 
        'media_type'
    ];

    // Ensure this matches what your React app expects
    protected $appends = ['media_url'];

    public function getMediaUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }
}