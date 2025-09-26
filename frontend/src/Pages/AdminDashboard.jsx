import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // pending or approved
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
const API = import.meta.env.VITE_API_BASE;
  const fetchDoctors = async (type) => {
    setLoading(true);
    setError("");
    try {
      const url =
        type === "pending"
          ? "http://localhost:8000/api/admin/pending-doctors"
          : "http://localhost:8000/api/admin/approved-doctors";

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.status) {
        if (type === "pending") setPendingDoctors(data.pending_doctors);
        else setApprovedDoctors(data.approved_doctors);
      } else {
        setError("Failed to load doctors.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors("pending");
    fetchDoctors("approved");
  }, []);

  const approveDoctor = async (id) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/admin/approve-doctor/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status) {
        setPendingDoctors((prev) => prev.filter((doc) => doc.id !== id));
        setApprovedDoctors((prev) => [...prev, data.doctor]);
      } else {
        alert(data.message || "Failed to approve doctor.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/admin/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("adminToken");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Logout failed.");
    }
  };

  const doctors = activeTab === "pending" ? pendingDoctors : approvedDoctors;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Admin Dashboard
          </h2>
          <button
            className={`mb-3 p-3 w-full rounded-lg font-semibold text-left transition flex items-center justify-start ${
              activeTab === "pending"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-green-100"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Doctors
          </button>
          <button
            className={`mb-3 p-3 w-full rounded-lg font-semibold text-left transition flex items-center justify-start ${
              activeTab === "approved"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Doctors
          </button>
        </div>

        {/* Logout Button at Bottom */}
        <button
          className="mt-4 p-3 w-full rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {activeTab === "pending" ? "Pending Doctors" : "Approved Doctors"}
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading doctors...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : doctors.length === 0 ? (
          <p className="text-center text-gray-600">
            {activeTab === "pending"
              ? "No pending doctors."
              : "No approved doctors."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {doc.name}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Email:</span> {doc.email}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Specialization:</span>{" "}
                    {doc.specialization}
                  </p>
                </div>
                {activeTab === "pending" && (
                  <button
                    onClick={() => approveDoctor(doc.id)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Approve
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
