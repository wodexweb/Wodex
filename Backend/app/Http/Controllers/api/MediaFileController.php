<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    /**
     * Store gallery images (event OPTIONAL)
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
            'title'    => 'required|string|max:255',
            'files'    => 'required|array',
            'files.*'  => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        foreach ($request->file('files') as $file) {
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('gallery', $filename, 'public');

            Gallery::create([
                'event_id' => $request->event_id ?? null,
                'title'    => $request->title,
                'image'    => $path,
            ]);
        }

        return response()->json([
            'message' => 'Gallery images uploaded successfully'
        ], 201);
    }

    /**
     * Get gallery images by event
     */
    public function show($eventId)
    {
        $images = Gallery::where('event_id', $eventId)
            ->orderByDesc('id')
            ->pluck('image');

        return response()->json([
            'images' => $images
        ]);
    }

    /**
     * Delete a single gallery image
     */
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        if ($gallery->image && Storage::disk('public')->exists($gallery->image)) {
            Storage::disk('public')->delete($gallery->image);
        }

        $gallery->delete();

        return response()->json([
            'message' => 'Gallery image deleted successfully'
        ]);
    }
}
