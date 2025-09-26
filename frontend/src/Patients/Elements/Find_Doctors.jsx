"use client";
import React, { useEffect, useMemo, useState } from "react";
import ExpandableDoctorCard from "@/components/expandable-card-demo-standard";
const API = import.meta.env.VITE_API_BASE;
// Helper function to fetch JSON data using a relative path
async function getJSON(url, params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, v);
  });
  const full = `${url}${usp.toString() ? `?${usp.toString()}` : ""}`;

  const res = await fetch(full, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export default function Find_Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [raw, setRaw] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [availableOn, setAvailableOn] = useState(""); // YYYY-MM-DD

  // Normalizes various API response shapes into a consistent array
  function normalizeDoctorsPayload(payload) {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.doctors)) return payload.doctors;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload)) return payload;
    return [];
  }

  // Fetches and processes the doctor list from the API
  async function fetchDoctors() {
    setLoading(true);
    setErr("");
    try {
      const data = await getJSON(`${API}/doctors`, {
        search: search || "",
        specialization: specialization || "",
        city: city || "",
        available_on: availableOn || "",
        per_page: 100,
      });

      console.log("Raw API Response:", data); // For debugging
      setRaw(data);

      const list = normalizeDoctorsPayload(data);
      console.log("Normalized Doctor List:", list); // For debugging
      setDoctors(list);

    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to fetch doctors.");
      setRaw({ error: String(e) });
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch doctors on initial component mount
  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized calculations for unique filter options
  const uniqueSpecializations = useMemo(() => {
    const s = new Set(
      doctors.map((d) => (d.specialization || "").trim()).filter(Boolean)
    );
    return Array.from(s).sort();
  }, [doctors]);

  const uniqueCities = useMemo(() => {
    const s = new Set(
      doctors.map((d) => (d.city || d.address || d.clinic_address || "").trim()).filter(Boolean)
    );
    return Array.from(s).sort();
  }, [doctors]);

  // Event handlers
  function handleApplyFilters(e) {
    e?.preventDefault();
    fetchDoctors();
  }

  function handleReset() {
    setSearch("");
    setSpecialization("");
    setCity("");
    setAvailableOn("");
    fetchDoctors();
  }

  function onViewProfile(doctor) {
    alert(`View profile: ${doctor?.name || "Doctor"}`);
  }

  function onBook(doctor) {
    alert(`Book appointment with ${doctor?.name || "Doctor"}`);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto w-[min(1200px,92%)] py-8">
        <header className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#7d9dd2] to-[#3fc3b1] bg-clip-text text-transparent">
              Doctors
            </h1>
            <p className="text-white/70">Find and book the right specialist.</p>
            <p className="text-white/40 text-sm mt-1">
              {loading ? "Loading…" : ` `}
            </p>
          </div>
        </header>

        {/* Debug panel */}
        {showDebug && (
          <pre className="mb-6 max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/80">
            {JSON.stringify(raw, null, 2)}
          </pre>
        )}

        <form
          onSubmit={handleApplyFilters}
          className="mb-6 grid gap-3 items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        >
          {/* search */}
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none placeholder:text-white/60 focus:ring-2 focus:ring-white/20 sm:col-span-2 lg:col-span-2"
            placeholder="Search name/specialization/city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            aria-label="Search doctors"
          />

          {/* date */}
          <input
            type="date"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
            value={availableOn}
            onChange={(e) => setAvailableOn(e.target.value)}
            aria-label="Available on"
          />

          {/* actions */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex gap-2 w-full">
            <button
              type="submit"
              className="flex-1 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 disabled:opacity-50"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>

        {err && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {err}
          </div>
        )}

        {/* Grid of demo_standard cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <ExpandableDoctorCard
              key={doc.id || doc.email}
              doctor={doc}
              onViewProfile={onViewProfile}
              onBook={onBook}
            />
          ))}
        </div>

        {/* Empty state */}
        {!loading && doctors.length === 0 && !err && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            No doctors found. Try adjusting filters.
          </div>
        )}
      </section>
    </main>
  );
}
