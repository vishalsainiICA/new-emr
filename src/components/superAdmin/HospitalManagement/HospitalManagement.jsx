import { commonApi, superAdminApi } from "../../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './HospitalManagement.css'
import { toast } from "react-toastify";


const HospitalManagement = () => {

    const [data, setData] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState(null);
    const [filterHospital, setFilterHospital] = useState([]);
    const navigate = useNavigate()
    const filter = (value) => {

        if (value.trim() === "") {
            setFilterHospital(data)
        }
        const filter = data.filter((hos) => {
            return hos.name.toLowerCase().startsWith(value.toLowerCase())
        })
        setFilterHospital(filter)

    }
    useEffect(() => {
        const fetchHospital = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.getAllhosptial();
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterHospital(res.data.data || []);
                    // initialize filter
                } else {
                    setError(res.data?.message || "Something went wrong");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Internal Server Error");
            } finally {
                setIsProcessing(false);
            }
        };

        fetchHospital();
    }, [refresh]);

    const handledelete = async (id) => {
        try {
            const isCheck = confirm("Are you Sure you Want to Delete this Hospital !")
            if (!isCheck) return
            setIsProcessing(true);
            const res = await superAdminApi.delethospital(id);
            if ((await res).status === 200 || (await res).data.status === 200) {
                toast.success("Hospital delete successfully");
                setRefresh(prev => !prev);
            } else {
                toast.error("Failed to register hospital")
            }
        } catch (err) {
            console.error("Error while adding hospital:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="dashboard">

            <div className="customCard" style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div className="hospitalMangement" >
                    <h3>Hospital Management</h3>
                    <p style={{
                        fontSize: '10px'
                    }}>Manage and monitor all healthcare facilities in the network</p>
                </div>
                <button
                    onClick={() => navigate('/super-admin/new-hospital')}
                    style={{

                    }} className="common-btn">+ Add New Hospital</button>
            </div>
            {/* 
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

            </div> */}
            {/* hospital performance */}

            <div className="customCard" style={{
                height: '100vh',
                marginTop: '10px'
            }}>
                <h4>Hospital Directory</h4>
                <div className="hostpitalmanagement-body" style={{
                    marginTop: '12px',
                    height: "100vh"
                }}>
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

                    {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length > 0 && filterHospital.map((hos, i) => (
                        <div
                            onDoubleClick={() => navigate("/super-admin/view-hospital", { state: { hospital: hos } })}
                            key={i}
                            className="customCard hover "
                            style={{
                                maxHeight: '290px'
                            }}

                        >
                            <div style={{
                                display: 'flex'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '35px',
                                    backgroundColor: 'rgba(141, 129, 244)',
                                    display: 'flex',
                                    justifyContent: "center",
                                    alignItems: 'center',
                                    borderRadius: '10px'

                                }}>
                                    <h2 style={{
                                        color: 'white'
                                    }}>E</h2>
                                </div>
                                <div style={{
                                    marginLeft: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}>
                                    <div>
                                        <h4>{hos?.name}</h4>
                                        <p style={{
                                            fontSize: '12px'
                                        }}>📍{hos?.state}</p>
                                    </div>
                                    <p style={{
                                        padding: '10px',
                                        backgroundColor: 'rgba(243, 243, 254)',
                                        color: 'rgba(141, 129, 244)',
                                        fontWeight: 'bold'

                                    }}>General Hospital</p>
                                </div>

                            </div>

                            <div className="hos-metrices">
                                <div className="">
                                    <p >Beds <h5>456</h5></p>
                                    <p >Beds <h5>456</h5></p>
                                </div>
                                <div className="" >
                                    <p >Beds <h5>456</h5></p>
                                    <p >Beds <h5>456</h5></p>
                                </div>
                            </div>



                            <h5>Key Departments:</h5>

                            <div style={{
                                display: 'flex',
                                gap: '10px'
                            }}>
                                <button
                                    onClick={() => navigate("/super-admin/view-hospital", { state: { hospital: hos } })}
                                    style={{
                                        height: '30px',
                                        width: '70px',
                                        fontSize: '10px',
                                        backgroundColor: 'rgba(219, 219, 252)',
                                        border: "none"
                                    }}> 👁️ View</button>

                                {/* <button style={{
                                    height: '30px',
                                    width: '70px',
                                    fontSize: '10px',
                                    backgroundColor: 'rgba(235, 254, 246)',
                                    border: "none"
                                }}>✏️ Edit</button> */}

                                <button
                                    onClick={() => handledelete(hos?._id)}
                                    style={{
                                        height: '30px',
                                        width: '70px',
                                        fontSize: '10px',
                                        backgroundColor: 'rgba(252, 231, 231)',
                                        border: "none"
                                    }}>🗑️ Delete</button>
                            </div>


                        </div>
                    ))}



                    {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length === 0 && (
                        <p
                            style={{ textAlign: 'center', padding: '50px 0' }}
                        >No hospitals found</p>
                    )}
                </div>


            </div>
        </div >
    );
}

export default HospitalManagement

