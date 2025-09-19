<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Doctor;

class DoctorController extends Controller
{
    /**
     * Register a new doctor.
     */
    public function register(Request $request)
    {
        try {
            $validateDoctor = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:doctors,email',
                'phone' => 'required|string|unique:doctors,phone',
                'specialization' => 'required|string|max:255',
                'password' => 'required|string|min:6',
                'city' => 'nullable|string|max:255',  // Making city optional
                'clinic_address' => 'nullable|string|max:255', 
            ]);

            if ($validateDoctor->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validateDoctor->errors()
                ], 422); // <-- proper status code for validation errors
            }

            // Creating a new doctor (password hashed)
            $doctor = Doctor::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'specialization' => $request->specialization,
                'password' => Hash::make($request->password),
                'city' => $request->city ?? null,  
                'clinic_address' => $request->clinic_address ?? null,              
                'is_approved' => false, // <-- default to false
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Doctor registered successfully',
                'data'    => $doctor, // Return doctor details (but not password)
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'  => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Authenticate doctor login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $doctor = Doctor::where('email', $request->email)->first();

        if (!$doctor || !Hash::check($request->password, $doctor->password)) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        $token = $doctor->createToken('DoctorApp')->plainTextToken;

        return response()->json([
            'status'  => true,
            'message' => 'Login successful',
            'data'    => [
                'doctor' => $doctor,
                'token' => $token
            ],
        ], 200);
    }
}
