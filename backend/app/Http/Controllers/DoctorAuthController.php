<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Doctor;

class DoctorAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.doctor_login');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::guard('doctor')->attempt($credentials)) {
            return redirect()->intended('doctor/dashboard')->with('success', 'Login successful');
            //return redirect()->intended('admin/dashboard');
        }

        return redirect('doctor/login')->with('error', 'Invalid credentials');
    }

    public function logout()
    {
        Auth::guard('doctor')->logout();
        return redirect('doctor/login');
    }

      public function showRegisterForm()
    {
        return view('auth.doctor_register'); 
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:doctors',
            'password' => 'required|string|confirmed|min:8',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:100',
            'degree' => 'nullable|string|max:50',
            'clinic_address' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $doctor = Doctor::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], 
            'phone' => $validated['phone'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'degree' => $validated['degree'] ?? null,
            'clinic_address' => $validated['clinic_address'] ?? null,
            'bio' => $validated['bio'] ?? null,
        ]);

        Auth::guard('doctor')->login($doctor);

        return redirect()->intended('doctor/dashboard')->with('success', 'Registration successful');
        //return redirect()->intended('admin/dashboard');
    }
};