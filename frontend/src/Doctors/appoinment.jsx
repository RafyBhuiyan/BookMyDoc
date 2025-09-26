"use client";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
const API = import.meta.env.VITE_API_BASE;

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
        // Replaced alert with redirect
        navigate("/user/login");
        return;
      }

      const { data } = await axios.get(
        `${API}/doctor/appointments?status=pending`,
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
        `${API}/doctor/appointments/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to accept appointment.");
    } finally {
      setBusyIds((prev) => prev.filter((bid) => bid !== id));
    }
  };

  const handleDecline = async (id, reason = "") => {
    if (busyIds.includes(id)) return;
    setBusyIds((prev) => [...prev, id]);
    try {
      const token = localStorage.getItem("doctorToken");
      await axios.patch(
        `${API}/doctor/appointments/${id}/decline`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to decline appointment.");
    } finally {
      setBusyIds((prev) => prev.filter((bid) => bid !== id));
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "patientName", header: "Patient" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "startsAt", header: "Starts At" },
      { accessorKey: "reason", header: "Reason" },
      {
        accessorKey: "actions",
        header: "Accept / Decline",
        cell: ({ row }) =>
          row.original.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-500"
                onClick={() => handleAccept(row.original.id)}
                disabled={busyIds.includes(row.original.id)}
              >
                Accept
              </Button>

              {/* Decline wrapped with AlertDialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-500"
                    disabled={busyIds.includes(row.original.id)}
                  >
                    Decline
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-neutral-900 border border-neutral-700 text-neutral-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Decline Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you want to decline this appointment?  
                      You can optionally provide a reason.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <textarea
                    placeholder="Reason (optional)"
                    className="w-full mt-3 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-600"
                    id={`decline-reason-${row.original.id}`}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        const reason = document.getElementById(
                          `decline-reason-${row.original.id}`
                        )?.value;
                        handleDecline(row.original.id, reason);
                      }}
                      className="bg-red-600 hover:bg-red-500"
                    >
                      Confirm Decline
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
        <div>
          <Table className="min-w-full text-gray-100 border border-neutral-800 rounded-xl overflow-hidden">
            <TableHeader className="bg-gradient-to-r from-neutral-900 to-neutral-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer select-none hover:text-blue-400"
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
                    className="hover:bg-gradient-to-r hover:from-neutral-800 hover:via-neutral-900 hover:to-neutral-800 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-gray-400"
                  >
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
              className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white"
            >
              Prev
            </Button>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white"
            >
              Next
            </Button>
            <span className="text-gray-400 ml-4">
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
