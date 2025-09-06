import * as React from 'react';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import SickSharpIcon from '@mui/icons-material/SickSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import '../index.css'
import Find_Doctors from './Elements/Find_Doctors';
import Symptom_checker from './Elements/Symptom_checker';
import Medical_reports from './Elements/Medical_reports';
import MyAppointments from './Elements/MyAppointments';
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

  const router = useDemoRouter('/doctors');

  const demoWindow = window !== undefined ? window() : undefined;
          {/* 
            kind: 'header',
            title: 'Animals',
          */}
  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={[

          {
            segment: 'doctors',
            title: <span className="text-lg font-semibold">Find Doctors</span>,
            icon: <PermIdentityIcon/>,
          },
          {
            segment: 'appointments',
            title:<span className="text-lg font-semibold">Appointments</span>,
            icon: <CalendarMonthSharpIcon />,
          },{
            segment: 'reports',
            title:<span className="text-lg font-semibold">Medical Reports</span>,
            icon: <DescriptionIcon />,
          },{
            segment: 'symptom_checker',
            title:<span className="text-lg font-semibold">Symptom Checker</span>,
            icon: <SickSharpIcon />,
          }
        ]}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        branding={{
            title: 'Patient Dashboard',   
             logo: <DescriptionIcon />,   
          }}
      >
        <DashboardLayout  >
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

export default PatientDashboard;