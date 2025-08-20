import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen">
      <Button variant="contained" onClick={() => navigate("/Patient/Dashboard")}>
        Go to CRUD Page
      </Button>
    </div>
  );
}
