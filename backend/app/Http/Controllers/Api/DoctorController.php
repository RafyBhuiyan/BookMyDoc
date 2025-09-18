<?php

namespace App\Http\Controllers\Api;

use App\Models\Doctor;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{

    public function register(Request $request)
    {
        try {
            $validateDoctor = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:doctors,email',
                'phone' => 'required|string|unique:doctors,phone',
                'specialization' => 'required|string|max:255',
                'password' => 'required|string|min:6'
            ]);

            if ($validateDoctor->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validateDoctor->errors()
                ], 422); // <-- proper status code for validation errors
            }

            $doctor = Doctor::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'specialization' => $request->specialization,
                'password' => Hash::make($request->password),
                'is_approved' => false, // <-- default to false

            ]);

            return response()->json([
                'status' => true,
                'message' => 'Doctor Registered Successfully. Waiting for admin approval.',
                'token' => $doctor->createToken('doctor-token', ['doctor'])->plainTextToken,

            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function login(Request $request)
    {
        try {
            $validateDoctor = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ]);

            if ($validateDoctor->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validateDoctor->errors()
                ], 422);
            }

            $doctor = Doctor::where('email', $request->email)->first();

            if (!$doctor || !Auth::guard('doctor')->attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password do not match our records.',
                ], 401);
            }

            // Prevent login if not approved
            if (!$doctor->is_approved) {
                return response()->json([
                    'status' => false,
                    'message' => 'Your account is pending admin approval.'
                ], 403);
            }

            return response()->json([
                'status' => true,
                'message' => 'Doctor Logged In Successfully',
                'token' => $doctor->createToken('doctor-token', ['doctor'])->plainTextToken,
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => true,
                'message' => 'Logged out successfully',
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
    
}
