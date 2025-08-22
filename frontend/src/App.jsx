import { Routes, Route } from "react-router-dom";
import Contact from "./Pages/Contact";
import { Box } from "@chakra-ui/react";
import Homepage from "./Pages/HomePage";
import DoctorDashboard from "./Doctors/Dashboard_Doc";
import PatientDashboard from "./Patients/Dashboard.jsx"


export default function App() {
  return (
    <Box minH={"100vh"}>
      <Routes>
       <Route path="/" element={<Homepage />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/Dashboard" element={<DoctorDashboard/>} />
       <Route path ='/Patient/Dashboard' element ={<PatientDashboard/>}/>
      </Routes>
    </Box>
  );
}
