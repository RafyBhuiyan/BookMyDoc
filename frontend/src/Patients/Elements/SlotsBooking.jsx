import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";

import axios from "axios";

const API = (import.meta.env.VITE_API_ORIGIN || "http://localhost:8000/api").replace(/\/$/, "");
const apiUrl = (p) => `${API}/${String(p).replace(/^\/+/, "")}`;


export default function SlotsBooking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const starts_at = searchParams.get("starts_at"); 
  const [doctor, setDoctor] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const friendly = useMemo(() => {
    if (!starts_at) return "";
    const d = new Date(starts_at);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }, [starts_at]);

  // Load doctor for header
  useEffect(() => {
    if (!starts_at) return;
    (async () => {
      try {
        const { data } = await axios.get(apiUrl(`doctors/${id}`));
        setDoctor(data?.data || data);
      } catch {
        /* ignore */}
    })();
  }, [id, starts_at]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("patientToken");
    if (!token) {
      alert("Please log in first.");
      return navigate("/user/login");
    }
    if (!starts_at) {
      setError("No slot selected.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
  apiUrl(`user/appointments`), // <-- change this
  { doctor_id: Number(id), starts_at, reason: reason || undefined },
  { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
);
      alert("Appointment booked successfully!");
      navigate("/user/appointments"); 
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) setError("This slot was just taken. Please pick another.");
      else if (status === 422) setError(e?.response?.data?.message || "Validation error.");
      else if (status === 401) setError("Please log in as a patient.");
      else setError("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!starts_at) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600 mb-4">No slot selected.</p>
        <Link to={`/doctors/${id}`} className="text-blue-600 underline">Back to slots</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-white">Confirm Appointment</h1>
          <Link to={`/doctors/${id}`} className="text-shadow-2xs hover:underline">Back to slots</Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="mb-4">
            <p className="text-sm text-gray-700">Doctor</p>
            <p className="font-medium">{doctor ? (doctor.name || doctor.full_name) : `#${id}`}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700">Selected time</p>
            <p className="font-medium">{friendly}</p>
          </div>

          {error && (
            <div className="text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-xl p-3 min-h-[90px]"
                placeholder="e.g., Follow-up consultation"
                maxLength={1000}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 ${
                submitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Booking..." : "Book appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
