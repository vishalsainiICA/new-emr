import { superAdminApi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function HospitalManagement() {

    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [filterHospital, setFilterHospital] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchHospital = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.getHosptialMetrices();
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterHospital(res.data.data?.TopPerformanceHospital || []); // initialize filter
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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <h2>Hospital Management</h2>
                <button className="commonBtn" onClick={() => navigate('/new-hosptial')}>Add New Hospital</button>
            </div>

            {/* hospital performance */}

            <div className="hospitalperformance">
                <div className="hosptialHeading">
                    <p>Hospital</p>
                    <p>Location</p>
                    <p>Revenue</p>
                    <p>Patients</p>
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

                {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length > 0 && (
                    <div style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginTop: '20px',
                        // minHeight: '500px'
                    }}>
                        {filterHospital.map((hos, i) => (
                            <div key={i}
                                style={{
                                    width: '80%',

                                    backgroundColor: 'white',
                                    border: '1px solid lightgray',
                                    padding: '15px 15px 15px 30px',
                                    borderRadius: '10px',
                                    margin: '0 0 10px 10px',

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

                                    <div>
                                        <h4 style={{ margin: 0 }}>{hos.name || "Unnamed Hospital"}</h4>
                                        <p style={{ margin: 0 }}>{hos.location || "Unknown location"}</p>
                                    </div>

                                </div>

                                <div>
                                    <h4>{hos.name || "Unnamed Hospital"}</h4>
                                    <p>{hos.location || "Unknown location"}</p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

                {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length === 0 && (
                    <p
                        style={{ textAlign: 'center', padding: '50px 0' }}
                    >No hospitals found</p>
                )}
            </div>
        </div>
    );
}

