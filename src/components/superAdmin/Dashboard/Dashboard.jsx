import { superAdminApi } from "../../../auth";
import { Circles, Grid } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './Dashboard.css'
import { toast } from "react-toastify";

const Dashboard = () => {

    const navigate = useNavigate()

    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCollapse, setCollapse] = useState(false);
    const [isEditprofile, setEditprofile] = useState(false);
    const [changePassword, setChangePassword] = useState(false)
    const [blur, setblur] = useState(false);
    const [logOut, setlogOut] = useState(false);
    // const [isCollapse, setCollapse] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [error, setError] = useState(null);
    const [metrices, setmetrices] = useState(null);
    const [filterHospital, setFilterHospital] = useState([]);
    const [superAdmin, setSuperAdmin] = useState(null);
    const [password, setpassword] = useState({
        old: "",
        new: ""
    })

    const handleChange = (key, value) => {
        setSuperAdmin((prev) => ({
            ...prev,
            [key]: value
        }))
    }


    const getMetricValue = (name) => {
        return metrices?.find((m) => m.key === name)?.value ?? 0;
    };

    const filter = (value) => {

        const search = value.toLowerCase().trim();

        // Empty input → reset full list
        if (!search) {
            setFilterHospital(data);
            return; // important
        }

        // Filter by name
        const result = data.filter((hos) =>
            hos.name.toLowerCase().startsWith(search)
        );

        setFilterHospital(result);
    };



    useEffect(() => {
        const fetchHospital = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.getHosptialMetrices();
                if (res.status === 200) {
                    setData(res.data.data?.TopPerformanceHospital || []);
                    setmetrices(res.data?.data?.metrices)
                    setFilterHospital(res.data.data?.TopPerformanceHospital || []);
                }
                else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);
                setError({ error: err.response?.data?.message || "Internal Server Error" });
            } finally {
                setIsProcessing(false);
            }
        };
        const fetchProfile = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.fetchProfile();
                if (res.status === 200) {
                    setSuperAdmin(res.data?.data)
                } else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);
                setError({ error: err.response?.data?.message || "Internal Server Error" });
                navigate("/login")
            } finally {
                setIsProcessing(false);
            }
        };
        fetchProfile()
        fetchHospital();
    }, [refresh]);

    const handleeditProfile = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const formdata = new FormData();
            formdata.append("name", superAdmin?.name);
            formdata.append("email", superAdmin?.email);
            formdata.append("contact", superAdmin?.contact);

            //Only add password fields if user actually entered something
            if (password.old.trim() !== "" && password.new.trim() !== "") {
                formdata.append("oldPassword", password.old);
                formdata.append("newPassword", password.new);
            }

            const res = await superAdminApi.ediProfile(formdata);

            if (res.status === 200) {
                setSuperAdmin(res.data?.data);
                toast.success("Profile Updated");

                // close edit section
                setEditprofile(false);
                setblur(false);
                setCollapse(false);
                setpassword({ old: '', new: '' });


            } else {
                setError({ profile: res.data?.message || "Something went wrong" });
            }

        } catch (err) {
            console.log(err);
            setError({ profile: err.response?.data?.message || "Internal Server Error" });
        } finally {
            setrefresh((prev) => !prev)
            setIsProcessing(false);
        }
    };


    return (
        <div className="">
            <div className="super-admin-logo">
                <div className="super-admin">
                    <h3>Super Admin Dashboard</h3>
                    <p>Helthcare and Network</p>
                </div>
                <div className="super-name" onClick={() => setCollapse(!isCollapse)}>
                    <span className="logo">SA</span>
                    <div>
                        <h4>Welcome back,{superAdmin?.name}</h4>
                        <span style={{
                            fontSize: "12px"
                        }}>System Administrator</span>
                    </div>
                </div>
            </div>
            {/* Hospital-card-list */}
            <div className="hospital-card-list">

                {/* Total Hospital */}
                <div onClick={() => navigate("/super-admin/hospital-management")} id="total-hospital" className="card-list">
                    <div className="card-name">
                        <span>Total Hospital</span>
                        <p style={{ fontSize: "20px" }}>🏥</p>
                    </div>
                    <div>
                        <h2>{getMetricValue("Total Hospital")}</h2>
                        {/* <p>↑ 8% from last quarter</p> */}
                    </div>
                </div>

                {/* Total Patients */}
                <div onClick={() => navigate("/super-admin/patient-management")} id="total-patient" className="card-list">
                    <div className="card-name">
                        <span>Total Patients</span>
                        <p style={{ fontSize: "20px" }}>👥</p>
                    </div>
                    <div>
                        <h2>{Number(getMetricValue("Total MalePatient")) + Number(getMetricValue("Total FemalePatient"))}</h2>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}> <p>Male:</p> <h4>{Number(getMetricValue("Total MalePatient"))}</h4> <p>Female:</p><h4> {Number(getMetricValue("Total FemalePatient"))}</h4>
                        </div>
                    </div>
                </div>

                {/* Total Prescription */}
                <div onClick={() => navigate("/super-admin/patient-management", { state: { status: "rx-done" } })} id="total-prescription" className="card-list">
                    <div className="card-name">
                        <span>Total Prescriptions</span>
                        <p style={{ fontSize: "20px" }}>💊</p>
                    </div>
                    <div>
                        <h2>{getMetricValue("Total Prescbrition")}</h2>
                        {/* <p>↑ This month processed</p> */}
                    </div>
                </div>

                {/* Total Revenue */}
                <div id="total-revenue" className="card-list">
                    <div className="card-name">
                        <span>Total Revenue</span>
                        <p style={{ fontSize: "20px" }}>💰</p>
                    </div>
                    <div>
                        <h2>₹{getMetricValue("Total Revenue")}</h2>
                        {/* <p>↑ 22% monthly revenue</p> */}
                    </div>
                </div>

            </div>

            {/* Hospital-performance and Networkoverview */}
            <div className="Hospital-perfo-and-Network">

                <div className="hospital-performance">
                    <div className="hospital-heading">
                        <h4 style={{
                            width: '100%'
                        }}>Hopital Performance</h4>
                        <input type="search" placeholder="type name..." onChange={(e) => filter(e.target.value)} />
                    </div>
                    <div >
                        {isProcessing && (
                            <span style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                padding: '50px 0'
                            }}>
                                <Circles height="40" width="40" color="#4f46e5" ariaLabel="loading" />
                                <br />Loading...
                            </span>
                        )}

                        {error && (
                            <h4 style={{
                                color: 'red',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '50px 0'
                            }}>{error?.error}</h4>
                        )}

                        {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length > 0 && (
                            <div style={{

                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '20px',
                                // minHeight: '500px'
                            }}>
                                {filterHospital.map((hos, i) => (
                                    <div onDoubleClick={() => navigate("/super-admin/view-hospital", { state: { hospital: hos } })} key={i} className="hospital-name">
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <span className="logo">{hos?.name?.slice(0, 2).toUpperCase()}</span>
                                            <div>
                                                <h4>{hos?.name}</h4>
                                                <span style={{
                                                    fontSize: "12px"
                                                }}>ID: H-00{i + 1} • Schemes: <a style={{
                                                    color: "blue"
                                                }}>{hos?.patientCategories?.join(",")}</a>  • Md: Dr.{hos?.medicalDirector?.name}</span>
                                            </div>
                                        </div>
                                        <p style={{
                                            width: '120px',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }} >Revenue: ₹{hos?.totalRevenue}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length === 0 && (
                            <p
                                style={{ textAlign: 'center', padding: '50px 0' }}
                            >No hospitals found</p>
                        )}
                    </div>


                </div>
                {/* Network Overview */}
                <div className="network-overview">
                    <h4>Network Overview</h4>

                    {/* Active Hospital */}
                    <div className="Network-card">
                        <span>Active Hospital</span>
                        <h4>{getMetricValue("Total Hospital")} Facilities</h4>
                        <p>All systems operational</p>
                    </div>

                    {/* Patient Load */}
                    <div className="Network-card">
                        <span>Patient Load</span>
                        <h4>{Number(getMetricValue("Total MalePatient")) + Number(getMetricValue("Total FemalePatient"))} Total</h4>
                        <p>15% increase this quarter</p>
                    </div>

                    {/* Revenue Stream */}
                    <div className="Network-card">
                        <span>Today Revenue</span>
                        <h4>₹{getMetricValue("Total Revenue")}</h4>
                        {/* <p>22% growth rate</p>  <-- If you want to hide growth line */}
                    </div>

                    {/* System Status (Static: backend me nahi aata) */}
                    <div className="Network-card">
                        <span>System Status</span>
                        <h4>99.8% Uptime</h4>
                        <p>Excellent performance</p>
                    </div>

                </div>

            </div>

            {/*  system-administrator-profile*/}
            <div className={isCollapse ? "system-administrator-profile" : ("active")}>
                <div className="profile">
                    <span>Profile</span>
                    <button className="common-btn" onClick={() => setCollapse(!isCollapse)}>Back</button>
                </div>
                <hr />

                <div className="profile-logo">
                    <span className="logo">SA</span>
                    <span>Super Administrator</span>
                    <p></p>
                </div>
                <hr />

                <div className="admin-detail">
                    <div>
                        <p>Email</p>
                        <span>{superAdmin?.email}</span>
                    </div>
                    <hr />
                    <div>
                        <p>Phone</p>
                        <span>{superAdmin?.contact}</span>
                    </div>
                    <hr />

                    <div>
                        <p>Department</p>
                        <span>System Administration</span>
                    </div>
                    <hr />

                    <div>
                        <p>Experience</p>
                        <span>20+ years</span>
                    </div>
                    <hr />

                    <div>
                        <p>Last Login</p>
                        <span>{superAdmin?.createdAt}</span>
                    </div>
                    <hr />

                    <div>
                        <p>Access Level</p>
                        <span>Full System Access</span>
                    </div>
                    <hr />

                    <div>
                        <p>Hospitals</p>
                        <span>{getMetricValue("Total Hospital")}</span>
                    </div>
                    <hr />

                    <div>
                        <p>Total Patients</p>
                        <span>{getMetricValue("Total Patient")}</span>
                    </div>
                    <hr />
                    {/* 
                    <div>
                        <p>Administrators</p>
                        <span>10 active</span>
                    </div>
                    <hr /> */}

                    <div>
                        <p>System Status</p>
                        <span>All Systems Operational</span>
                    </div>
                    <hr />

                </div>

                <div className="acount-setting">
                    <button className="main-button " onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse) }}>Edit profile</button>
                    <button className="main-button " onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}>Logout</button>
                </div>
                <hr />

            </div>

            {/* Edit-Profile */}

            {/* <div className="edit-profile"> */}
            <div className={isEditprofile ? "edit-profile" : "active"}>

                <div className="editCard">
                    <div style={{
                        display: 'flex',
                        justifyContent: "space-between"
                    }}>

                        <span>Edit Profile</span>
                        <button className="common-btn" onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse); setChangePassword(false) }}>Back</button>

                    </div>

                    <div className="edit-detail">
                        <label htmlFor="User Name">Name    <input type="text" onChange={(e) => handleChange("name", e.target.value)} value={superAdmin?.name} /></label>

                        <label htmlFor="Email">Email     <input type="email" onChange={(e) => handleChange("email", e.target.value)} value={superAdmin?.email} /></label>

                        <label htmlFor="Phone">Phone
                            <input type="phone" onChange={(e) => handleChange("contact", e.target.value)} value={superAdmin?.contact} />
                        </label>
                    </div>
                    <br />
                    {changePassword == false && (

                        <label htmlFor="">
                            <button className="main-button" onClick={() => setChangePassword(true)}>Change Password</button>
                        </label>

                    )}

                    {

                        changePassword == true && (
                            <>

                                <label htmlFor="oldpassword">Old Password  <input value={password?.old} type="password" onChange={(e) =>
                                    setpassword(prev => ({
                                        ...prev,
                                        old: e.target.value
                                    }))
                                }
                                /></label>
                                <label htmlFor="newpassword">New Password    <input value={password?.new} onChange={(e) =>
                                    setpassword(prev => ({
                                        ...prev,
                                        new: e.target.value
                                    }))
                                }
                                    type="password" /></label>

                            </>

                        )
                    }
                    {error?.profile && (<p style={{ color: 'red' }}>Error :{error?.profile}</p>)}

                    <div className="final-process">
                        <button className="common-btn" disabled={isProcessing} onClick={handleeditProfile}>{`${isProcessing ? <Circles height="40" width="40" color="#4f46e5" ariaLabel="loading" /> : "Save Profile"}`}</button>
                        <button className="main-button" disabled={isProcessing} onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse); setChangePassword(false) }}>Cancel</button>
                    </div>
                </div>

            </div>

            {/* Logout page */}

            <div className={logOut ? 'logout-page' : 'active'}>

                <div className="profile">
                    <span>Logout Confirmation</span>
                    <button className="common-btn" onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}>Back</button>
                </div>
                <div className="Logout-information">
                    <span>🚪Confirm Logout</span>
                    <br /> <br />
                    <p>Are you sure you want to logout from the Super Admin Dashboard?</p>
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

        </div >
        //  </div>

    );
}

export default Dashboard;
