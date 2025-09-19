<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Prescription #{{ $prescription->p_id ?? '' }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h2 { margin: 0 0 8px 0; }
        .section { margin: 14px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
    </style>
</head>
<body>
    <h2>Prescription</h2>

    <div class="section">
        <strong>Issued Date:</strong>
        @php
            $d = $prescription->issued_date ?? null;
            // $issued_date is Carbon due to casts; if not, try parsing
            if (is_string($d)) { try { $d = \Carbon\Carbon::parse($d); } catch (\Exception $e) { $d = null; } }
        @endphp
        {{ $d ? $d->format('Y-m-d') : 'N/A' }}
    </div>

    <div class="section">
        <h3>Patient</h3>
        <div>
            <strong>Name:</strong> {{ $prescription->patient->name ?? 'N/A' }}<br>
            <strong>Email:</strong> {{ $prescription->patient->email ?? 'N/A' }}
        </div>
    </div>

    <div class="section">
        <h3>Doctor</h3>
        <div>
            <strong>Name:</strong> {{ $prescription->doctor->name ?? 'N/A' }}<br>
            <strong>Specialization:</strong> {{ $prescription->doctor->specialization ?? 'N/A' }}<br>
            <strong>City:</strong> {{ $prescription->doctor->city ?? 'N/A' }}
        </div>
    </div>

    <div class="section">
        <h3>Notes</h3>
        <div>{{ $prescription->notes ?? 'No notes provided.' }}</div>
    </div>

    <div class="section">
        <h3>Medicines</h3>
        <table>
            <thead>
            <tr>
                <th>Name</th><th>Dose</th><th>Schedule</th><th>Days</th>
            </tr>
            </thead>
            <tbody>
            @php
                $meds = $prescription->medicines ?? [];
                if (is_string($meds)) { // just in case JSON string slipped through
                    try { $meds = json_decode($meds, true) ?: []; } catch (\Exception $e) { $meds = []; }
                }
            @endphp
            @if(is_array($meds) && count($meds))
                @foreach($meds as $m)
                    <tr>
                        <td>{{ $m['name'] ?? '' }}</td>
                        <td>{{ $m['dose'] ?? '-' }}</td>
                        <td>{{ $m['schedule'] ?? '-' }}</td>
                        <td>{{ $m['days'] ?? '-' }}</td>
                    </tr>
                @endforeach
            @else
                <tr><td colspan="4">No medicines recorded.</td></tr>
            @endif
            </tbody>
        </table>
    </div>

    @if(!empty($prescription->appointment))
        <div class="section">
            <h3>Appointment</h3>
            <div>
                <strong>Patient ID:</strong> {{ $prescription->appointment->patient_id ?? 'N/A' }}<br>
                <strong>Doctor ID:</strong> {{ $prescription->appointment->doctor_id ?? 'N/A' }}<br>
                <strong>Starts At:</strong> {{ $prescription->appointment->starts_at ?? 'N/A' }}<br>
                <strong>Status:</strong> {{ $prescription->appointment->status ?? 'N/A' }}
            </div>
        </div>
    @endif

    <div class="section" style="text-align:center;">
        <small>Confidential — For medical use only</small>
    </div>
</body>
</html>
