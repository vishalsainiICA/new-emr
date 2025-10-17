import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"


export function ControlPannel() {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const navigate = useNavigate()

    const navLinks = [
        { name: 'DashBoard', icon: 'ri-dashboard-line', navigate: '/dashboard' },
        { name: 'Hospital Management', icon: 'ri-building-line', navigate: '/super-admin/dashboard' },
        { name: 'Patients Records', icon: 'ri-group-line', navigate: '/super-admin/dashboard' },
        { name: 'Admin Management', icon: 'ri-admin-line', navigate: '/super-admin/dashboard' },
    ]

    return <div className="controlPannel">
        <nav>
            <div style={{
                margin: '30px 0  0 15px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'white'
                }}>
                    <div>
                        <h3>EMR System</h3>
                        <p>Super Admin</p>
                    </div>
                    <i style={{
                        cursor: 'pointer',
                        marginLeft: '20px',
                        display: 'block',
                        fontSize: '20px',
                        color: 'white'

                    }} class="ri-layout-right-line"></i>
                </div>
                <hr />

                <div style={{
                    margin: ' 20px 0  0 15px',
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
                            }} className={`navDiv  ${activeTab === items.name ? "active" : ""}`} key={i}><span style={{ color: 'white' }}><i style={{
                                color: 'white'
                            }} className={items.icon}></i>{items.name}</span></div>

                        })}
                </div>


            </div>

        </nav >

        <div className="mainContent">
            <Outlet></Outlet>
        </div>

    </div >

}

export default ControlPannel