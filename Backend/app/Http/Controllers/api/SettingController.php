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

        if (!$setting) {
            return response()->json(null, 200);
        }

        // ✅ Attach public URLs
        $setting->website_logo_url = $setting->website_logo
            ? asset('storage/' . $setting->website_logo)
            : null;

        $setting->admin_logo_url = $setting->admin_logo
            ? asset('storage/' . $setting->admin_logo)
            : null;

        return response()->json($setting, 200);
    }

    /**
     * UPDATE Settings
     */
    public function update(Request $request)
    {
        $validated = array_filter(
            $request->validate([
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

        // ✅ Single row always
        $setting = Setting::firstOrCreate([]);

        // ✅ Ensure directory exists
        Storage::disk('public')->makeDirectory('settings');

        // ✅ Website Logo
        if ($request->hasFile('website_logo')) {
            if ($setting->website_logo && Storage::disk('public')->exists($setting->website_logo)) {
                Storage::disk('public')->delete($setting->website_logo);
            }

            $validated['website_logo'] = $request
                ->file('website_logo')
                ->store('settings', 'public');
        }

        // ✅ Admin Logo
        if ($request->hasFile('admin_logo')) {
            if ($setting->admin_logo && Storage::disk('public')->exists($setting->admin_logo)) {
                Storage::disk('public')->delete($setting->admin_logo);
            }

            $validated['admin_logo'] = $request
                ->file('admin_logo')
                ->store('settings', 'public');
        }

        // ✅ Update DB
        $setting->update($validated);

        // ✅ Attach URLs for response
        $setting->website_logo_url = $setting->website_logo
            ? asset('storage/' . $setting->website_logo)
            : null;

        $setting->admin_logo_url = $setting->admin_logo
            ? asset('storage/' . $setting->admin_logo)
            : null;

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => $setting,
        ], 200);
    }
}
