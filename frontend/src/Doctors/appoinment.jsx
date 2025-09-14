import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000"; // change if needed

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("doctorToken");
        if (!token) {
          alert("Please log in first.");
          navigate("/user/login");
          return;
        }

        const { data } = await axios.get(
          `${API_BASE}/api/doctor/appointments?status=inbox`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(data.data)) {
          setAppointments(data.data);
        } else if (Array.isArray(data.appointments)) {
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

  return (
    <div className="p-12 bg-neutral-950 min-h-full w-full">
      <div className="flex flex-col space-y-8 items-start">
        <h1 className="text-4xl font-bold text-blue-400">Appointments</h1>
        <p className="text-xl text-gray-300">
          This is where upcoming appointments will be displayed.
        </p>

        {loading && <p className="text-gray-400">Loading appointments...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="flex flex-col space-y-6 w-full">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-6 w-full bg-gray-800 rounded-xl shadow-lg border border-gray-700"
                >
                  <h2 className="text-2xl font-semibold text-gray-100">
                    {appt.patient?.name || "Unknown Patient"}
                  </h2>
                  <p className="text-md text-gray-300">
                    Status:{" "}
                    <span className="capitalize font-medium text-gray-200">
                      {appt.status}
                    </span>
                  </p>
                  <p className="text-md text-gray-300">
                    Starts at:{" "}
                    {appt.starts_at
                      ? new Date(appt.starts_at).toLocaleString()
                      : "N/A"}
                  </p>
                  {appt.reason && (
                    <p className="text-md text-gray-300">
                      Reason: {appt.reason}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No appointments found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
