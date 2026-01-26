<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * GET Settings
     */
    public function index()
    {
        $setting = Setting::first();
        return response()->json($setting, 200);
    }

    /**
     * UPDATE Settings
     */
    public function update(Request $request)
    {
        $validated = array_filter(
            // ✅ Validation (matches UI exactly)
            $validated = $request->validate([
                'system_name' => 'nullable|string|max:255',
                'application_title' => 'nullable|string|max:255',
                'website_title' => 'nullable|string|max:255',
                'website_description' => 'nullable|string',
                'website_keywords' => 'nullable|string|max:500',
                'website_url' => 'nullable|url|max:255',
                'site_copyright' => 'nullable|string|max:255',

                'website_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
                'admin_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            ]),
            fn($value) => !is_null($value)
        );
        // ✅ Always single row
        $setting = Setting::firstOrCreate([]);

        // ✅ Handle Website Logo
        if ($request->hasFile('website_logo')) {
            if ($setting->website_logo) {
                Storage::disk('public')->delete($setting->website_logo);
            }
            $validated['website_logo'] = $request->file('website_logo')
                ->store('settings', 'public');
        }

        // ✅ Handle Admin Logo
        if ($request->hasFile('admin_logo')) {
            if ($setting->admin_logo) {
                Storage::disk('public')->delete($setting->admin_logo);
            }
            $validated['admin_logo'] = $request->file('admin_logo')
                ->store('settings', 'public');
        }

        // ✅ Update safely
        $setting->update($validated);

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => $setting
        ], 200);
    }
}
