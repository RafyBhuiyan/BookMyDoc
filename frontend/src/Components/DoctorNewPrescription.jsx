import React, { useState } from 'react';
import axios from 'axios';

export default function DoctorNewPrescription() {
  const [patientId, setPatientId] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dose: '', schedule: '', days: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  axios.defaults.withCredentials = true;

  function addMedicine() {
    setMedicines(prev => [...prev, { name: '', dose: '', schedule: '', days: '' }]);
  }
  function updateMedicine(idx, field, value) {
    setMedicines(prev => prev.map((m, i) => i === idx ? {...m, [field]: value } : m));
  }
  function removeMedicine(idx) {
    setMedicines(prev => prev.filter((_,i) => i !== idx));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        user_id: patientId,
        issued_date: issuedDate || null,
        notes,
        medicines,
        duration_days: null,
        refill_count: 0,
        is_private: true,
      };
      const res = await axios.post('http://localhost:8000/api/prescriptions', payload);
      const created = res.data;
      window.open(`http://localhost:8000/api/prescriptions/${created.p_id}/pdf`, '_blank');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Create Prescription</h2>

      <label>Patient ID or Search</label>
      <input value={patientId} onChange={e => setPatientId(e.target.value)} required />

      <label>Issued date</label>
      <input type="date" value={issuedDate} onChange={e => setIssuedDate(e.target.value)} />

      <label>Notes</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} />

      <h3>Medicines</h3>
      {medicines.map((m, i) =>
        <div key={i}>
          <input placeholder="Name" value={m.name} required onChange={e => updateMedicine(i, 'name', e.target.value)} />
          <input placeholder="Dose" value={m.dose} onChange={e => updateMedicine(i, 'dose', e.target.value)} />
          <input placeholder="Schedule" value={m.schedule} onChange={e => updateMedicine(i, 'schedule', e.target.value)} />
          <input placeholder="Days" value={m.days} onChange={e => updateMedicine(i, 'days', e.target.value)} />
          <button type="button" onClick={() => removeMedicine(i)}>Remove</button>
        </div>
      )}
      <button type="button" onClick={addMedicine}>Add medicine</button>

      <div>
        <button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Issue Prescription'}</button>
      </div>

      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
