<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
  protected $fillable = ['event_id', 'title', 'images', 'drive_link'];

protected $casts = [
    'images' => 'array', // This converts the DB string back into a PHP array automatically
];
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
