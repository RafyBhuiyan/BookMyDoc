import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("patientToken");
        if (!token) {
          alert("Please log in first.");
          navigate("/user/login");
        }
        const { data } = await axios.get(`${API_BASE}/api/my/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure appointments is an array
        if (Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
        } else {
          setError("Failed to load appointments.");
        }
      } catch (err) {
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCancel = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment(appointmentId);
    }
  };

  const handleReschedule = (appointmentId) => {
    setSelectedAppointment(appointmentId);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("patientToken");
      if (!token) {
        alert("Please log in first.");
        navigate("/user/login");
      }
      await axios.patch(`${API_BASE}/api/user/appointments/${appointmentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId)); // Remove from list
      alert("Appointment cancelled successfully.");
    } catch (err) {
      setError("Failed to cancel appointment.");
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!newDateTime) {
      setError("Please select a new date and time.");
      return;
    }

    try {
      const token = localStorage.getItem("patientToken");
      if (!token) {
        alert("Please log in first.");
        navigate("/user/login");
      }

      await axios.patch(
        `${API_BASE}/api/user/appointments/${selectedAppointment}/reschedule`,
        { starts_at: newDateTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment rescheduled successfully.");
      setSelectedAppointment(null);
      setNewDateTime("");
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === selectedAppointment
            ? { ...appt, starts_at: newDateTime } // Update the starts_at of the rescheduled appointment
            : appt
        )
      );
    } catch (err) {
      setError("Failed to reschedule appointment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">My Appointments</h1>

      {loading && <p>Loading your appointments...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id} className="border-b py-4">
              <div>
                <strong>Doctor: </strong> {appt.doctor.name} <br />
                <strong>Specialization: </strong> {appt.doctor.specialization} <br />
                <strong>Date: </strong> {new Date(appt.starts_at).toLocaleString()} <br />
                <strong>Status: </strong> {appt.status} <br />
                <div className="mt-3">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="mr-4 text-red-600 hover:text-red-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReschedule(appt.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedAppointment && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
          <p className="mb-4">Select a new date and time:</p>
          <input
            type="datetime-local"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            className="w-full h-14 px-5 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button
            onClick={handleRescheduleSubmit}
            className="w-full h-14 mt-4 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Reschedule Appointment
          </button>
        </div>
      )}
    </div>
  );
}
