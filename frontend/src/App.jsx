import { Routes, Route } from "react-router-dom";
import Contact from "./Pages/Contact";
import { Box } from "@chakra-ui/react";
import Homepage from "./Pages/HomePage";
import DoctorDashboard from "./Doctors/Dashboard_Doc";

export default function App() {
  return (
    <Box minH={"100vh"}>
      <Routes>
       <Route path="/" element={<Homepage />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/Dashboard" element={<DoctorDashboard/>} />
      </Routes>
    </Box>
  );
}
