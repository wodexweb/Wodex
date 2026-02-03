<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice; // CRITICAL: This must be here
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;

class NoticeController extends Controller
{
    public function index()
    {
        try {
            // Fetching all notices from the database
            return response()->json(Notice::orderBy('publish_date', 'desc')->get());
        } catch (Exception $e) {
            // Returning the error message to help debug
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'notice_title' => 'required|string|max:255',
                'publish_date' => 'required|date',
                'attachment'   => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            ]);

            // Capture all fields including the newly added 'status'
            $data = $request->only([
                'notice_title', 
                'notice_description', 
                'publish_date', 
                'visibility', 
                'status'
            ]);

            if ($request->hasFile('attachment')) {
                $data['attachment_path'] = $request->file('attachment')->store('notices', 'public');
            }

            $notice = Notice::create($data);

            return response()->json($notice, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ... (include update and destroy methods as previously provided)


    public function update(Request $request, $id)
    {
        $notice = Notice::findOrFail($id);
        
        // Handle multipart/form-data with PUT spoofing
        $data = $request->all();

        if ($request->hasFile('attachment')) {
            if ($notice->attachment_path) {
                Storage::disk('public')->delete($notice->attachment_path);
            }
            $data['attachment_path'] = $request->file('attachment')->store('notices', 'public');
        }

        $notice->update($data);
        return response()->json(['message' => 'Notice updated successfully', 'data' => $notice]);
    }

    public function destroy($id)
    {
        $notice = Notice::findOrFail($id);
        if ($notice->attachment_path) {
            Storage::disk('public')->delete($notice->attachment_path);
        }
        $notice->delete();
        return response()->json(['message' => 'Notice deleted successfully']);
    }
}