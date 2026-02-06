<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// class MenuItem extends Model
// {
//     protected $fillable = [
//         'menu_id',
//         'parent_id',
//         'title',
//         'url',
//         'order',
//         'target',
//         'is_active',
//     ];

//     protected $casts = [
//         'is_active' => 'boolean',
//     ];

//     /* ================= RELATIONSHIPS ================= */

//     // Parent menu item (for submenu)
//     public function parent()
//     {
//         return $this->belongsTo(MenuItem::class, 'parent_id');
//     }

//     // Child menu items (dropdown)
//     public function children()
//     {
//         return $this->hasMany(MenuItem::class, 'parent_id')
//             ->where('is_active', true)
//             ->orderBy('order');
//     }

//     /* ================= SCOPES ================= */

//     // Only active menu items
//     public function scopeActive($query)
//     {
//         return $query->where('is_active', true);
//     }

//     // Only top-level items
//     public function scopeTopLevel($query)
//     {
//         return $query->whereNull('parent_id');
//     }
// }
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'parent_id',
        'title',
        'url',
        'order',
        'is_active',
    ];

    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')
            ->orderBy('order'); // ✅ NO is_active filter
    }

    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }
}
