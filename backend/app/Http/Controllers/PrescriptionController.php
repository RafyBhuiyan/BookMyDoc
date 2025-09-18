<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prescription;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;

class PrescriptionController extends Controller
{
    public function create(User $user)
    {
        return view('prescription.create', ['patient' => $user]);
    }
    public function store(Request $request)
{
    $auth = Auth::user();

    if (!$auth) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
    if (empty($auth->is_doctor) && empty($auth->is_admin)) {
        return response()->json(['message' => 'Only doctors can issue prescriptions.'], 403);
    }

    $data = $request->validate([
        'user_id' => 'required|exists:users,id',
        'issued_date' => 'nullable|date',
        'notes' => 'nullable|string',
        'medicines' => 'nullable|array',
        'medicines.*.name' => 'required_with:medicines|string',
        'medicines.*.dose' => 'nullable|string',
        'medicines.*.schedule' => 'nullable|string',
        'medicines.*.days' => 'nullable|integer|min:0',
        'duration_days' => 'nullable|integer|min:0',
        'refill_count' => 'nullable|integer|min:0',
        'is_private' => 'nullable|boolean',
    ]);

    $data['doctor_id'] = $auth->id;

    $prescription = Prescription::create($data);

    return response()->json($prescription, 201);
}

    public function apiIndexForUser(User $user)
    {
        $auth = Auth::user();

        // allow the user themselves or an admin or the issuing doctor (if you want)
        $allowed = $auth && (
            ($auth->id === $user->id) ||
            ($auth->is_admin ?? false)
        );

        // if (!$allowed) {
        //     return response()->json(['message' => 'You do not have permission to view these prescriptions.'], 403);
        // }

        $prescriptions = $user->prescriptions()->latest()->paginate(20);

        return response()->json(['prescriptions' => $prescriptions]);
    }

    /**
     * API: return a single prescription JSON
     */
    public function apiShow(Prescription $prescription)
    {
        $auth = Auth::user();

        $isAdmin = $auth->is_admin ?? false;
        $isPatient = $auth->id === $prescription->user_id;
        $isDoctor  = $auth->id === $prescription->doctor_id;

        if (!($isAdmin || $isPatient || $isDoctor)) {
            return response()->json(['message' => 'You do not have permission to view this prescription.'], 403);
        }

        $prescription->load(['patient', 'doctor', 'medicalData']);

        return response()->json($prescription);
    }
    public function pdf(Request $request, Prescription $prescription)
    {
        $auth = Auth::user();

        $isAdmin = $auth->is_admin ?? false;
        $isPatient = $auth->id === $prescription->user_id;
        $isDoctor  = $auth->id === $prescription->doctor_id;

        if (!($isAdmin || $isPatient || $isDoctor)) {
            abort(403, 'You do not have permission to view this prescription.');
        }

        $prescription->load(['patient', 'doctor', 'medicalData']);

        $viewData = ['prescription' => $prescription];
        $pdf = Pdf::loadView('prescription.pdf', $viewData)->setPaper('a4', 'portrait');

        return $pdf->stream("prescription-{$prescription->p_id}.pdf");
    }
}
