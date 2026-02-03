<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| AUTH CONTROLLERS
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Auth\{
    RegistrationController,
    LoginController,
    VerifyOtpController,
    ForgotPasswordController,
    ResetPasswordController,
    AuthController
};

/*
|--------------------------------------------------------------------------
| API CONTROLLERS
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Api\{
    SettingController,
    ContactSettingController,
    HeaderSettingController,
    MenuController,
    MenuItemController,
    NoticeController,
    PdfPageController,
    MembershipPlanController,
    GalleryController
};

/*
|--------------------------------------------------------------------------
| APP CONTROLLERS
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\{
    EventController,
    AnnouncementController,
    MemberController,
    PaymentController,
    RegisterController
};

/*
|--------------------------------------------------------------------------
| ADMIN CONTROLLERS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| PUBLIC AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [RegistrationController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/login/verify-otp', [VerifyOtpController::class, 'verify']);

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

/*
|--------------------------------------------------------------------------
| PAYMENTS (RATE LIMITED)
|--------------------------------------------------------------------------
*/
Route::middleware('throttle:3,1')->post('/create-order', [PaymentController::class, 'createOrder']);
Route::middleware('throttle:5,1')->post('/submit-form', [PaymentController::class, 'submitForm']);

/*
|--------------------------------------------------------------------------
| PUBLIC READ-ONLY RESOURCES
|--------------------------------------------------------------------------
*/
Route::apiResource('membership-plans', MembershipPlanController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('announcements', AnnouncementController::class);
Route::apiResource('members', MemberController::class);
Route::apiResource('registration', RegisterController::class);

/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
*/
Route::get('settings', [SettingController::class, 'index']);
Route::post('settings', [SettingController::class, 'update']);

Route::get('contact-settings', [ContactSettingController::class, 'index']);
Route::post('contact-settings', [ContactSettingController::class, 'update']);

Route::get('header', [HeaderSettingController::class, 'index']);
Route::post('header', [HeaderSettingController::class, 'update']);

/*
|--------------------------------------------------------------------------
| MENUS
|--------------------------------------------------------------------------
*/
Route::prefix('menus')->group(function () {
    Route::get('/', [MenuController::class, 'index']);
    Route::get('/by-location/{location}', [MenuController::class, 'getByLocation']);
    Route::post('/', [MenuController::class, 'store']);
    Route::get('/{id}', [MenuController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| MENU ITEMS
|--------------------------------------------------------------------------
*/
Route::prefix('menu-items')->group(function () {
    Route::post('/', [MenuItemController::class, 'store']);
    Route::post('/order', [MenuItemController::class, 'updateOrder']);
    Route::patch('/{id}/toggle', [MenuItemController::class, 'toggle']);
    Route::delete('/{id}', [MenuItemController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN AUTH ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    Route::get('/admin/profile', [RegistrationController::class, 'profile']);
    Route::post('/admin/profile', [RegistrationController::class, 'updateProfile']);
});

/*
|--------------------------------------------------------------------------
| ADMIN PANEL ROUTES (PROTECTED)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    Route::apiResource('notices', NoticeController::class);
    Route::apiResource('pdf-pages', PdfPageController::class);
    Route::apiResource('membership-plans', MembershipPlanController::class);

    /*
    |--------------------------------------------------------------------------
    | GALLERY (ADMIN)
    |--------------------------------------------------------------------------
    */
    Route::get('/gallery/events', [GalleryController::class, 'events']);        // dropdown
    Route::post('/gallery', [GalleryController::class, 'store']);              // upload
    Route::get('/gallery', [GalleryController::class, 'index']);               // list
    Route::get('/gallery/event/{eventId}', [GalleryController::class, 'byEvent']); // event-wise
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);     // delete
});
