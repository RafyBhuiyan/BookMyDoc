"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function DoctorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
    city: "",
    clinic_address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/doctor/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.status) {
        setSuccess(data.message || "Registered successfully!");
        navigate("/doctor/login");
      } else {
        setError(data.message || "Registration failed, please try again.");
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
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-6 md:rounded-2xl md:p-8 ">
      
      <h2 className="text-xl font-bold text-neutral-800 ">
        Doctor Registration
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600">
        Please fill in your details to create your account.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-100 px-4 py-2 text-center text-sm font-medium text-red-700 ">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-md bg-green-100 px-4 py-2 text-center text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <form className="my-6 space-y-4 " onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="name" >Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dr. John Doe"
            type="text"
            required
            className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
          />
        </LabelInputContainer>
        <div className="flex">
        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@example.com"
            type="email"
            required
            className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+880123456789"
            type="text"
            required
            className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
          />
        </LabelInputContainer>
        </div>
        <LabelInputContainer>
          <Label htmlFor="specialization">Specialization</Label>
          <Input 
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Cardiologist"
            type="text"
            className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
            required
          />
        </LabelInputContainer>
        <div className="flex">
        <LabelInputContainer>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Dhaka"
            type="text"
            required
            className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="clinic_address">Clinic Address</Label>
          <Input
            id="clinic_address"
            name="clinic_address"
            value={formData.clinic_address}
            onChange={handleChange}
            placeholder="123 Clinic Road"
            type="text"
            required
            className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
          />
        </LabelInputContainer>
        </div>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
            required
            className="border border-black bg-white text-black placeholder-gray-500 focus:border-black focus:ring-0"
          />
        </LabelInputContainer>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "group/btn relative block h-11 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white transition hover:opacity-90",
            "dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900",
            loading ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          {loading ? "Registering..." : "Register"}
          <BottomGradient />
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{" "}
        <span
          className="cursor-pointer text-indigo-600 hover:underline dark:text-indigo-400"
          onClick={() => navigate("/doctor/login")}
        >
          Login
        </span>
      </p>
    </div>
    </div>
  );
}

// 🔹 Gradient hover effect for button
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

// 🔹 Wrapper for each input field
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
