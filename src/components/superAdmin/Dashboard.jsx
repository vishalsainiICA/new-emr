import { superAdminApi } from "../../auth";
import { Circles, Grid } from 'react-loader-spinner';
import { useEffect, useState } from "react";

export function Dashboard() {

    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCollapse, setCollapse] = useState(false);
    const [isHide, setisHide] = useState(false);
    const [error, setError] = useState(null);
    const [filterHospital, setFilterHospital] = useState([]);

    useEffect(() => {
        const fetchHospital = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.getHosptialMetrices();
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterHospital(res.data.data?.TopPerformanceHospital || []);
                } else {
                    setError(res.data?.message || "Something went wrong");
                }
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || "Internal Server Error");
            } finally {
                setIsProcessing(false);
            }
        };

        fetchHospital();
    }, []);

    const handlonclick = () => {
        if (!isCollapse) {
            setCollapse(true);
        }
        else {
            setCollapse(false)
        }
    }


    return (
        // <div className="dashboard">
        //     <h2>Dashboard</h2>

        //     { /* metrics cards */}

        //     <div className="dashbaordcardList" style={{ display: 'flex', gap: '10px' }}>
        //         {data?.metrices?.map((obj, index) => (
        //             <div key={index}
        //                 className="card"
        //             >
        //                 <span style={{ display: 'flex', gap: '20px' }}>
        //                     <h3>{obj?.key}</h3>
        //                     <span style={{
        //                         backgroundColor: 'lightblue',
        //                         padding: '10px',
        //                         borderRadius: '10px'
        //                     }}>
        //                         <i className="ri-group-line"></i>
        //                     </span>
        //                 </span>
        //                 <h2>
        //                     {typeof obj?.value === "object"
        //                         ? JSON.stringify(obj.value)
        //                         : obj?.value ?? "N/A"}
        //                 </h2>

        //             </div>
        //         ))}
        //     </div>

        //     {/* hospital performance */}
        //     <div className="hospitalperformance" style={{
        //         backgroundColor: 'white'
        //     }}>
        //         <h3>Hospital Performance</h3>

        //         {isProcessing && (
        //             <span style={{
        //                 display: 'flex',
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //                 flexDirection: 'column',
        //                 padding: '50px 0'
        //             }}>
        //                 <Circles height="40" width="40" color="#4f46e5" ariaLabel="loading" />
        //                 <br />Loading...
        //             </span>
        //         )}

        //         {error && (
        //             <h4 style={{
        //                 color: 'red',
        //                 display: 'flex',
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //                 padding: '50px 0'
        //             }}>{error}</h4>
        //         )}

        //         {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length > 0 && (
        //             <div style={{

        //                 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        //                 gap: '20px',
        //                 marginTop: '20px',
        //                 // minHeight: '500px'
        //             }}>
        //                 {filterHospital.map((hos, i) => (
        //                     <div key={i}
        //                         style={{
        //                             display: 'flex',
        //                             justifyContent: 'space-between',
        //                             width: '80%',
        //                             height: '75px',
        //                             backgroundColor: 'white',
        //                             border: '1px solid lightgray',
        //                             padding: '15px 15px 15px 30px',
        //                             borderRadius: '10px',
        //                             margin: '0 0 10px 10px',
        //                             boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        //                             cursor: 'pointer'
        //                         }}>
        //                         <div

        //                             style={{

        //                                 padding: "10px",
        //                                 display: "flex",
        //                                 alignItems: "center",
        //                                 gap: "20px" // space between items
        //                             }}
        //                         >
        //                             <span style={{ fontSize: '18px', fontFamily: 'cursive' }}>{i + 1}.</span>
        //                             <div>
        //                                 <h4 style={{ margin: 0 }}>{hos.name || "Unnamed Hospital"}</h4>
        //                                 <p style={{ margin: 0 }}>{`${hos.city},${hos.state}`}</p>
        //                             </div>

        //                         </div>

        //                         <div>
        //                             <h4>{hos.totalRevenue || "Unnamed Hospital"}</h4>
        //                             <p>{`patients: 0`}</p>
        //                         </div>

        //                     </div>
        //                 ))}
        //             </div>
        //         )}

        //         {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length === 0 && (
        //             <p
        //                 style={{ textAlign: 'center', padding: '50px 0' }}
        //             >No hospitals found</p>
        //         )}
        //     </div>
        // </div>
        //  <div className="Deshbord-main-container">
        <div className="deshbord-panel">
            <div className="super-admin-logo">
                <div className="super-admin">
                    <h2>Super Admin Dashboard</h2>
                    <p>Helthcare and Network</p>
                </div>
                <div className="super-name" onClick={handlonclick}>
                    <span className="logo">SA</span>
                    <div>
                        <h5>Welcome back, Super Admin</h5>
                        <span style={{
                            fontSize: "12px"
                        }}>System Administrator</span>
                    </div>
                </div>
            </div>
            {/* Hospital-card-list */}
            <div className="hospital-card-list">
                <div id="total-hospital" className="card-list">
                    <div className="card-name">
                        <span>Total Hospital  </span>
                        <p style={{ fontSize: "20px" }}> 🏥</p>
                    </div>
                    <div>
                        <h2>47</h2>
                        <p>↑ 8% from last querter</p>
                    </div>
                </div>
                <div id="total-patient" className="card-list">
                    <div className="card-name">
                        <span>Total Patients </span>
                        <p style={{ fontSize: "20px" }}>👥</p>
                    </div>
                    <div>
                        <h2>125,847</h2>
                        <p>↑ 15% Network growth</p>
                    </div>
                </div>
                <div id="total-prescription" className="card-list">
                    <div className="card-name">
                        <span>Total Prescriptions </span>
                        <p style={{ fontSize: "20px" }}>💊</p>
                    </div>

                    <div>
                        <h2>89,234</h2>
                        <p>↑ This month processed</p>
                    </div>
                </div>
                <div id="total-revenue" className="card-list">
                    <div className="card-name">
                        <span>Total Revenue </span>
                        <p style={{ fontSize: "20px" }}
                        >💰</p>
                    </div>
                    <div>
                        <h2>$2.4M</h2>
                        <p>↑ 22% monthly revenue</p>
                    </div>
                </div>
            </div>
            {/* Hospital-performance and Networkoverview */}
            <div className="Hospital-perfo-and-Network">
                <div className="hospital-performance">
                    <div className="hospital-heading">
                        <h4>Hopital Performance</h4>
                        <button className="hbutton">View All Hospital</button>
                    </div>
                    <div className="hospital-name">
                        <div style={{ display: "flex", gap: "20px" }}>
                            <span className="logo">CH</span>
                            <div>
                                <h5>Central Hospital</h5>
                                <span style={{
                                    fontSize: "12px"
                                }}>ID: H-001 • Patients: 2,847 • Revenue: $485K</span>
                            </div>
                        </div>
                        <p>Excellent</p>
                    </div>
                    <div className="hospital-name">
                        <div style={{ display: "flex", gap: "20px" }}>
                            <span className="logo">MH</span>
                            <div>
                                <h5>Metro Health Center</h5>
                                <span style={{
                                    fontSize: "12px"
                                }}>ID: H-002 • Patients: 1,923 • Revenue: $342K</span>
                            </div>
                        </div>
                        <p>Good</p>
                    </div>
                    <div className="hospital-name">
                        <div style={{ display: "flex", gap: "20px" }}>
                            <span className="logo">RH</span>
                            <div>
                                <h5>Regional Hospital</h5>
                                <span style={{
                                    fontSize: "12px"
                                }}>ID: H-003 • Patients: 3,156 • Revenue: $567K</span>
                            </div>
                        </div>
                        <p>Critical load</p>
                    </div>
                    <div className="hospital-name">
                        <div style={{ display: "flex", gap: "20px" }}>
                            <span className="logo">KH</span>
                            <div>
                                <h5>Specialty Hospital</h5>
                                <span style={{
                                    fontSize: "12px"
                                }}>ID: H-004 • Patients: 1,234 • Revenue: $298K</span>
                            </div>
                        </div>
                        <p>Good</p>
                    </div>
                    <div className="hospital-name">
                        <div style={{ display: "flex", gap: "20px" }}>
                            <span className="logo">DH</span>
                            <div>
                                <h5>Emergency Hospital</h5>
                                <span style={{
                                    fontSize: "12px"
                                }}>ID: H-005 • Patients: 4,567 • Revenue: $723K</span>
                            </div>
                        </div>
                        <p>Well</p>
                    </div>
                </div>
                {/* Network Overview */}
                <div className="network-overview">
                    <h4>Network Overview</h4>
                    <div className="Network-card">
                        <span> Active Hospital</span>
                        <h5>47 Facilities</h5>
                        <p>All systems operational</p>
                    </div>
                    <div className="Network-card">
                        <span>Patient Load</span>
                        <h5>125,847 Total</h5>
                        <p>15% increase this quarter</p>
                    </div>
                    <div className="Network-card">
                        <span>Revenue Stream</span>
                        <h5>$2.4M Monthly</h5>
                        <p>22% growth rate</p>
                    </div>
                    <div className="Network-card">
                        <span>System Status</span>
                        <h5>99.8% Uptime</h5>
                        <p>Excellent performance</p>
                    </div>

                    {/* Extra Block */}

                    <div className="extra-main-block">

                        <div className="extra-block">
                            <div className="blocks">
                                <p>🏥</p>
                                <span>Add Hospital</span>
                            </div>
                            <div className="blocks">
                                <p>👥</p>
                                <span>Generate Report</span>
                            </div>
                        </div>
                        <div className="extra-block">
                            <div className="blocks">
                                <p>👥</p>
                                <span>Manage Admins</span>
                            </div>
                            <div className="blocks">
                                <p>🏥</p>
                                <span>System Settings</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/*  system-administrator-profile*/}
            <div className={isCollapse ? "system-administrator-profile" : ("active")}>
                <div className="profile">
                    <span>Profile</span>
                    <button onClick={handlonclick}>Back</button>
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
                        <span>superadmin@healthcare.com</span>
                    </div>
                    <hr />
                    <div>
                        <p>Phone</p>
                        <span>+1 (555) 000-0001</span>
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
                        <span>07/11/2025, 15:11:57</span>
                    </div>
                    <hr />

                    <div>
                        <p>Access Level</p>
                        <span>Full System Access</span>
                    </div>
                    <hr />

                    <div>
                        <p>Hospitals</p>
                        <span>6 facilities</span>
                    </div>
                    <hr />

                    <div>
                        <p>Total Patients</p>
                        <span>8</span>
                    </div>
                    <hr />

                    <div>
                        <p>Administrators</p>
                        <span>10 active</span>
                    </div>
                    <hr />

                    <div>
                        <p>System Status</p>
                        <span>All Systems Operational</span>
                    </div>
                    <hr />

                </div>

                <div className="acount-setting">
                    <button>Edit profile</button>
                    <button>Logout</button>
                </div>
                <hr />

            </div>
        </div>


        //  </div>

    );
}

export default Dashboard;
