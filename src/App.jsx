import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
// import './Jaffar.css'
import ControlPannel from './components/superAdmin/ControlPannel'
import Dashboard from './components/superAdmin/Dashboard'
import DoctorControlPannel from './components/doctor/ControlPannel'
import DoctorDashboard from './components/doctor/Dashboard'
import PaDashboard from './components/personalAssitant/Dashboard'
import PaControlPannel from './components/personalAssitant/ControlPannel'
import { HospitalManagement } from './components/superAdmin/HospitalManagement'
import { NewHospital } from './components/superAdmin/NewHospital'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PatientRecords from './components/superAdmin/PatientRecord'
import Loginpage from './components/utility/Loginpage/Loginpage'
import PatientRecordsof_Doc from './components/doctor/PatientRecord'
import PatientRecordsof_Pa from './components/doctor/PatientRecord'
import NewPatientRegister from './components/personalAssitant/NewPatient'
import { Medication } from './components/doctor/Medication'
import FinalPrescription from './components/doctor/FinalPrescribition'
import { AdminManagement } from './components/superAdmin/AdminManagement'
import InitialAssesment from './components/personalAssitant/InitialAssement'
import { ViewHospital } from './components/superAdmin/ViewHospital'
import RegisterPatient from './components/RegisterPatient'
// import Priscription from './components/Priscription/Priscription'
import Patientregisteration from './components/PatientRegisteration/Patientregisteration'






function App() {

  return <BrowserRouter>

    <Routes>

      {/* */}
      <Route path='register' element={<RegisterPatient></RegisterPatient>}></Route>
       <Route path='/NewRegister' element={<Patientregisteration></Patientregisteration>}></Route>
      {/* <Route path='/Priscription' element={<Priscription></Priscription>}> </Route> */}
      <Route path='/Login' element={<Loginpage></Loginpage>}></Route>

      <Route path='/' element={<ControlPannel></ControlPannel>} >
        {/* <Route path='dashboard' element={<DoctorDashboard />}></Route> */}
        <Route path='dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='hosptial-management' element={<HospitalManagement></HospitalManagement>}></Route>
        <Route path='new-hosptial' element={<NewHospital></NewHospital>}></Route>
        <Route path='patient-record' element={<PatientRecords></PatientRecords>}></Route>
        <Route path='admin-record' element={<AdminManagement></AdminManagement>}></Route>
        <Route path='view-hospital' element={<ViewHospital></ViewHospital>}></Route>
      </Route>
      <Route path='/final-prescription' element={<FinalPrescription />} ></Route>
      <Route path='/doctor' element={<DoctorDashboard />} >
        {/* <Route path='dashboard' element={<DoctorDashboard />}></Route> */}
        <Route path='medication' element={<Medication />}></Route>
        <Route path='patient-record' element={<PatientRecordsof_Doc></PatientRecordsof_Doc>}></Route>
      </Route>

      <Route path='/pa' element={<PaControlPannel />} >
        <Route path='dashboard' element={<PaDashboard />}></Route>
        <Route path='patient-record' element={<PatientRecordsof_Pa></PatientRecordsof_Pa>}></Route>
        <Route path='new-patient' element={<NewPatientRegister></NewPatientRegister>}></Route>
        <Route path='inital-assement' element={<InitialAssesment></InitialAssesment>}></Route>
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
