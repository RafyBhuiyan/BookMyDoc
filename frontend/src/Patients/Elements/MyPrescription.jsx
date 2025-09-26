import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, X } from "lucide-react";
import axios from "axios";
const API_BASE = "http://localhost:8000";

export default function MyPrescriptions() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptionsMap, setPrescriptionsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Fetch accepted appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("patientToken");
        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:8000/api/my/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const accepted = (res.data.appointments || []).filter(
          (a) => a.status === "accepted"
        );
        setAppointments(accepted);

        accepted.forEach(async (appt) => {
          try {
            const presRes = await axios.get(
              `http://localhost:8000/api/appointments/${appt.id}/prescriptions`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const list = presRes.data?.data ?? [];
            setPrescriptionsMap((prev) => ({
              ...prev,
              [appt.id]: list.length > 0 ? list[0] : null, // শুধু প্রথম prescription ধরলাম
            }));
          } catch (err) {
            console.error("Error fetching prescription:", err);
            setPrescriptionsMap((prev) => ({ ...prev, [appt.id]: null }));
          }
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Download/open PDF
  const downloadPdf = async (p_id) => {
    if (!p_id) return;
    setPdfLoading(true);
    try {
      const token = localStorage.getItem("patientToken");
      const res = await axios.get(`http://localhost:8000/api/prescriptions/${p_id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error(err);
      setError("Failed to download PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white px-4 py-8 flex flex-col lg:flex-row gap-6">
      {/* Table */}
      <div
        className={`flex-1 transition-all duration-300 ${
          selectedPrescription ? "lg:w-2/3" : "lg:w-full"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead className="text-white">Doctor</TableHead>
                <TableHead className="text-white">Specialization</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-gray-400 text-center">
                    No accepted appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.doctor?.name}</TableCell>
                    <TableCell>{appt.doctor?.specialization}</TableCell>
                    <TableCell>
                      {new Date(appt.starts_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {prescriptionsMap[appt.id] ? (
                        <Button
                          size="sm"
                          onClick={() =>
                            setSelectedPrescription(prescriptionsMap[appt.id])
                          }
                          className="bg-green-900"
                        >
                          Details
                        </Button>
                      ) : (
                        <span className="text-gray-400">
                          Wait for prescription
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Prescription Card */}
      {selectedPrescription && (
        <div className="flex-1 lg:w-1/3 fixed bottom-0 left-0 right-0 lg:static p-6 rounded-xl   backdrop-blur-md shadow-lg">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Prescription Details</CardTitle>
            </CardHeader>

            <CardContent className="text-gray-200 space-y-2">
              <p>
                <strong>Doctor:</strong> {selectedPrescription.doctor?.name}
              </p>
              <p>
                <strong>Issued Date:</strong>{" "}
                 {selectedPrescription.issued_date
                ? new Date(selectedPrescription.issued_date).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Notes:</strong> {selectedPrescription.notes || "-"}
              </p>

              {selectedPrescription.medicines?.length > 0 ? (
                <div>
                  <strong>Medicines:</strong>
                  <ul className="list-disc ml-6 mt-1">
                    {selectedPrescription.medicines.map((m, i) => (
                      <li key={i}>
                        {m.name} {m.dose ? `- ${m.dose}` : ""}{" "}
                        {m.schedule ? `(${m.schedule})` : ""}{" "}
                        {m.days ? `for ${m.days} days` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No medicines listed.</p>
              )}

              <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => downloadPdf(selectedPrescription.p_id)}
                    disabled={pdfLoading}
                    className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  >
                    {pdfLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />}
                    {pdfLoading ? "Loading..." : "Download"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setSelectedPrescription(null)}
                    className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
