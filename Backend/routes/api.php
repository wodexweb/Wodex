<?php

use Illuminate\Support\Facades\Route;

/* ================= AUTH CONTROLLERS ================= */
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\VerifyOtpController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\AuthController;

/* ================= ADMIN CONTROLLERS ================= */
// use App\Http\Controllers\Admin\HomeController;
// use App\Http\Controllers\AdminProfileController;

/* ================= APP CONTROLLERS ================= */
use App\Http\Controllers\EventController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RegisterController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (NO AUTH)
|--------------------------------------------------------------------------
*/

// 🔐 Authentication
Route::post('/register', [RegistrationController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/login/verify-otp', [VerifyOtpController::class, 'verify']);

// 🔑 Password recovery
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

// 💳 Payments (rate limited)
Route::middleware('throttle:3,1')->post('/create-order', [PaymentController::class, 'createOrder']);
Route::middleware('throttle:5,1')->post('/submit-form', [PaymentController::class, 'submitForm']);

/*
|--------------------------------------------------------------------------
| PUBLIC READ-ONLY RESOURCES
|--------------------------------------------------------------------------
*/

Route::apiResource('registration', RegisterController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('announcements', AnnouncementController::class);
Route::apiResource('members', MemberController::class);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (ADMIN AUTH)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/profile', [RegistrationController::class, 'profile']);
    Route::post('/admin/profile', [RegistrationController::class, 'updateProfile']);
});
