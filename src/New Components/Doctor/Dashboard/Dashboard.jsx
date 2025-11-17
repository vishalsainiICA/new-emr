import "./Doctor.css"
// import { doctorAPi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
// import { CircularAvatar } from "../utility/CicularAvatar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { doctorAPi } from "../../../../auth";
import { FaCableCar } from "react-icons/fa6";


const DashBoard = () => {

    const [data, setData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);
    const [edit, setEdit] = useState(null)
    const navigate = useNavigate()

    const filter = (value) => {

        if (value.trim() === "") {
            setFilterPatient(data)
        }
        const filter = data.filter((hos) => {
            return hos.name.toLowerCase().startsWith(value.toLowerCase())
        })

        setFilterPatient(filter)

    }

    useEffect(() => {
        const fetchPatient = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await doctorAPi.getAllPatients();
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
                    <h4 style={{ margin: 0 }}>{"Welcome back, Super Admin"}</h4>
                    <p style={{ margin: 0, textAlign: "right" }}>{"Doctor Management"}</p>
                </div>
                <span className="logo">{"SR"}</span>


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
        <div className="doctor-card-list">
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
                        <input type="search" placeholder="type name..." />
                        <select name="" id="">
                            <option value="all">All</option>
                            <option value="schedule">Schedule</option>
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

                            // onClick={() => navigate('/doctor/medication', { state: { patient: hos } })}
                            > <div
                                style={{
                                    width: '100%',
                                    padding: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "20px" // space between items
                                }}
                            >
                                    <span className="logo">{"SR"}</span>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <h4 style={{ margin: 0 }}>{"Welcome back, Super Admin"}</h4>
                                            <p style={{
                                                color: 'green',
                                                backgroundColor: 'lightgreen',
                                                padding: '5px',
                                                borderRadius: '10px'
                                            }}>Shcdule</p>
                                        </div>

                                        <p style={{}}>{"Doctor Management"}</p>
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
                                        <button
                                            // onClick={() => navigate("/view-hospital", { state: { hospital: hos } })}
                                            style={{
                                                backgroundColor: 'rgba(219, 219, 252)',
                                            }}> 👁️ View</button>

                                        <button
                                            onClick={() => setEdit(edit == hos._id ? null : hos._id)}
                                            style={{

                                                backgroundColor: 'rgba(235, 254, 246)',
                                            }}>✏️ Edit</button>
                                        {
                                            edit === hos._id && (
                                                <div style={{
                                                    position: "fixed",
                                                    top: "60px",
                                                    right: "10px",
                                                    
                                                    // width: "120px",
                                                    // background: "white",
                                                    // boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                                                    // borderRadius: "8px",
                                                    // padding: "8px 0",



                                                }}>


                                                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                                                        <li
                                                            style={{
                                                                padding: "8px 12px",
                                                                fontSize: '12px',
                                                                cursor: "pointer",
                                                                // transition: "background 0.2s",
                                                            }}
                                                            // onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                                                            // onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                                                        >
                                                            Postpone
                                                        </li>
                                                        <li
                                                            style={{
                                                                fontSize: '12px',
                                                                padding: "8px 12px",
                                                                cursor: "pointer",
                                                                // transition: "background 0.2s",
                                                            }}
                                                            // onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                                                            // onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                                                        >
                                                            Cancel
                                                        </li>
                                                    </ul>


                                                </div>
                                            )
                                        }
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
                    <h4>Schedule</h4>
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
        </div>



    </div >

}

export default DashBoard