import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";

import apiClient from "@/apiClient";

export default function DoctorSlots() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  // per-date data
  const [slots, setSlots] = useState([]);
  // all-days data
  const [days, setDays] = useState([]);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const date = searchParams.get("date") || "";

  // fetch doctor header info
  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get(`/doctors/${id}`);
        setDoctor(data?.data || data);
      } catch {
        /* ignore */
      }
    })();
  }, [id]);

  // fetch slots (per-date or all-days)
  useEffect(() => {
    setLoading(true);
    setError("");
    setSlots([]);
    setDays([]);

    (async () => {
      try {
        if (date) {
          const { data } = await apiClient.get(`/doctors/${id}/slots`, { params: { date } });
          const list = (data?.slots || []).map((s) => ({
            id: s.starts_at,
            starts_at: s.starts_at,
            ends_at: s.ends_at || null,
            status: s.status || "available",
          }));
          setSlots(list);
        } else {
          const { data } = await apiClient.get(`/doctors/${id}/slots/all`);
          const normalized = (data?.days || []).map((d) => ({
            date: d.date,
            slots: (d.slots || []).map((s) => ({
              id: s.starts_at,
              starts_at: s.starts_at,
              ends_at: s.ends_at || null,
              status: s.status || "available",
            })),
          }));
          setDays(normalized);
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load slots");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, date]);

  const onChangeDate = (e) => {
    const d = e.target.value;
    if (!d) setSearchParams({});
    else setSearchParams({ date: d });
  };

  const goToBooking = (starts_at) => {
    navigate(`/doctors/${id}/book?starts_at=${encodeURIComponent(starts_at)}`);
  };

  // Dark-only button styles
  const baseBtn = "px-3 py-2 rounded-xl border text-sm transition-colors";
  const availableBtn =
    "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50";
  const unavailableBtn =
    "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed line-through";

  const timeLabel = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    // Wrap with a dark background + light text — page is dark-only
    <div className="min-h-dvh w-full bg-neutral-950 text-neutral-100">
      <div className="max-w-5xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Book an Appointment</h1>
            <p className="text-sm text-neutral-400">
              {doctor ? (doctor.name || doctor.full_name) : `Doctor #${id}`}
            </p>
          </div>
          <Link
            to="/doctor"
            className="text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400/40 rounded"
          >
            Back to Doctors
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Filter by date (optional)
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              value={date}
              min={todayStr}
              onChange={onChangeDate}
              className="
                bg-neutral-800 border border-neutral-700 text-neutral-100
                rounded-lg px-3 py-2 outline-none
                placeholder:text-neutral-400
                focus:ring-2 focus:ring-neutral-600
              "
            />
            {date && (
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="
                  px-3 py-2 rounded-lg border
                  bg-neutral-800 border-neutral-700 text-neutral-100
                  hover:bg-neutral-700
                  focus:outline-none focus:ring-2 focus:ring-neutral-600
                "
              >
                Clear
              </button>
            )}
            <div className="ml-auto flex items-center gap-3 text-xs text-neutral-300">
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Available
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-500 inline-block" /> Unavailable
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        {loading && <p className="text-neutral-300">Loading slots…</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Per-date view */}
        {date && !loading && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            {slots.length === 0 ? (
              <p className="text-sm text-neutral-400">No slots for {date}.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {slots.map((s) => {
                  const disabled = s.status !== "available";
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && goToBooking(s.starts_at)}
                      className={`${baseBtn} ${disabled ? unavailableBtn : availableBtn}`}
                      title={disabled ? `Unavailable (${s.status})` : "Select slot"}
                    >
                      {timeLabel(s.starts_at)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* All-days grouped view */}
        {!date && !loading && (
          <div className="space-y-4">
            {days.every((d) => (d.slots || []).length === 0) ? (
              <p className="text-sm text-neutral-400">No upcoming slots.</p>
            ) : (
              days.map((d) => (
                <div key={d.date} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                  <h3 className="font-semibold mb-2 text-neutral-200">{d.date}</h3>

                  {d.slots.length === 0 ? (
                    <p className="text-sm text-neutral-500">No slots.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {d.slots.map((s) => {
                        const disabled = s.status !== "available";

                        if (disabled) {
                          return (
                            <button
                              key={s.id}
                              className={`${baseBtn} ${unavailableBtn}`}
                              disabled
                              title={`Unavailable (${s.status})`}
                            >
                              Already booked
                            </button>
                          );
                        }

                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => goToBooking(s.starts_at)}
                            className={`${baseBtn} ${availableBtn}`}
                            title="Select slot"
                          >
                            {timeLabel(s.starts_at)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
