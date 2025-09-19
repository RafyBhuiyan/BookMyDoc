// src/pages/PrescriptionForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const API_BASE = "http://127.0.0.1:8000/api"; // change if needed

export default function PrescriptionForm() {
  const { userId, appointmentId } = useParams();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [formData, setFormData] = useState({
    user_id: userId || "",
    appointment_id: appointmentId || "",
    issued_date: today,
    notes: "",
    duration_days: "",
    refill_count: "",
    is_private: false,
    medicines: [{ name: "", dose: "", schedule: "", days: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const meds = [...formData.medicines];
    meds[index][field] = value;
    setFormData((prev) => ({ ...prev, medicines: meds }));
  };

  const addMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", dose: "", schedule: "", days: "" }],
    }));
  };

  const removeMedicine = (index) => {
    const meds = [...formData.medicines];
    meds.splice(index, 1);
    setFormData((prev) => ({ ...prev, medicines: meds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("doctorToken"); // Sanctum token
      const res = await axios.post(`${API_BASE}/prescriptions`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Prescription created successfully ✅");
      navigate("/doctor/patients");
      //console.log("Created:", res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error creating prescription ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">New Prescription</CardTitle>
          <CardDescription className="text-gray-300">
            Issuing prescription 
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Hidden inputs for user_id & appointment_id */}
            <input type="hidden" name="user_id" value={formData.user_id} />
            <input type="hidden" name="appointment_id" value={formData.appointment_id} />

            <div>
              <Label htmlFor="issued_date" className="text-white">Issued Date</Label>
              <Input
                type="date"
                id="issued_date"
                name="issued_date"
                value={formData.issued_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-white">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes for the patient"
                className="text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration_days" className="text-white">Duration (days)</Label>
                <Input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <Label htmlFor="refill_count" className="text-white">Refill Count</Label>
                <Input
                  type="number"
                  id="refill_count"
                  name="refill_count"
                  value={formData.refill_count}
                  onChange={handleChange}
                  placeholder="e.g., 0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                id="is_private"
                name="is_private"
                checked={formData.is_private}
                onChange={handleChange}
              />
              <Label htmlFor="is_private" className="text-white">Private Prescription</Label>
            </div>

            {/* Medicines section */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">Medicines</Label>
              {formData.medicines.map((med, i) => (
                <div
                  key={i}
                  className="border p-2 rounded-md items-center flex gap-2"
                >
                  <Input
                    placeholder="Name"
                    value={med.name}
                    onChange={(e) => handleMedicineChange(i, "name", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Dose"
                    value={med.dose}
                    onChange={(e) => handleMedicineChange(i, "dose", e.target.value)}
                  />
                  <Input
                    placeholder="Schedule"
                    value={med.schedule}
                    onChange={(e) => handleMedicineChange(i, "schedule", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Days"
                    value={med.days}
                    onChange={(e) => handleMedicineChange(i, "days", e.target.value)}
                  />
                  {i > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeMedicine(i)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={addMedicine} variant="secondary" className="text-white hover:underline">
                + Add Medicine
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading} className="text-white bg-amber-500 hover:bg-amber-600">
              {loading ? "Saving..." : "Save Prescription"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md text-center">{message}</div>
      )}
    </div>
  );
}
