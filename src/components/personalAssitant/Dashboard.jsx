import { doctorAPi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import { CircularAvatar } from "../utility/CicularAvatar";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export function Dashboard() {

    const [data, setData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);

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

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>

            {/* metrics cards */}
            {/* <div className="dashbaordcardList" style={{ display: 'flex', gap: '10px' }}>
                <div className="card">
                    <span style={{ display: 'flex', gap: '20px' }}>
                        <h3>Total Patients</h3>
                        <span style={{ backgroundColor: 'lightblue', padding: '10px', borderRadius: '10px' }}>
                            <i className="ri-group-line"></i>
                        </span>
                    </span>
                    <h2>{data?.doctorProfile?.totalPatient ?? "N/A"}</h2>
                </div>

                <div className="card">
                    <span style={{ display: 'flex', gap: '20px' }}>
                        <h3>Patients Today</h3>
                        <span style={{ backgroundColor: 'lightblue', padding: '10px', borderRadius: '10px' }}>
                            <i className="ri-group-line"></i>
                        </span>
                    </span>
                    <h2>{data?.todayPatient?.length ?? "N/A"}</h2>
                </div>

                <div className="card">
                    <span style={{ display: 'flex', gap: '20px' }}>
                        <h3>Total Prescriptions</h3>
                        <span style={{ backgroundColor: 'lightblue', padding: '10px', borderRadius: '10px' }}>
                            <i className="ri-group-line"></i>
                        </span>
                    </span>
                    <h2>{data?.doctorProfile?.totalPrescriptions ?? "N/A"}</h2>
                </div>

                <div className="card">
                    <span style={{ display: 'flex', gap: '20px' }}>
                        <h3>Total Lab Tests</h3>
                        <span style={{ backgroundColor: 'lightblue', padding: '10px', borderRadius: '10px' }}>
                            <i className="ri-group-line"></i>
                        </span>
                    </span>
                    <h2>{data?.doctorProfile?.totalLabTests ?? "N/A"}</h2>
                </div>
            </div> */}

            <div className="cardList">
                <div className="customCard hover" style={{

                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <h4>Total Hospitals</h4>
                        <p>🏥</p>
                    </div>
                    <h2>6</h2>
                    <p style={{
                        color: 'rgba(125, 200, 176)',
                        fontWeight: "bold"
                    }}>08%</p>
                </div>
                <div className="customCard hover" style={{

                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <h4>Total Capacity</h4>
                        <p>🛏️</p>
                    </div>
                    <h2>6</h2>
                    <p style={{
                        color: 'rgba(125, 200, 176)',
                        fontWeight: "bold"
                    }}>08%</p>
                </div>
                <div className="customCard hover" style={{

                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <h4>Current Occupancy</h4>
                        <p>👥</p>
                    </div>
                    <h2>6</h2>
                    <p style={{
                        color: 'rgba(125, 200, 176)',
                        fontWeight: "bold"
                    }}>08%</p>
                </div>
                <div className="customCard hover" style={{

                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <h4>Total Staff</h4>
                        <p>👨‍⚕️</p>
                    </div>
                    <h2>6</h2>
                    <p style={{
                        color: 'rgba(125, 200, 176)',
                        fontWeight: "bold"
                    }}>08%</p>
                </div>

            </div>


            {/* hospital performance */}
            <div style={{
                backgroundColor: 'white'
            }} className="hospitalperformance">
                <h3><i class="ri-calendar-line"></i>Today's Appointments</h3>
                <p>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>


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
                            <div key={i}
                                onClick={() => navigate('/doctor/medication', { state: { patient: hos } })}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '20px',
                                    height: '75px',
                                    backgroundColor: 'white',
                                    borderBottom: '1px solid lightgray',
                                    borderRadius: '10px',
                                    cursor: 'pointer'
                                }}>
                                <div

                                    style={{
                                        padding: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "20px" // space between items
                                    }}
                                >
                                    <span className="logo">{hos?.name?.slice(0, 2).toUpperCase()}</span>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{hos.name || "Unnamed Hospital"}</h4>
                                        <p style={{ margin: 0 }}>{`${hos.age} years,${hos.gender}`}</p>
                                    </div>

                                </div>

                                <div>
                                    <button className="commonBtn" onClick={() => navigate("/pa/inital-assement", { state: { patient: hos } })}>Intial Assement</button>
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
        </div>
    );
}

export default Dashboard;
