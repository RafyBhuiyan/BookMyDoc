import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function DoctorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      localStorage.removeItem("patientToken");
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/doctor/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.status) {
        localStorage.setItem("doctorToken", data.token);
        navigate("/doctor");
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
        <h2 className="text-xl font-bold text-neutral-900">Doctor Login</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-900">
          Please enter your email and password to login.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md my-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <Label className ="text-black">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-black">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-900 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/doctor/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
