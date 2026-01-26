<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaFileController extends Controller
{
    /**
     * Get all media, optionally filtered by type/topic.
     */
    public function index(Request $request)
    {
        $query = MediaFile::query();

        // Topic filter: api/admin/media?type=Banner image
        if ($request->has('type')) {
            $query->where('media_type', $request->type);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Upload new media and categorize it.
     */
   public function store(Request $request)
{
    $request->validate([
        'media_name' => 'required|string|max:255',
        'media_type' => 'required|string', 
        'file'       => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
    ]);

    if ($request->hasFile('file')) {
        $path = $request->file('file')->store('media_library', 'public');

        $media = MediaFile::create([
            'media_name' => $request->media_name,
            'media_type' => $request->media_type,
            'file_path'  => $path, // Changed from media_path to file_path
        ]);

        return response()->json($media, 201);
    }

    return response()->json(['error' => 'File upload failed'], 400);
}

public function destroy($id)
{
    $media = MediaFile::findOrFail($id);

    if ($media->file_path) { // Changed to file_path
        Storage::disk('public')->delete($media->file_path);
    }

    $media->delete();
    return response()->json(['message' => 'Media deleted successfully']);
}
}