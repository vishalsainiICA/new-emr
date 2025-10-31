import { superAdminApi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment'
import { toast } from "react-toastify";

export function AdminManagement() {

    const [data, setData] = useState([]);
    const [assinAdmin, setAssignAdmin] = useState(null)
    const [refresh, setrefresh] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [filterAdmin, setFilterAdmins] = useState([]);
    const [adminData, setAdminData] = useState({
        name: "",
        email: "",
        contact: "",
        creationfor: "",
    });

    const handleAddAdmin = async () => {
        if (!adminData.name || !adminData.email) {
            toast.error("Please fill all required fields!");
            return;
        }
        setIsProcessing(true);
        setError(null);
        try {
            const res = await superAdminApi.addAdmin(adminData);
            if (res.status === 200) {
                toast.success("Admin added successfully!");
                setAssignDoctor(null);
                setAssignAdmin({
                    name: "",
                    email: "",
                    contact: "",
                    creationfor: "",
                });
                setAssignAdmin(null)
                setrefresh(!refresh)
            } else {
                toast.error(res.data?.message || "Something went wrong");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Internal Server Error");
        } finally {
            setIsProcessing(false);
        }
    };
    const navigate = useNavigate()
    const filter = (value) => {

        if (value.trim() === "") {
            setFilterAdmins(data)
        }
        const filter = data.filter((hos) => {
            return hos.name.toLowerCase().startsWith(value.toLowerCase())
        })
        setFilterAdmins(filter)

    }

    const handleDelete = async (hos) => {
        try {
            const isConfirm = confirm('Are you sure delete  ' + hos.name)
            if (isConfirm) {
                const res = await superAdminApi.deleteAdmin(hos?._id)
                if (res.status === 200) {
                    toast.success('deleted successfully')
                    setrefresh(!refresh)
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        }
    }
    useEffect(() => {
        const fetchAdmins = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.getAllAdmins();
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterAdmins(res.data.data || []); // initialize filter
                } else {
                    setError(res.data?.message || "Something went wrong");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Internal Server Error");
            } finally {
                setIsProcessing(false);
            }
        };

        fetchAdmins();
    }, [refresh]);


    return (
        <div className="dashboard">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <h2>Admin Management</h2>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                }}>
                    <input style={{
                        height: '40px',
                        width: '300px',
                        padding: '10px'
                    }} type="search" placeholder="type name.." onChange={(e) => filter(e.target.value)} />
                    <input style={{
                        height: '40px',
                        width: '250px',
                        padding: '10px',
                        cursor: "pointer"
                    }} type="date" />
                    <button className="commonBtn" onClick={() => setAssignAdmin('New Admin')}>New Admin</button>
                </div>

            </div>

            {/* hospital performance */}

            <div className="hospitalperformance">
                <div className="hosptialHeading">
                    <p>AdminId</p>
                    <p>Creation For</p>
                    <p>Email</p>
                    <p>Name</p>
                    <p>CreateAt</p>
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

                {!isProcessing && !error && Array.isArray(filterAdmin) && filterAdmin.length > 0 && filterAdmin.map((hos, i) => (
                    <div key={i}

                        className="hosptialBody"
                    >
                        <h4 style={{ margin: 0 }}>A00{i + 1}</h4>
                        <h4 style={{ margin: 0 }}>{hos?.creationfor || "N/A"}</h4>
                        <h4 style={{ margin: 0 }}>{hos.name || "N/A"}</h4>
                        <h4>{hos?.email || "N/A"}</h4>
                        <h4 style={{ margin: 0 }}>{moment(hos?.createdAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</h4>
                        <span style={{
                            marginLeft: '10px',
                            display: 'flex',
                            gap: '20px'
                        }}><i class="ri-edit-box-line" onMouseOver={(e) => (e.target.style.color = 'green')}
                            onMouseOut={(e) => (e.target.style.color = '#555')}></i><i
                                onClick={() => handleDelete(hos)}
                                onMouseOver={(e) => (e.target.style.color = 'red')}
                                onMouseOut={(e) => (e.target.style.color = '#555')} class="ri-delete-bin-6-line"></i></span>

                    </div>
                ))}
                {!isProcessing && !error && Array.isArray(filterAdmin) && filterAdmin.length === 0 && (
                    <p
                        style={{ textAlign: 'center', padding: '50px 0' }}
                    >No Admin found</p>
                )}
            </div>
            {assinAdmin !== null && (
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
                                    value={adminData.name}
                                    onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                                />
                            </label>

                            <label style={{ width: '100%' }}>
                                Email *
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={adminData.email}
                                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
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
                                    value={adminData.contact}
                                    onChange={(e) => setAdminData({ ...adminData, contact: e.target.value })}
                                />
                            </label>
                        </div>

                        <label style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '10px'
                        }}>
                            Role *
                            <select
                                style={{ padding: '10px', borderRadius: '7px', cursor: 'pointer' }}
                                value={adminData.creationfor}
                                onChange={(e) => setAdminData({ ...adminData, creationfor: e.target.value })}
                            >
                                <option value="">Select Role</option>
                                <option value="Hospital Onboard">Hospital Onboard</option>
                                <option value="Hospital Management">Hospital Management</option>
                                <option value="Research & Analysis">Research & Analysis</option>
                            </select>

                        </label>

                        {/*Action Buttons */}
                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'end',
                            gap: '10px'
                        }}>
                            <button onClick={() => setAssignAdmin(null)}>Cancel</button>

                            {isProcessing ?
                                <p style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'lightblue',
                                    textAlign: 'center',
                                    width: '80px',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Circles height="20" width="20" color="#4f46e5" ariaLabel="loading" />
                                </p>
                                : <button style={{
                                    backgroundColor: "lightblue"
                                }} onClick={handleAddAdmin}>
                                    Save
                                </button>
                            }

                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}