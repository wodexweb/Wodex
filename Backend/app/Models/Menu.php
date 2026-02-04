<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = ['name', 'location', 'is_active'];

    public function items()
    {
        // Fetches only top-level items; children are loaded via recursion
        return $this->hasMany(MenuItem::class)
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('order');
    }
}