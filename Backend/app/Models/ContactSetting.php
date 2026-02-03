<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    use HasFactory;

    protected $table = 'contact_settings';

    // Mass assignable fields
    protected $fillable = [
        'contact_number',
        'contact_number_1',
        'whatsapp_number',
        'email',
        'working_hours',
        'address',
        'google_map_link',
        'facebook_url',
        'instagram_url',
        'youtube_url',
        'linkedin_url',
        'x_url',
        'custom_url',
    ];
}
