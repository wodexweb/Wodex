<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'image_path', 'status'];

    // Automatically appends 'image_url' to the JSON response
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        // This generates a full URL like http://localhost:8000/storage/achievements/xyz.jpg
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }
}