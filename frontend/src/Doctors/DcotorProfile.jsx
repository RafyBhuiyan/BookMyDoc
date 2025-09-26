// src/Doctors/DoctorProfile.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE;
const authHeaders = () => {
  const token = localStorage.getItem("doctorToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "", // read-only display
    phone: "",
    specialization: "",
    city: "",
    clinic_address: "",
    medical_school: "",
    medical_license_number: "",
    years_of_experience: "",
    bio: "",
  });

  const maxYear = useMemo(() => new Date().getFullYear() - 0, []);

  // Load profile
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(`http://localhost:8000/api/doctor/profile`, {
          headers: authHeaders(),
        });
        const d = data?.data || {};
        setForm({
          name: d.name ?? "",
          email: d.email ?? "",
          phone: d.phone ?? "",
          specialization: d.specialization ?? "",
          city: d.city ?? "",
          clinic_address: d.clinic_address ?? "",
          medical_school: d.medical_school ?? "",
          medical_license_number: d.medical_license_number ?? "",
          years_of_experience: d.years_of_experience ?? "",
          bio: d.bio ?? "",
        });
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

const onSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setSaving(true);

  try {
    // send only allowed fields (no email/password)
    const payload = {
      name: form.name || undefined,
      phone: form.phone || undefined,
      specialization: form.specialization || undefined,
      city: form.city || undefined,
      clinic_address: form.clinic_address || undefined,
      medical_school: form.medical_school || undefined,
      medical_license_number: form.medical_license_number || undefined,
      years_of_experience:
        form.years_of_experience !== "" ? Number(form.years_of_experience) : undefined,
      bio: form.bio || undefined,
    };

    const { data } = await axios.put(`http://localhost:8000/api/doctor/profile`, payload, {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });

    setSuccess(data?.message || "Profile updated successfully");
  } catch (e) {
    // Surface Laravel validation messages if present
    const v = e?.response?.data;
    if (v?.errors) {
      const first = Object.values(v.errors)[0];
      setError(Array.isArray(first) ? first[0] : String(first));
    } else {
      setError(v?.message || "Failed to update profile");
    }
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="min-h-dvh w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-neutral-400">Manage your professional information</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
          {loading ? (
            <p className="text-neutral-300">Loading…</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Full name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="Dr. Jane Doe"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Email</label>
                  <input
                    value={form.email}
                    disabled
                    className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Specialization</label>
                  <input
                    name="specialization"
                    value={form.specialization}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="Cardiology, Dermatology, etc."
                  />
                </div>

                {/* City */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="City"
                  />
                </div>

                {/* Clinic address */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Clinic address</label>
                  <input
                    name="clinic_address"
                    value={form.clinic_address}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="Street, area, etc."
                  />
                </div>

                {/* Medical school */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Medical school</label>
                  <input
                    name="medical_school"
                    value={form.medical_school}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="e.g., Dhaka Medical College"
                  />
                </div>

                {/* License number */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Medical license number</label>
                  <input
                    name="medical_license_number"
                    value={form.medical_license_number}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="License number"
                  />
                </div>

                {/* Years of experience */}
                <div>
                  <label className="mb-1 block text-sm text-neutral-300">Years of experience</label>
                  <input
                    type="number"
                    name="years_of_experience"
                    min={0}
                    max={80}
                    value={form.years_of_experience}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="e.g., 10"
                  />
                </div>

                {/* Bio (full width on md) */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm text-neutral-300">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={onChange}
                    rows={4}
                    className="w-full resize-y rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="Short professional summary"
                  />
                </div>
              </div>

              {/* Alerts */}
              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-emerald-400">{success}</p>}

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg border border-emerald-500 bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

