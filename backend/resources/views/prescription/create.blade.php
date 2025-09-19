<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Issue Prescription for {{ $patient->name }}</title>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <style>
    label{display:block;margin-top:8px}
    input, textarea{width:420px;padding:6px}
    .med-row{margin-bottom:8px}
  </style>
</head>
<body>
  <h3>Issue Prescription for {{ $patient->name }} (ID: {{ $patient->id }})</h3>

  @if(session('success'))<div style="color:green">{{ session('success') }}</div>@endif
  @if($errors->any())
    <div style="color:red"><ul>@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div>
  @endif

  <form method="POST" action="{{ route('prescription.store') }}">
    @csrf
    <input type="hidden" name="user_id" value="{{ $patient->id }}">
    <label>Issued Date <input type="date" name="issued_date" value="{{ old('issued_date', now()->toDateString()) }}"></label>
    <label>Notes <textarea name="notes">{{ old('notes') }}</textarea></label>

    <h4>Medicines</h4>
    <div id="medicines">
      <div class="med-row">
        <input placeholder="Name" name="medicines[0][name]">
        <input placeholder="Dose" name="medicines[0][dose]">
        <input placeholder="Frequency" name="medicines[0][frequency]">
        <input placeholder="Duration (days)" name="medicines[0][duration]">
      </div>
    </div>

    <button type="button" id="addMed">+ Add medicine</button>

    <label>Duration days <input type="number" name="duration_days" value="{{ old('duration_days') }}"></label>
    <label>Refill count <input type="number" name="refill_count" value="{{ old('refill_count', 0) }}"></label>
    <label><input type="checkbox" name="is_private" value="1" {{ old('is_private', true) ? 'checked' : '' }}> Private</label>

    <div style="margin-top:12px"><button type="submit">Save Prescription</button></div>
  </form>

  <script>
    let idx = 1;
    document.getElementById('addMed').addEventListener('click', function(){
      const container = document.getElementById('medicines');
      const div = document.createElement('div');
      div.className = 'med-row';
      div.innerHTML = `
        <input placeholder="Name" name="medicines[${idx}][name]">
        <input placeholder="Dose" name="medicines[${idx}][dose]">
        <input placeholder="Frequency" name="medicines[${idx}][frequency]">
        <input placeholder="Duration (days)" name="medicines[${idx}][duration]">
        <button type="button" class="removeMed">Remove</button>
      `;
      container.appendChild(div);
      div.querySelector('.removeMed').addEventListener('click', () => div.remove());
      idx++;
    });
  </script>
</body>
</html>
