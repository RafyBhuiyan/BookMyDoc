<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MedicalData;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class MedicalDataController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'visit_date' => 'nullable|date',
            'weight_kg' => 'nullable|numeric',
            'height_cm' => 'nullable|numeric',
            'blood_pressure' => 'nullable|string|max:32',
            'pulse_bpm' => 'nullable|integer',
            'temperature_c' => 'nullable|numeric',
            'symptoms' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'tests' => 'nullable|array',
            'notes' => 'nullable|string',
            'is_confidential' => 'nullable|boolean',
        ]);
        $authUser = Auth::user();

        $data['doctor_id'] = $authUser->id;

        // json dile array banaye dibe
        if (isset($data['tests']) && !is_array($data['tests'])) {
            $data['tests'] = json_decode($data['tests'], true) ?: null;
        }

        $record = MedicalData::create($data);

        return redirect()->back()->with('success', 'Medical record saved.');
    }
    public function show(MedicalData $medicalData)
    {
        $user = auth()->user();
        if ($user->id !== $medicalData->user_id && !($user->is_admin ?? false)) {
            abort(403, 'You do not have permission to view this record.');
        }

        return view('medical-data.show', ['record' => $medicalData]);
    }
    public function indexForUser(User $user)
    {
        $auth = auth()->user();
        if ($auth->id !== $user->id && !($auth->is_admin ?? false)) {
            abort(403, 'You do not have permission to view these records.');
        }
        $records = $user->medicalRecords()->latest('visit_date')->paginate(20);
        return view('medical-data.index', compact('user', 'records'));
    }
}
