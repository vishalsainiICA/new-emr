import { useEffect, useState } from "react";
import './AdminManagement.css'
import { Circles } from "react-loader-spinner";
import moment from "moment";
import { superAdminApi } from "../../../auth";
import { toast } from "react-toastify";


export default function AdminManagement() {
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [assinAdmin, setAssignAdmin] = useState(null)
    const [filterPatient, setFilterPatient] = useState([]);
    const [doctorData, setDoctorData] = useState({
        doctorName: "",
        email: "",
        contact: "",
        experience: "",
        qualification: "",
        docId: null
    });

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

    const handleAddAdmin = async () => {
        try {
            const res = await superAdminApi.addAdmin(doctorData)
            if (res.status === 200) {
                toast.success(`Pa Added for ${assinDoctor?.name}`)
                setAssignAdmin(null)
            }
        } catch (error) {
            console.log(err);
            toast.success(err.response?.data?.message || "Internal Server Error");
        }
    }

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

            <div className="customCard" style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div className="hospitalMangement" >
                    <h3>Admin Management</h3>
                    <p style={{
                        fontSize: '10px'
                    }}>Manage and monitor all healthcare facilities in the network</p>
                </div>
                <button
                    onClick={() => setAssignAdmin("NewAdmin")}
                    style={{

                    }} className="common-btn">+ New Admin</button>
            </div>

            <div className="customCard">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}
                >
                    <h4>Admin Records</h4>
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
                        <input style={{
                            padding: "7px"
                        }} type="date" />
                    </div>


                </div>
                <div className="patientHeading">
                    <p>Admin ID</p>
                    <p>Name</p>
                    <p>Age</p>
                    <p>Email</p>
                    <p>Active</p>
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
                            <div key={i} className="patientBody" >
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
                        No Admin found
                    </p>
                )}
            </div>
            {
                assinAdmin !== null && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(19, 5, 5, 0.6)',
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            minHeight: '400px',
                            width: '600px',
                            padding: '20px',
                            borderRadius: '10px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3>
                                    {`New Admin`}
                                </h3>
                                <i
                                    onClick={() => setAssignAdmin(null)}
                                    className="ri-close-large-line"
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                ></i>
                            </div>

                            {/*Doctor Data Form */}
                            <div style={{
                                marginTop: '10px',
                                display: 'flex',
                                columnGap: '10px'
                            }}>
                                <label style={{ width: '100%' }}>
                                    Name *
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={doctorData.doctorName}
                                        onChange={(e) => setDoctorData({ ...doctorData, doctorName: e.target.value })}
                                    />
                                </label>

                                <label style={{ width: '100%' }}>
                                    Email *
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={doctorData.email}
                                        onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                                    />
                                </label>
                            </div>

                            <div style={{
                                marginTop: '10px',
                                display: 'flex',
                                columnGap: '10px'
                            }}>
                                <label style={{ width: '100%' }}>
                                    Contact Number *
                                    <input
                                        type="text"
                                        placeholder="Contact Number"
                                        value={doctorData.contact}
                                        onChange={(e) => setDoctorData({ ...doctorData, contact: e.target.value })}
                                    />
                                </label>

                                <label style={{ width: '100%' }}>
                                    Experience (years) *
                                    <input
                                        type="number"
                                        placeholder="ex.2"
                                        value={doctorData.experience}
                                        onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value })}
                                    />
                                </label>
                            </div>

                            <label style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: '10px'
                            }}>
                                Qualification *
                                <select
                                    style={{ padding: '10px', borderRadius: '7px' }}
                                    value={doctorData.qualification}
                                    onChange={(e) => setDoctorData({ ...doctorData, qualification: e.target.value })}
                                >
                                    <option value="">Select_Degree</option>
                                    <option value="Graduation">Graduation</option>
                                    <option value="Post-Graduation">Post-Graduation</option>
                                </select>
                            </label>

                            {/*Action Buttons */}
                            <div style={{
                                marginTop: '30px',
                                display: 'flex',
                                justifyContent: 'end',
                                gap: '10px'
                            }}>
                                <button className="common-btn" onClick={() => setAssignAdmin(null)}>Cancel</button>
                                <button onClick={() => {

                                    setDoctorData({ ...doctorData, docId: assinAdmin._id })
                                    // console.log("dodo", doctorData);
                                    // console.log("assinAdmin", assinAdmin._id);

                                    handleAddAdmin()
                                }} >Add Doctor</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}