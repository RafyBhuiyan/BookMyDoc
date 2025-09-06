<?php
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MessageController;

Route::post('/doctor/register', [DoctorController::class, 'register']);

Route::post('/doctor/login', [DoctorController::class, 'login']);

Route::post('/user/register', [UserController::class, 'createUser']);

Route::post('/user/login', [UserController::class, 'loginUser']);

Route::post('/message', [MessageController::class, 'store']);

Route::get('/message', [MessageController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/doctor/logout', [DoctorController::class, 'logout']);
});