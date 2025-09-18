import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          return;
        }
        const { data } = await axios.get(`${API_BASE}/api/my/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const token = localStorage.getItem("patientToken");
      if (!token) {
        alert("Please log in first.");
        navigate("/user/login");
        return;
      }
      await axios.patch(`${API_BASE}/api/user/appointments/${appointmentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
      alert("Appointment cancelled successfully.");
    } catch (err) {
      setError("Failed to cancel appointment.");
    }
  };

  const handleReschedule = (appointmentId) => {
    setSelectedAppointment(appointmentId);
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
        return;
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
            ? { ...appt, starts_at: newDateTime }
            : appt
        )
      );
    } catch (err) {
      setError("Failed to reschedule appointment.");
    }
  };
return (
  <div className="min-h-screen w-full bg-neutral-900 text-white flex justify-center px-4 py-8">
    <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
      
      {/* Appointments List */}
      <div className={`flex-1 transition-all duration-300 ${selectedAppointment ? "lg:w-2/3" : "lg:w-full"}`}>
        <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">My Appointments</h1>

        {loading && <p className="text-neutral-400">Loading your appointments...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {appointments.length === 0 ? (
          <p className="text-neutral-400 text-center">No appointments found.</p>
        ) : (
          <ul className="space-y-6">
            {appointments.map((appt) => (
<li key={appt.id}>
  <Card className="flex flex-row items-start justify-between p-5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition">
    {/* Left Side: Appointment Details */}
    <CardContent className="flex-1 space-y-2 text-white">
      <p>
        <span className="font-semibold text-indigo-400">Doctor:</span>{" "}
        {appt.doctor.name}
      </p>
      <p>
        <span className="font-semibold text-indigo-400">Specialization:</span>{" "}
        {appt.doctor.specialization}
      </p>
      <p>
        <span className="font-semibold text-indigo-400">Date:</span>{" "}
        {new Date(appt.starts_at).toLocaleString()}
      </p>
      <p>
        <span className="font-semibold text-indigo-400">Status:</span>{" "}
        <span
          className={`px-2 py-1 rounded-md text-sm ${
            appt.status === "confirmed"
              ? "bg-green-600/20 text-green-400"
              : "bg-yellow-600/20 text-yellow-400"
          }`}
        >
          {appt.status}
        </span>
      </p>
    </CardContent>

    {/* Right Side: Buttons */}
    <CardFooter className="flex flex-col gap-3">
      <Button
        onClick={() => handleCancel(appt.id)}
        variant="ghost"
        className="w-32 bg-red-600/20 text-red-400 hover:bg-red-600/40 transition"
      >
        Cancel
      </Button>
      <Button
        onClick={() => handleReschedule(appt.id)}
        variant="ghost"
        className="w-32 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition"
      >
        Reschedule
      </Button>
    </CardFooter>
  </Card>
</li>
            ))}
          </ul>
        )}
      </div>

      {/* Side Panel for Reschedule */}
      {selectedAppointment && (
        <div className="flex-1 lg:w-1/3 p-6 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300">
          <h2 className="text-lg font-bold mb-3">Reschedule Appointment</h2>
          <p className="mb-4 text-neutral-400">Select a new date and time:</p>
          <input
            type="datetime-local"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            className="w-full h-14 px-5 text-lg bg-neutral-900/80 border border-white/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white backdrop-blur-sm"
          />
          <button
            onClick={handleRescheduleSubmit}
            className="w-full h-14 mt-5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Reschedule Appointment
          </button>
        </div>
      )}
    </div>
  </div>
);
}