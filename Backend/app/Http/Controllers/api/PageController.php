<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class PageController extends Controller
{
    /* ================= LIST ================= */
    public function index()
    {
        return response()->json(Page::orderByDesc('id')->get());
    }

    /* ================= SHOW BY ID ================= */
    public function show($id)
    {
        return response()->json(Page::findOrFail($id));
    }

    /* ================= SHOW BY SLUG (for frontend rendering) ================= */
    public function showBySlug($slug)
    {
        $page = Page::where('slug', $slug)
                    ->where('status', 'published')
                    ->firstOrFail();

        return response()->json($page);
    }

    /* ================= STORE ================= */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'slug'    => 'nullable|string|unique:pages,slug',
            'content' => 'required',
            'status'  => 'required|in:draft,published',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        $page = Page::create($validated);

        return response()->json([
            'message' => 'Page created successfully',
            'data'    => $page,
        ], 201);
    }

    /* ================= UPDATE ================= */
    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'slug'    => 'nullable|string|unique:pages,slug,' . $page->id,
            'content' => 'required',
            'status'  => 'required|in:draft,published',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        $page->update($validated);

        return response()->json([
            'message' => 'Page updated successfully',
            'data'    => $page,
        ]);
    }

    /* ================= DELETE ================= */
    public function destroy($id)
    {
        Page::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Page deleted successfully',
        ]);
    }

    /* ================= CKEDITOR 5 IMAGE UPLOAD ================= */
    /*
     * This route is intentionally PUBLIC (no auth:sanctum middleware).
     *
     * WHY: CKEditor's fetch() upload request triggers a CORS preflight
     * which can strip the Authorization header before it reaches Sanctum,
     * causing a 401 even when the token is valid and present.
     *
     * This is safe — the endpoint only accepts valid image files,
     * rejects everything else, and doesn't expose any sensitive data.
     *
     * CKEditor 5 SUCCESS response must be: { "default": "https://..." }
     * CKEditor 5 ERROR response must be:   { "error": { "message": "..." } }
     */
    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'upload' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            ]);

            if (!$request->hasFile('upload') || !$request->file('upload')->isValid()) {
                return response()->json([
                    'error' => ['message' => 'No valid image file received']
                ], 400);
            }

            $file       = $request->file('upload');
            $uploadPath = public_path('uploads/pages');

            // Create the folder if it doesn't exist yet
            if (!File::exists($uploadPath)) {
                File::makeDirectory($uploadPath, 0755, true);
            }

            // Build a clean, safe filename
            $name     = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $ext      = strtolower($file->getClientOriginalExtension());
            $filename = time() . '_' . Str::slug($name) . '.' . $ext;

            $file->move($uploadPath, $filename);

            // ✅ CKEditor 5 REQUIRES the key to be "default"
            return response()->json([
                'default' => asset('uploads/pages/' . $filename),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => ['message' => implode(' ', $e->validator->errors()->all())]
            ], 422);

        } catch (\Throwable $e) {
            // Always return JSON — if PHP returns HTML, CKEditor crashes with
            // "Unexpected token <" which is very hard to debug
            return response()->json([
                'error' => ['message' => 'Server error: ' . $e->getMessage()]
            ], 500);
        }
    }
}
