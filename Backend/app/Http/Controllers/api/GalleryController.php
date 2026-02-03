<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function events()
    {
        return response()->json(
            Event::select('id', 'title')->orderBy('title')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'title'    => 'required|string|max:255',
            'photos'   => 'required',
            'photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:100048'
        ]);

        $imagePaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('gallery', 'public');
                $imagePaths[] = $path;
            }
        }

        $gallery = Gallery::create([
            'event_id' => $request->event_id,
            'title'    => $request->title,
            'images'   => $imagePaths 
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Gallery uploaded successfully',
            'data' => $gallery
        ], 201);
    }

    // ✅ FIXED: Added missing method referenced in api.php
    public function byEvent($eventId)
    {
        $gallery = Gallery::where('event_id', $eventId)->first();

        if (!$gallery) {
            return response()->json([
                'event_title' => '',
                'images' => [],
                'drive_link' => ''
            ], 200);
        }

        return response()->json([
            'gallery_id' => $gallery->id,
            'event_title' => $gallery->title,
            'images' => $gallery->images, // Model casting handles this
            'drive_link' => $gallery->drive_link ?? ''
        ]);
    }

    public function index()
    {
        $galleries = Gallery::with('event:id,title')
            ->latest()
            ->get()
            ->map(function ($g) {
                return [
                    'gallery_id' => $g->id,
                    'gallery_title' => $g->title,
                    'event_title' => $g->event?->title,
                    'images' => collect($g->images)->map(
                        fn($img) => asset('storage/' . $img)
                    )
                ];
            });

        return response()->json($galleries);
    }

    // ✅ FIXED: Added destroy method
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);
        
        // Delete files from storage
        if ($gallery->images) {
            foreach ($gallery->images as $path) {
                Storage::disk('public')->delete($path);
            }
        }
        
        $gallery->delete();
        return response()->json(['message' => 'Gallery deleted']);
    }
}