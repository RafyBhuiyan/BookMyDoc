import React from "react";
import { Outlet } from "react-router-dom";
import SidebarDemo from "@/components/SidebarDemo";
import {
  FaUserMd,
  FaUserInjured,
  FaPills,
  FaPrescriptionBottle,
  FaFileMedical,
  FaCalendarCheck,
  FaClock,
} from "react-icons/fa";

export default function DoctorDashboard() {
  // Use absolute paths that live under /organizers
  const links = [
    { label: "Patients",     href: "/doctor/patients" ,icon: <FaUserInjured className="h-5 w-5 shrink-0 rounded" /> },
    { label: "Prescription",    href: "/doctor/prescription" , icon: <FaPrescriptionBottle className="h-5 w-5 shrink-0 rounded " /> },
    { label: "Appointment",  href: "/doctor/appointment", icon: <FaClock className="h-5 w-5 shrink-0 rounded " /> },

  ];

  const user = {
    label: "Manu Arora",
    href: "/organizers/me",
    icon: (
      <img
        src="https://assets.aceternity.com/manu.png"
        className="h-7 w-7 shrink-0 rounded-full"
        alt="Avatar"
      />
    ),
  };

  return (
    <SidebarDemo links={links}  user={user} defaultOpen={true}>
      {/* Nested routes will render here */}
      <Outlet />
    </SidebarDemo>
  );
}