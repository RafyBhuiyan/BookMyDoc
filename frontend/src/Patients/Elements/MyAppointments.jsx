import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";


const API = (import.meta.env.VITE_API_ORIGIN || "http://localhost:8000/api").replace(/\/$/, "");
const apiUrl = (p) => `${API}/${String(p).replace(/^\/+/, "")}`;

export default function MyAppointmentsTable() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState(""); // initialize state
  const [filters, setFilters] = useState({
    status: "all",
    date: "",
    specialization: "",
  });

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
        const { data } = await axios.get(apiUrl(`my/appointments`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
          setFilteredAppointments(data.appointments);
        } else {
          setError("Failed to load appointments.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [navigate]);

  // Filter logic
  useEffect(() => {
    let filtered = [...appointments];
    if (filters.status !== "all") filtered = filtered.filter((a) => a.status === filters.status);
    if (filters.date)
      filtered = filtered.filter(
        (a) =>
          new Date(a.starts_at).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString()
      );
    if (filters.specialization)
      filtered = filtered.filter(
        (a) =>
          a.doctor?.specialization
            .toLowerCase()
            .includes(filters.specialization.toLowerCase())
      );
    setFilteredAppointments(filtered);
  }, [filters, appointments]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const token = localStorage.getItem("patientToken");
      await axios.patch(
        apiUrl(`user/appointments/${appointmentId}/cancel`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
    } catch (err) {
      console.error(err);
      setError("Failed to cancel appointment.");
    }
  };

  const handleReschedule = (appointmentId, currentDateTime) => {
    setSelectedAppointment(appointmentId);
    setNewDateTime(currentDateTime); // prefill current datetime
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

      // Ensure that the `newDateTime` is in the correct format before sending
      const formattedDate = new Date(newDateTime).toISOString(); // Converts to ISO 8601 format

      const response = await axios.patch(
        apiUrl(`user/appointments/${selectedAppointment}/reschedule`),
        { starts_at: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Appointment rescheduled successfully.");
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === selectedAppointment ? { ...appt, starts_at: formattedDate } : appt
          )
        );
        setSelectedAppointment(null);
        setNewDateTime("");
      } else {
        setError("Failed to reschedule appointment.");
      }
    } catch (err) {
      console.error(err);
      // Log the actual error response
      if (err.response) {
        console.error("Error response:", err.response);
        setError(err.response.data.message || "Failed to reschedule appointment.");
      } else {
        setError("Failed to reschedule appointment.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">My Appointments</h1>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 rounded bg-neutral-800 text-white w-full lg:w-1/4"
        >
          <option value="all">All Status</option>
          <option value="accepted">Accepted</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="p-2 rounded bg-neutral-800 text-white w-full lg:w-1/4"
        />
        <input
          type="text"
          placeholder="Filter by specialization"
          value={filters.specialization}
          onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
          className="p-2 rounded bg-neutral-800 text-white w-full lg:w-1/4"
        />
      </div>

      {loading && <p className="text-gray-400">Loading appointments...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader className="bg-gray-900">
            <TableRow>
              <TableHead className="text-white">Doctor</TableHead>
              <TableHead className="text-white">Specialization</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-gray-400 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>{appt.doctor?.name}</TableCell>
                  <TableCell>{appt.doctor?.specialization}</TableCell>
                  <TableCell>{new Date(appt.starts_at).toLocaleString()}</TableCell>
                  <TableCell>{appt.status}</TableCell>
                  <TableCell>
                    {appt.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-red-600" onClick={() => handleCancel(appt.id)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-indigo-600"
                          onClick={() => handleReschedule(appt.id, appt.starts_at)}
                        >
                          Reschedule
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400">No actions available</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Reschedule Panel */}
        {selectedAppointment && (
          <div className="mt-6 p-4 bg-black rounded-xl shadow">
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
    </div>
  );
}
