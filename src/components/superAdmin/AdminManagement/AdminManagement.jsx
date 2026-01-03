import { useEffect, useState } from "react";
import './AdminManagement.css'
import { Circles } from "react-loader-spinner";
import moment from "moment";
import { superAdminApi } from "../../../auth";
import { toast } from "react-toastify";


export default function AdminManagement() {
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [error, setError] = useState(null);
    const [assinAdmin, setAssignAdmin] = useState(null)
    const [filterPatient, setFilterPatient] = useState([]);

    const [doctorData, setadminData] = useState({
        name: "",
        email: "",
        contact: "",
        experience: "",
        creationfor: "",
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
                const res = await superAdminApi.getAllAdmins();
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
    }, [refresh]);

    const handleAddAdmin = async () => {

        // Required field check
        if (
            !doctorData.name ||
            !doctorData.email ||
            !doctorData.contact ||
            !doctorData.experience ||
            !doctorData.creationfor
        ) {
            toast.error("Please fill all required fields!");
            return;
        }

        // Regex patterns
        const nameRegex = /^[A-Za-z ]+$/;
        const contactRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Name validation
        if (!nameRegex.test(doctorData.name)) {
            toast.error("Name must contain only alphabets!");
            return;
        }

        // Contact number validation
        if (!contactRegex.test(doctorData.contact)) {
            toast.error("Contact must be a valid 10-digit number!");
            return;
        }

        // Experience validation
        if (Number(doctorData.experience) > 100) {
            toast.error("Experience must be less than 100 years!");
            return;
        }

        // Email validation
        if (!emailRegex.test(doctorData.email)) {
            toast.error("Invalid email!");
            return;
        }
        try {
            setIsProcessing(true)
            const res = await superAdminApi.addAdmin(doctorData)
            if (res.status === 200) {
                toast.success(`Admin Added Successfully`)
                setAssignAdmin(null)
                setadminData(null)
                setrefresh((prev) => !prev)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
        finally {
            setIsProcessing(false)
        }
    }

    const handleeditAdmin = async (id) => {
        try {
            setIsProcessing(true)
            const res = await superAdminApi.editAdmin(id, doctorData)
            if (res.status === 200) {
                toast.success(`Admin Updated Successfully`)
                setAssignAdmin(null)
                setadminData(null)
                setrefresh((prev) => !prev)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
        finally {
            setIsProcessing(false)
        }
    }

    const handlechangeStatus = async (id, status) => {
        try {
            setIsProcessing(true)
            const res = await superAdminApi.changeStatus(id, status)
            if (res.status === 200) {
                toast.success(` Status Updated`)
                setrefresh((prev) => !prev)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
        finally {
            setIsProcessing(false)
        }
    }


    const handledeleteadmin = async (doc) => {
        try {
            const isConfirm = confirm(`Are You Sure You Want To Delete Dr.${doc?.name}`)
            if (!isConfirm) return
            setIsProcessing(true);
            const res = await superAdminApi.deleteAdmin(doc?._id);
            if (res.status === 200 || (await res).data.status === 200) {
                toast.success("Admin remove successfully");
                setrefresh(prev => !prev);
            } else {
                toast.error("Failed to remove Admin")
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div >


            <div className="customCard" style={{
                display: 'flex',
                justifyContent: 'space-between',
                minWidth:'600px'
            }}>
                <div className="hospitalMangement">
                    <h3>Admin Management</h3>
                    <p style={{
                        fontSize: '10px'
                    }}>Manage and monitor all healthcare facilities in the network</p>
                </div>
                <button
                    onClick={() => setAssignAdmin({ type: "new" })}
                    style={{

                    }} className="common-btn hidebutton">+ New Admin</button>
            </div>

            <div className="customCard" style={{
                    minWidth:'600px'
                }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                    
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
                    <p>Role</p>
                    <p>Email</p>
                    <p>Date</p>
                    <p>Status</p>
                    <p>Control</p>

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
                                <p>{`${patient?.name?.trim().slice(0, 3).toUpperCase()}-${i + 1}`}</p>
                                <p>{patient?.name}</p>
                                <p>{patient?.role}({patient?.experience || "0"})</p>
                                <p>{patient?.email || "N/A"}</p>
                                <p>{moment(patient?.updatedAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</p>
                                <span >
                                    <button
                                        className={`${patient?.status ? "active-btn" : "de-active-btn"}`}
                                        onClick={() => handlechangeStatus(patient?._id, patient?.status)}
                                    >
                                        {patient?.status ? "Active" : "De-Active"}
                                    </button>
                                    {/* <i class="ri-delete-bin-6-line"></i> */}
                                </span>
                                <div style={{
                                    display: "flex",
                                    gap: '10px',
                                    marginRight: '10px',
                                }}>
                                    <i class="ri-edit-box-line" onClick={() => {
                                        setadminData(patient)
                                        setAssignAdmin({ type: "edit", admin: patient })
                                    }
                                    }></i>
                                    <i class="ri-delete-bin-7-line" onClick={() => handledeleteadmin(patient)} ></i>
                                </div>


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
                assinAdmin !== null && assinAdmin?.type === "new" && (
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
                                        value={doctorData?.name}
                                        onChange={(e) => setadminData({ ...doctorData, name: e.target.value })}
                                    />
                                </label>

                                <label style={{ width: '100%' }}>
                                    Email *
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={doctorData?.email}
                                        onChange={(e) => setadminData({ ...doctorData, email: e.target.value })}
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
                                        onChange={(e) => setadminData({ ...doctorData, contact: e.target.value })}
                                    />
                                </label>

                                <label style={{ width: '100%' }}>
                                    Experience (years) *
                                    <input
                                        type="number"
                                        placeholder="ex.2"
                                        value={doctorData.experience}
                                        onChange={(e) => setadminData({ ...doctorData, experience: e.target.value })}
                                    />
                                </label>
                            </div>

                            <label style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: '10px'
                            }}>
                                Creationfor *
                                <select
                                    style={{ padding: '10px', borderRadius: '7px' }}
                                    value={doctorData.creationfor}
                                    onChange={(e) => setadminData({ ...doctorData, creationfor: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="For Analyst">For Analyst</option>
                                    <option value="Hospital Creation">Hospital Creation</option>
                                </select>
                            </label>

                            {/*Action Buttons */}
                            <div style={{
                                marginTop: '30px',
                                display: 'flex',
                                justifyContent: 'end',
                                gap: '10px'
                            }}>
                                <button className="regular-btn" onClick={() => setAssignAdmin(null)}>Cancel</button>
                                <button className="common-btn"
                                    disabled={isProcessing}
                                    onClick={() => {
                                        handleAddAdmin()
                                    }} >{isProcessing ? "adding..." : "Add Admin"}</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                assinAdmin !== null && assinAdmin?.type === "edit" && (
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
                                    {`Update Profile`}
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
                                        value={doctorData?.name}
                                        onChange={(e) => setadminData({ ...doctorData, name: e.target.value })}
                                    />
                                </label>

                                <label style={{ width: '100%' }}>
                                    Email *
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={doctorData.email}
                                        onChange={(e) => setadminData({ ...doctorData, email: e.target.value })}
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
                                        onChange={(e) => setadminData({ ...doctorData, contact: e.target.value })}
                                    />
                                </label>

                                <label style={{ width: '100%' }}>
                                    Experience (years) *
                                    <input
                                        type="number"
                                        placeholder="ex.2"
                                        value={doctorData.experience}
                                        onChange={(e) => setadminData({ ...doctorData, experience: e.target.value })}
                                    />
                                </label>
                            </div>

                            <label style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: '10px'
                            }}>
                                Creationfor *
                                <select
                                    style={{ padding: '10px', borderRadius: '7px' }}
                                    value={doctorData.creationfor}
                                    onChange={(e) => setadminData({ ...doctorData, creationfor: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="For Analyst">For Analyst</option>
                                    <option value="Hospital Creation">Hospital Creation</option>
                                </select>
                            </label>

                            {/*Action Buttons */}
                            <div style={{
                                marginTop: '30px',
                                display: 'flex',
                                justifyContent: 'end',
                                gap: '10px'
                            }}>
                                <button className="regular-btn" disabled={isProcessing} onClick={() => setAssignAdmin(null)}>Cancel</button>
                                <button className="common-btn"
                                    disabled={isProcessing}
                                    onClick={() => {
                                        handleeditAdmin(assinAdmin?.admin?._id)
                                    }} >{isProcessing ? "saving..." : "Update Admin"}</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}