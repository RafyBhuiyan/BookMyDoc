<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Prescription;
use App\Models\Appointment;

class PrescriptionController extends Controller
{
    /* ----------------------------------------------------
     | Auth helpers (Sanctum single guard)
     | ---------------------------------------------------- */
    protected function actor(Request $request)
    {
        // Sanctum returns either App\Models\Doctor or App\Models\User
        return $request->user();
    }

    protected function actingDoctor(Request $request): ?Doctor
    {
        $a = $this->actor($request);
        return $a instanceof Doctor ? $a : null;
    }

    protected function actingPatient(Request $request): ?User
    {
        $a = $this->actor($request);
        return $a instanceof User ? $a : null;
    }

    /* ----------------------------------------------------
     | Appointment patient-id normalizer (user_id vs patient_id)
     | ---------------------------------------------------- */
    protected function apptPatientId(Appointment $appt): ?int
    {
        if (isset($appt->user_id))    return (int) $appt->user_id;
        if (isset($appt->patient_id)) return (int) $appt->patient_id;
        return null;
    }

    /* ----------------------------------------------------
     | POST /api/prescriptions   (approved Doctor only)
     | Body: user_id, issued_date?, notes?, medicines?[], duration_days?, refill_count?, is_private?, appointment_id?
     | ---------------------------------------------------- */
    public function store(Request $request): JsonResponse
    {
        $doctor = $this->actingDoctor($request);
        if (!$doctor) {
            return response()->json(['message' => 'Only doctors can issue prescriptions.'], 403);
        }
        if (!($doctor->is_approved ?? false)) {
            return response()->json(['message' => 'Doctor is not approved.'], 403);
        }

        $data = $request->validate([
            'user_id'              => 'required|exists:users,id',
            'appointment_id'       => 'nullable|exists:appointments,id',
            'issued_date'          => 'nullable|date',
            'notes'                => 'nullable|string',
            'medicines'            => 'nullable|array',
            'medicines.*.name'     => 'required_with:medicines|string',
            'medicines.*.dose'     => 'nullable|string',
            'medicines.*.schedule' => 'nullable|string',
            'medicines.*.days'     => 'nullable|integer|min:0',
            'duration_days'        => 'nullable|integer|min:0',
            'refill_count'         => 'nullable|integer|min:0',
            'is_private'           => 'nullable|boolean',
        ]);

        // If appointment_id provided, verify it belongs to this doctor + patient
        if (!empty($data['appointment_id'])) {
            $appt = Appointment::find($data['appointment_id']);
            $apptPatientId = $appt ? $this->apptPatientId($appt) : null;

            if (
                !$appt ||
                (int) $appt->doctor_id !== (int) $doctor->id ||
                (int) $apptPatientId !== (int) $data['user_id']
            ) {
                return response()->json(['message' => 'Invalid appointment for this doctor/patient.'], 422);
            }
        }

        $data['doctor_id'] = $doctor->id;

        $prescription = Prescription::create($data)
            ->load([
                'patient:id,name,email',
                'doctor:id,name,specialization,city',
'appointment:id,patient_id,doctor_id,starts_at,status',
            ]);

        return response()->json($prescription, 201);
    }

    /* ----------------------------------------------------
     | GET /api/appointments/{appointment}/prescriptions
     | Patient: list prescriptions linked to THEIR appointment
     | ---------------------------------------------------- */
    public function forAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        $patient = $this->actingPatient($request);
        $apptPatientId = $this->apptPatientId($appointment);

        // Only the patient who owns this appointment
        if (!($patient && (int) $patient->id === (int) $apptPatientId)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $per = min(max((int) $request->integer('per_page', 20), 1), 100);

        $rx = Prescription::where('appointment_id', $appointment->id)
            ->where('user_id', $apptPatientId) // prescriptions table keeps user_id as the patient FK
            ->with(['doctor:id,name,specialization,city'])
            ->latest('issued_date')
            ->paginate($per)
            ->withQueryString();

        return response()->json([
            'data' => $rx->items(),
            'meta' => [
                'current_page' => $rx->currentPage(),
                'last_page'    => $rx->lastPage(),
                'total'        => $rx->total(),
            ],
        ]);
    }

    /* ----------------------------------------------------
     | GET /api/doctor/prescriptions
     | Doctor: list ALL prescriptions they have issued
     | ---------------------------------------------------- */
    public function doctorIssued(Request $request): JsonResponse
    {
        $doctor = $this->actingDoctor($request);
        if (!$doctor) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $per = min(max((int) $request->integer('per_page', 20), 1), 100);

        $rx = Prescription::where('doctor_id', $doctor->id)
            ->with([
                'patient:id,name,email',
                'appointment:id,patient_id,doctor_id,starts_at,status',
            ])
            ->latest('issued_date')
            ->paginate($per)
            ->withQueryString();

        return response()->json([
            'data' => $rx->items(),
            'meta' => [
                'current_page' => $rx->currentPage(),
                'last_page'    => $rx->lastPage(),
                'total'        => $rx->total(),
            ],
        ]);
    }

    /* ----------------------------------------------------
     | GET /api/prescriptions/{prescription}
     | Visible to the owner patient OR the issuing doctor
     | ---------------------------------------------------- */
    public function apiShow(Request $request, Prescription $prescription): JsonResponse
    {
        $patient = $this->actingPatient($request);
        $doctor  = $this->actingDoctor($request);

        $isPatient = $patient && (int) $patient->id === (int) $prescription->user_id;
        $isDoctor  = $doctor  && (int) $doctor->id  === (int) $prescription->doctor_id;

        if (!($isPatient || $isDoctor)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $prescription->load([
            'patient:id,name,email',
            'doctor:id,name,specialization,city',
            'appointment:id,patient_id,doctor_id,starts_at,status',
        ]);

        return response()->json($prescription);
    }

    /* ----------------------------------------------------
     | GET /api/prescriptions/{prescription}/pdf
     | Same visibility as apiShow()
     | ---------------------------------------------------- */
 public function pdf(Request $request, \App\Models\Prescription $prescription)
{
    $patient = $this->actingPatient($request);
    $doctor  = $this->actingDoctor($request);

    $isPatient = $patient && (int) $patient->id === (int) $prescription->user_id;
    $isDoctor  = $doctor  && (int) $doctor->id  === (int) $prescription->doctor_id;

    if (!($isPatient || $isDoctor)) {
        abort(403, 'Forbidden');
    }

    $prescription->load([
        'patient:id,name,email',
        'doctor:id,name,specialization,city',
        'appointment:id,patient_id,doctor_id,starts_at,status',
    ]);

    try {
        // QUICK: render a 100% minimal PDF if ?debug=1 (to isolate DomPDF vs. Blade)
        if ($request->boolean('debug')) {
            $html = '<html><body><h1>Hello PDF</h1><p>ID: '
                  . e($prescription->p_id) . '</p></body></html>';

            // IMPORTANT: use Barryvdh facade alias you imported: Pdf:: (not \PDF::)
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)->setPaper('a4', 'portrait');
            return $pdf->stream("debug-{$prescription->p_id}.pdf");
        }

        // Normal flow using Blade
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prescription.pdf', [
            'prescription' => $prescription,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream("prescription-{$prescription->p_id}.pdf");

    } catch (\Throwable $e) {
        \Log::error('PDF render failed', [
            'message' => $e->getMessage(),
            'line'    => $e->getLine(),
            'file'    => $e->getFile(),
        ]);

        if (app()->environment('local')) {
            // show the real reason during local dev
            return response()->json([
                'message' => 'PDF generation failed.',
                'error'   => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ], 500);
        }

        return response()->json([
            'message' => 'PDF generation failed.',
            'hint'    => 'Check storage/logs/laravel.log for details.',
        ], 500);
    }
}


}