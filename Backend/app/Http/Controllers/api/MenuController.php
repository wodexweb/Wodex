<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /* ================= ADMIN ================= */

    // GET /api/menus
    public function index()
    {
        return response()->json([
            'data' => Menu::all()
        ], 200);
    }

    // POST /api/menus
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'location' => 'required|in:header,footer',
        ]);

        $menu = Menu::create([
            'name'     => $validated['name'],
            'location' => $validated['location'],
            'status'   => true,
        ]);

        return response()->json([
            'message' => 'Menu created successfully',
            'data'    => $menu,
        ], 201);
    }

    // GET /api/menus/{id}
    public function show($id)
    {
        $menu = Menu::with('items.children')->findOrFail($id);

        return response()->json([
            'data' => $menu
        ], 200);
    }

    /* ================= FRONTEND ================= */

    // GET /api/menus/by-location/{location}
    public function byLocation(string $location)
    {
        $menu = Menu::where('location', $location)
            ->where('status', true)
            ->with([
                'items' => function ($q) {
                    $q->where('is_active', true)
                        ->whereNull('parent_id')
                        ->orderBy('order')
                        ->with([
                            'children' => function ($c) {
                                $c->where('is_active', true)
                                    ->orderBy('order');
                            }
                        ]);
                }
            ])
            ->first();

        return response()->json([
            'data' => $menu ? $menu->items : []
        ], 200);
    }
}
