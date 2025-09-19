<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DoctorProfileController extends Controller
{
    /**
     * Return the authenticated doctor's profile.
     */
    public function show(Request $request)
    {
        try {
            $doctor = $request->user(); // Sanctum-authenticated doctor

            return response()->json([
                'status'  => true,
                'message' => 'Doctor profile fetched successfully',
                'data'    => $doctor,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'  => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the doctor's profile (no password, no file uploads).
     */
    public function update(Request $request)
    {
        try {
            $doctor = $request->user();

            $validated = $request->validate([
                'name'                   => ['sometimes','string','max:255'],
                'phone'                  => ['sometimes','string', Rule::unique('doctors','phone')->ignore($doctor->id)],
                'specialization'         => ['sometimes','string','max:255'],
                'city'                   => ['sometimes','string','max:255'],
                'clinic_address'         => ['sometimes','string','max:255'],
                'medical_school'         => ['sometimes','string','max:255'],
                'medical_license_number' => ['sometimes','string', Rule::unique('doctors','medical_license_number')->ignore($doctor->id)],
                'years_of_experience'    => ['sometimes','integer','min:0','max:80'],
                'bio'                    => ['sometimes','string'],
                // NO education_certificates, NO profile_picture
            ]);

            $doctor->update($validated);

            return response()->json([
                'status'  => true,
                'message' => 'Profile updated successfully',
                'data'    => $doctor->fresh(),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'  => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
