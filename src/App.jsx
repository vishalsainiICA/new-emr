import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css"
import Doc_Dashboard from "./components/Doctor/Dashboard/Dashboard"
import Su_Dashboard from "./components/superAdmin/Dashboard/Dashboard"
import HospitalManagement from './components/superAdmin/HospitalManagement/HospitalManagement';
import AdminManagement from './components/superAdmin/AdminManagement/AdminManagement';
import ViewHospital from './components/superAdmin/ViewHospital/ViewHospital';
import ControlPannel from './components/superAdmin/ControlPannel/ControlPannel';
import Medication from './components/Doctor/Medication/Medication';
import Pricription from './components/Doctor/Priscription/Priscription';
import { NewHospital } from './components/superAdmin/NewHospital/NewHospital';
import Patientregisteration from './components/superAdmin/PatientRegisteration/Patientregisteration';
import PatientRecords from './components/superAdmin/PatientRecord/PatientRecord';
import Pa_Dashboard from "./components/personalAssitant/Dashboard/Dashboard.jsx"
import InitialAssesment from './components/personalAssitant/InitialAssement/InitialAssement.jsx';


function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="register-patient" element={<Patientregisteration />} />


      <Route path="/super-admin" element={<ControlPannel></ControlPannel>}>
        <Route path="dashboard" element={<Su_Dashboard></Su_Dashboard>} />
        <Route path="hospital-management" element={<HospitalManagement />} />
        <Route path="patient-management" element={<PatientRecords />} />
        <Route path="view-hospital" element={<ViewHospital />} />
        <Route path="admin-management" element={<AdminManagement />} />
        <Route path="new-hospital" element={<NewHospital />} />
      </Route>

      <Route path="/doctor" element={<Doc_Dashboard></Doc_Dashboard>}> </Route>
      <Route path="/medication" element={<Medication></Medication>} />
      <Route path="/prescribtion" element={<Pricription />} />

      {/* personal Assitant */}
      <Route path="/pa" element={<Pa_Dashboard></Pa_Dashboard>}> </Route>
      <Route path="/intial-assement" element={<InitialAssesment></InitialAssesment>}> </Route>


    </Routes>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
    />


  </BrowserRouter>
}

export default App
