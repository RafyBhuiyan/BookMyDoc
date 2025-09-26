import React, { useEffect, useState } from "react";
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE;
function Medical_reports({ user }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${API}users/${userId}/prescriptions`, { withCredentials: true })
      .then((res) => setPrescriptions(res.data.prescriptions?.data ?? []))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div>
      <h2>My Prescriptions</h2>
      <table style={{ width: "700px", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "120px" }}>Date</th>
            <th style={{ width: "120px" }}>Doctor</th>
            <th style={{ width: "180px" }}>Notes</th>
            <th style={{ width: "280px" }}>Medicines</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p) => (
            <tr key={p.p_id}>
              <td>{p.issued_date}</td>
              <td>{p.doctor_id}</td>
              <td>{p.notes}</td>
              <td>
                {Array.isArray(p.medicines)
                  ? p.medicines.map((m, i) => <div key={i}>{m.name}</div>)
                  : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Medical_reports;
