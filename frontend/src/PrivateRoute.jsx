import { Route, Navigate } from "react-router-dom";
const PrivateRoute = ({ element, allowedRole, ...rest }) => {
  const doctorToken = localStorage.getItem("doctorToken");
  const patientToken = localStorage.getItem("patientToken");
  const userRole = doctorToken ? "doctor" : patientToken ? "patient" : null; 

  if (!doctorToken && !patientToken) {
    return <Navigate to="/" />; 
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/" />; 
  }

  return element;
};

export default PrivateRoute;
