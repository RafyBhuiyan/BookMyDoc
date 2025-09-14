<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\DoctorBrowseController;   // list/show/slots
use App\Http\Controllers\Api\AvailabilityController;   // doctor availabilities
use App\Http\Controllers\Api\AppointmentController;    // bookings


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
