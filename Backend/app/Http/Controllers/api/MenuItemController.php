<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MenuItemController extends Controller
{
    /**
     * Create menu item (top-level or submenu)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_id'   => 'required|exists:menus,id',
            'parent_id' => 'nullable|exists:menu_items,id',
            'title'     => 'required|string|max:255',
            'url'       => 'required|string|max:255',
        ]);

        // Ensure parent belongs to same menu
        if (!empty($validated['parent_id'])) {
            $parent = MenuItem::find($validated['parent_id']);
            if ($parent->menu_id !== (int) $validated['menu_id']) {
                return response()->json([
                    'message' => 'Parent item does not belong to this menu'
                ], 422);
            }
        }

        // Order relative to same parent
        $validated['order'] = MenuItem::where('menu_id', $validated['menu_id'])
            ->where('parent_id', $validated['parent_id'] ?? null)
            ->count() + 1;

        $validated['is_active'] = true;

        $item = MenuItem::create($validated);

        return response()->json($item, 201);
    }

    /**
     * 🔥 Drag & drop (nested) order save
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'items'                 => 'required|array',
            'items.*.id'            => 'required|exists:menu_items,id',
            'items.*.order'         => 'required|integer|min:1',
            'items.*.parent_id'     => 'nullable|exists:menu_items,id',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->items as $item) {
                MenuItem::where('id', $item['id'])->update([
                    'order'     => $item['order'],
                    'parent_id' => $item['parent_id'] ?? null,
                ]);
            }
        });

        return response()->json([
            'message' => 'Menu order updated successfully'
        ], 200);
    }

    /**
     * Enable / Disable menu item
     */
    public function toggle($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->is_active = ! $item->is_active;
        $item->save();
        
        return response()->json([
            'message'   => 'Menu item status updated',
            'is_active' => $item->is_active
        ], 200);
    }

    /**
     * Delete menu item (recursive delete)
     */
    public function destroy($id)
    {
        $item = MenuItem::with('children')->findOrFail($id);

        $this->deleteRecursive($item);

        return response()->json([
            'message' => 'Menu item deleted'
        ], 200);
    }

    /**
     * 🔁 Recursive delete helper
     */
    private function deleteRecursive(MenuItem $item)
    {
        foreach ($item->children as $child) {
            $this->deleteRecursive($child);
        }

        $item->delete();
    }
    // Add this method inside MenuItemController

/**
 * Get nested menu items by menu location slug
 */
public function getByLocation($location)
{
    // 1. Find the menu by its location string (e.g., 'footer-about')
    $menu = \App\Models\Menu::where('location', $location)->first();

    if (!$menu) {
        return response()->json(['items' => []], 404);
    }

    // 2. Fetch only top-level items (parent_id is null) 
    // and pull their children recursively using the relationship
    $items = MenuItem::where('menu_id', $menu->id)
        ->whereNull('parent_id')
        ->where('is_active', true)
        ->orderBy('order', 'asc')
        ->with('children') // This pulls sub-menus automatically
        ->get();

    return response()->json([
        'items' => $items
    ]);
}
}
