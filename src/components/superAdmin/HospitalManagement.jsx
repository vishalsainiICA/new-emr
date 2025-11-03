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
            <div style={{
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

            </div>

            {/* hospital performance */}

            <div className="hospitalperformance">
                <div className="hosptialHeading">
                    <p>Hospital</p>
                    <p>Location</p>
                    <p>Revenue</p>
                    <p>Patients</p>
                    <p>CreateBy</p>
                    <p>CreateAt</p>
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

                {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length > 0 && filterHospital.map((hos, i) => (
                    <div key={i}

                        className="hosptialBody"
                    >
                        <div>
                            <h3 style={{ margin: 0 }}>{hos.name || "Unnamed Hospital"}</h3>
                            <p style={{ margin: 0, }}>Director {hos?.medicalDirector?.name || "N/A"}</p>
                            <p style={{ margin: 0, color: 'blue' }}>Schemes {hos?.patientCategories?.join(",") || "N/A"}</p>
                        </div>
                        <h4 style={{ margin: 0 }}>{hos.address},{hos.city} ,{hos.state},{hos.pinCode} </h4>
                        <h4 style={{ margin: 0, color: 'green' }}>₹ {hos?.totalRevenue || "N/A"}</h4>
                        <h4 style={{ margin: 0 }}>{hos?.totalPatient || "N/A"}</h4>
                        <div>
                            <h4 style={{ margin: 0 }}>{hos?.adminId?.name || "super-admin"}</h4>
                            <p style={{ margin: 0, }}>{hos?.adminId?.email || "super@admin"}</p>

                        </div>

                        <h4 style={{ margin: 0 }}>{moment(hos?.createdAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</h4>
                        {/* <span><i class="ri-edit-box-line"></i><i class="ri-delete-bin-6-line"></i></span>a */}

                    </div>
                ))}



                {!isProcessing && !error && Array.isArray(filterHospital) && filterHospital.length === 0 && (
                    <p
                        style={{ textAlign: 'center', padding: '50px 0' }}
                    >No hospitals found</p>
                )}
            </div>
        </div>
    );
}

