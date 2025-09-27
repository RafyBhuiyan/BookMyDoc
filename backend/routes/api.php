<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\UserController;

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\MedicalDataController;
use App\Http\Controllers\MedicalReportController;

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\DoctorBrowseController;   // list/show/slots
use App\Http\Controllers\Api\AvailabilityController;   // doctor availabilities
use App\Http\Controllers\Api\AppointmentController;    // bookings
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\Api\DoctorProfileController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/doctor/profile', [DoctorProfileController::class, 'show']);
    Route::put('/doctor/profile', [DoctorProfileController::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [UserProfileController::class, 'getProfile']);
    Route::put('/user/profile', [UserProfileController::class, 'updateProfile']);
});

// Auth (public)
Route::post('/doctor/register', [DoctorController::class, 'register']);
Route::post('/doctor/login', [DoctorController::class, 'login']);
Route::post('/user/register',  [UserController::class, 'createUser']);
Route::post('/user/login',     [UserController::class, 'loginUser']);

// (demo/test) medical report
Route::get('/medical-report/generate', [MedicalReportController::class, 'generate'])
    ->name('medical.report.generate');

// ===================== PRESCRIPTIONS =====================
Route::middleware('auth:sanctum')->group(function () {
    // Doctor creates a prescription (must be an approved doctor)
    Route::post('/prescriptions', [PrescriptionController::class, 'store'])
        ->name('prescriptions.store');

    // Patient view: prescriptions linked to a specific appointment they own
    Route::get('/appointments/{appointment}/prescriptions', [PrescriptionController::class, 'forAppointment']);

    // Doctor view: all prescriptions issued by the signed-in doctor
    Route::get('/doctor/prescriptions', [PrescriptionController::class, 'doctorIssued']);

    // Common: show & PDF for a specific prescription (patient owner or issuing doctor)
    Route::get('/prescriptions/{prescription}', [PrescriptionController::class, 'apiShow'])
        ->name('prescriptions.show');
    Route::get('/prescriptions/{prescription}/pdf', [PrescriptionController::class, 'pdf'])
        ->name('prescriptions.pdf');

});
// =================== END PRESCRIPTIONS ===================

// Medical Data (uses session/web auth in your app; leaving as-is)
Route::middleware(['auth'])->group(function () {
    Route::post('/medical-data', [MedicalDataController::class, 'store'])->name('medical-data.store');
    Route::get('/medical-data/{medicalData}', [MedicalDataController::class, 'show'])->name('medical-data.show');
    Route::get('/users/{user}/medical-data', [MedicalDataController::class, 'indexForUser'])->name('medical-data.index');
});

// Logout
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/doctor/logout', [DoctorController::class, 'logout']);
    Route::post('/user/logout',   [UserController::class, 'logout']);
});

// Health/auth checks
Route::get('/health', fn() => response()->json(['ok' => true], 200));
Route::middleware('auth:sanctum')->get('/auth-check', function () {
    return response()->json(['auth' => true, 'user' => auth()->user()], 200);
});

// Doctor browse & slots (public browse; controller already filters is_approved)
Route::get('/doctors',                    [DoctorBrowseController::class, 'index']);
Route::get('/doctors/{doctor}',           [DoctorBrowseController::class, 'show']);
Route::get('/doctors/{doctor}/slots',     [DoctorBrowseController::class, 'slots']);
Route::get('/doctors/{doctor}/slots/all', [DoctorBrowseController::class, 'allSlots']);

// Messages (keeping your existing routes)
Route::post('/message', [MessageController::class, 'store']);
Route::get('/message',  [MessageController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    // Availability (doctor)
    Route::get('/doctor/availabilities',                   [AvailabilityController::class, 'index']);
    Route::post('/doctor/availabilities',                  [AvailabilityController::class, 'store']);
    Route::delete('/doctor/availabilities/{availability}', [AvailabilityController::class, 'destroy']);

    // Appointments
    Route::patch('/doctor/appointments/{appointment}/accept',   [AppointmentController::class, 'accept']);
    Route::patch('/doctor/appointments/{appointment}/decline',  [AppointmentController::class, 'decline']);
    Route::get('/doctor/appointments',                          [AppointmentController::class, 'myForDoctor']);
    Route::get('/doctor/appointments/day',                      [AppointmentController::class, 'day']);
    Route::get('/doctor/appointments/accepted',                 [AppointmentController::class, 'accepted']);

    Route::post('/user/appointments',                           [AppointmentController::class, 'store']);
    Route::patch('/user/appointments/{appointment}/cancel',     [AppointmentController::class, 'cancel']);
    Route::patch('/user/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
    Route::get('/my/appointments',                              [AppointmentController::class, 'myForPatient']);

    // Who am I (debug)
    Route::get('/me', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'class'     => $user ? get_class($user) : null,
            'id'        => $user->id ?? null,
            'abilities' => $user?->currentAccessToken()?->abilities,
        ]);
    });
});

// Admin routes
Route::prefix('admin')->group(function () {
    // Public
    Route::post('/login', [AdminController::class, 'login']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminController::class, 'logout']);

        Route::get('/dashboard', function (Request $request) {
            if ($request->user() instanceof \App\Models\Admin) {
                return response()->json([
                    'status'  => true,
                    'message' => 'Welcome to the Admin Dashboard',
                    'admin'   => $request->user()->only('id', 'name', 'email')
                ]);
            }
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        });

        Route::get('/pending-doctors',  [AdminController::class, 'pendingDoctors']);
        Route::get('/approved-doctors', [AdminController::class, 'approvedDoctors']);
        Route::post('/approve-doctor/{id}', [AdminController::class, 'approveDoctor']);
    });
});
