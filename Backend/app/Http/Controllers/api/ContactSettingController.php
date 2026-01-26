<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSetting;
use Illuminate\Http\Request;

class ContactSettingController extends Controller
{
    /**
     * GET Contact Settings
     */
    public function index()
    {
        $setting = ContactSetting::first();
        return response()->json($setting);
    }

    /**
     * UPDATE Contact Settings
     */
    public function update(Request $request)
    {
        $validated = array_filter(
            $request->validate([
                'contact_number' => 'nullable|digits:10',
                'contact_number_1' => 'nullable|digits:10',
                'whatsapp_number' => 'nullable|digits:10',

                'email' => 'nullable|email|max:255',
                'working_hours' => 'nullable|string|max:255',
                'address' => 'nullable|string',

                'google_map_link' => 'nullable|url|max:500',
                'facebook_url' => 'nullable|url|max:500',
                'instagram_url' => 'nullable|url|max:500',
                'youtube_url' => 'nullable|url|max:500',
                'linkedin_url' => 'nullable|url|max:500',
                'x_url' => 'nullable|url|max:500',
                'custom_url' => 'nullable|url|max:500',
            ]),

            fn($value) => !is_null($value)
        );
        // Create or update first record
        $setting = ContactSetting::firstOrCreate([]);

        $setting->update($request->all());

        return response()->json([
            'message' => 'Contact settings updated successfully',
            'data' => $setting
        ]);
    }
}
