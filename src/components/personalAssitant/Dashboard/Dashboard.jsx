import "./Doctor.css"
// import { doctorAPi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
// import { CircularAvatar } from "../utility/CicularAvatar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaCableCar } from "react-icons/fa6";
import { doctorAPi, perosnalAssistantAPI } from "../../../auth";


const DashBoard = () => {

    const [data, setData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCollapse, setCollapse] = useState(false);
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);
    const [edit, setEdit] = useState(null)
    const [isEditprofile, setEditprofile] = useState(false);
    const [blur, setblur] = useState(false);
    const [logOut, setlogOut] = useState(false);
    const [pa, setpa] = useState(null);


    const getMetricValue = (name) => {
        return metrices?.find((m) => m.key === name)?.value ?? 0;
    };

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token") || undefined
        if (!token) {
            navigate("/login", { replace: true })
        }
    }, [])

    const filter = (value) => {

        if (value.trim() === "") {
            setFilterPatient(data)
        }
        const filter = data.filter((hos) => {
            return hos.name.toLowerCase().startsWith(value.toLowerCase())
        })

        setFilterPatient(filter)

    }

    const handelclick = () => {
        if (!isCollapse) {
            setCollapse(true);
        }
        else {
            setCollapse(false)
        }
    }
    useEffect(() => {
        const fetchPatient = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await perosnalAssistantAPI.getAllPatients();
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterPatient(res.data.data || []); // initialize filter
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
        const fetchProfile = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await perosnalAssistantAPI.fetchProfile();
                if (res.status === 200) {
                    setpa(res.data?.data)
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
        fetchProfile()

        fetchPatient();
    }, []);

    return <div className="doctor-dashboard">

        <div className="doctor-heading">
            <div style={{
                // display:'flex',
                // flexDirection:'column',
                // gap:'5px'
            }} >
                <h3>Dashboard</h3>
                <p >Helthcare and Network</p>
            </div>
            <div
                style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px" // space between items
                }}
            >
                <div>
                    <h4 style={{ margin: 0 }}>{`Welcome back,Dr.${pa?.name}`}</h4>
                    <p style={{ margin: 0, textAlign: "right" }}>{"Doctor Management"}</p>
                </div>
                <span style={{
                    cursor: 'pointer'
                }} onClick={handelclick} className="logo">{"VS"}</span>


            </div>
            {/* <div style={{
                display: 'flex'
            }} >
                <span className="logo">SA</span>
                <div className="doctor-controler">
                    <h5>Welcome back, Super Admin</h5>
                    <span style={{
                        fontSize: "12px"
                    }}>System Administrator</span>
                </div>
            </div> */}

        </div>

        {/* Hospital-card-list */}
        {/* <div className="doctor-card-list">
            <div id="total-hospital" className="hover card-list">
                <div className="card-name">
                    <span>Total Hospital  </span>
                    <p> 🏥</p>
                </div>
                <div className="card-Metrices">
                    <h2>47</h2>
                    <p >↑ 8% from last querter</p>
                </div>
            </div>
            <div id="total-patient" className="hover card-list">
                <div className="card-name">
                    <span>Total Patients </span>
                    <p >👥</p>
                </div>
                <div className="card-Metrices">
                    <h2>125,847</h2>
                    <p>↑ 15% Network growth</p>
                </div>
            </div>
            <div id="total-prescription" className="hover card-list">
                <div className="card-name">
                    <span>Total Prescriptions </span>
                    <p >💊</p>
                </div>

                <div className="card-Metrices">
                    <h2>89,234</h2>
                    <p>↑ This month processed</p>
                </div>
            </div>
            <div id="total-revenue" className="hover card-list">
                <div className="card-name">
                    <span>Total Revenue </span>
                    <p
                    >💰</p>
                </div>
                <div className="card-Metrices">
                    <h2>$2.4M</h2>
                    <p>↑ 22% monthly revenue</p>
                </div>
            </div>
        </div> */}
        <div className="doctor-patient-list">
            <div style={{
                width: '100%'
            }} className="hospitalperformance">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h4><i class="ri-calendar-line"></i>Today's Appointments</h4>
                        <p style={{
                            fontSize: '12px',
                            color: "gray"
                        }}>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>

                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '7px'
                    }}>
                        <input type="search" placeholder="type name..." />
                        <select name="" id="">
                            <option value="all">Schedule</option>
                            <option value="cancel">Cancel</option>
                        </select>
                        <input type="date" />

                    </div>

                </div>

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
                    }}>{error}</h4>
                )}

                {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient?.length > 0 && (
                    <div style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginTop: '20px',
                        // minHeight: '500px'
                    }}>
                        {filterPatient?.map((hos, i) => (
                            <div key={i} className="patient-card hover"

                            > <div
                                style={{
                                    width: '100%',
                                    padding: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "20px" // space between items
                                }}
                            >
                                    <span className="logo">{hos?.name.slice(0, 1).toUpperCase()}</span>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <h4 style={{ margin: 0 }}>{hos?.name}</h4>
                                            <p style={{
                                                color: 'green',
                                                backgroundColor: 'lightgreen',
                                                padding: '5px',
                                                borderRadius: '10px'
                                            }}>{hos?.status}</p>
                                        </div>

                                        <p style={{}}>{`${hos.gender?.toLowerCase() || "N/A"} , ${hos?.age || "N/A"} `}</p>
                                    </div>

                                </div>

                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'end',


                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        justifyContent: 'end',
                                    }}>
                                        {hos.initialAssementId != null ? (
                                            <button

                                                disabled={true}
                                                // onClick={() => navigate('/medication', { state: { patient: hos } })}
                                                style={{
                                                    backgroundColor: 'rgba(219, 219, 252)',

                                                    margin: '10px',
                                                    padding: '10px',
                                                    width: '150px'
                                                }}> Assement Done</button>
                                        ) : (
                                            <div>
                                                <button
                                                    onClick={() => navigate("/intial-assement", { state: { patient: hos } })}
                                                    style={{
                                                        backgroundColor: 'rgba(219, 219, 252)',
                                                    }}> 👁️ Ini</button>

                                                <button
                                                    onClick={() => setEdit(edit === hos._id ? null : hos._id)}
                                                    style={{ backgroundColor: "rgba(235, 254, 246)" }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                            </div>


                                        )}

                                        {edit === hos._id && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "100%",
                                                    right: 0,
                                                    background: "white",
                                                    boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                                                    borderRadius: "8px",
                                                    padding: "8px 0",
                                                    zIndex: 999,
                                                }}
                                            >
                                                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                                                    <li style={{ padding: "8px 12px", fontSize: "12px", cursor: "pointer" }}>
                                                        Postpone
                                                    </li>
                                                    <li style={{ padding: "8px 12px", fontSize: "12px", cursor: "pointer" }}>
                                                        Cancel
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>


                                </div>

                            </div>


                        ))}
                    </div>
                )}

                {!isProcessing && !error && Array.isArray(filterPatient?.todayPatient) && filterPatient?.todayPatient?.length === 0 && (
                    <p
                        style={{ textAlign: 'center', padding: '50px 0' }}
                    >No Patients found</p>
                )}
            </div>
            <div style={{

            }}>


                <div className="hospitalperformance">
                    <h4>Recents Activity</h4>
                    <p style={{
                        fontSize: '12px',
                        color: "gray"
                    }}>
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>

                </div>


            </div>

            {/*  system-administrator-profile*/}
            <div className={isCollapse ? "system-administrator-profile" : ("active")}>
                <div className="profile">
                    <span>Profile</span>
                    <button className="common-btn" onClick={handelclick}>Back</button>
                </div>
                <hr />

                <div className="profile-logo">
                    <span className="logo">VS</span>
                    <span>Dr.{pa?.name}</span>
                    <p></p>
                </div>
                <hr />

                <div className="admin-detail">
                    <div>
                        <p>Email</p>
                        <span>{pa?.email}</span>
                    </div>
                    <hr />
                    <div>
                        <p>Phone</p>
                        <span>{pa?.contact}</span>
                    </div>
                    <hr />

                    {/* <div>
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
                    <hr /> */}

                </div>


                <div className="acount-setting">
                    <button className="common-btn" onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse) }}>Edit profile</button>
                    <button className="common-btn" onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}>Logout</button>
                </div>
                <hr />

            </div>
            <hr />
            {/* Logout page */}
            <div className={isEditprofile ? "edit-profile" : "active"}>
                <div className="profile">
                    <span >Edit Profile</span>
                    <button className="common-btn" onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse) }}>Back</button>
                </div>
                <hr />
                <div className="edit-detail">
                    <div className="detail">
                        <div>
                            <label htmlFor="User Name">Username</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label htmlFor="Email">Email</label>
                            <input type="email" />
                        </div>
                    </div>
                    <div className="detail">
                        <div>
                            <label htmlFor="Phone">Phone</label>
                            <input type="number" />
                        </div>
                        <div>
                            <label htmlFor="Department">Department</label>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="bio">
                        <label htmlFor="Bio">Bio</label>
                        <br />
                        <textarea name="" id=""></textarea>
                    </div>
                </div>
                <hr />

                <div className="final-process">
                    <button className="main-button"> Save Profile</button>
                    <button className="common-btn" onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse) }}>Cancel</button>
                </div>

            </div>
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
                    <button className="main-button" onClick={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("role")
                        navigate("/login", { replace: true })
                    }}>Yes logout</button>
                    <button className="common-btn" onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}>Cancel</button>
                </div>

            </div>

        </div>
    </div >




}

export default DashBoard