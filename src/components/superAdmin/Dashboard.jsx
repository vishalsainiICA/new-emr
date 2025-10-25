import { superAdminApi } from "../../auth";
import { Circles } from 'react-loader-spinner';
import { useEffect, useState } from "react";

export function Dashboard() {

    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [filterHospital, setFilterHospital] = useState([]);

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
            <h2>Dashboard</h2>

            {/* metrics cards */}
            <div className="dashbaordcardList" style={{ display: 'flex', gap: '10px' }}>
                {data?.metrices?.map((obj, index) => (
                    <div key={index}
                        className="card"
                    >
                        <span style={{ display: 'flex', gap: '20px' }}>
                            <h3>{obj?.key}</h3>
                            <span style={{
                                backgroundColor: 'lightblue',
                                padding: '10px',
                                borderRadius: '10px'
                            }}>
                                <i className="ri-group-line"></i>
                            </span>
                        </span>
                        <h2>
                            {typeof obj?.value === "object"
                                ? JSON.stringify(obj.value)
                                : obj?.value ?? "N/A"}
                        </h2>

                    </div>
                ))}
            </div>

            {/* hospital performance */}
            <div className="hospitalperformance">
                <h3>Hospital Performance</h3>

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
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '80%',
                                    height: '75px',
                                    backgroundColor: 'white',
                                    border: '1px solid lightgray',
                                    padding: '15px 15px 15px 30px',
                                    borderRadius: '10px',
                                    margin: '0 0 10px 10px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
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
                                    <span style={{ fontSize: '18px', fontFamily: 'cursive' }}>{i + 1}.</span>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{hos.name || "Unnamed Hospital"}</h4>
                                        <p style={{ margin: 0 }}>{`${hos.city},${hos.state}`}</p>
                                    </div>

                                </div>

                                <div>
                                    <h4>{hos.totalRevenue || "Unnamed Hospital"}</h4>
                                    <p>{`patients: 0`}</p>
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

export default Dashboard;
