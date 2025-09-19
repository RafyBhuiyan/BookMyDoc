import React from "react";
import Medical_reports from "../Components/prescriptions";

export default function PrescriptionPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <Medical_reports user={user} />
    </div>
  );
}