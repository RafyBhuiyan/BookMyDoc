import { useEffect, useState } from "react";
import axios from "axios";
import { DoctorCard } from "./DoctorCard";

const API_BASE = "http://127.0.0.1:8000";

export default function Find_Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/doctors`, { params: { per_page: 100 } });
        setDoctors(data?.data || data);
      } catch (e) {
        setError("Failed to load doctors");
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Find a Doctor</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
}
