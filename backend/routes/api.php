<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\UserController;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MessageController;


use App\Http\Controllers\Api\DoctorBrowseController;   // list/show/slots
use App\Http\Controllers\Api\AvailabilityController;   // doctor availabilities
use App\Http\Controllers\Api\AppointmentController;    // bookings

/*
|--------------------------------------------------------------------------
| Auth (existing)
|--------------------------------------------------------------------------
*/
Route::post('/doctor/register', [DoctorController::class, 'register']);
Route::post('/doctor/login',    [DoctorController::class, 'login']);

Route::post('/user/register',   [UserController::class, 'createUser']);
Route::post('/user/login',      [UserController::class, 'loginUser']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/doctor/logout', [DoctorController::class, 'logout']);
    Route::post('/user/logout',   [UserController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| Public browse
|--------------------------------------------------------------------------
*/
Route::get('/doctors',                    [DoctorBrowseController::class, 'index']);
Route::get('/doctors/{doctor}',           [DoctorBrowseController::class, 'show']);
Route::get('/doctors/{doctor}/slots',     [DoctorBrowseController::class, 'slots']);     // ?date=YYYY-MM-DD
Route::get('/doctors/{doctor}/slots/all', [DoctorBrowseController::class, 'allSlots']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/doctor/availabilities',                       [AvailabilityController::class, 'index']);
    Route::post('/doctor/availabilities',                      [AvailabilityController::class, 'store']);
    Route::delete('/doctor/availabilities/{availability}',     [AvailabilityController::class, 'destroy']);

Route::post('/message', [MessageController::class, 'store']);

Route::get('/message', [MessageController::class, 'index']);


    Route::patch('/doctor/appointments/{appointment}/accept',  [AppointmentController::class, 'accept']);
    Route::patch('/doctor/appointments/{appointment}/decline', [AppointmentController::class, 'decline']);
    Route::get('/doctor/appointments',                         [AppointmentController::class, 'myForDoctor']);
});

/*
|--------------------------------------------------------------------------
| Patient-only (Sanctum token with ability: patient)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/user/appointments',                                 [AppointmentController::class, 'store']);
    Route::patch('/user/appointments/{appointment}/cancel',           [AppointmentController::class, 'cancel']);
    Route::patch('/user/appointments/{appointment}/reschedule',       [AppointmentController::class, 'reschedule']);
    Route::get('/my/appointments',                                    [AppointmentController::class, 'myForPatient']);
});

// Debug current token
use Illuminate\Http\Request;
Route::middleware('auth:sanctum')->get('/me', function (Request $r) {
    $user = $r->user();
    return response()->json([
        'class'     => $user ? get_class($user) : null,
        'id'        => $user->id ?? null,
        'abilities' => $user?->currentAccessToken()?->abilities,
    ]);
});
