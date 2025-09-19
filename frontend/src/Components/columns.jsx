// src/components/columns.jsx or src/components/appointments/columns.jsx
// Make sure to add `use client` since this will be an interactive component.
"use client"

import { Button } from "@/components/ui/button"

export const columns = (handleAccept, handleDecline, busyIds) => [
  {
    accessorKey: "patient.name",
    header: "Patient Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    // Optional: Render with a capitalized value for better display
    cell: ({ row }) => {
      const status = row.original.status
      return <span className="capitalize">{status}</span>
    },
  },
  {
    accessorKey: "starts_at",
    header: "Appointment Time",
    // Format the date for better readability
    cell: ({ row }) => {
      const startsAt = row.original.starts_at
      if (!startsAt) return "N/A"
      return new Date(startsAt).toLocaleString()
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    // Display reason only if it exists
    cell: ({ row }) => {
      const reason = row.original.reason
      return reason || "N/A"
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original
      const isBusy = busyIds.includes(appointment.id)

      if (appointment.status === "pending") {
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleAccept(appointment.id)}
              disabled={isBusy}
              variant="default"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleDecline(appointment.id)}
              disabled={isBusy}
              variant="destructive"
            >
              Decline
            </Button>
          </div>
        )
      }

      return null // Hide actions for non-pending appointments
    },
  },
]