import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ControlPannel from './components/superAdmin/ControlPannel'
import Dashboard from './components/superAdmin/Dashboard'



function App() {

  return <BrowserRouter>

    <Routes>
      {/* */}
      <Route path='/' element={<ControlPannel></ControlPannel>} >

        <Route path='dashboard' element={<Dashboard></Dashboard>}></Route>

      </Route>
    </Routes>

  </BrowserRouter>
}

export default App
