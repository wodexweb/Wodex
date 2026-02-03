<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class RegistrationController extends Controller
{
    /* ================= REGISTER ================= */

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:admin,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'avatar'   => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $admin = Admin::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'avatar'   => $avatarPath,
        ]);

        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Registration successful',
            'token'   => $token,
            'user'    => $this->profileData($admin),
        ], 201);
    }

    /* ================= PROFILE FETCH ================= */

    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user'   => $this->profileData($request->user()),
        ]);
    }

    /* ================= UPDATE PROFILE ================= */

    public function updateProfile(Request $request)
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'name'   => ['sometimes', 'required', 'string', 'max:255'],
            'email'  => ['sometimes', 'required', 'email', 'unique:admin,email,' . $admin->id],
            'avatar' => ['sometimes', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        /* ===== Avatar ===== */
        if ($request->hasFile('avatar')) {

            if ($admin->avatar && Storage::disk('public')->exists($admin->avatar)) {
                Storage::disk('public')->delete($admin->avatar);
            }

            $admin->avatar = $request->file('avatar')->store('avatars', 'public');
            $admin->save();
        }

        /* ===== Name / Email ===== */
        $data = [];

        if ($request->has('name')) {
            $data['name'] = $request->name;
        }

        if ($request->has('email')) {
            $data['email'] = $request->email;
        }

        if (!empty($data)) {
            $admin->update($data);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Profile updated successfully',
            'user'    => $this->profileData($admin),
        ]);
    }

    /* ================= PROFILE FORMAT ================= */

    private function profileData(Admin $admin)
    {
        return [
            'id'     => $admin->id,
            'name'   => $admin->name,
            'email'  => $admin->email,
            'avatar' => $admin->avatar
                ? asset('storage/' . $admin->avatar)
                : null,
        ];
    }
}
