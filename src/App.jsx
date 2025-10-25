import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ControlPannel from './components/superAdmin/ControlPannel'
import Dashboard from './components/superAdmin/Dashboard'
import { HospitalManagement } from './components/superAdmin/HospitalManagement'
import { NewHospital } from './components/superAdmin/NewHospital'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return <BrowserRouter>

    <Routes>
      {/* */}
      <Route path='/' element={<ControlPannel></ControlPannel>} >
        <Route path='dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='hosptial-management' element={<HospitalManagement></HospitalManagement>}></Route>
        <Route path='new-hosptial' element={<NewHospital></NewHospital>}></Route>

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
