<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\UserController;

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\DoctorBrowseController;   // list/show/slots
use App\Http\Controllers\Api\AvailabilityController;   // doctor availabilities
use App\Http\Controllers\Api\AppointmentController;    // bookings


use App\Http\Controllers\Api\DoctorProfileController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/doctor/profile', [DoctorProfileController::class, 'show']);
    Route::put('/doctor/profile', [DoctorProfileController::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [UserProfileController::class, 'getProfile']);
    Route::put('/user/profile', [UserProfileController::class, 'updateProfile']);
});


Route::post('/doctor/register', [DoctorController::class, 'register']);
Route::post('/doctor/login',    [DoctorController::class, 'login']);


Route::post('/user/register',   [UserController::class, 'createUser']);
Route::post('/user/login',      [UserController::class, 'loginUser']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/doctor/logout', [DoctorController::class, 'logout']);
    Route::post('/user/logout',   [UserController::class, 'logout']);
});

Route::get('/health', fn() => response()->json(['ok' => true], 200));
Route::middleware('auth:sanctum')->get('/auth-check', function () {
    return response()->json(['auth' => true, 'user' => auth()->user()], 200);
});
Route::get('/doctors',                    [DoctorBrowseController::class, 'index']);
Route::get('/doctors/{doctor}',           [DoctorBrowseController::class, 'show']);
Route::get('/doctors/{doctor}/slots',     [DoctorBrowseController::class, 'slots']);    
Route::get('/doctors/{doctor}/slots/all', [DoctorBrowseController::class, 'allSlots']);
    
Route::post('/message', [MessageController::class, 'store']);
Route::get('/message',  [MessageController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/doctor/availabilities',                       [AvailabilityController::class, 'index']);
    Route::post('/doctor/availabilities',                      [AvailabilityController::class, 'store']);
    Route::delete('/doctor/availabilities/{availability}',     [AvailabilityController::class, 'destroy']);


    Route::patch('/doctor/appointments/{appointment}/accept',  [AppointmentController::class, 'accept']);
    Route::patch('/doctor/appointments/{appointment}/decline', [AppointmentController::class, 'decline']);
    Route::get('/doctor/appointments',                         [AppointmentController::class, 'myForDoctor']);
    Route::get('/doctor/appointments/day',                      [AppointmentController::class, 'day']);

    Route::get('/doctor/appointments/accepted',                     [AppointmentController::class, 'accepted']);
    Route::post('/user/appointments',                                 [AppointmentController::class, 'store']);
    Route::patch('/user/appointments/{appointment}/cancel',           [AppointmentController::class, 'cancel']);
    Route::patch('/user/appointments/{appointment}/reschedule',       [AppointmentController::class, 'reschedule']);
    Route::get('/my/appointments',                                    [AppointmentController::class, 'myForPatient']);

    
    Route::get('/me', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'class'     => $user ? get_class($user) : null,
            'id'        => $user->id ?? null,
            'abilities' => $user?->currentAccessToken()?->abilities,
        ]);
    });

});



Route::prefix('admin')->group(function () {

    // Public routes (no token needed)
    Route::post('/login', [AdminController::class, 'login']);

    // Protected routes (require admin token)
    Route::middleware('auth:sanctum')->group(function () {

        // Logout
        Route::post('/logout', [AdminController::class, 'logout']);

        // Dashboard (example)
        Route::get('/dashboard', function (Request $request) {
            if ($request->user() instanceof \App\Models\Admin) {
                return response()->json([
                    'status' => true,
                    'message' => 'Welcome to the Admin Dashboard',
                    'admin' => $request->user()->only('id', 'name', 'email')
                ]);
            }
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        });

        // List pending doctors
        Route::get('/pending-doctors', [AdminController::class, 'pendingDoctors']);

        // List approved doctors (NEW)
        Route::get('/approved-doctors', [AdminController::class, 'approvedDoctors']);

        // Approve a doctor
        Route::post('/approve-doctor/{id}', [AdminController::class, 'approveDoctor']);
    });
});


