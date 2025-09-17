import { useEffect, useState, useCallback, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const API_BASE = "http://127.0.0.1:8000";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
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
        `${API_BASE}/api/doctor/appointments?status=pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const appts = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.appointments)
        ? data.appointments
        : [];
      setAppointments(appts);
    } catch (err) {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleAccept = async (id) => {
    if (busyIds.includes(id)) return;
    setBusyIds((prev) => [...prev, id]);
    try {
      const token = localStorage.getItem("doctorToken");
      await axios.patch(
        `${API_BASE}/api/doctor/appointments/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept appointment.");
    } finally {
      setBusyIds((prev) => prev.filter((bid) => bid !== id));
    }
  };

  const handleDecline = async (id) => {
    if (busyIds.includes(id)) return;
    const reason = prompt("Optional: Enter reason for declining this appointment:");
    setBusyIds((prev) => [...prev, id]);
    try {
      const token = localStorage.getItem("doctorToken");
      await axios.patch(
        `${API_BASE}/api/doctor/appointments/${id}/decline`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to decline appointment.");
    } finally {
      setBusyIds((prev) => prev.filter((bid) => bid !== id));
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "patientName",
        header: "Patient",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "startsAt",
        header: "Starts At",
      },
      {
        accessorKey: "reason",
        header: "Reason",
      },
      {
        accessorKey: "actions",
        header: "Accept / Decline",
        cell: ({ row }) => (
          row.original.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => handleAccept(row.original.id)}
                disabled={busyIds.includes(row.original.id)}
              >
                Accept
              </Button>
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDecline(row.original.id)}
                disabled={busyIds.includes(row.original.id)}
              >
                Decline
              </Button>
            </div>
          )
        ),
      },
    ],
    [busyIds]
  );

  const data = useMemo(
    () =>
      appointments.map((appt) => ({
        id: appt.id,
        patientName: appt.patient?.name || "Unknown",
        status: appt.status,
        startsAt: appt.starts_at
          ? new Date(appt.starts_at).toLocaleString()
          : "N/A",
        reason: appt.reason || "N/A",
      })),
    [appointments]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-12 bg-neutral-950 min-h-full w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-400">Appointments</h1>
        <p className="text-xl text-gray-300">
          Upcoming appointments are displayed below.
        </p>
      </div>

      {loading && <p className="text-gray-400">Loading appointments...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div >
          <Table className="min-w-full text-gray-100">
            <TableHeader className="bg-gray-900" >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer select-none hover:text-blue-400  "
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="ml-1 text-gray-400">
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gradient-to-r hover:from-gray-800 hover:via-gray-850 hover:to-gray-800 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </Button>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <span className="text-gray-300 ml-4">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
