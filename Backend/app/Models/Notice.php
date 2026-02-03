<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'notice_title', 
        'notice_description', 
        'publish_date', 
        'visibility', 
        'status', 
        'attachment_path'
    ];
}