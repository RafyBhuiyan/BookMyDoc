"use client";

import React, { useEffect, useMemo, useState } from "react";
import ExpandableDoctorCard from "@/components/expandable-card-demo-standard";

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://127.0.0.1:8000";

async function getJSON(url, params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, v);
  });
  const full = `${url}${usp.toString() ? `?${usp.toString()}` : ""}`;

  const res = await fetch(full, {
    method: "GET",
    headers: { "Accept": "application/json" },
    credentials: "omit", // change to "include" only if your API requires cookies
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

  function normalizeDoctorsPayload(payload) {
    // Try common Laravel/REST shapes in order:
    // 1) Laravel paginate: { data: [...] }
    if (Array.isArray(payload?.data)) return payload.data;

    // 2) Double-wrapped: { data: { data: [...] } }
    if (Array.isArray(payload?.data?.data)) return payload.data.data;

    // 3) Named collections
    if (Array.isArray(payload?.doctors)) return payload.doctors;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;

    // 4) Raw array
    if (Array.isArray(payload)) return payload;

    // 5) Nothing matched → empty
    return [];
  }

  async function fetchDoctors() {
    setLoading(true);
    setErr("");
    try {
      const data = await getJSON(`${API_BASE}/api/doctors`, {
        search: search || "",
        specialization: specialization || "",
        city: city || "",
        available_on: availableOn || "",
        per_page: 100,
      });

      setRaw(data); // keep raw for debugging
      const list = normalizeDoctorsPayload(data);
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

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // CTA handlers for each card
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
              {loading ? "Loading…" : `Found ${doctors.length} doctor(s)`}
            </p>
          </div>

          {/* Debug toggle */}
          <button
            type="button"
            onClick={() => setShowDebug((s) => !s)}
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 text-sm"
          >
            {showDebug ? "Hide" : "Show"} debug
          </button>
        </header>

        {/* Debug panel */}
        {showDebug && (
          <pre className="mb-6 max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/80">
            {JSON.stringify(raw, null, 2)}
          </pre>
        )}

        {/* Filters */}
        <form
          onSubmit={handleApplyFilters}
          className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-5"
        >
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none placeholder:text-white/50"
            placeholder="Search name/specialization/city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All specializations</option>
            {uniqueSpecializations.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All cities</option>
            {uniqueCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
            value={availableOn}
            onChange={(e) => setAvailableOn(e.target.value)}
          />

          <div className="flex gap-2 ">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-white/90 px-3 py-2 font-medium text-white hover:bg-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10"
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
