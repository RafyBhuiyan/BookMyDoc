<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    // Get user profile
    public function getProfile(Request $request)
    {
        return response()->json([
            'status' => true,
            'profile' => $request->user(), // authenticated user
        ]);
    }

    // Update profile (excluding password)
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|unique:users,phone,' . $user->id,
            'date_of_birth' => 'sometimes|date',
            'gender' => 'sometimes|string',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'blood_group' => 'sometimes|string',
            'emergency_contact' => 'sometimes|string',
        ]);

        $user->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'profile' => $user,
        ]);
    }
}
