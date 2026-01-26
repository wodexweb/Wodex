<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PdfPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PdfPageController extends Controller
{
    /**
     * Display a listing of the PDFs.
     */
    public function index()
    {
        return response()->json(PdfPage::orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created PDF.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'file'    => 'nullable|mimes:pdf|max:10240', // Max 10MB
            'link'    => 'nullable|url', // Validates external link if provided
            'pdf_for' => 'nullable|string',
        ]);

        $data = $request->only(['title', 'description', 'link', 'pdf_for', 'status']);

        // Handle File Upload
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('pdfs', 'public');
        }

        $pdf = PdfPage::create($data);
        return response()->json($pdf, 201);
    }

    /**
     * Update the specified PDF (Handles status toggles and full edits).
     */
    public function update(Request $request, $id)
    {
        $pdf = PdfPage::findOrFail($id);

        // Validation - 'sometimes' allows updating just the status without title
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'file'  => 'nullable|mimes:pdf|max:10240',
            'link'  => 'nullable|url',
        ]);

        $data = $request->only(['title', 'description', 'link', 'pdf_for', 'status']);

        // Handle New File Upload & Delete Old File
        if ($request->hasFile('file')) {
            if ($pdf->file_path) {
                Storage::disk('public')->delete($pdf->file_path);
            }
            $data['file_path'] = $request->file('file')->store('pdfs', 'public');
        }

        $pdf->update($data);

        return response()->json([
            'message' => 'Updated successfully',
            'data' => $pdf
        ]);
    }

    /**
     * Remove the specified PDF and its associated file.
     */
    public function destroy($id)
    {
        $pdf = PdfPage::findOrFail($id);
        
        // Delete physical file from storage before deleting database record
        if ($pdf->file_path) {
            Storage::disk('public')->delete($pdf->file_path);
        }
        
        $pdf->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}