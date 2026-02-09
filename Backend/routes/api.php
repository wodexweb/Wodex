<?php

// use Illuminate\Support\Facades\Route;

// /*
// |--------------------------------------------------------------------------
// | AUTH CONTROLLERS
// |--------------------------------------------------------------------------
// */
// use App\Http\Controllers\Auth\{
//     RegistrationController,
//     LoginController,
//     VerifyOtpController,
//     ForgotPasswordController,
//     ResetPasswordController,
//     AuthController
// };

// /*
// |--------------------------------------------------------------------------
// | API CONTROLLERS
// |--------------------------------------------------------------------------
// */
// use App\Http\Controllers\Api\{
//     SettingController,
//     ContactSettingController,
//     HeaderSettingController,
//     MenuController,
//     MenuItemController,
//     NoticeController,
//     PdfPageController,
//     MembershipPlanController,
//     GalleryController,
//     AchievementController
// };

// /*
// |--------------------------------------------------------------------------
// | APP CONTROLLERS
// |--------------------------------------------------------------------------
// */
// use App\Http\Controllers\{
//     EventController,
//     AnnouncementController,
//     MemberController,
//     PaymentController,
//     RegisterController
// };

// /*
// |--------------------------------------------------------------------------
// | PUBLIC AUTH ROUTES
// |--------------------------------------------------------------------------
// */

// Route::post('/register', [RegistrationController::class, 'register']);
// Route::post('/login', [LoginController::class, 'login']);
// Route::post('/login/verify-otp', [VerifyOtpController::class, 'verify']);
// Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
// Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

// /*
// |--------------------------------------------------------------------------
// | PAYMENTS (RATE LIMITED)
// |--------------------------------------------------------------------------
// */
// Route::middleware('throttle:3,1')->post('/create-order', [PaymentController::class, 'createOrder']);
// Route::middleware('throttle:5,1')->post('/submit-form', [PaymentController::class, 'submitForm']);

// /*
// |--------------------------------------------------------------------------
// | PUBLIC READ-ONLY RESOURCES
// |--------------------------------------------------------------------------
// */
// Route::apiResource('membership-plans', MembershipPlanController::class)->only(['index', 'show']);
// Route::apiResource('events', EventController::class)->only(['index', 'show']);
// Route::apiResource('announcements', AnnouncementController::class)->only(['index', 'show']);
// Route::apiResource('members', MemberController::class)->only(['index', 'show']);
// Route::apiResource('registration', RegisterController::class)->only(['store']);

// Route::apiResource('achievements', AchievementController::class)->only(['index', 'show']);
// Route::apiResource('notices', NoticeController::class)->only(['index', 'show']);

// /*
// |--------------------------------------------------------------------------
// | SETTINGS (ADMIN UPDATE, PUBLIC READ)
// |--------------------------------------------------------------------------
// */
// Route::get('settings', [SettingController::class, 'index']);
// Route::post('settings', [SettingController::class, 'update']);

// Route::get('contact-settings', [ContactSettingController::class, 'index']);
// Route::post('contact-settings', [ContactSettingController::class, 'update']);

// Route::get('header', [HeaderSettingController::class, 'index']);
// Route::post('header', [HeaderSettingController::class, 'update']);

// /*
// |--------------------------------------------------------------------------
// | MENUS
// |--------------------------------------------------------------------------
// */
// Route::prefix('menus')->group(function () {
//     Route::get('/', [MenuController::class, 'index']);           // admin list
//     Route::post('/', [MenuController::class, 'store']);          // admin create
//     Route::get('/{id}', [MenuController::class, 'show']);        // admin edit
//     Route::get('/by-location/{location}', [MenuController::class, 'byLocation']); // frontend
// });

// /*
// |--------------------------------------------------------------------------
// | MENU ITEMS
// |--------------------------------------------------------------------------
// */
// Route::prefix('menu-items')->group(function () {
//     Route::post('/', [MenuItemController::class, 'store']);
//     Route::post('/order', [MenuItemController::class, 'updateOrder']);
//     Route::patch('/{id}/toggle', [MenuItemController::class, 'toggle']);
//     Route::delete('/{id}', [MenuItemController::class, 'destroy']);
// });

// /*
// |--------------------------------------------------------------------------
// | PROTECTED AUTH ROUTES
// |--------------------------------------------------------------------------
// */
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/admin/me', [AuthController::class, 'me']);
//     Route::post('/admin/logout', [AuthController::class, 'logout']);

//     Route::get('/admin/profile', [RegistrationController::class, 'profile']);
//     Route::post('/admin/profile', [RegistrationController::class, 'updateProfile']);
// });

// /*
// |--------------------------------------------------------------------------
// | ADMIN PANEL ROUTES (PROTECTED)
// |--------------------------------------------------------------------------
// */
// Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

//     Route::apiResource('notices', NoticeController::class);
//     Route::apiResource('pdf-pages', PdfPageController::class);
//     Route::apiResource('membership-plans', MembershipPlanController::class);
//     Route::apiResource('achievements', AchievementController::class);

//     /*
//     |--------------------------------------------------------------------------
//     | GALLERY (ADMIN)
//     |--------------------------------------------------------------------------
//     */
//     Route::get('/gallery/events', [GalleryController::class, 'events']);
//     Route::post('/gallery', [GalleryController::class, 'store']);
//     Route::get('/gallery', [GalleryController::class, 'index']);
//     Route::get('/gallery/event/{eventId}', [GalleryController::class, 'byEvent']);
//     Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
// });

// /*
// |--------------------------------------------------------------------------
// | PUBLIC GALLERY
// |--------------------------------------------------------------------------
// */
// Route::get('/galleries', [GalleryController::class, 'index']);



// use Illuminate\Support\Facades\Route;

// /*
// |--------------------------------------------------------------------------
// | AUTH CONTROLLERS (PUBLIC)
// |--------------------------------------------------------------------------
// */
// use App\Http\Controllers\Auth\{
//     RegistrationController,
//     LoginController,
//     VerifyOtpController,
//     ForgotPasswordController,
//     ResetPasswordController,
//     AuthController
// };

// /*
// |--------------------------------------------------------------------------
// | API CONTROLLERS
// |--------------------------------------------------------------------------
// */
// use App\Http\Controllers\Api\{
//     SettingController,
//     ContactSettingController,
//     HeaderSettingController,
//     MenuController,
//     MenuItemController,
//     NoticeController,
//     PdfPageController,
//     MembershipPlanController,
//     GalleryController,
//     AchievementController
// };

// /*
// |--------------------------------------------------------------------------
// | APP CONTROLLERS
// |--------------------------------------------------------------------------
// */
// use App\Http\Controllers\{
//     EventController,
//     AnnouncementController,
//     MemberController,
//     PaymentController,
//     RegisterController
// };

// /*
// |--------------------------------------------------------------------------
// | PUBLIC AUTH ROUTES (ONLY THESE ARE OPEN)
// |--------------------------------------------------------------------------
// */

// Route::post('/register', [RegistrationController::class, 'register']);
// Route::post('/login', [LoginController::class, 'login']);
// Route::post('/login/verify-otp', [VerifyOtpController::class, 'verify']);
// Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
// Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

// /*
// |--------------------------------------------------------------------------
// | EVERYTHING BELOW REQUIRES LOGIN
// |--------------------------------------------------------------------------
// */
// Route::middleware('auth:sanctum')->group(function () {

//     /*
//     |--------------------------------------------------------------------------
//     | AUTH
//     |--------------------------------------------------------------------------
//     */
//     Route::get('/admin/me', [AuthController::class, 'me']);
//     Route::post('/admin/logout', [AuthController::class, 'logout']);

//     Route::get('/admin/profile', [RegistrationController::class, 'profile']);
//     Route::post('/admin/profile', [RegistrationController::class, 'updateProfile']);

//     /*
//     |--------------------------------------------------------------------------
//     | PAYMENTS (RATE LIMITED)
//     |--------------------------------------------------------------------------
//     */
//     Route::middleware('throttle:3,1')->post('/create-order', [PaymentController::class, 'createOrder']);
//     Route::middleware('throttle:5,1')->post('/submit-form', [PaymentController::class, 'submitForm']);

//     /*
//     |--------------------------------------------------------------------------
//     | SETTINGS
//     |--------------------------------------------------------------------------
//     */
//     Route::get('settings', [SettingController::class, 'index']);
//     Route::post('settings', [SettingController::class, 'update']);

//     Route::get('contact-settings', [ContactSettingController::class, 'index']);
//     Route::post('contact-settings', [ContactSettingController::class, 'update']);

//     Route::get('header', [HeaderSettingController::class, 'index']);
//     Route::post('header', [HeaderSettingController::class, 'update']);

//     /*
//     |--------------------------------------------------------------------------
//     | PUBLIC DATA (NOW LOGIN REQUIRED)
//     |--------------------------------------------------------------------------
//     */
//     Route::apiResource('membership-plans', MembershipPlanController::class);
//     Route::apiResource('events', EventController::class);
//     Route::apiResource('announcements', AnnouncementController::class);
//     Route::apiResource('members', MemberController::class);
//     Route::apiResource('registration', RegisterController::class)->only(['store']);
//     Route::apiResource('achievements', AchievementController::class);
//     Route::apiResource('notices', NoticeController::class);

//     /*
//     |--------------------------------------------------------------------------
//     | MENUS
//     |--------------------------------------------------------------------------
//     */
//     Route::prefix('menus')->group(function () {
//         Route::get('/', [MenuController::class, 'index']);
//         Route::post('/', [MenuController::class, 'store']);
//         Route::get('/{id}', [MenuController::class, 'show']);
//         Route::get('/by-location/{location}', [MenuController::class, 'byLocation']);
//     });

//     /*
//     |--------------------------------------------------------------------------
//     | MENU ITEMS
//     |--------------------------------------------------------------------------
//     */
//     Route::prefix('menu-items')->group(function () {
//         Route::post('/', [MenuItemController::class, 'store']);
//         Route::post('/order', [MenuItemController::class, 'updateOrder']);
//         Route::patch('/{id}/toggle', [MenuItemController::class, 'toggle']);
//         Route::delete('/{id}', [MenuItemController::class, 'destroy']);
//     });

//     /*
//     |--------------------------------------------------------------------------
//     | ADMIN PANEL
//     |--------------------------------------------------------------------------
//     */
//     Route::prefix('admin')->group(function () {
//         Route::apiResource('notices', NoticeController::class);
//         Route::apiResource('pdf-pages', PdfPageController::class);
//         Route::apiResource('membership-plans', MembershipPlanController::class);
//         Route::apiResource('achievements', AchievementController::class);

//         /*
//         |--------------------------------------------------------------------------
//         | GALLERY
//         |--------------------------------------------------------------------------
//         */
//         Route::get('/gallery/events', [GalleryController::class, 'events']);
//         Route::post('/gallery', [GalleryController::class, 'store']);
//         Route::get('/gallery', [GalleryController::class, 'index']);
//         Route::get('/gallery/event/{eventId}', [GalleryController::class, 'byEvent']);
//         Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
//     });

//     /*
//     |--------------------------------------------------------------------------
//     | PUBLIC GALLERY (NOW PROTECTED)
//     |--------------------------------------------------------------------------
//     */
//     Route::get('/galleries', [GalleryController::class, 'index']);
// });


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
    GalleryController,
    AchievementController,
    AdminController
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
| PUBLIC AUTH ROUTES (NO LOGIN REQUIRED)
|--------------------------------------------------------------------------
*/

Route::post('/register', [RegistrationController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/login/verify-otp', [VerifyOtpController::class, 'verify']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

/*
|--------------------------------------------------------------------------
| PUBLIC CLIENT ROUTES (READ ONLY – NO AUTH)
|--------------------------------------------------------------------------
*/

// SETTINGS
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/contact-settings', [ContactSettingController::class, 'index']);
Route::get('/header', [HeaderSettingController::class, 'index']);

// MENUS
Route::get('/menus/by-location/{location}', [MenuController::class, 'byLocation']);

// EVENTS
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

// ANNOUNCEMENTS
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);

// MEMBERS
Route::get('/members', [MemberController::class, 'index']);
Route::get('/members/{id}', [MemberController::class, 'show']);

// ACHIEVEMENTS
Route::get('/achievements', [AchievementController::class, 'index']);
Route::get('/achievements/{id}', [AchievementController::class, 'show']);

// NOTICES (CLIENT SIDE MUST HAVE THIS)
Route::get('/notices', [NoticeController::class, 'index']);
Route::get('/notices/{id}', [NoticeController::class, 'show']);

// GALLERY
Route::get('/galleries', [GalleryController::class, 'index']);

/*
|--------------------------------------------------------------------------
| FORM / PAYMENT (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::middleware('throttle:3,1')->post('/create-order', [PaymentController::class, 'createOrder']);
Route::middleware('throttle:5,1')->post('/submit-form', [PaymentController::class, 'submitForm']);
Route::apiResource('registration', RegisterController::class)
    ->only(['index', 'show']);
    // Delete a member
Route::delete('/registration/{id}', [RegisterController::class, 'destroy']);

// Approve/Update a member (This fixes your 405 error)
Route::put('/registration/{id}', [RegisterController::class, 'update']);


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (LOGIN REQUIRED)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Role Based Auth
    |--------------------------------------------------------------------------
    */
    Route::get('/admins/{id}',[AdminController::class, 'show']);
    Route::get('/admins', [AdminController::class, 'index']);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::put('/admins/{id}', [AdminController::class, 'update']);
    Route::delete('/admins/{id}', [AdminController::class, 'destroy']);
    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [RegistrationController::class, 'profile']);
    Route::post('/profile', [RegistrationController::class, 'updateProfile']);

    /* SETTINGS */
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);

    Route::get('/contact-settings', [ContactSettingController::class, 'index']);
    Route::post('/contact-settings', [ContactSettingController::class, 'update']);

    Route::get('/header', [HeaderSettingController::class, 'index']);
    Route::post('/header', [HeaderSettingController::class, 'update']);

    /* MENUS */
    Route::get('/menus', [MenuController::class, 'index']);
    Route::post('/menus', [MenuController::class, 'store']);
    Route::get('/menus/{id}', [MenuController::class, 'show']);
    Route::get('/menus/by-location/{location}', [MenuController::class, 'byLocation']);

    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::post('/menu-items/order', [MenuItemController::class, 'updateOrder']);
    Route::patch('/menu-items/{id}/toggle', [MenuItemController::class, 'toggle']);
    Route::patch('/menu-items/{id}', [MenuItemController::class, 'update']);
    Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN CRUD
    |--------------------------------------------------------------------------
    */
    Route::apiResource('notices', NoticeController::class);
    // ->except(['show']);

    Route::apiResource('announcements', AnnouncementController::class);
    // ->except(['show']);

    // Route::apiResource('events', EventController::class)
    // ->except(['show']);
    Route::apiResource('events', EventController::class);
    // ->except(['show']);

    Route::apiResource('members', MemberController::class);
    // ->except(['show']);

    Route::apiResource('pdf-pages', PdfPageController::class);
    // ->except(['show']);

    Route::apiResource('membership-plans', MembershipPlanController::class);
    // ->except(['show']);

    Route::apiResource('achievements', AchievementController::class);
    // ->except(['show']);

    /*
    |--------------------------------------------------------------------------
    | GALLERY (ADMIN)
    |--------------------------------------------------------------------------
    */
    Route::get('/gallery/events', [GalleryController::class, 'events']);
    Route::get('/gallery/event/{event}', [GalleryController::class, 'byEvent']);
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
});
