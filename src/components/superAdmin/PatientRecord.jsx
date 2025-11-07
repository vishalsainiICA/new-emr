import { useEffect, useState } from "react";
import { superAdminApi } from "../../auth";
import { Circles } from "react-loader-spinner";
import moment from "moment";


export default function PatientRecords() {
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
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
        <div>
            <div
                style={{
                    width: '100%',
                    display: 'flex',         // add this
                    justifyContent: 'end', // horizontally center
                    alignItems: 'end',
                    gap: '10px'      // vertically bottom         // height dena zaroori hai
                }}
            >
                <input
                    onChange={(e) => filter(e.target.value)}
                    style={{
                        width: '170px',
                    }}
                    type="text"
                    placeholder="Search"
                />
                <input style={{
                    width: '170px',
                }} type="date" />

            </div>
            <div style={{ marginTop: '10px' }}>
                <div className="hosptialHeading">
                    <p>Patient ID</p>
                    <p>Name</p>
                    <p>Age</p>
                    <p>Hospital</p>
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
                                <p>{patient.name}</p>
                                <p>{patient.age}</p>
                                <p>{patient?.hospitalId?.name || "N/A"}</p>
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
        </div>
    )
}