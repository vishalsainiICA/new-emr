import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import emrimg from '../../../../public/emr.png'
import "./ControlPannel.css"

const ControlPannel_Md = () => {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [collapsed, setcollapsed] = useState(false)
    const [isCollapse, setCollapse] = useState(false);
    const [logOut, setlogOut] = useState(false);
    const [blur, setblur] = useState(false);
    const navigate = useNavigate()

    const navLinks = [
        { name: 'Dashboard', icon: 'ri-dashboard-line', navigate: '/md/dashboard' },
        { name: 'Patients Records', icon: 'ri-group-line', navigate: '/md/patient-management' },
        { name: 'Departments', icon: 'ri-admin-line', navigate: '/md/admin-management' },
        { name: 'Hospital Info', icon: 'ri-building-line', navigate: '/md/hospital-management' },

    ]


    useEffect(() => {
        if (window.location.pathname == "/md") {
            // navigate("/md/dashboard")
            // setActiveTab("DashBoard")
        }
    })



    return (
        <div className="control-pannel">

            <div className={`side-bar ${collapsed ? "acitve" : ""}`}>
                <div className="collapse">
                    <i
                        onClick={() => setcollapsed(!collapsed)}
                        style={{
                            cursor: 'pointer',
                            display: 'block',
                            fontSize: '20px',

                        }} class="ri-menu-line"></i>
                </div>
                {!collapsed && (
                    <div className="side-bar-logo"

                        onClick={() => navigate("/super-admin/dashboard")}
                    >


                        <img src={emrimg} alt="emr" />
                        <span>
                            <h2>Dr. Parcha</h2>
                            <p>(Electronic Medical Record)</p>
                        </span>
                    </div>
                )}
                <hr />
                <div className="side-bar-links">
                    {navLinks.map((item, i) => {

                        return <div key={i}
                            onClick={() => navigate(item.navigate)}
                            className="side-bar-item">
                            <i className={item.icon}></i>
                            {!collapsed && (
                                <h5>{item.name}</h5>
                            )}
                        </div>
                    })}
                </div>


                <hr />
                <div
                    onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}
                    className="side-bar-logout ">
                    <i class="ri-logout-box-r-line"></i>
                    {!collapsed && (
                        <h5>LogOut</h5>
                    )}
                </div>

            </div>


            <div className="mainContent">
                <div className="super-admin-logo">
                    <div className="super-admin">
                        <h3> Dashboard</h3>
                        <p>Helthcare and Network</p>
                    </div>
                    <div className="super-name" onClick={() => setCollapse(!isCollapse)}>
                        <span className="logo">SA</span>
                        <div>
                            <h4>{"superAdmin?.name"}</h4>
                            <span style={{
                                fontSize: "12px"
                            }}>System Administrator</span>
                        </div>
                    </div>
                </div>
                <Outlet></Outlet>
            </div>

            <div className={logOut ? 'logout-page' : 'active'}>

                <div className="profile">
                    <span>Logout Confirmation</span>
                    <button className="common-btn" onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}>Back</button>
                </div>
                <div className="Logout-information">
                    <span>🚪Confirm Logout</span>
                    <br /> <br />
                    <p>Are you sure you want to logout from the Dashboard?</p>
                </div>
                <div className="log-btn">
                    <button className="main-button " onClick={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("role")
                        navigate("/login", { replace: true })
                    }}>Yes logout</button>
                    <button className="common-btn" onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}>Cancel</button>
                </div>

            </div>


        </div>
    )


}
export default ControlPannel_Md