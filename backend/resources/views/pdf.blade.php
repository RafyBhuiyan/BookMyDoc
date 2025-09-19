<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Prescription #{{ $prescription->p_id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .section { margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 6px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Prescription</h2>
        <p>Issued on: {{ $prescription->issued_date?->format('Y-m-d') ?? 'N/A' }}</p>
    </div>

    <div class="section">
        <h4>Patient Info</h4>
        <p>
            <strong>Name:</strong> {{ $prescription->patient->name ?? 'N/A' }}<br>
            <strong>Email:</strong> {{ $prescription->patient->email ?? 'N/A' }}<br>
        </p>
    </div>

    <div class="section">
        <h4>Doctor Info</h4>
        <p>
            <strong>Name:</strong> {{ $prescription->doctor->name ?? 'N/A' }}<br>
            <strong>Specialization:</strong> {{ $prescription->doctor->specialization ?? 'N/A' }}<br>
            <strong>City:</strong> {{ $prescription->doctor->city ?? 'N/A' }}<br>
        </p>
    </div>

    <div class="section">
        <h4>Notes</h4>
        <p>{{ $prescription->notes ?? 'No notes provided.' }}</p>
    </div>

    <div class="section">
        <h4>Medicines</h4>
        <table>
            <thead>
                <tr><th>Name</th><th>Dose</th><th>Schedule</th><th>Days</th></tr>
            </thead>
            <tbody>
                @if(is_array($prescription->medicines))
                    @foreach($prescription->medicines as $med)
                        <tr>
                            <td>{{ $med['name'] ?? '' }}</td>
                            <td>{{ $med['dose'] ?? '-' }}</td>
                            <td>{{ $med['schedule'] ?? '-' }}</td>
                            <td>{{ $med['days'] ?? '-' }}</td>
                        </tr>
                    @endforeach
                @else
                    <tr><td colspan="4">No medicines recorded.</td></tr>
                @endif
            </tbody>
        </table>
    </div>

    <div class="section">
        <p><strong>Duration (days):</strong> {{ $prescription->duration_days ?? 'N/A' }}<br>
           <strong>Refills:</strong> {{ $prescription->refill_count ?? 0 }}</p>
    </div>

    @if($prescription->appointment)
    <div class="section">
        <h4>Appointment</h4>
        <p>
            <strong>Date:</strong> {{ $prescription->appointment->starts_at ?? 'N/A' }}<br>
            <strong>Status:</strong> {{ $prescription->appointment->status ?? 'N/A' }}
        </p>
    </div>
    @endif

    <div style="position: fixed; bottom: 20px; width: 100%; text-align: center;">
        <small>Confidential — For medical use only</small>
    </div>
</body>
</html>
