import { useEffect, useState } from "react";
import './PatientRecord.css'
import { Circles } from "react-loader-spinner";
import moment from "moment";
import { superAdminApi } from "../../../auth";
import { LabTest, Patient_Hisotry } from "../../../components/Utility/PatientHistory__Labtest";


export default function PatientRecords() {
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [open, setClose] = useState(false)
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);


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
                const res = await superAdminApi.allPatients();
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterPatient(res.data.data || []); // initialize filter
                } else {
                    setError(res.data?.message || "Something went wrong");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Internal Server Error");
            } finally {
                setIsProcessing(false);
            }
        };

        fetchPatient();
    }, []);



    return (
        <div >
            {/* <div className="cardList">
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

            </div> */}

            <div className="customCard">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}
                >
                    <h4>Patient Records</h4>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <input
                            onChange={(e) => filter(e.target.value)}
                            style={{

                                padding: "7px"
                            }}
                            type="text"
                            placeholder="Search"
                        />
                        <select
                            style={{ padding: '6px', borderRadius: '7px', border: "0.5px solid lightgrey" }}
                        >
                            <option value="all">All</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="cancel">Cancel</option>
                            <option value="pospond">Pospond</option>
                        </select>
                        <input style={{
                            padding: "7px"
                        }} type="date" />
                    </div>


                </div>
                <div className="patientHeading">
                    <p>Patient ID</p>
                    <p>Name</p>
                    <p>Age</p>
                    <p>Hospital</p>
                    <p>Doctor</p>
                    <p>Status</p>
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
                            <div
                                onClick={() => setClose(patient)}
                                key={i} className="patientBody" >
                                <p>{patient.uid}</p>
                                <p>{patient.name}</p>
                                <p>{patient.age}</p>
                                <p>{patient?.hospitalId?.name || "N/A"}</p>
                                <p>{patient?.doctorId?.name || "N/A"}</p>
                                <p
                                    style={{
                                        width: '70px',
                                        fontSize: "12px",
                                        color:
                                            patient?.status === "Cancel"
                                                ? "red"
                                                : patient?.status === "Postponed"
                                                    ? "#b8860b"          // dark yellow
                                                    : "green",

                                        backgroundColor:
                                            patient?.status === "Cancel"
                                                ? "#ffb3b3"          // light red
                                                : patient?.status === "Postponed"
                                                    ? "#fff2a8"          // light yellow
                                                    : "lightgreen",

                                        padding: "5px",
                                        borderRadius: "10px",
                                    }}
                                >
                                    {patient?.status}
                                </p>
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

            {
                open && (
                    <div className="patientHistory">
                        <Patient_Hisotry patient={open} onclose={() => setClose(false)} ></Patient_Hisotry>
                        {/* <LabTest selectedLabTest={selectedLabTest} setselectedLabTest={setselectedLabTest} labTest={labtestResult} labTestError={labTestError} labTestloading={labTestloading} onclose={() => setClose(false)} ></LabTest> */}
                    </div>
                )
            }
        </div>
    )
}