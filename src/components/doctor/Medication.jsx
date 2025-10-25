import { useEffect, useState } from "react";
import { superAdminApi } from "../../auth";
import { Circles } from "react-loader-spinner";



export const Medication = () => {
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

    return <div>
        {/* patient info */}
        <div style={{
            display: 'flex',
            gap: '10px'
        }}>
            <div className="medicationPatieninfo">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <h4>Patient Information</h4>
                    <button style={{
                        padding: '10px',
                        fontSize: '12px',
                        border: '1px solid black'
                    }}>View History</button>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <span>Name:<h4>Vishal</h4></span>
                    <span>Age:<h4>Vishal</h4></span>
                    <span>Gender:<h4>Vishal</h4></span>
                    <span>Phone:<h4>Vishal</h4></span>
                </div>

            </div>
            <div className="medicationPatieninfo">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <h4>Patient Information</h4>
                    <button style={{
                        padding: '10px',
                        fontSize: '12px',
                        border: '1px solid black'
                    }}>View History</button>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <span>Name:<h4>Vishal</h4></span>
                    <span>Age:<h4>Vishal</h4></span>
                    <span>Gender:<h4>Vishal</h4></span>
                    <span>Phone:<h4>Vishal</h4></span>
                </div>

            </div>
        </div>

        {/* Symtomps/illness */}
        <div>
            
        </div>
        <div className="medicationPatienmedication">
            <div style={{
                width: "30%",
                minHeight: '250px'
            }}>
                <h3>Illness/Daignosis</h3>
                <input type="text" placeholder="Enter Illness Related" />
                <h3>Symptoms</h3>
                <input type="text" placeholder="Enter Illness Related" />

            </div>
            <div style={{
                width: "30%",
            }}>
                <h3>Suggested Medication:</h3>
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
                                    padding: '20px',
                                    height: '75px',
                                    backgroundColor: 'white',
                                    borderBottom: '1px solid lightgray',
                                    borderRadius: '10px',
                                    cursor: 'pointer'
                                }}>
                                <div

                                    style={{
                                        padding: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "20px" // space between items
                                    }}
                                > <div>
                                        <h4 style={{ margin: 0 }}>{hos.name || "Unnamed Hospital"}</h4>
                                        <p style={{ margin: 0 }}>{`${hos.city},${hos.state}`}</p>
                                    </div>

                                </div>

                                <div>

                                    <button style={{
                                        padding: '10px',
                                        fontSize: '12px',
                                        border: '1px solid black'
                                    }}>+ Add </button>
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

    </div>

}