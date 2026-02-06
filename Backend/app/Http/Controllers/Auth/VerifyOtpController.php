<?php

// namespace App\Http\Controllers\Auth;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Cookie;
// use Illuminate\Support\Facades\Hash;
// use App\Models\Admin;

// class VerifyOtpController extends Controller
// {
//     public function verify(Request $request)
//     {
//         $request->validate([
//             'otp' => 'required',
//         ]);

//         // 🍪 Read email from httpOnly cookie
//         $email = $request->cookie('otp_login_email');

//         if (!$email) {
//             return response()->json([
//                 'status'  => 'failed',
//                 'message' => 'OTP session expired',
//             ], 400);
//         }

//         $record = DB::table('password_resets')
//             ->where('email', $email)
//             ->first();

//         if (!$record) {
//             return response()->json([
//                 'status'  => 'failed',
//                 'message' => 'OTP not found',
//             ], 400);
//         }

//         // ❗ HASH CHECK (IMPORTANT)
//         if (!Hash::check($request->otp, $record->otp)) {
//             return response()->json([
//                 'status'  => 'failed',
//                 'message' => 'Wrong OTP',
//             ], 400);
//         }

//         // ⏱ Expiry check (5 min)
//         if (now()->diffInMinutes($record->created_at) > 5) {
//             return response()->json([
//                 'status'  => 'failed',
//                 'message' => 'OTP expired',
//             ], 400);
//         }

//         $admin = Admin::where('email', $email)->first();

//         // 🧹 cleanup
//         DB::table('password_resets')->where('email', $email)->delete();
//         Cookie::queue(Cookie::forget('otp_login_email'));

//         // 🔑 Create token
//         $token = $admin->createToken('auth_token')->plainTextToken;

//         return response()->json([
//             'status' => 'success',
//             'token'  => $token,
//             'admin'  => [
//                 'id'    => $admin->id,
//                 'name'  => $admin->name,
//                 'email' => $admin->email,
//             ],
//         ]);
//     }
// }

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class VerifyOtpController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required',
        ]);

        // Read email from httpOnly cookie
        $email = $request->cookie('otp_login_email');

        if (!$email) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'OTP session expired',
            ], 400);
        }

        $record = DB::table('password_resets')
            ->where('email', $email)
            ->first();

        if (!$record) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'OTP not found',
            ], 400);
        }

        // Check OTP
        if (!Hash::check($request->otp, $record->otp)) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'Wrong OTP',
            ], 400);
        }

        // Expiry check (5 minutes)
        if (now()->diffInMinutes($record->created_at) > 5) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'OTP expired',
            ], 400);
        }

        $admin = Admin::where('email', $email)->first();

        // Cleanup OTP
        DB::table('password_resets')->where('email', $email)->delete();
        Cookie::queue(Cookie::forget('otp_login_email'));

        // Create token
        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token'  => $token,
            'user'   => [
                'id'       => $admin->id,
                'name'     => $admin->name,
                'email'    => $admin->email,
                'role_id'  => $admin->role_id, // IMPORTANT
                'avatar'   => $admin->avatar,
            ],
        ]);
    }
}
