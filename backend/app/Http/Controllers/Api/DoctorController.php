<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                'data'    => $doctor, // Model hides password/remember_token
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'  => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the doctor's profile (no password update here).
     * Supports optional file upload for profile_picture and JSON/array for education_certificates.
     */
    public function update(Request $request)
    {
        try {
            $doctor = $request->user();

            $validated = $request->validate([
                'name'                   => ['sometimes', 'string', 'max:255'],
                'phone'                  => ['sometimes', 'string', Rule::unique('doctors', 'phone')->ignore($doctor->id)],
                'specialization'         => ['sometimes', 'string', 'max:255'],
                'city'                   => ['sometimes', 'string', 'max:255'],
                'clinic_address'         => ['sometimes', 'string', 'max:255'],
                'medical_school'         => ['sometimes', 'string', 'max:255'],
                'medical_license_number' => ['sometimes', 'string', Rule::unique('doctors', 'medical_license_number')->ignore($doctor->id)],
                'years_of_experience'    => ['sometimes', 'integer', 'min:0', 'max:80'],
                'bio'                    => ['sometimes', 'string'],
                // accepts either a JSON array string or array
                'education_certificates' => ['sometimes'],
                // optional image
                'profile_picture'        => ['sometimes', 'file', 'image', 'max:2048'], // 2MB
            ]);

            // Handle education_certificates as array or JSON string
            if ($request->has('education_certificates')) {
                $certs = $request->input('education_certificates');
                if (is_string($certs)) {
                    $decoded = json_decode($certs, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $validated['education_certificates'] = $decoded;
                    } else {
                        return response()->json([
                            'status'  => false,
                            'message' => 'Invalid JSON provided for education_certificates',
                        ], 422);
                    }
                } elseif (!is_array($certs)) {
                    // non-array/non-string: reject
                    return response()->json([
                        'status'  => false,
                        'message' => 'education_certificates must be an array or JSON array string',
                    ], 422);
                }
            }

            // Optional image upload. Store under storage/app/public/profile_pictures
            if ($request->hasFile('profile_picture')) {
                $path = $request->file('profile_picture')
                    ->store('profile_pictures', 'public');

                // delete old file if present
                if ($doctor->profile_picture && Storage::disk('public')->exists($doctor->profile_picture)) {
                    Storage::disk('public')->delete($doctor->profile_picture);
                }
                $validated['profile_picture'] = $path;
            }

            $doctor->update($validated);

            return response()->json([
                'status'  => true,
                'message' => 'Profile updated successfully',
                'data'    => $doctor->fresh(), // return updated
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status'  => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
