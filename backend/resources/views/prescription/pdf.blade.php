<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Prescription #{{ $prescription->p_id }}</title>
  <style>
    /* Use a safe font for DOMPDF (DejaVu for Unicode) */
    body { font-family: "DejaVu Sans", sans-serif; font-size: 12px; color:#111; margin: 20px; }
    .header { text-align: center; margin-bottom: 12px; }
    .clinic { font-size: 18px; font-weight: 700; }
    .meta { margin-top: 8px; display:flex; justify-content:space-between; }
    .section { margin-top: 12px; }
    table { width:100%; border-collapse: collapse; margin-top:8px; }
    th, td { padding:8px; border: 1px solid #ccc; text-align:left; }
    th { background:#f4f4f4; }
    .notes { margin-top:12px; }
    .signature { margin-top:30px; display:flex; justify-content:space-between; }
    .footer { position: fixed; bottom: 20px; width: 100%; text-align:center; font-size: 10px; color:#666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="clinic">Clinic / Hospital Name</div>
    <div>Address · Phone · Email</div>
    <div style="margin-top:6px;"><strong>Prescription</strong></div>
  </div>

  <div class="meta">
    <div>
      <strong>Patient:</strong> {{ $prescription->patient->name ?? '—' }} <br>
      <strong>Patient ID:</strong> {{ $prescription->user_id }} <br>
      @if($prescription->medicalData)
        <strong>Visit:</strong> {{ $prescription->medicalData->visit_date?->toDateString() ?? '—' }}
      @endif
    </div>

    <div style="text-align:right;">
      <strong>Doctor:</strong> {{ $prescription->doctor->name ?? '—' }} <br>
      <strong>Issued:</strong> {{ $prescription->issued_date?->toDateString() ?? $prescription->created_at->toDateString() }} <br>
      <strong>Prescription ID:</strong> {{ $prescription->p_id }}
    </div>
  </div>

  <div class="section">
    <h4>Medicines</h4>
    @if(empty($prescription->medicines))
      <p>No medicines listed.</p>
    @else
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine</th>
            <th>Dose</th>
            <th>Frequency</th>
            <th>Duration (days)</th>
          </tr>
        </thead>
        <tbody>
          @foreach($prescription->medicines as $i => $med)
            <tr>
              <td>{{ $i + 1 }}</td>
              <td>{{ $med['name'] ?? '-' }}</td>
              <td>{{ $med['dose'] ?? '-' }}</td>
              <td>{{ $med['frequency'] ?? '-' }}</td>
              <td>{{ $med['duration'] ?? '-' }}</td>
            </tr>
          @endforeach
        </tbody>
      </table>
    @endif
  </div>

  <div class="notes">
    <strong>Notes / Instructions</strong>
    <p>{!! nl2br(e($prescription->notes ?? '—')) !!}</p>
  </div>

  <div class="signature">
    <div>
      <strong>Pharmacist notes:</strong>
      <div style="height:48px;border-bottom:1px dotted #ccc;width:280px;"></div>
    </div>
    <div style="text-align:center;">
      <div style="height:48px;"></div>
      <div>__________________________</div>
      <div>Doctor signature</div>
    </div>
  </div>

  <div class="footer">Confidential — medical record. Generated {{ \Carbon\Carbon::now()->toDateString() }}</div>
</body>
</html>
