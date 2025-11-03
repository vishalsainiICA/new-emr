import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { CircularAvatar } from "../utility/CicularAvatar"


export function ControlPannel() {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [collapsed, setcollapsed] = useState(false)
    const navigate = useNavigate()

    const navLinks = [
        { name: 'Dashboard', icon: 'ri-dashboard-line', navigate: '/pa/dashboard' },
        { name: 'Patients Records', icon: 'ri-group-line', navigate: '/pa/patient-record' },
    ]

    useEffect(() => {
        if (window.location.pathname == "/pa") {
            navigate("/pa/dashboard")
            setActiveTab("Dashboard")
        }
    })

    return <div className="controlPannel">
        <div className={`navbar ${collapsed ? "collapse" : ""}`}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'white'
            }}>
                {!collapsed && (
                    <div>
                        <h3>EMR ( Electronic Medical Record )</h3>
                    </div>
                )}
                <i
                    onClick={() => setcollapsed(!collapsed)}
                    style={{
                        cursor: 'pointer',
                        marginLeft: collapsed ? '' : "20px",

                        display: 'block',
                        fontSize: '20px',
                        color: 'white'

                    }} className={collapsed ? "ri-layout-left-line" : "ri-layout-right-line"}></i>
            </div>
            <hr style={{
                width: '100%',
                height: '2px',
                marginBottom: '20px',
            }} />

            <div style={{
                margin: collapsed ? "" : "20px 0  0 15px",
                display: 'flex',
                flexDirection: "column",
                gap: '30px',
                height: collapsed ? '' : "100%",

            }}>
                {
                    navLinks.map((items, i) => {
                        return <div onClick={() => {
                            setActiveTab(items.name)
                            navigate(items.navigate)
                        }} className={`navDiv  ${activeTab === items.name ? "active" : ""}`} key={i}>

                            <i className={`navIcon ${items.icon}`}></i>
                            <span className="navText">{items.name}</span>
                        </div>

                    })}

                {/* {!collapsed && (
                    <div style={{
                        height: '100%',
                        justifyContent: 'end',
                        alignItems: 'end',
                        alignContent: 'end',
                        marginBottom: '30px'
                    }}>
                        <hr style={{
                            width: '100%',
                            height: '2px',


                        }} />
                        <h3 style={{
                            color: 'white',
                        }}>Dr. Arun Mehta <i style={{ height: '50px', width: '50px' }} class="ri-logout-box-r-line"></i></h3>
                        <p style={{ color: 'white' }}>MBBS, MD (Internal Medicine)</p>


                    </div>
                )} */}

            </div>


        </div>

        <div className="mainContent">
            <Outlet></Outlet>
        </div>

    </div >

}

export default ControlPannel