import { useEffect, useState } from "react";
import axios from "axios";
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


const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // put these at file top (outside the component) so they’re reusable across calls
const API_BASE = (import.meta.env.VITE_API_ORIGIN || "http://localhost:8000/api").replace(/\/$/, "");
const apiUrl   = (p) => `${API_BASE}/${String(p).replace(/^\/+/, "")}`;

const downloadPDF = async (prescriptionId) => {
  const token = localStorage.getItem("doctorToken") || localStorage.getItem("patientToken");
  if (!token) return alert("Please log in first.");

  // Try likely backend paths — pick the first that returns a real PDF
  const tryPaths = [    `prescriptions/${prescriptionId}/pdf`   ];

  for (const path of tryPaths) {
    const url = apiUrl(path);
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
        responseType: "blob",
        validateStatus: () => true, // let us inspect non-2xx responses
      });

      const ct = (res.headers?.["content-type"] || "").toLowerCase();
      if (res.status < 400 && ct.includes("application/pdf")) {
        // success: save the PDF
        const blobUrl = window.URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `prescription-${prescriptionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
        return;
      }

      // Not a PDF: try to read the body as text/JSON to show a clear reason
      const text = await new Response(res.data).text().catch(() => "");
      let msg = `PDF download failed (${res.status})`;
      try {
        const json = text ? JSON.parse(text) : null;
        if (json?.message) msg = json.message;
      } catch (_) {}
      console.warn(`Failed on ${url}: ${msg}`);
      // continue loop and try next path
    } catch (e) {
      console.warn(`Request error on ${url}:`, e);
      // continue loop
    }
  }

  alert("Could not download PDF. Check the ID/route or see backend logs for details.");
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

        const { data } = await axios.get(apiUrl(`doctor/prescriptions`), {
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
