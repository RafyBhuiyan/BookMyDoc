"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Label } from "@radix-ui/react-label";
import { Trash2, Plus } from "lucide-react";
const API = import.meta.env.VITE_API_BASE;
// Token helper
const authHeaders = () => {
  const token = localStorage.getItem("doctorToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AvailabilityManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorDialog, setErrorDialog] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const [date, setDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotMinutes, setSlotMinutes] = useState(30);

  // Load availability list
  const load = async () => {
    try {
      setLoading(true);
      setErrorDialog("");
      const { data } = await axios.get(`${API}/doctor/availabilities`, {
        headers: authHeaders(),
      });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErrorDialog(
        e?.response?.data?.message || "Failed to load availability"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create new availability
  const createAvailability = async (e) => {
    e.preventDefault();
    setErrorDialog("");

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    const overlap = items.some((slot) => {
      if (slot.date !== date) return false;
      const existingStart = toMinutes(slot.start_time);
      const existingEnd = toMinutes(slot.end_time);
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (overlap) {
      setErrorDialog("This time slot overlaps with an existing availability.");
      return;
    }

    try {
      setBusy(true);
      const payload = {
        date,
        start_time: startTime,
        end_time: endTime,
        ...(slotMinutes ? { slot_minutes: Number(slotMinutes) } : {}),
      };
      const { data } = await axios.post(
        `${API}/doctor/availabilities`,
        payload,
        {
          headers: { "Content-Type": "application/json", ...authHeaders() },
        }
      );
      setItems((prev) => [data, ...prev]);
    } catch (e) {
      setErrorDialog(
        e?.response?.data?.message || "Failed to create availability"
      );
      return;
    } finally {
      setBusy(false);
    }

    const closeBtn = document.getElementById("close-sheet-avail");
    closeBtn?.click();
  };

  // Ask for delete confirmation
  const remove = async (id) => {
    setConfirmId(id);
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-4 text-neutral-100">
      <div className="mb-4 flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="ml-auto inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm hover:bg-neutral-700"
              title="Add availability"
            >
              <Plus className="h-4 w-4" />
              Manage
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-md bg-neutral-900 text-neutral-100 border-neutral-800 flex flex-col"
          >
            <SheetHeader>
              <SheetTitle>Manage Availability</SheetTitle>
              <SheetDescription>
                Add new slots and manage existing availability.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-6 p-5">
              <form onSubmit={createAvailability} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-neutral-300">Date</Label>
                  <input
                    type="date"
                    min={tomorrow}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-neutral-300">Start time</Label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-neutral-300">End time</Label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Label className="text-neutral-300">
                      Slot minutes (optional)
                    </Label>
                    <input
                      type="number"
                      min={10}
                      max={120}
                      step={5}
                      value={slotMinutes}
                      onChange={(e) => setSlotMinutes(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                      placeholder="e.g. 30"
                    />
                  </div>
                  <SheetFooter className="mt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-500 bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </SheetFooter>
                </div>
              </form>

              {/* Availability list */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-3">
                {loading ? (
                  <p className="text-neutral-300">Loading…</p>
                ) : items.length === 0 ? (
                  <p className="text-neutral-400">
                    No availability yet. Fill out the form above to add.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {items.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{a.date}</div>
                          <div className="text-sm text-neutral-400">
                            {a.start_time} – {a.end_time}
                            {a.slot_minutes ? ` • ${a.slot_minutes} min` : ""}
                          </div>
                        </div>
                        <button
                          onClick={() => remove(a.id)}
                          disabled={busy}
                          className="rounded-md border border-neutral-700 bg-neutral-800 p-2 hover:bg-neutral-700 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Error Dialog */}
      <AlertDialog open={!!errorDialog} onOpenChange={() => setErrorDialog("")}>
        <AlertDialogContent className="bg-neutral-900 text-neutral-100 border border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog("")}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Delete */}
      <AlertDialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <AlertDialogContent className="bg-neutral-900 text-neutral-100 border border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Availability</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this availability?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500 text-white"
              onClick={async () => {
                try {
                  setBusy(true);
                  await axios.delete(`/doctor/availabilities/${confirmId}`, {
                    headers: authHeaders(),
                  });
                  setItems((prev) => prev.filter((x) => x.id !== confirmId));
                } catch (e) {
                  setErrorDialog(
                    e?.response?.data?.message || "Failed to delete"
                  );
                } finally {
                  setBusy(false);
                  setConfirmId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
