<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Logout user (ALL devices)
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logout success',
        ], 200);
    }

    /**
     * Get logged-in admin profile
     */
    public function me(Request $request)
    {
        $admin = $request->user();

        return response()->json([
            'status' => 'success',
            'user' => [
                'id'     => $admin->id,
                'name'   => $admin->name,
                'email'  => $admin->email,
                'avatar' => $admin->avatar
                    ? asset('storage/' . $admin->avatar)
                    : null,
            ],
        ], 200);
    }
}
