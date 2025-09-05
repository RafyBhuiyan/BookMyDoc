<?php
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/doctor/register', [DoctorController::class, 'register']);

Route::post('/doctor/login', [DoctorController::class, 'login']);

Route::post('/user/register', [UserController::class, 'createUser']);

Route::post('/user/login', [UserController::class, 'loginUser']);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/doctor/logout', [DoctorController::class, 'logout']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/logout', [UserController::class, 'logout']);
});