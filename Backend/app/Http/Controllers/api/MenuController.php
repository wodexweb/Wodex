<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * List all menus (admin list)
     */
    public function index()
    {
        return response()->json(Menu::all(), 200);
    }

    /**
     * Create menu
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|in:header,footer',
        ]);

        $menu = Menu::create($validated);

        return response()->json([
            'message' => 'Menu created successfully',
            'data' => $menu
        ], 201);
    }

    /**
     * Get menu by ID (admin edit)
     */
    public function show($id)
    {
        $menu = Menu::with('items.children')->findOrFail($id);
        return response()->json($menu, 200);
    }

    /**
     * ✅ Get menu by location (header/footer)
     * Used by MenuBuilder & frontend
     */
    public function getByLocation($location)
    {
        $menu = Menu::where('location', $location)
            ->where('status', true)
            ->with('items.children')
            ->first();

        return response()->json($menu, 200);
    }
}
