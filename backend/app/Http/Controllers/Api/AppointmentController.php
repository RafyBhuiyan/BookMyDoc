<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Availability;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Support\EnsuresRole;

class AppointmentController extends Controller
{
    use EnsuresRole;


    public function store(Request $r)
    {
        $this->ensurePatient($r);

        $data = $r->validate([
            'doctor_id' => ['required', 'exists:doctors,id'],
            'starts_at' => ['required', 'date'],
            'reason'    => ['nullable', 'string', 'max:1000'],
        ]);

        $patientId = $r->user()->id;

        $start = Carbon::parse($data['starts_at'])->second(0);

        $win = Availability::where('doctor_id', $data['doctor_id'])
            ->where('date', $start->toDateString())
            ->where('start_time', '<=', $start->format('H:i:s'))
            ->where('end_time',   '>',  $start->format('H:i:s'))
            ->first();

        if (!$win) {
            return response()->json(['message' => 'Selected time is outside availability'], 422);
        }

        $conflict = Appointment::where('doctor_id', $data['doctor_id'])
            ->where('starts_at', $start)
            ->whereIn('status', ['pending','accepted'])
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'This time has just been taken. Please choose another slot.'], 409);
        }

        $end = (clone $start)->addMinutes($win->slot_minutes ?? 30);

        $appointment = Appointment::create([
            'doctor_id'  => $data['doctor_id'],
            'patient_id' => $patientId,
            'starts_at'  => $start,
            'ends_at'    => $end,
            'status'     => 'pending',
            'reason'     => $data['reason'] ?? null,
        ])->refresh();

        return response()->json([
            'status'  => true,
            'message' => 'Appointment created',
            'data'    => $appointment,
        ], 201);
    }

    /**
     * PATCH /api/appointments/{appointment}/cancel
     */
    public function cancel(Request $r, Appointment $appointment)
    {
        $this->ensurePatient($r);
        abort_if($appointment->patient_id !== $r->user()->id, 403, 'Not your appointment');

        // Only PENDING can be cancelled by patient (accepted cannot)
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending appointments can be cancelled by the patient.'
            ], 409);
        }
        $r->validate(['cancel_reason' => ['nullable','string','max:1000']]);

        $appointment->delete();  // HARD DELETE

        return response()->json([
            'status'  => true,
            'message' => 'Appointment cancelled and removed.'
        ]);
    }

    /**
     * Patient reschedules: only when PENDING
     * PATCH /api/appointments/{appointment}/reschedule
     */
    public function reschedule(Request $r, Appointment $appointment)
    {
        $this->ensurePatient($r);
        abort_if($appointment->patient_id !== $r->user()->id, 403, 'Not your appointment');

        // Only PENDING can be rescheduled. Accepted cannot.
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending appointments can be rescheduled by the patient.'
            ], 409);
        }
$startsAt = str_replace('T', ' ', $r->starts_at); // 2025-09-08 18:30
$r->merge(['starts_at' => $startsAt]);
$data = $r->validate([
    'starts_at' => ['required', 'date'],
]);


        $start = Carbon::parse($data['starts_at'])->second(0);

        // Must be within availability
        $win = Availability::where('doctor_id', $appointment->doctor_id)
            ->where('date', $start->toDateString())
            ->where('start_time', '<=', $start->format('H:i:s'))
            ->where('end_time',   '>',  $start->format('H:i:s'))
            ->first();

        if (!$win) {
            return response()->json(['message' => 'Selected time is outside availability'], 422);
        }

        // Prevent rescheduling into a taken (pending/accepted) slot
        $conflict = Appointment::where('doctor_id', $appointment->doctor_id)
            ->where('starts_at', $start)
            ->where('id', '!=', $appointment->id)
            ->whereIn('status', ['pending','accepted'])
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'That slot has been booked by someone else. Please choose a different time.'
            ], 409);
        }

        $appointment->update([
            'starts_at' => $start,
            'ends_at'   => (clone $start)->addMinutes($win->slot_minutes ?? 30),
            'status'    => 'pending', // stays pending after reschedule
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Appointment rescheduled',
            'data'    => $appointment->fresh(),
        ]);
    }

    /**
     * Doctor accepts (only pending)
     * PATCH /api/appointments/{appointment}/accept
     */
    public function accept(Request $r, Appointment $appointment)
    {
        $this->ensureDoctor($r);
        abort_if($appointment->doctor_id !== $r->user()->id, 403, 'Not your appointment');

        if ($appointment->status !== 'pending') {
            return response()->json(['message' => 'Only pending appointments can be accepted.'], 409);
        }

        $appointment->update(['status' => 'accepted']);

        return response()->json([
            'status'  => true,
            'message' => 'Appointment accepted',
            'data'    => $appointment->fresh(),
        ]);
    }

    /**
     * Doctor declines (only pending). Keep record with reason.
     * PATCH /api/appointments/{appointment}/decline
     */
    public function decline(Request $r, Appointment $appointment)
    {
        $this->ensureDoctor($r);
        abort_if($appointment->doctor_id !== $r->user()->id, 403, 'Not your appointment');

        if ($appointment->status !== 'pending') {
            return response()->json(['message' => 'Only pending appointments can be declined.'], 409);
        }

        $payload = $r->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $appointment->update([
            'status'        => 'declined',
            'cancel_reason' => $payload['reason'] ?? null,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Appointment declined',
            'data'    => $appointment->fresh(),
        ]);
    }

    /**
     * Doctor’s queue (default = upcoming pending+accepted)
     */
    public function myForDoctor(Request $r)
    {
        $this->ensureDoctor($r);

        $status = $r->query('status', 'inbox'); // inbox|pending|accepted|cancelled|declined|all
        $q = Appointment::where('doctor_id', $r->user()->id);

        switch ($status) {
            case 'pending':
                $q->where('status','pending')->where('starts_at','>=', now());
                break;
            case 'accepted':
                $q->where('status','accepted')->where('starts_at','>=', now());
                break;
            case 'declined':
                $q->where('status','declined');
                break;
            case 'inbox': // default
                $q->whereIn('status',['pending','accepted'])->where('starts_at','>=', now());
                break;
            case 'all':
            default:
                // no extra filters
                break;
        }

        return $q->orderBy('starts_at')->paginate(20)->appends(['status'=>$status]);
    }

    /**
     * Patient’s history
     */
   public function myForPatient(Request $r)
{
    $this->ensurePatient($r);

    // Fetch appointments with doctor details
    $appointments = Appointment::with('doctor') // Eager load doctor data
        ->where('patient_id', $r->user()->id)
        ->latest('starts_at') // Get latest appointments first
        ->paginate(20);

    // You can return the paginated data directly, or format as needed
    return response()->json([
        'appointments' => $appointments->items(),
    ]);
}

}
