<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaLibraryController extends Controller
{
    /* ADMIN LIST */
    public function index()
    {
        return MediaLibrary::latest()->get();
    }

    /* ADMIN CREATE (AUTO REPLACE OLD BANNER) */
    public function store(Request $request)
    {
        $request->validate([
            'page_slug' => 'required|string',
            'section'   => 'required|in:hero,header',
            'file'      => 'nullable|image'
        ]);

        // delete existing banner for same page + section
        $old = MediaLibrary::where('page_slug', $request->page_slug)
            ->where('section', $request->section)
            ->first();

        if ($old) {
            if ($old->file_path) {
                Storage::disk('public')->delete($old->file_path);
            }
            $old->delete();
        }

        $path = null;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('media', 'public');
        }

        return MediaLibrary::create([
            'page_slug' => $request->page_slug,
            'section'   => $request->section,
            'title'     => $request->title,
            'subtitle'  => $request->subtitle,
            'file_path' => $path
        ]);
    }

    /* ADMIN UPDATE */
    public function update(Request $request, $id)
    {
        $item = MediaLibrary::findOrFail($id);

        if ($request->hasFile('file')) {
            if ($item->file_path) {
                Storage::disk('public')->delete($item->file_path);
            }
            $item->file_path = $request->file('file')->store('media', 'public');
        }

        $item->update([
            'page_slug' => $request->page_slug,
            'section'   => $request->section,
            'title'     => $request->title,
            'subtitle'  => $request->subtitle
        ]);

        return $item;
    }

    /* ADMIN DELETE */
    public function destroy($id)
    {
        $item = MediaLibrary::findOrFail($id);

        if ($item->file_path) {
            Storage::disk('public')->delete($item->file_path);
        }

        $item->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    /* FRONTEND FETCH */
    public function byPage($slug)
    {
        return MediaLibrary::where('page_slug', $slug)->get();
    }
}
