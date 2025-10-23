import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"


export function ControlPannel() {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [collapsed, setcollapsed] = useState(false)
    const navigate = useNavigate()

    const navLinks = [
        { name: 'DashBoard', icon: 'ri-dashboard-line', navigate: '/dashboard' },
        { name: 'Hospital Management', icon: 'ri-building-line', navigate: '/hosptial-management' },
        { name: 'Patients Records', icon: 'ri-group-line', navigate: '/super-admin/dashboard' },
        { name: 'Admin Management', icon: 'ri-admin-line', navigate: '/super-admin/dashboard' },
    ]

    return <div className="controlPannel">
        <div className={`navbar ${collapsed ? "collapse" : ""}`}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'white'
            }}>
                {!collapsed && (
                    <div>
                        <h3>EMR System</h3>
                        <p>Super Admin</p>
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
                        }} className={`navDiv  ${activeTab === items.name ? "active" : ""}`} key={i}>

                            <i className={`navIcon ${items.icon}`}></i>
                            <span className="navText">{items.name}</span>
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