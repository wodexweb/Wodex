<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeaderSetting;
use Illuminate\Http\Request;

class HeaderSettingController extends Controller
{
    /**
     * Get header settings
     */
    public function index()
    {
        $settings = HeaderSetting::first();

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Update header settings
     */
    public function update(Request $request)
    {
        $validated = array_filter(
            $request->validate([
                'header_title' => 'nullable|string|max:255',
                'drive_link' => 'nullable|url',
                'title_color' => 'nullable|string|max:20',
            ]),
            fn($value) => !is_null($value)
        );

        $settings = HeaderSetting::first();

        if (!$settings) {
            $settings = HeaderSetting::create($validated);
        } else {
            $settings->update($validated);
        }

        return response()->json([
            'success' => true,
            'message' => 'Header settings updated successfully',
            'data' => $settings
        ]);
    }
}
