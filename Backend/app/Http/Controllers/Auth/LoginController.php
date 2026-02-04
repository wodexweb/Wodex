<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'Invalid credentials',
            ], 401);
        }

        // 🔐 Generate OTP
        $otp = rand(100000, 999999);

        // Store HASHED OTP (security)
        DB::table('password_resets')->updateOrInsert(
            ['email' => $admin->email],
            [
                'otp'        => Hash::make($otp),
                'created_at' => now(),
            ]
        );

        // 📧 Send OTP email
        Mail::raw(
            "Your login OTP is: {$otp}",
            function ($message) use ($admin) {
                $message->to($admin->email)
                    ->subject('Login OTP Verification');
            }
        );

        // 🍪 Store email in httpOnly cookie (5 min)
        $cookie = cookie(
            'otp_login_email',
            $admin->email,
            5,
            '/',
            null,
            false,
            true,
            false,
            'lax'
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'OTP sent to your email',
            'step'    => 'otp_required',
        ])->withCookie($cookie);
    }
}
