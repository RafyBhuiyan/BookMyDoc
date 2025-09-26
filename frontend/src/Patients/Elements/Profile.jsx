// src/Patients/Profile.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE;
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["male", "female", "other", "prefer_not_to_say"];

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    blood_group: "",
    emergency_contact: "",
    email: "",
  });

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const navigate = useNavigate();

  // ✅ Load profile only if token exists
  useEffect(() => {
    const token = localStorage.getItem("patientToken");
    if (!token) {
      navigate("/"); // redirect to home if no token
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(
          "http://localhost:8000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const p = data?.profile || {};
        setForm((f) => ({
          ...f,
          name: p.name ?? "",
          phone: p.phone ?? "",
          date_of_birth: p.date_of_birth ?? "",
          gender: p.gender ?? "",
          address: p.address ?? "",
          city: p.city ?? "",
          blood_group: p.blood_group ?? "",
          emergency_contact: p.emergency_contact ?? "",
          email: p.email ?? "",
        }));
      } catch (e) {
        if (e.response?.status === 401) {
          localStorage.removeItem("patientToken");
          navigate("/");
        } else {
          setError(e?.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ✅ Save changes
  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSaving(true);

    const token = localStorage.getItem("patientToken");
    if (!token) {
      navigate("/user/login");
      return;
    }

    try {
      const payload = {
        name: form.name || undefined,
        phone: form.phone || undefined,
        date_of_birth: form.date_of_birth || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        blood_group: form.blood_group || undefined,
        emergency_contact: form.emergency_contact || undefined,
      };

      const { data } = await axios.put(
        "http://localhost:8000/api/user/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(data?.message || "Profile updated successfully");
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("patientToken");
        navigate("/");
      } else {
        setError(e?.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-neutral-950 text-neutral-100">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Profile</h1>
            <p className="text-sm text-neutral-400">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
          {loading ? (
            <p className="text-neutral-300">Loading…</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Full name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="Your name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    value={form.email}
                    disabled
                    className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-neutral-400"
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth || ""}
                    max={today}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender || ""}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                  >
                    <option value="">Select</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Blood group */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Blood group
                  </label>
                  <select
                    name="blood_group"
                    value={form.blood_group || ""}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                  >
                    <option value="">Select</option>
                    {bloodGroups.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    City
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="City"
                  />
                </div>

                {/* Emergency contact */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Emergency contact
                  </label>
                  <input
                    name="emergency_contact"
                    value={form.emergency_contact}
                    onChange={onChange}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"
                    placeholder="Emergency phone"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-neutral-300 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    rows={3}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600 resize-y"
                    placeholder="Street, area, etc."
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-emerald-400 text-sm">{success}</p>}

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
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
