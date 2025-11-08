import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export function ControlPannel() {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [collapsed, setcollapsed] = useState(false)
    const navigate = useNavigate()

    const navLinks = [
        { name: 'DashBoard', icon: 'ri-dashboard-line', navigate: '/dashboard' },
        { name: 'Hospital Management', icon: 'ri-building-line', navigate: '/hosptial-management' },
        { name: 'Patients Records', icon: 'ri-group-line', navigate: '/patient-record' },
        { name: 'Admin Management', icon: 'ri-admin-line', navigate: '/admin-record' },
    ]


    useEffect(() => {
        if (window.location.pathname == "/") {
            navigate("/dashboard")
            setActiveTab("Dashboard")
        }
    })

    return <div className="controlPannel">
        <div className={`navbar ${collapsed ? "collapse" : ""}`}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',


            }}>
                {!collapsed && (
                    <div className="navHeading">
                        <span className="logo">👑</span>
                        <h3>Dr Parcha</h3>
                    </div>
                )}

                <i
                    onClick={() => setcollapsed(!collapsed)}
                    style={{
                        cursor: 'pointer',
                        marginLeft: collapsed ? '' : "20px",
                        display: 'block',
                        fontSize: '20px',


                    }} className={collapsed ? "ri-layout-left-line" : "ri-layout-right-line"}></i>
            </div>
            <hr style={{
                height: '2px',
                marginBottom: '20px',
            }} />

            <div style={{
                margin: collapsed ? "" : "20px 0  0 15px",
                display: 'flex',
                flexDirection: "column",
                gap: '30px',
                height: '450px'
            }}>
                {
                    navLinks.map((items, i) => {
                        return <div onClick={() => {
                            setActiveTab(items.name)
                            navigate(items.navigate)
                        }} className={`navDiv hover ${activeTab === items.name ? "active" : ""}`} key={i}>

                            <i className={`navIcon ${items.icon}`}></i>
                            <h5 className="navText">{items.name}</h5>
                        </div>

                    })}
            </div>


        </div>

        <div className="mainContent">
            <Outlet></Outlet>
        </div>

    </div >

}

export default ControlPannel