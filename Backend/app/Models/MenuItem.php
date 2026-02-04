<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'menu_id',
        'parent_id',
        'title',
        'url',
        'order',
        'target',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /* ================= RELATIONSHIPS ================= */

    // The Menu this item belongs to
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    // Parent menu item (for submenu)
    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    // Child menu items (dropdown) - Fixed with recursive loading
    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')
            ->where('is_active', true)
            ->orderBy('order')
            ->with('children'); // ✅ This allows infinite nesting for submenus
    }

    /* ================= SCOPES ================= */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }
}