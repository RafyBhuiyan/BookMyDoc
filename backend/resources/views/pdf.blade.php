<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Medical Report - {{ $user->name }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .patient-info { margin-bottom: 10px; }
        .section { margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 6px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Medical Report</h2>
        <p>Generated on: {{ \Carbon\Carbon::now()->toDateTimeString() }}</p>
    </div>

    <div class="patient-info">
        <strong>Patient Name:</strong> {{ $user->name }}<br>
        <strong>Email:</strong> {{ $user->email }}<br>
        <strong>Phone:</strong> {{ $user->phone ?? 'N/A' }}<br>
        <strong>Date of Birth:</strong> {{ $user->dob ?? 'N/A' }}<br>
    </div>

    <div class="section">
        <h4>Clinical Summary</h4>
        <p>{{ $user->clinical_summary ?? 'Not available.' }}</p>
    </div>

    <div class="section">
        <h4>Investigations</h4>
        <table>
            <thead>
                <tr><th>Test</th><th>Result</th><th>Reference</th></tr>
            </thead>
            <tbody>
                @if(isset($user->tests) && is_array($user->tests))
                    @foreach($user->tests as $test)
                        <tr>
                            <td>{{ $test['name'] }}</td>
                            <td>{{ $test['result'] }}</td>
                            <td>{{ $test['ref'] ?? '-' }}</td>
                        </tr>
                    @endforeach
                @else
                    <tr><td colspan="3">No test records available.</td></tr>
                @endif
            </tbody>
        </table>
    </div>

    <div class="section">
        <h4>Prescriptions</h4>
        <p>{{ $user->prescription ?? 'N/A' }}</p>
    </div>

    <div style="position: fixed; bottom: 20px; width: 100%; text-align: center;">
        <small>Confidential — For medical use only</small>
    </div>
</body>
</html>