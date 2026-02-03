<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    // 🔽 Event dropdown
    public function events()
    {
        return response()->json(
            Event::select('id', 'title')->orderBy('title')->get()
        );
    }

    // 🔼 Upload gallery
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'photos' => 'required',
            'photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        $imagePaths = [];

        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('gallery', 'public');
            $imagePaths[] = $path;
        }

        Gallery::create([
            'event_id' => $request->event_id,
            'title' => $request->title,
            'images' => $imagePaths // 👈 no json_encode
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Gallery uploaded successfully'
        ], 201);
    }

    // 📃 Right side gallery list
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
}
