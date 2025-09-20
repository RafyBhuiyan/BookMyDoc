import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE = "http://localhost:8000";

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Download PDF function
  const downloadPDF = (prescriptionId) => {
    const token = localStorage.getItem("doctorToken");  // or "patientToken"
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const url = `/api/prescriptions/${prescriptionId}/pdf`;

    // Fetch the PDF file
    fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/pdf",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to generate PDF.");
        }
        return response.blob();
      })
      .then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `prescription-${prescriptionId}.pdf`; // Filename
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(fileURL);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF.");
      });
  };

  // Fetch prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("doctorToken");
        if (!token) {
          alert("Please log in first.");
          return;
        }

        const { data } = await apiClient.get(`/doctor/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPrescriptions(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="p-4 md:p-12 bg-neutral-950 min-h-full">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">Issued Prescriptions</h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 overflow-x-auto">
          <Table className="rounded-xl min-w-[500px]">
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead className="text-gray-200">Patient Name</TableHead>
                <TableHead className="text-gray-200">Issued Date</TableHead>
                <TableHead className="text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.length > 0 ? (
                prescriptions.map((rx) => (
                  <TableRow key={rx.p_id} className="group hover:bg-gray-800 transition-colors">
                    <TableCell className="text-gray-100 group-hover:text-neutral-200 font-semibold">
                      {rx.patient?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-gray-100 group-hover:text-neutral-200 font-semibold">
                      {rx.issued_date
                        ? new Date(rx.issued_date).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadPDF(rx.p_id)}  // Ensure we use the correct field here (e.g., rx.p_id or rx.id)
                          className="text-white hover:bg-gray-700"
                        >
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPrescription(rx)}
                          className="text-white hover:bg-gray-700"
                        >
                          Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-gray-400 text-center">
                    No prescriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Prescription Details Card */}
        {selectedPrescription && (
          <Card className="flex-shrink-0 w-full lg:w-96 bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Prescription Details</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-200 space-y-2">
              <p><strong>Patient:</strong> {selectedPrescription.patient?.name}</p>
              <p><strong>Issued Date:</strong> {selectedPrescription.issued_date}</p>
              <p><strong>Notes:</strong> {selectedPrescription.notes || "-"}</p>

              {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 && (
                <div>
                  <strong>Medicines:</strong>
                  <ul className="list-disc ml-6 mt-1">
                    {selectedPrescription.medicines.map((med, idx) => (
                      <li key={idx}>
                        {med.name} {med.dose && `- ${med.dose}`} {med.schedule && `(${med.schedule})`} {med.days ? `for ${med.days} days` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p><strong>Duration:</strong> {selectedPrescription.duration_days || "-"}</p>
              <p><strong>Refill Count:</strong> {selectedPrescription.refill_count || "-"}</p>
              <p><strong>Private:</strong> {selectedPrescription.is_private ? "Yes" : "No"}</p>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedPrescription(null)}
                className="bg-red-300 text-black hover:bg-red-400"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Prescription;
