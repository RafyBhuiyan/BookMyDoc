<?php

use Illuminate\Support\Facades\Route;
use App\Models\Doctor;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reset-doctor-password', function () {
    $doctor = Doctor::where('email', 'ayesha@example.com')->first();
    $doctor->password = Hash::make('password');
    $doctor->save();
    return 'Password reset done!';
});