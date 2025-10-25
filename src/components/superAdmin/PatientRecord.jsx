import { useEffect, useState } from "react";
import { superAdminApi } from "../../auth";
import { Circles } from "react-loader-spinner";


export function PatientRecords() {
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);

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
        <div>
            <h2>Patient-Records</h2>

            <div
                style={{
                    width: '100%',
                    display: 'flex',         // add this
                    justifyContent: 'end', // horizontally center
                    alignItems: 'end',        // vertically bottom         // height dena zaroori hai
                }}
            >
                <input
                    style={{
                        width: '20%',
                    }}
                    type="text"
                    placeholder="Search"
                />
            </div>


            <div style={{
                marginTop: '10px',
                // alignContent: 'center',
                // alignItems: 'center'
            }}>
                <div className="patientRecordsHeadings">
                    <p>Patient ID</p>
                    <p>Name</p>
                    <p>Age</p>
                    <p>Hospital</p>
                    <p>Doctor</p>
                    <p>Date</p>
                </div>
                {/* <div className="patientRecordBody">
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
                )} */}

                {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length > 0 && (
                    // <div style={{

                    // }}>
                    <>
                        {filterPatient.map((patient, i) => (
                            <div key={i}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    // height: '75px',
                                    backgroundColor: 'white',
                                    border: '1px solid lightgray',
                                    // padding: '20px',
                                    cursor: 'pointer',

                                    // gap: '180px'

                                }}
                                // className="patientRecordsHeadings"
                            >
                                <p style={{textAlign:'center', background:'red'}}>{patient.uid}</p>
                                <p style={{textAlign:'center', background:'red'}}>{patient.name}</p>
                                <p style={{textAlign:'center', background:'red'}}>{patient.age}</p>
                                <p style={{textAlign:'center', background:'red'}}>{patient?.hospitalId?.name || "N/A"}</p>
                                <p style={{textAlign:'center', background:'red'}}>{patient?.doctorId?.name || "N/A"}</p>
                                <p style={{textAlign:'center', background:'red'}}>{"1990-05-15"}</p>
                            </div>
                        ))}
                    </>
                )}

                {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length === 0 && (
                    <p
                        style={{ textAlign: 'center', padding: '50px 0' }}
                    >No Patient found</p>
                )}
            </div>
        </div>
        // </div>
    )
}