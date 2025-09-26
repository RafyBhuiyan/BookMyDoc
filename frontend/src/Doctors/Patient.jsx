import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import AvailabilityManager from "./AvailabilityManager";


const PatientPage = () => {
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
          navigate("/doctor/login");
          return;
        }

        const { data } = await axios.get(
          `http://localhost:8000/api/doctor/appointments/accepted`,
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
      <div className="space-y-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold text-blue-400">Confirmed Appointments</h1>
            <p className="text-xl text-gray-300">
              Confirmed Patient List & Schedule.
            </p>
          </div>
          <AvailabilityManager />
        </div>

        {loading && <p className="text-gray-400">Loading appointments...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <Table className=" rounded-xl ">
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead className="text-gray-200">Patient Name</TableHead>
                <TableHead className="text-gray-200">Status</TableHead>
                <TableHead className="text-gray-200">Starts At</TableHead>
                <TableHead className="text-gray-200">Reason</TableHead>
                <TableHead className="text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <TableRow
                    key={appt.id}
                    className="group hover:bg-gray-300  transition-colors"
                  >
                    <TableCell className="text-gray-100 group-hover:text-neutral-800 font-bold capitalize">
                      {appt.patient?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-gray-300 group-hover:text-neutral-800 font-bold capitalize">
                      {appt.status}
                    </TableCell>
                    <TableCell className="text-gray-300 group-hover:text-neutral-800 font-bold">
                      {appt.starts_at
                        ? new Date(appt.starts_at).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300 group-hover:text-neutral-800 font-bold">
                      {appt.reason || "-"}
                    </TableCell>
                    <TableCell>
                      {/* Shadcn DropdownMenu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-full hover:bg-gray-500 ">
                            <MoreVertical className="h-5 w-5 text-gray-700" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-700 border border-gray-600">
                          <DropdownMenuItem className="text-gray-200 font-semibold">
                            Profile 
                          </DropdownMenuItem>
                             <DropdownMenuItem
                             className="text-gray-200 font-semibold cursor-pointer hover:bg-black"
                             onClick={() => navigate(`/doctor/prescription/${appt.patient.id}/${appt.id}`)}
                              >
                            Prescription
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-200 font-semibold">
                            Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-gray-400 text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        )}
      </div>
    </div>
  );
};

export default PatientPage;
