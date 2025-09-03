<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactUsManager extends Controller
{
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string|min:10',
        ]);

        // Save to database
        $contact = ContactMessage::create($validated);

        // Return JSON response
        return response()->json([
            'success' => true,
            'message' => 'Message saved successfully!',
            'data' => $contact,
        ], 201);
    }

    // Optional: show all messages
    public function index()
    {
        return response()->json(ContactMessage::latest()->get());
    }
}
