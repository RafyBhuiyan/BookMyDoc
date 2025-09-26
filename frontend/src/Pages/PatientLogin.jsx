import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE;

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      localStorage.removeItem("doctorToken");
      
      const { data } = await axios.post(
        `${API}/user/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.status) {
        localStorage.setItem("patientToken", data.token);
        navigate("/user");
      } else {
        setError(data.message || "Login failed, please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-6 md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-neutral-900 ">
         Patient Login
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-700">
          Please enter your credentials to access your account.
        </p>

        {error && (
          <div className="bg-red-200 text-red-800 px-4 py-2 rounded-md my-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-900"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full h-12 px-4 border border-black bg-white text-black rounded-md focus:border-black focus:ring-0 mt-0.5"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-900"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full h-12 px-4 border border-black bg-white text-black rounded-md focus:border-black focus:ring-0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-900 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/user/register")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
