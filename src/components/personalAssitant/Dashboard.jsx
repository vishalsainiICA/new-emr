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
            <div className="dashbaordcardList" style={{ display: 'flex', gap: '10px' }}>
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
            </div>


            {/* hospital performance */}
            {/* <div style={{
                backgroundColor: 'white'
            }} className="hospitalperformance">
                <h3><i class="ri-calendar-line"></i>Today's Patient</h3>
                <p>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>

    <div style={{ marginTop: '10px' }}>
                <div className="hosptialHeading">
                    <p>Patient ID</p>
                    <p>Problem</p>
                    <p>Name</p>
                    <p>Age</p>
                    <p>Doctor</p>
                    <p>Date</p>
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

                {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length > 0 && (
                    <>
                        {filterPatient.map((patient, i) => (
                            <div key={i} className="hosptialBody" >
                                <p>{patient.uid}</p>
                                <p>{patient?.hospitalId?.name || "N/A"}</p>
                                <p>{patient.name}</p>
                                <p>{patient.age}</p>
                                <p>{patient?.doctorId?.name || "N/A"}</p>
                                <p>{moment(patient?.createdAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</p>
                            </div>
                        ))}
                    </>
                )}

                {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '50px 0' }}>
                        No Patient found
                    </p>
                )}
            </div>

                {!isProcessing && !error && Array.isArray(filterHospital?.todayPatient) && filterHospital?.todayPatient?.length === 0 && (
                    <p
                        style={{ textAlign: 'center', padding: '50px 0' }}
                    >No Patients found</p>
                )}
            </div> */}
            <div style={{
                marginTop: '20px',
                backgroundColor: 'white',
                padding: '10px',
                minHeight: '100vh',
                maxHeight: '100vh'
            }}>
                <div
                    style={{

                        width: '100%',
                        display: 'flex',         // add this
                        justifyContent: "space-between", // horizontally center

                        gap: '10px'      // vertically bottom         // height dena zaroori hai
                    }}
                >
                    <div>
                        <h3><i class="ri-calendar-line"></i>Today's Patient</h3>
                        <p>
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
                        gap: '7px'
                    }}>
                        <input
                            onChange={(e) => filter(e.target.value)}
                            style={{
                                width: '200px',
                                height: '35px',
                            }}
                            type="text"
                            placeholder="Search"
                        />
                        <input style={{
                            height: '35px',
                            width: '200px',
                        }} type="date" />

                        <button
                            onClick={() => navigate('/pa/new-patient')}
                            style={{
                                height: '40px',
                                width: '200px',
                                textAlign: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                backgroundColor: 'lightseagreen'
                            }} >+Add New</button>

                    </div>

                </div>


                <div style={{ marginTop: '10px' }}>
                    <div className="hosptialHeading">
                        <p>Patient ID</p>
                        <p>Name</p>
                        <p>Age</p>
                        <p>Source</p>
                        <p>Date</p>
                        <p>Action</p>
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

                    {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length > 0 && (
                        <>
                            {filterPatient.map((patient, i) => (
                                <div key={i} className="hosptialBody" >
                                    <p>{patient.uid}</p>
                                    <p>{patient?.name || "N/A"}</p>
                                    <p>{patient.age}</p>
                                    <p style={{
                                        display: 'flex',
                                        border: '0.2px solid lightgray',
                                        textAlign: 'center',
                                        alignItems: 'center',
                                        padding: '2px',
                                        justifyContent: 'center',
                                        marginRight: '100px',
                                        borderRadius: '10px',
                                        color: 'white',

                                        backgroundColor: 'lightseagreen'
                                    }}>{"Web" || "N/A"}</p>
                                    <p>{moment(patient?.createdAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</p>
                                    <p
                                    onClick={()=>navigate('/pa/inital-assement')}
                                     style={{
                                        border: '1px solid lightgray',
                                        borderRadius: '7px',
                                        marginRight: '20px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>InitialAssement</p>
                                </div>
                            ))}
                        </>
                    )}

                    {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '50px 0' }}>
                            No Patient found
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
