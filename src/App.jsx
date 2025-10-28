import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ControlPannel from './components/superAdmin/ControlPannel'
import Dashboard from './components/superAdmin/Dashboard'
import DoctorControlPannel from './components/doctor/ControlPannel'
import DoctorDashboard from './components/doctor/Dashboard'
import { HospitalManagement } from './components/superAdmin/HospitalManagement'
import { NewHospital } from './components/superAdmin/NewHospital'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { PatientRecords } from './components/superAdmin/PatientRecord'
import { Medication } from './components/doctor/Medication'
import FinalPrescription from './components/doctor/FinalPrescribition'





function App() {

  return <BrowserRouter>

    <Routes>
      {/* */}
      <Route path='/' element={<ControlPannel></ControlPannel>} >
        <Route path='dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='hosptial-management' element={<HospitalManagement></HospitalManagement>}></Route>
        <Route path='new-hosptial' element={<NewHospital></NewHospital>}></Route>
        <Route path='patient-record' element={<PatientRecords></PatientRecords>}></Route>
      </Route>
      <Route path='/final-prescription' element={<FinalPrescription />} ></Route>
      <Route path='/doctor' element={<DoctorControlPannel />} >
        <Route path='dashboard' element={<DoctorDashboard />}></Route>
        <Route path='medication' element={<Medication />}></Route>
        <Route path='patient-record' element={<PatientRecords></PatientRecords>}></Route>
      </Route>


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
