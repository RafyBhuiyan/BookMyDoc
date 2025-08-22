<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DoctorAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// -----------------------------------------
// Doctor Authentication Routes
// -----------------------------------------
Route::prefix('doctor')->name('doctor.')->group(function () {
    // Registration
    Route::get('register', [DoctorAuthController::class, 'showRegisterForm'])->name('register');
    Route::post('register', [DoctorAuthController::class, 'register'])->name('register.submit');

    // Login / Logout
    Route::get('login', [DoctorAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [DoctorAuthController::class, 'login'])->name('login.submit');
    Route::post('logout', [DoctorAuthController::class, 'logout'])->name('logout');

    // Protected dashboard
    Route::middleware('auth:doctor')->group(function () {
        Route::get('dashboard', function () {
            return view('doctor.dashboard');
        })->name('dashboard');
    });
});

require __DIR__.'/auth.php';
