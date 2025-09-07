import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DoctorCard } from "./DoctorCard";

const API_BASE = "http://127.0.0.1:8000";

export default function Find_Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [availableOn, setAvailableOn] = useState("");

  // debounce timeout
  const debounceTimeout = useRef(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`${API_BASE}/api/doctors`, {
        params: {
          search,
          specialization,
          city,
          available_on: availableOn,
          per_page: 100,
        },
      });
      setDoctors(data?.data || []);
    } catch (e) {
      console.error(e.response || e);
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initially
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch on filter changes with debounce
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchDoctors();
    }, 500); // wait 500ms after last input

    return () => clearTimeout(debounceTimeout.current);
  }, [search, specialization, city, availableOn]);

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white flex justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Find a Doctor</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={availableOn}
            onChange={(e) => setAvailableOn(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading && <p className="text-center">Loading doctors...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {doctors.length === 0 && !loading ? (
            <p className="col-span-full text-center text-gray-400">No doctors found.</p>
          ) : (
            doctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
          )}
        </div>
      </div>
    </div>
  );
}
