<?php

use Illuminate\Support\Facades\Route;

/* ================= AUTH CONTROLLERS ================= */
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\VerifyOtpController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\api\SettingController;
use App\Http\Controllers\api\ContactSettingController;
use App\Http\Controllers\Api\HeaderSettingController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\PdfPageController;
// use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\MembershipPlanController;

/* ================= ADMIN CONTROLLERS ================= */
// use App\Http\Controllers\Admin\HomeController;
// use App\Http\Controllers\AdminProfileController;

/* ================= APP CONTROLLERS ================= */
use App\Http\Controllers\EventController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Api\Admin\GalleryController;
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

Route::apiResource('membership-plans', MembershipPlanController::class);

// General Settings
Route::get('settings', [SettingController::class, 'index']);
Route::post('settings', [SettingController::class, 'update']);

// Contact Settings
Route::get('contact-settings', [ContactSettingController::class, 'Index']);
Route::post('contact-settings', [ContactSettingController::class, 'Update']);

Route::get('/header', [HeaderSettingController::class, 'index']);
Route::post('/header', [HeaderSettingController::class, 'update']);
// });


Route::prefix('menus')->group(function () {

    // 🔹 Get all menus (optional admin list)
    Route::get('/', [MenuController::class, 'index']);

    // 🔹 Get menu by location (header / footer) – ADMIN & FRONTEND
    Route::get('/by-location/{location}', [MenuController::class, 'getByLocation']);

    // 🔹 Create menu (Header / Footer)
    Route::post('/', [MenuController::class, 'store']);

    // 🔹 Get menu with items by ID
    Route::get('/{id}', [MenuController::class, 'show']);
});


/*
|--------------------------------------------------------------------------
| MENU ITEMS (Links inside menu)
|--------------------------------------------------------------------------
*/
Route::prefix('menu-items')->group(function () {

    // 🔹 Add menu item
    Route::post('/', [MenuItemController::class, 'store']);

    // 🔹 Update order (drag & drop)
    Route::post('/order', [MenuItemController::class, 'updateOrder']);

    // 🔹 Delete menu item
    Route::delete('/{id}', [MenuItemController::class, 'destroy']);
});

Route::prefix('menu-items')->group(function () {
    Route::post('/', [MenuItemController::class, 'store']);
    Route::post('/order', [MenuItemController::class, 'updateOrder']);

    Route::patch('/{id}/toggle', [MenuItemController::class, 'toggle']);
    // Route::patch('menu-items/{id}/toggle', [MenuItemController::class, 'toggle']);
    Route::delete('/{id}', [MenuItemController::class, 'destroy']);
});


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

Route::prefix('admin')->group(function () {
    Route::apiResource('notices', NoticeController::class);
    Route::apiResource('pdf-pages', PdfPageController::class);
    // Route::apiResource('achievements', AchievementController::class);

    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::get('/gallery/{eventId}', [GalleryController::class, 'show']);
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);

    Route::apiResource('membership-plans', MembershipPlanController::class);
});
