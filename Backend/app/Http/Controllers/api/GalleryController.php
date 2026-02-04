<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;

class GalleryController extends Controller
{
    /**
     * Get events for the dropdown.
     */
    public function events()
    {
        $events = Event::select('id', 'title')->orderBy('title')->get();
        return response()->json([
            'success' => true,
            'data' => $events
        ]);
    }

    /**
     * Store a new gallery with multiple images.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'event_id' => 'required|exists:events,id',
                'title'    => 'required|string|max:255',
                'photos'   => 'required',
                'photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:10048' // ~10MB per image
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
                'success' => true,
                'message' => 'Gallery uploaded successfully',
                'data' => $gallery
            ], 201);

        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Fetch images for a specific event.
     */
    public function byEvent($eventId)
    {
        $gallery = Gallery::where('event_id', $eventId)->first();

        if (!$gallery) {
            return response()->json([
                'success' => true,
                'data' => [
                    'event_title' => '',
                    'images' => [],
                    'drive_link' => ''
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'gallery_id'  => $gallery->id,
                'event_title' => $gallery->title,
                'images'      => collect($gallery->images ?? [])->map(fn($img) => asset('storage/' . $img)),
                'drive_link'  => $gallery->drive_link ?? ''
            ]
        ]);
    }

    /**
     * Main index for the frontend and admin.
     */
    public function index()
    {
        try {
            $galleries = Gallery::with('event:id,title')
                ->latest()
                ->get()
                ->map(function ($g) {
                    return [
                        'gallery_id'    => $g->id,
                        'gallery_title' => $g->title,
                        'event_title'   => $g->event?->title,
                        'images'        => collect($g->images ?? [])->map(
                            fn($img) => asset('storage/' . $img)
                        )
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $galleries
            ]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete gallery and its physical images.
     */
    public function destroy($id)
    {
        try {
            $gallery = Gallery::findOrFail($id);
            
            if ($gallery->images) {
                foreach ($gallery->images as $path) {
                    Storage::disk('public')->delete($path);
                }
            }
            
            $gallery->delete();
            return response()->json(['success' => true, 'message' => 'Gallery deleted']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}