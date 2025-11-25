// import { useEffect, useState } from "react"
// import { Outlet, useNavigate } from "react-router-dom"
// import './ControlPannel.css'

// import emrimg from '../../../../public/emr.png'


// const ControlPannel = () => {
//     const [activeTab, setActiveTab] = useState('DashBoard')
//     const [collapsed, setcollapsed] = useState(false)
//     const navigate = useNavigate()

//     const navLinks = [
//         { name: 'Dashboard', icon: 'ri-dashboard-line', navigate: '/super-admin/dashboard' },
//         { name: 'Hospital Management', icon: 'ri-building-line', navigate: '/super-admin/hospital-management' },
//         { name: 'Patients Records', icon: 'ri-group-line', navigate: '/super-admin/patient-management' },
//         { name: 'Admin Management', icon: 'ri-admin-line', navigate: '/super-admin/admin-management' },
//     ]


//     useEffect(() => {
//         if (window.location.pathname == "/") {
//             navigate("/super-admin/dashboard")
//             setActiveTab("DashBoard")
//         }
//     })



//     return <div className="control-pannel">

//         <div className="side-bar">
//             <div className="collapse">
//                 <i
//                     onClick={() => setcollapsed(!collapsed)}
//                     style={{
//                         cursor: 'pointer',
//                         marginLeft: collapsed ? '' : "20px",
//                         display: 'block',
//                         fontSize: '20px',


//                     }} className={collapsed ? "ri-layout-left-line" : "ri-layout-right-line"}></i>
//             </div>
//             <div className="side-bar-logo">


//                 <img src={emrimg} alt="emr" />
//                 <span>
//                     <h2>Dr. Parcha</h2>
//                     <p>(Electronic Medical Record)</p>
//                 </span>
//             </div>
//             <hr />
//             <div className="side-bar-links">
//                 {navLinks.map((item, i) => {

//                     return <div key={i}
//                         onClick={() => navigate(item.navigate)}
//                         className="side-bar-item">
//                         <i className={item.icon}></i>
//                         <h5>{item.name}</h5>
//                     </div>
//                 })}
//             </div>


//         </div>


//         <div className="mainContent">
//             <Outlet></Outlet>
//         </div>



//     </div>


// }

// export default ControlPannel


import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import './ControlPannel.css'

import emrimg from '../../../../public/emr.png'


const ControlPannel = () => {
    const [activeTab, setActiveTab] = useState('DashBoard')
    const [collapsed, setcollapsed] = useState(false)
    const navigate = useNavigate()

    const navLinks = [
        { name: 'Dashboard', icon: 'ri-dashboard-line', navigate: '/super-admin/dashboard' },
        { name: 'Hospital Management', icon: 'ri-building-line', navigate: '/super-admin/hospital-management' },
        { name: 'Patients Records', icon: 'ri-group-line', navigate: '/super-admin/patient-management' },
        { name: 'Admin Management', icon: 'ri-admin-line', navigate: '/super-admin/admin-management' },
    ]

    useEffect(() => {
        if (window.location.pathname === "/") {
            navigate("/super-admin/dashboard")
            setActiveTab("DashBoard")
        }
    }, [navigate])


    return (
        <div className="control-pannel">

            {/* SIDEBAR */} 
            <div className={collapsed ? "side-bar collapsed" : "side-bar"}>
                
                <div className="collapse">
                    <i
                        onClick={() => setcollapsed(!collapsed)}
                        // style={{
                        //     cursor: 'pointer',
                        //     marginLeft: collapsed ? '' : "20px",
                        //     display: 'block',
                        //     fontSize: '20px'
                        // }}
                        className={collapsed ? "ri-layout-right-line" : "ri-layout-left-line"}
                    ></i>
                </div>

                <div className="side-bar-logo">
                    <img src={emrimg} alt="emr" />
                    <span>
                        <h2>Dr. Parcha</h2>
                        <p>(Electronic Medical Record)</p>
                    </span>
                </div>

                <hr />

                <div className="side-bar-links">
                    {navLinks.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(item.navigate)}
                            className="side-bar-item"
                        >
                            <i className={item.icon}></i>
                            <h5>{item.name}</h5>
                        </div>
                    ))}
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="mainContent">
                <Outlet />
            </div>

        </div>
    )
}

export default ControlPannel
