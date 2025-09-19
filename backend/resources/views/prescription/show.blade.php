<!doctype html>
<html>
<head><meta charset="utf-8"><title>Prescription #{{ $prescription->p_id }}</title></head>
<body>
  <h2>Prescription #{{ $prescription->p_id }}</h2>
  <p><strong>Patient:</strong> {{ $prescription->patient->name }} (ID: {{ $prescription->user_id }})</p>
  <p><strong>Doctor:</strong> {{ $prescription->doctor->name ?? '—' }}</p>
  <p><strong>Issued:</strong> {{ $prescription->issued_date ? $prescription->issued_date->toDateString() : '—' }}</p>
  <p><strong>Notes:</strong> {!! nl2br(e($prescription->notes)) !!}</p>

  <h3>Medicines</h3>
  @if(!$prescription->medicines)
    <p>No medicines listed.</p>
  @else
    <table border="1" cellpadding="6" cellspacing="0">
      <thead><tr><th>#</th><th>Name</th><th>Dose</th><th>Frequency</th><th>Duration (days)</th></tr></thead>
      <tbody>
      @foreach($prescription->medicines as $i => $med)
        <tr>
          <td>{{ $i+1 }}</td>
          <td>{{ $med['name'] ?? '-' }}</td>
          <td>{{ $med['dose'] ?? '-' }}</td>
          <td>{{ $med['frequency'] ?? '-' }}</td>
          <td>{{ $med['duration'] ?? '-' }}</td>
        </tr>
      @endforeach
      </tbody>
    </table>
  @endif

  <p><a href="{{ url()->previous() }}">Back</a></p>
</body>
</html>
