<?php

// app/Models/Setting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'system_name',
        'application_title',
        'website_url',
        'website_title',
        'website_description',
        'website_keywords',
        'site_copyright',
        'website_logo',
        'admin_logo',
    ];
}

