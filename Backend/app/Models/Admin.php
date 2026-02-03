<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;

// class Admin extends Authenticatable
// {
//     use HasApiTokens, HasFactory, Notifiable;

//     protected $table = 'admin'; // correct

//     protected $fillable = [
//         'name',
//         'email',
//         'password',
//         'avatar',
//     ];

//     protected $hidden = [
//         'password',
//         'remember_token',
//     ];

//     protected $casts = [
//         'email_verified_at' => 'datetime',
//     ];

//     /* ================= RELATION ================= */
// }

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /* ================= ROLE HELPERS ================= */

    public function isAdmin(): bool
    {
        return $this->role_id === 1;
    }

    public function isEditor(): bool
    {
        return $this->role_id === 2;
    }

    public function isSecretary(): bool
    {
        return $this->role_id === 3;
    }
}
