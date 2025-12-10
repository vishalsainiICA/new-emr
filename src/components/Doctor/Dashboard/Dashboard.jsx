import "./Doctor.css"
// import { doctorAPi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
// import { CircularAvatar } from "../utility/CicularAvatar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaCableCar } from "react-icons/fa6";
import { commonApi, doctorAPi } from "../../../auth";
import { ActivityTimeline, Patient_Hisotry } from "../../Utility/PatientHistory__Labtest";
import { toast } from "react-toastify";


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
    const [showPostponeModal, setShowPostponeModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [cancelReason, setCancelReason] = useState("");
    const [metrices, setmetrices] = useState(null);
    const [refresh, setrefresh] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [timeline, setimeline] = useState([]);
    const [open, setClose] = useState(false)
    const [password, setpassword] = useState({
        old: "",
        new: ""
    })


    const navigate = useNavigate()

    const getMetricValue = (name) => {
        return metrices?.[name] ?? 0;
    };

    const handleChange = (key, value) => {
        setpa((prev) => ({
            ...prev,
            [key]: value
        }))
    }


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

    const changePatientStatus = async (id) => {
        setIsProcessing(true);
        try {
            const res = await commonApi.changePatientStatus(id, newDate, cancelReason);
            if (res.status === 200) {
                toast.success("Status Updated")
                setrefresh((prev) => !prev)

            } else {
                setError({ error: res.data?.message || "Something went wrong" });
            }
        } catch (err) {
            console.log(err);
            setError({ error: err.response?.data?.message || "Internal Server Error" });
        } finally {
            setIsProcessing(false);
            setEdit(null)
            setCancelReason('')
            setNewDate('')
        }
    }
    useEffect(() => {
        const fetchPatient = async () => {
            setIsProcessing(true);
            try {
                const res = await doctorAPi.getAllPatients(newDate, cancelReason);
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterPatient(res.data.data || []); // initialize filter
                    setmetrices(res.data?.metrices)
                } else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);
                setError({ error: err.response?.data?.message || "Internal Server Error" });
            } finally {
                setIsProcessing(false);
            }
        };

        fetchPatient();
    }, [cancelReason, newDate, refresh,])
    useEffect(() => {
        const fetchProfile = async () => {
            setIsProcessing(true);
            try {
                const res = await doctorAPi.fetchProfile();
                if (res.status === 200) {
                    setpa(res.data?.data)
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

        const dailyActivity = async () => {
            setIsProcessing(true);
            try {
                const res = await doctorAPi.dailyActivity();
                if (res.status === 200) {
                    setimeline(res.data.data || []);
                } else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);
                setError({ error: err.response?.data?.message || "Internal Server Error" });
            } finally {
                setIsProcessing(false);
            }
        };
        dailyActivity()
        fetchProfile()
    }, [refresh]);

    const handleeditProfile = async () => {
        setIsProcessing(true);
        try {
            const formdata = new FormData();
            formdata.append("name", pa?.name);
            formdata.append("email", pa?.email);
            formdata.append("contact", pa?.contact);

            //Only add password fields if user actually entered something
            if (password.old.trim() !== "" && password.new.trim() !== "") {
                formdata.append("oldPassword", password.old);
                formdata.append("newPassword", password.new);
            }

            const res = await doctorAPi.ediProfile(formdata);

            if (res.status === 200) {
                setpa(res.data?.data);
                toast.success("Profile Updated");

                // close edit section
                setEditprofile(false);
                setblur(false);
                setCollapse(false);
                setpassword({ old: '', new: '' });
                setChangePassword(false)


            } else {
                setError({ profile: res.data?.message || "Something went wrong" });
            }

        } catch (err) {
            console.log(err);
            setError({ profile: err.response?.data?.message || "Internal Server Error" });
        } finally {
            setrefresh((prev) => !prev)
            setIsProcessing(false);
            console.log(error);

        }
    };


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
        </div>

        {/* Hospital-card-list */}
        <div className="doctor-card-list">
            <div id="total-hospital" className="hover card-list">
                <div className="card-name">
                    <span>Today Patient  </span>
                    <p> 🏥</p>
                </div>
                <div className="card-Metrices">
                    <h2>{getMetricValue("TodayPatient")}</h2>
                    {/* <p >↑ 8% from last querter</p> */}
                </div>
            </div>
            <div id="total-patient" className="card-list">
                <div className="card-name">
                    <span>Total Patients</span>
                    <p style={{ fontSize: "20px" }}>👥</p>
                </div>
                <div>
                    <h2>{Number(getMetricValue("TotalMalepatient")) + Number(getMetricValue("TotalFemalepatient"))}</h2>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}> <p>Male:</p> <h4>{Number(getMetricValue("TotalMalepatient"))}</h4> <p>Female:</p><h4> {Number(getMetricValue("TotalFemalepatient"))}</h4>
                    </div>
                </div>
            </div>
            <div id="total-prescription" className="hover card-list">
                <div className="card-name">
                    <span>Total Prescriptions </span>
                    <p >💊</p>
                </div>

                <div className="card-Metrices">
                    <h2>{getMetricValue("TotalPrescrition")}</h2>
                    {/* <p>↑ This month processed</p> */}
                </div>
            </div>
            <div id="total-revenue" className="hover card-list">
                <div className="card-name">
                    <span>Cancel Patient </span>
                    <p
                        style={{
                            color: 'red'
                        }}
                    >X</p>
                </div>
                <div className="card-Metrices">
                    <h2>{getMetricValue("CancelPatient")}</h2>
                    {/* <p>↑ 22% monthly revenue</p> */}
                </div>
            </div>
        </div>
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
                        <input type="search" onChange={(e) => filter(e.target.value)} placeholder="type name..." />
                        <select onChange={(e) => setCancelReason(e.target.value)} name="" id="">
                            <option value="today">Today</option>
                            <option value="postponed">Postponed</option>
                            <option value="cancel">Cancel</option>
                            <option value="all">All</option>
                        </select>
                        <input type="date" onChange={(e) => setNewDate(e.target.value)} />

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

                {error?.error && (
                    <h4 style={{
                        color: 'red',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '50px 0'
                    }}>{error?.error}</h4>
                )}

                {!isProcessing && !error?.error && Array.isArray(filterPatient) && filterPatient?.length > 0 && (
                    <div style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginTop: '20px',
                        overflowY: "scroll",
                        maxHeight: "100vh",
                        minHeight: '100vh',
                        scrollBehavior: 'smooth',

                        scrollbarWidth: "none"
                    }}>
                        {
                            filterPatient?.map((hos, i) => (
                                <div key={i} className="patient-card hover"

                                >
                                    <div
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
                                                <h5 style={{ margin: 0 }}>{hos?.name}</h5>
                                                <p
                                                    style={{
                                                        color:
                                                            hos?.status === "Cancel"
                                                                ? "red"
                                                                : hos?.status === "Postponed"
                                                                    ? "#b8860b"          // dark yellow
                                                                    : "green",

                                                        backgroundColor:
                                                            hos?.status === "Cancel"
                                                                ? "#ffb3b3"          // light red
                                                                : hos?.status === "Postponed"
                                                                    ? "#fff2a8"          // light yellow
                                                                    : "lightgreen",

                                                        padding: "5px",
                                                        borderRadius: "10px",
                                                    }}
                                                >
                                                    {hos?.prescribtionId ? "Rxdone" : hos?.status}
                                                </p>
                                            </div>
                                            <p style={{}}>{`${hos?.gender?.toLowerCase() || "N/A"} , ${hos?.age || "N/A"} `}</p>
                                            <p>{moment(hos?.updatedAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</p>
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
                                            {hos?.prescribtionId ? (

                                                <>
                                                    <button
                                                        onClick={() => setClose(hos)}
                                                        style={{
                                                            backgroundColor: 'rgba(219, 219, 252)',
                                                            marginRight: '20px'
                                                        }}> 👁️ View</button>

                                                </>


                                            ) : hos.status === "Cancel" ? (
                                                /* ----------------------------------------
                                                   CASE: CANCELLED → No actions
                                                ---------------------------------------- */
                                                <p
                                                    style={{
                                                        color: "red",
                                                        backgroundColor: "#ffb3b3",
                                                        padding: "5px",
                                                        borderRadius: "10px",
                                                        width: "150px",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    Cancelled
                                                </p>

                                            )
                                                : hos.status === "Postponed" ? (
                                                    /* ----------------------------------------
                                                       CASE: POSTPONED → No actions
                                                    ---------------------------------------- */
                                                    <p
                                                        style={{
                                                            color: "#b8860b",
                                                            backgroundColor: "#fff2a8",
                                                            padding: "5px",
                                                            borderRadius: "10px",
                                                            width: "150px",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        Postponed
                                                    </p>

                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => navigate('/medication', { state: { patient: hos } })}
                                                            style={{
                                                                backgroundColor: 'rgba(219, 219, 252)',
                                                            }}>Medication</button>

                                                        <button
                                                            onClick={() => setEdit(edit === hos._id ? null : hos._id)}
                                                            style={{ backgroundColor: "rgba(235, 254, 246)" }}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                    </>

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
                                                        <li onClick={() => setShowPostponeModal(true)} style={{ padding: "8px 12px", fontSize: "12px", cursor: "pointer" }}>
                                                            Postpone
                                                        </li>
                                                        <li onClick={() => setShowCancelModal(true)} style={{ padding: "8px 12px", fontSize: "12px", cursor: "pointer" }}>
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

                {!isProcessing && !error?.error && Array.isArray(filterPatient) && filterPatient?.length === 0 && (
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

                    <ActivityTimeline timeline={timeline}></ActivityTimeline>

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
                    <h6>Experience:{pa?.experience}</h6>
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
                    <div>
                        <p>Qualification</p>
                        <span>{pa?.qualification}</span>
                    </div>
                    <hr />

                </div>


                <div className="acount-setting">
                    <button className="common-btn" onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse); setChangePassword(false) }}>Edit profile</button>
                    <button className="common-btn" onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse); setChangePassword(false) }}>Logout</button>
                </div>
                <hr />

            </div>
            <hr />
            {/* Logout page */}
            <div className={isEditprofile ? "edit-profile" : "active"}>

                <div className="editCard">
                    <div style={{
                        display: 'flex',
                        justifyContent: "space-between"
                    }}>

                        <span>Edit Profile</span>
                        <button className="common-btn" onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse); setChangePassword(false); setError({ profile: null }) }}>Back</button>

                    </div>

                    <div className="edit-detail">
                        <label htmlFor="User Name">Name    <input type="text" onChange={(e) => handleChange("name", e.target.value)} value={pa?.name} /></label>

                        <label htmlFor="Email">Email     <input type="email" onChange={(e) => handleChange("email", e.target.value)} value={pa?.email} /></label>

                        <label htmlFor="Phone">Phone
                            <input type="phone" onChange={(e) => handleChange("contact", e.target.value)} value={pa?.contact} />
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
                        <button className="main-button" disabled={isProcessing} onClick={() => { setEditprofile(!isEditprofile); setblur(!blur); setCollapse(!isCollapse); setChangePassword(false); setError({ profile: null }) }}>Cancel</button>
                    </div>
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
                    }} >Yes logout</button>
                    <button className="common-btn" onClick={() => { setlogOut(!logOut); setblur(!blur); setCollapse(!isCollapse) }}>Cancel</button>
                </div>

            </div>

        </div>
        {
            showPostponeModal && (
                <div className="modal">
                    <div className="modal-box">
                        <h3>Postpone Appointment of {showPostponeModal?.name}</h3>

                        <label>New Date & Time:</label>
                        <input
                            type="datetime-local"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button className="regular-btn" onClick={() => setShowPostponeModal(null)}>Close</button>
                            <button
                                className="common-btn"
                                onClick={() => {
                                    changePatientStatus(showPostponeModal?._id)
                                    setShowPostponeModal(null);
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        {
            showCancelModal && (
                <div className="modal">
                    <div className="modal-box">
                        <h3>Cancel Appointment of {showCancelModal?.name}</h3>

                        <label>Reason for cancellation:</label>
                        <br />
                        <br />
                        <textarea
                            placeholder="Enter reason..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        ></textarea>

                        <div className="modal-actions">
                            <button className="regular-btn" onClick={() => setShowCancelModal(null)}>Close</button>
                            <button
                                className="common-btn"
                                onClick={() => {

                                    changePatientStatus(showCancelModal?._id)
                                    setShowCancelModal(null)
                                }}
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }


        {
            open && (
                <div className="patientHistory">
                    <Patient_Hisotry patient={open} onclose={() => setClose(false)} ></Patient_Hisotry>
                    {/* <LabTest selectedLabTest={selectedLabTest} setselectedLabTest={setselectedLabTest} labTest={labtestResult} labTestError={labTestError} labTestloading={labTestloading} onclose={() => setClose(false)} ></LabTest> */}
                </div>
            )
        }


    </div >




}

export default DashBoard