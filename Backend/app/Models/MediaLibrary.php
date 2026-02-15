<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaLibrary extends Model
{
    protected $table = 'media_library';

    protected $fillable = [
        'page_slug',
        'section',
        'title',
        'subtitle',
        'file_path',
        // 'order'
    ];
}
