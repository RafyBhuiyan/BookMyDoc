import { React } from 'react'
import './index.css'
import ReactDOM from "react-dom/client"
import App from './App.jsx'
import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import PatientDashboard from "./Patients/Dashboard.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path ='/' element ={<App/>}/>
      <Route path ='/Patient/Dashboard' element ={<PatientDashboard/>}/>
    </Routes>
  </BrowserRouter>
)
