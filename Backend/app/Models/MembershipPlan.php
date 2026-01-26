<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model
{
    use HasFactory;

    // You MUST add these fields to allow Laravel to save them
    protected $fillable = [
        'name',
        'price',
        'duration_months',
        'benefits',
        'status'
    ];
}