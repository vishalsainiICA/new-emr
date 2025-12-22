import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "./Md_dashboard.css"; // <-- tumhara existing CSS
import { superAdminApi } from "../../../auth";
import RevenueChart from "../../Utility/RevenueChart";
import { Circles } from "react-loader-spinner";


const Md_Dashboard = () => {
    const [metrices, setmetrices] = useState(null);
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCollapse, setCollapse] = useState(false);
    const [isEditprofile, setEditprofile] = useState(false);
    const [changePassword, setChangePassword] = useState(false)
    const [blur, setblur] = useState(false);
    const [logOut, setlogOut] = useState(false);
    // const [isCollapse, setCollapse] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);
    const [superAdmin, setSuperAdmin] = useState(null);
    const [password, setpassword] = useState({
        old: "",
        new: ""
    })

    const getMetricValue = (name) => {
        return metrices?.find((m) => m.key === name)?.value ?? 0;
    };

    useEffect(() => {
        const fetchHospital = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.getHosptialMetrices();
                if (res.status === 200) {
                    setData(res.data.data?.TopPerformanceHospital || []);
                    setmetrices(res.data?.data?.metrices)
                    setFilterHospital(res.data.data?.TopPerformanceHospital || []);
                }
                else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);
                setError({ error: err.response?.data?.message || "Internal Server Error" });
            } finally {
                setIsProcessing(false);
            }
        };
        const fetchProfile = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.fetchProfile();
                if (res.status === 200) {
                    setSuperAdmin(res.data?.data)
                } else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);
                setError({ error: err.response?.data?.message || "Internal Server Error" });
                navigate("/login")
            } finally {
                setIsProcessing(false);
            }
        };
        fetchProfile()
        fetchHospital();
    }, [refresh]);
    useEffect(() => {
        const fetchPatient = async () => {
            setIsProcessing(true);
            try {

                const res = await superAdminApi.hospitalAllPaitent("693bee3d26d881f5bf859905");
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterPatient(res.data.data || []); // initialize filter
                } else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);

                setError({ error: err.response?.data?.message || "Internal Server Error" });
            } finally {
                setIsProcessing(false);
            }
        };
        fetchPatient();
    }, []);

    const handleeditProfile = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const formdata = new FormData();
            formdata.append("name", superAdmin?.name);
            formdata.append("email", superAdmin?.email);
            formdata.append("contact", superAdmin?.contact);

            //Only add password fields if user actually entered something
            if (password.old.trim() !== "" && password.new.trim() !== "") {
                formdata.append("oldPassword", password.old);
                formdata.append("newPassword", password.new);
            }

            const res = await superAdminApi.ediProfile(formdata);

            if (res.status === 200) {
                setSuperAdmin(res.data?.data);
                toast.success("Profile Updated");

                // close edit section
                setEditprofile(false);
                setblur(false);
                setCollapse(false);
                setpassword({ old: '', new: '' });


            } else {
                setError({ profile: res.data?.message || "Something went wrong" });
            }

        } catch (err) {
            console.log(err);
            setError({ profile: err.response?.data?.message || "Internal Server Error" });
        } finally {
            setrefresh((prev) => !prev)
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <div className="hospital-card-list">
                {/* Total Hospital */}
                <div onClick={() => navigate("/super-admin/hospital-management")} id="total-hospital" className="card-list">
                    <div className="card-name">
                        <span>Total Hospital</span>
                        <p style={{ fontSize: "20px" }}>🏥</p>
                    </div>
                    <div>
                        <h2>{getMetricValue("Total Hospital")}</h2>
                        {/* <p>↑ 8% from last quarter</p> */}
                    </div>
                </div>

                {/* Total Patients */}
                <div onClick={() => navigate("/super-admin/patient-management")} id="total-patient" className="card-list">
                    <div className="card-name">
                        <span>Total Patients</span>
                        <p style={{ fontSize: "20px" }}>👥</p>
                    </div>
                    <div>
                        <h2>{Number(getMetricValue("Total MalePatient")) + Number(getMetricValue("Total FemalePatient"))}</h2>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}> <p>Male:</p> <h4>{Number(getMetricValue("Total MalePatient"))}</h4> <p>Female:</p><h4> {Number(getMetricValue("Total FemalePatient"))}</h4>
                        </div>
                    </div>
                </div>

                {/* Total Prescription */}
                <div onClick={() => navigate("/super-admin/patient-management", { state: { status: "rx-done" } })} id="total-prescription" className="card-list">
                    <div className="card-name">
                        <span>Total Prescriptions</span>
                        <p style={{ fontSize: "20px" }}>💊</p>
                    </div>
                    <div>
                        <h2>{getMetricValue("Total Prescbrition")}</h2>
                        {/* <p>↑ This month processed</p> */}
                    </div>
                </div>

                {/* Total Revenue */}
                <div id="total-revenue" className="card-list">
                    <div className="card-name">
                        <span>Total Revenue</span>
                        <p style={{ fontSize: "20px" }}>💰</p>
                    </div>
                    <div>
                        <h2>₹{getMetricValue("Total Revenue")}</h2>
                        {/* <p>↑ 22% monthly revenue</p> */}
                    </div>
                </div>

            </div>
            {/*  chart*/}
            <div className="performance-card">
                <div className="revenue-performance">
                    <p>Revenue Performance</p>
                    <RevenueChart></RevenueChart>


                </div>

                <div className="today-visits">
                    <p>Today's Visits</p>

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

                    {error?.error && (
                        <h4 style={{
                            color: 'red',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '50px 0'
                        }}>{error?.error}</h4>
                    )}

                    {!isProcessing && !error?.error && Array.isArray(filterPatient) && filterPatient?.length > 0 && (
                        <div>
                            {
                                filterPatient.map((patient, index) => {
                                    return <div className="patientCard">
                                        <p>
                                            {patient?.name}
                                        </p>

                                    </div>

                                })
                            }
                        </div>
                    )}



                </div>

            </div>



        </div>
    );
};

export default Md_Dashboard;
