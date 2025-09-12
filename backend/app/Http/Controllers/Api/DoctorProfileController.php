<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DoctorProfileController extends Controller
{
    /**
     * Show the logged-in doctor's profile
     */
    public function show(Request $request)
    {
        try {
            $doctor = $request->user(); // current authenticated doctor

            return response()->json([
                'status' => true,
                'message' => 'Doctor profile fetched successfully',
                'data' => $doctor,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Update doctor profile (no password updates here)
     */
    public function update(Request $request)
    {
        try {
            $doctor = $request->user();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|unique:doctors,phone,' . $doctor->id,
                'specialization' => 'sometimes|string|max:255',
                'city' => 'sometimes|string|max:255',
                'clinic_address' => 'sometimes|string|max:255',
            ]);

            $doctor->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Profile updated successfully',
                'data' => $doctor,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
