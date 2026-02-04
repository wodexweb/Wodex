<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;

class NoticeController extends Controller
{
    public function index()
    {
        try {
            // Fetching active notices for the frontend
            $notices = Notice::orderBy('publish_date', 'desc')->get();
            
            // WRAPPING: Match the { success: true, data: [...] } format
            return response()->json([
                'success' => true,
                'data' => $notices
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false, 
                'error' => $e->getMessage()
            ], 500);
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

            return response()->json([
                'success' => true,
                'data' => $notice
            ], 201);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $notice = Notice::findOrFail($id);
            $data = $request->all();

            if ($request->hasFile('attachment')) {
                if ($notice->attachment_path) {
                    Storage::disk('public')->delete($notice->attachment_path);
                }
                $data['attachment_path'] = $request->file('attachment')->store('notices', 'public');
            }

            $notice->update($data);
            return response()->json([
                'success' => true, 
                'message' => 'Notice updated successfully', 
                'data' => $notice
            ]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $notice = Notice::findOrFail($id);
            if ($notice->attachment_path) {
                Storage::disk('public')->delete($notice->attachment_path);
            }
            $notice->delete();
            return response()->json(['success' => true, 'message' => 'Notice deleted successfully']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}