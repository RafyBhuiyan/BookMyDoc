import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export default function RescheduleAppointment() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("patientToken");
        if (!token) {
          alert("Please log in first.");
          navigate("/user/login");
        }
        const { data } = await axios.get(`${API_BASE}/api/user/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(data.data);
      } catch (err) {
        setError("Failed to fetch appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, navigate]);
 const isoDateTime = new Date(newDateTime).toISOString(); 
const handleReschedule = async () => {
  if (!newDateTime) {
    setError("Please select a new date and time.");
    return;
  }

  try {
    const token = localStorage.getItem("patientToken");
    if (!token) {
      alert("Please log in first.");
      navigate("/user/login");
      return;
    }

    const { data } = await axios.patch(
      `${API_BASE}/api/user/appointments/${appointmentId}/reschedule`,
      { starts_at: newDateTime },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(data.message || "Appointment rescheduled successfully.");
    navigate("/my/appointments");
  } catch (err) {
    console.error(err.response?.data);
    setError(err.response?.data?.message || "Failed to reschedule appointment.");
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Reschedule Appointment</h1>

      {loading && <p>Loading appointment details...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {appointment && (
        <div>
          <p><strong>Doctor:</strong> {appointment.doctor.name}</p>
          <p><strong>Original Date:</strong> {new Date(appointment.starts_at).toLocaleString()}</p>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Date & Time</label>
          <input
            type="datetime-local"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            className="w-full h-14 px-5 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button
            onClick={handleReschedule}
            className="w-full h-14 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition mt-4"
          >
            Reschedule Appointment
          </button>
        </div>
      )}
    </div>
  );
}
