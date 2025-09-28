import { Routes, Route,Navigate } from "react-router-dom";
import Contact from "./pages/Contact";
import { Box } from "@chakra-ui/react";
import Homepage from "./pages/HomePage";
import DoctorDashboard from "./doctors/Dashboard_Doc";
import PatientDashboard from "./patients/Dashboard.jsx";
import DoctorLogin from "./pages/Doctorlogin.jsx";
import DoctorRegister from "./pages/DoctorRegister.jsx";
import Find_Doctors from "./patients/elements/Find_Doctors.jsx";
import DoctorSlots from "./patients/elements/DoctorSlots.jsx";
import SlotsBooking from "./patients/elements/SlotsBooking.jsx";
import PatientLogin from "./pages/PatientLogin.jsx";
import PatientRegister from "./pages/PatientRegister.jsx";
import MyAppointments from "./patients/elements/MyAppointments.jsx";

import PrivateRoute from "./PrivateRoute"; 
import PatientPage from "./doctors/Patient";
import PrescriptionPage from "./doctors/prescription";
import AppointmentPage from "./doctors/appoinment";

import PrescriptionForm from "./doctors/CreatePrescription.jsx"


import AdminLogin from "./pages/AdminLogin.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import MyPrescriptions from "./patients/elements/MyPrescription";
import Profile from "./patients/elements/Profile";
import DoctorProfile from "./doctors/DcotorProfile";


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
               element={<PrescriptionForm  />}
               />
           < Route path="profile" element={<DoctorProfile/>  }/>
          </Route>
        
        <Route 
          path="/user" 
          element={<PrivateRoute element={<PatientDashboard />} allowedRole="patient" />} >
            <Route index element={<Navigate to ="doctors" replace />} />
            <Route path="doctors" element={<Find_Doctors  />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="prescription" element={<MyPrescriptions />} />
            <Route path="profile" element={<Profile/>  }/>
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
