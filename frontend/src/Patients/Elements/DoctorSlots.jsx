import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

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
        const { data } = await axios.get(`${API_BASE}/api/doctors/${id}`);
        setDoctor(data?.data || data);
      } catch {
        /* ignore */ }
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
          const { data } = await axios.get(`${API_BASE}/api/doctors/${id}/slots`, { params: { date } });
          const list = (data?.slots || []).map((s) => ({
            id: s.starts_at,
            starts_at: s.starts_at,
            ends_at: s.ends_at || null,
            status: s.status || "available",
          }));
          setSlots(list);
        } else {
          const { data } = await axios.get(`${API_BASE}/api/doctors/${id}/slots/all`);
          
           const normalized = (data?.days || []).map((d) => {
    console.log(d.slots); // ✅ put logging here

    return {
      date: d.date,
      slots: (d.slots || []).map((s) => ({
        id: s.starts_at,
        starts_at: s.starts_at,
        ends_at: s.ends_at || null,
        status: s.status || "available",
      })),
    };
  });
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

  // Explicit Tailwind v4-safe button styles
  const baseBtn = "px-3 py-2 rounded-xl border text-sm";
  const availableBtn = "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900";
  const unavailableBtn = "bg-red-50 border-red-300 text-red-700 cursor-not-allowed";

  const timeLabel = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Book an Appointment</h1>
            <p className="text-sm text-gray-600">
              {doctor ? (doctor.name || doctor.full_name) : `Doctor #${id}`}
            </p>
          </div>
          <Link to="/doctor" className="text-blue-600 hover:underline">Back to Doctors</Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by date (optional)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={date}
              min={todayStr}
              onChange={onChangeDate}
              className="border rounded-lg px-3 py-2"
            />
            {date && (
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="px-3 py-2 rounded-lg border"
              >
                Clear
              </button>
            )}
            <div className="ml-auto flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-400 inline-block" /> Available
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-400 inline-block" /> Unavailable
              </span>
            </div>
          </div>
        </div>

        {loading && <p>Loading slots…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Per-date view */}
        {date && !loading && (
          <div className="bg-white rounded-2xl shadow p-4">
            {slots.length === 0 ? (
              <p className="text-sm text-gray-600">No slots for {date}.</p>
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
              <p className="text-sm text-gray-600">No upcoming slots.</p>
            ) : (
              days.map((d) => (
                <div key={d.date} className="bg-white rounded-2xl shadow p-4">
                  <h3 className="font-semibold mb-2">{d.date}</h3>
                  {d.slots.length === 0 ? (
                    <p className="text-sm text-gray-500">No slots.</p>
                  ) : (<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {d.slots.map((s) => {
               const disabled = s.status !== "available";
         console.log(s);

    if (s.status !== "available") {
      return (
        <button
          key={s.id}
          className="bg-red-500 text-white px-3 py-2 rounded-xl border text-sm cursor-not-allowed"
          disabled
        >
          Already booked
        </button>
      );
    } else {
      return (
        <button
          key={s.id}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && goToBooking(s.starts_at)}
          className={`px-3 py-2 rounded-xl border text-sm ${
            disabled
              ? "bg-red-50 border-red-300 text-red-700 cursor-not-allowed"
              : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900"
          }`}
          title={disabled ? `Unavailable (${s.status})` : "Select slot"}
        >
          {timeLabel(s.starts_at)}
        </button>
      );
    }
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
