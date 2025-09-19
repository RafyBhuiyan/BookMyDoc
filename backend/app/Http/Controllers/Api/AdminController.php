<?php

namespace App\Http\Controllers\Api;

use App\Models\Admin;
use App\Models\Doctor;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Admin Login
     */
    public function login(Request $request)
    {
        try {
            $validateAdmin = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ]);

            if ($validateAdmin->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validateAdmin->errors()
                ], 401);
            }

            if (!Auth::guard('admin')->attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password do not match our records.',
                ], 401);
            }

            $admin = Admin::where('email', $request->email)->first();

            return response()->json([
                'status' => true,
                'message' => 'Admin Logged In Successfully',
                'token' => $admin->createToken('admin-token', ['admin'])->plainTextToken,
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin Logout
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => true,
                'message' => 'Admin Logged out successfully',
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve a Doctor
     * Only admin can approve doctor accounts.
     */
    public function approveDoctor(Request $request, $doctorId)
    {
        try {
            $doctor = Doctor::find($doctorId);

            if (!$doctor) {
                return response()->json([
                    'status' => false,
                    'message' => 'Doctor not found.'
                ], 404);
            }

            if ($doctor->is_approved) {
                return response()->json([
                    'status' => false,
                    'message' => 'Doctor is already approved.'
                ], 400);
            }

            $doctor->is_approved = true;
            $doctor->save();

            return response()->json([
                'status' => true,
                'message' => 'Doctor approved successfully.',
                'doctor' => $doctor->only('id', 'name', 'email', 'specialization', 'is_approved')
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * List Pending Doctors
     * Optional helper endpoint to see which doctors are awaiting approval.
     */
    public function pendingDoctors()
    {
        $doctors = Doctor::where('is_approved', false)->get([
            'id', 'name', 'email', 'specialization'
        ]);

        return response()->json([
            'status' => true,
            'pending_doctors' => $doctors
        ]);
    }
     /**
     * List Approved Doctors
     * Shows all doctors that have been approved by the admin.
     */
    public function approvedDoctors()
    {
        try {
            $doctors = Doctor::where('is_approved', true)->get([
                'id', 'name', 'email', 'specialization'
            ]);

            return response()->json([
                'status' => true,
                'approved_doctors' => $doctors
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
