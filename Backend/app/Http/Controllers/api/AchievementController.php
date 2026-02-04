<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AchievementController extends Controller
{
    // GET: api/achievements OR api/admin/achievements
    public function index()
    {
        // For the public site, you might want only 'active'
        // For admin, you might want all. Here is a simple approach:
        $achievements = Achievement::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $achievements
        ], 200);
    }

    // POST: api/admin/achievements
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:191',
            'status' => 'required|string'
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('achievements', 'public');
        }

        $achievement = Achievement::create($data);

        return response()->json(['success' => true, 'data' => $achievement], 201);
    }

    // GET: api/achievements/{id}
    public function show($id)
    {
        $achievement = Achievement::find($id);
        if (!$achievement) return response()->json(['success' => false], 404);
        
        return response()->json(['success' => true, 'data' => $achievement]);
    }

    // PUT/PATCH: api/admin/achievements/{id}
    public function update(Request $request, $id)
    {
        $achievement = Achievement::findOrFail($id);
        $data = $request->all();

        if ($request->hasFile('image')) {
            if ($achievement->image_path) {
                Storage::disk('public')->delete($achievement->image_path);
            }
            $data['image_path'] = $request->file('image')->store('achievements', 'public');
        }

        $achievement->update($data);
        return response()->json(['success' => true, 'data' => $achievement]);
    }

    // DELETE: api/admin/achievements/{id}
    public function destroy($id)
    {
        $achievement = Achievement::findOrFail($id);
        if ($achievement->image_path) {
            Storage::disk('public')->delete($achievement->image_path);
        }
        $achievement->delete();
        return response()->json(['success' => true, 'message' => 'Deleted successfully']);
    }
}