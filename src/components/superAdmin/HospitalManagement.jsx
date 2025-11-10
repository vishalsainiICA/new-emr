import { commonApi, superAdminApi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment'

export function HospitalManagement() {

    const [data, setData] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);
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
                    setFilterHospital(res.data.data || []); // initialize filter
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
    }, []);



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
                    onClick={() => navigate('/new-hosptial')}
                    style={{

                    }} className="commonBtn">+ Add New Hospital</button>
            </div>
            {/* <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <h2>Hospital Management</h2>
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
                    <button className="commonBtn" onClick={() => navigate('/new-hosptial')}>Add New Hospital</button>
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

            <div className="customCard" style={{
                height: '100vh',
                marginTop: '10px',

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
                        <div key={i}
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
                                        <p>📍{hos?.state}</p>
                                    </div>
                                    <p style={{
                                        padding: '10px',
                                        backgroundColor: 'rgba(243, 243, 254)',
                                        color: 'rgba(141, 129, 244)',
                                        fontWeight: 'bold'

                                    }}>General Hospital</p>
                                </div>

                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: "space-around"
                            }}>
                                <p style={{
                                    fontSize: '14px'
                                }}>Beds <h5>456</h5></p>
                                <p style={{
                                    fontSize: '14px'
                                }}>Beds <h5>456</h5></p>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: "space-around"
                            }}>
                                <p style={{
                                    fontSize: '14px'
                                }}>Beds <h5>456</h5></p>
                                <p style={{
                                    fontSize: '14px'
                                }}>Beds <h5>456</h5></p>
                            </div>

                            <h5>Key Departments:</h5>

                            <div style={{
                                display: 'flex',
                                gap: '10px'
                            }}>
                                <button
                                    onClick={() => navigate("/view-hospital", { state: { hospital: hos } })}
                                    style={{
                                        height: '30px',
                                        width: '70px',
                                        fontSize: '10px',
                                        backgroundColor: 'rgba(219, 219, 252)',
                                        border: "none"
                                    }}> 👁️ View</button>

                                <button style={{
                                    height: '30px',
                                    width: '70px',
                                    fontSize: '10px',
                                    backgroundColor: 'rgba(235, 254, 246)',
                                    border: "none"
                                }}>✏️ Edit</button>

                                <button style={{
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

