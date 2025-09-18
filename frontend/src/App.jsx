import { Routes, Route } from "react-router-dom";
import Contact from "./Pages/Contact";
import { Box } from "@chakra-ui/react";
import Homepage from "./Pages/HomePage";
import DoctorDashboard from "./Doctors/Dashboard_Doc";
import PatientDashboard from "./Patients/Dashboard.jsx"
import DoctorLogin from "./Pages/Doctorlogin.jsx";
import DoctorRegister from "./Pages/DoctorRegister.jsx";
import Find_Doctors from "./Patients/Elements/Find_Doctors.jsx";
import DoctorSlots from "./Patients/Elements/DoctorSlots.jsx";
import SlotsBooking from "./Patients/Elements/SlotsBooking.jsx";
import PatientLogin from "./Pages/PatientLogin.jsx";
import PatientRegister from "./Pages/PatientRegister.jsx";
import MyAppointments from "./Patients/Elements/MyAppointments.jsx";

import AdminLogin from "./Pages/AdminLogin.jsx"
import AdminDashboard from "./Pages/AdminDashboard.jsx"

export default function App() {
  return (
    <Box minH={"100vh"}>
      <Routes>
       <Route path="/" element={<Homepage />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/doctor/login" element={<DoctorLogin />} />
       <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/user/login" element={<PatientLogin />} />
       <Route path="/user/register" element={<PatientRegister />} />
       <Route path="/Dashboard" element={<DoctorDashboard/>} />
       <Route path ='/user/Dashboard' element ={<PatientDashboard/>}/>
        <Route path="/doctors" element={<Find_Doctors />} />
         <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doctors/:id" element={<DoctorSlots />} />
        <Route path="/doctors/:id/book" element={<SlotsBooking/>} />
        <Route path="/user/appointments" element={<MyAppointments/>} />
         <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </Box>
  );
}
