<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Store a new message
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'user_type' => 'nullable|string|max:255',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        // Check for validation errors
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $msg = Message::create([
            'name' => $request->name,
            'email' => $request->email,
            'user_type' => $request->user_type,
            'subject' => $request->subject,
            'message' => $request->message,
            'posted_at' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Message stored successfully',
            'data' => $msg
        ], 201);
    }

    /**
     * List all messages
     */
    public function index()
    {
        $messages = Message::orderBy('posted_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $messages
        ]);
    }
}