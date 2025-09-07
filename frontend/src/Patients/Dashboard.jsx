import * as React from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; // Added Outlet
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import SickSharpIcon from '@mui/icons-material/SickSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import '../index.css';
import Find_Doctors from './Elements/Find_Doctors';
import Symptom_checker from './Elements/Symptom_checker';
import Medical_reports from './Elements/Medical_reports';
import MyAppointments from './Elements/MyAppointments';
import SidebarDemo from "@/components/SidebarDemo";
import {
  FaUserMd,
  FaUserInjured,
  FaPills,
  FaPrescriptionBottle,
  FaFileMedical,
  FaCalendarCheck,
  FaClock,
  FaSyringe,
} from "react-icons/fa";
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  let content;

  switch (pathname) {
    case '/doctors':
      content = <Find_Doctors />;
      break;
    case '/appointments':
      content = <MyAppointments />;
      break;
    case '/reports':
      content = <Medical_reports />;
      break;
    case '/symptom_checker':
      content = <Symptom_checker />;
      break;
    default:
      content = <Find_Doctors />;
  }
  return (
    <Box
      sx={{
        py: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function PatientDashboard(props) {
  const { window } = props;
  const navigate = useNavigate();

  // Check if patient is logged in
  const patientToken = localStorage.getItem("patientToken");

  if (!patientToken) {
    navigate("/"); // redirect if not logged in
    return null;
  }

  // fake user info (replace with real API/user state later)
  const user = {
    name: "John Doe",
    role: "patient",
  };

  const links = [
    { label: "Doctor List", href: "/user/doctors",icon: <FaUserMd className="h-5 w-5 shrink-0 rounded" /> },
    { label: "Appointments", href: "/user/appointments", icon: <FaCalendarCheck className="h-5 w-5 shrink-0 rounded" /> },
    { label: "Medical Report", href: "/user/reports", icon: <FaFileMedical className="h-5 w-5 shrink-0 rounded" /> },
    { label: "Symptom Checker", href: "/user/symptom_checker" , icon: <FaSyringe className="h-5 w-5 shrink-0 rounded" /> },
    { label: "Prescription", href: "/" , icon: <FaPrescriptionBottle className="h-5 w-5 shrink-0 rounded" /> },
  ];

  return (
    <SidebarDemo links={links} user={user} defaultOpen={true}>
      <Outlet />
    </SidebarDemo>
  );
}

export default PatientDashboard;
