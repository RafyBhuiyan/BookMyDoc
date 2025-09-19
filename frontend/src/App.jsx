import { Routes, Route,Navigate } from "react-router-dom";
import Contact from "./Pages/Contact";
import { Box } from "@chakra-ui/react";
import Homepage from "./Pages/HomePage";
import DoctorDashboard from "./Doctors/Dashboard_Doc";
import PatientDashboard from "./Patients/Dashboard.jsx";
import DoctorLogin from "./Pages/Doctorlogin.jsx";
import DoctorRegister from "./Pages/DoctorRegister.jsx";
import Find_Doctors from "./Patients/Elements/Find_Doctors.jsx";
import DoctorSlots from "./Patients/Elements/DoctorSlots.jsx";
import SlotsBooking from "./Patients/Elements/SlotsBooking.jsx";
import PatientLogin from "./Pages/PatientLogin.jsx";
import PatientRegister from "./Pages/PatientRegister.jsx";
import MyAppointments from "./Patients/Elements/MyAppointments.jsx";

import PrivateRoute from "./PrivateRoute"; 
import PatientPage from "./Doctors/Patient";
import PrescriptionPage from "./Doctors/prescription";
import AppointmentPage from "./Doctors/appoinment";

import PrescriptionForm from "./Doctors/CreatePrescription.jsx"


import AdminLogin from "./Pages/AdminLogin.jsx"
import AdminDashboard from "./Pages/AdminDashboard.jsx"
import MyPrescriptions from "./Patients/Elements/MyPrescription";


export default function App() {
  //        <Route path="/user/appointments" element={<PrivateRoute element={<MyAppointments />} allowedRole="patient" />} />
  //        <Route path="/doctors" element={<PrivateRoute element={<Find_Doctors />} allowedRole="patient" />} />
  return (
    <Box minH={"100vh"}>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/user/login" element={<PatientLogin />} />
        <Route path="/user/register" element={<PatientRegister />} />
        <Route 
          path="/doctor" 
          element={<PrivateRoute element={<DoctorDashboard />} allowedRole="doctor" />}>
            <Route index element={<Navigate to="patients" replace />} />
            <Route path="patients" element={<PatientPage />} />
            <Route path="prescription" element={<PrescriptionPage />} />
            <Route path="appointment" element={<AppointmentPage />} />
             <Route
               path="prescription/:userId/:appointmentId"
               element={<PrescriptionForm />}
               />
          </Route>
        
        <Route 
          path="/user" 
          element={<PrivateRoute element={<PatientDashboard />} allowedRole="patient" />} >
            <Route index element={<Navigate to ="doctors" replace />} />
            <Route path="doctors" element={<Find_Doctors  />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="prescription" element={<MyPrescriptions />} />
          </Route>
        


        <Route path="/doctors/:id" element={<PrivateRoute element={<DoctorSlots />} allowedRole="patient" />} />
        <Route path="/doctors/:id/book" element={<PrivateRoute element={<SlotsBooking />} allowedRole="patient" />} />
  

         <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doctors/:id" element={<DoctorSlots />} />
        <Route path="/doctors/:id/book" element={<SlotsBooking/>} />
        <Route path="/user/appointments" element={<MyAppointments/>} />
         <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </Box>
  );
}
