import "./Priscription.css"
import srk from "../../../assets/srk-removebg-preview.png"
import scanmer from "../../../assets/Screenshot 2025-11-12 122020.png"
import nabh from "../../../assets/nabh-accreditated-inodaya-hospital.png"
import nabl from "../../../assets/nabl-logo-png_seeklogo-398757.png"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Pricription = () => {
    const navigate = useNavigate()
    const [state, setState] = useState(null);
    const location = useLocation();


    useEffect(() => {
        const data = location.state?.data;
        if (!data) {
            navigate("/doctor");
            return;
        }
        console.log("Received Data:", data);
        setState(data);
    }, [location.state, navigate]);



    return (
        <div className="priscription">
            <button onClick={() => navigate(-1)} style={{ display: "flex", gap: "8px" }}> <i class="ri-arrow-left-circle-line" ></i>Back</button>
            <div className="prisciption-detail-form">
                <div className="logo-and-detail">
                    <img src={srk} alt="logo-hospital" />
                    <div
                        style={{
                            width: '50%',
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px"
                        }}
                    >
                        <div className="certified-logo">
                            <img src={nabh} alt="logo-hospital" style={{ height: '60px', width: '90px' }} />
                            <img src={nabl} alt="logo-hospital" style={{ height: '50px', width: '70px' }} />
                        </div>

                        <div className="lable-input">
                            <div style={{ width: "100%", display: "grid", alignItems: "center", }}>
                                <label htmlFor="">BP :</label>
                                <label htmlFor="">PULSE :</label>
                                <label htmlFor="">WEIGHT :</label>
                                <label htmlFor="">LMP :</label>
                            </div>

                            <div>
                                <input type="text" />
                                <input type="text" />
                                <input type="text" />
                                <input type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="patient-box">
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>Rx</span>
                    <div style={{
                        minHeight: '100px'
                    }}>
                        <h3>Diagnosis:</h3>
                        {
                            state?.illnessData && (
                                <div style={{
                                    margin: '10px',
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap'
                                }}>
                                    {state?.illnessData?.map((item) => {
                                        return <p style={{
                                            fontSize: '17px'
                                        }}>{item?.illnessName
                                            }</p>
                                    })}
                                </div>

                            )
                        }
                    </div>

                    <div style={{
                        minHeight: '100px'
                    }}>
                        <h3>Presenting Symptoms:</h3>
                        {
                            state?.symtomps && (
                                <div style={{
                                    margin: '10px',
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap'
                                }}>
                                    {state?.symtomps?.map((item) => {
                                        return <p style={{
                                            borderRadius: '10px',
                                            padding: '10px',
                                            backgroundColor: 'rgba(240, 242, 245)',
                                            fontSize: '17px'
                                        }}>{item
                                            }</p>

                                    })}
                                </div>

                            )
                        }
                    </div>
                    <div style={{
                        padding: '20px'
                    }}>
                        {
                            state?.selectedLabTest?.length > 0 && (
                                <div >
                                    <h3>
                                        Recommended Lab Tests:
                                    </h3>

                                    <div style={{
                                        borderLeft: '10px solid skyblue',
                                        borderRadius: '0 0 0 10px',
                                    }} >
                                        {
                                            state?.selectedLabTest.map((lab, i) => {
                                                return <div style={{
                                                    padding: '10px',

                                                    display: 'flex',

                                                    justifyContent: 'space-between'
                                                }}>

                                                    <span>{i + 1} <span>{lab.test}</span></span>
                                                </div>

                                            })
                                        }

                                    </div>

                                </div>
                            )
                        }
                        <br />
                        {
                            state?.medication?.length > 0 && (
                                <div >
                                    <h3>
                                        Prescribed Medications:
                                    </h3>

                                    <div style={{
                                        marginTop: '10px',
                                        padding: '7px',
                                        borderRadius: '7px',
                                        borderLeft: '10px solid skyblue'
                                    }}
                                    >
                                        {
                                            state?.medication.map((med, i) => {

                                                return <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>

                                                    <div>
                                                        <span>{i + 1} <span>{med?.drug_name}</span></span>
                                                        <p>{med?.dosage}</p>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex'
                                                    }}>
                                                        <p>5 Days</p>
                                                        <p>Three times daily</p>
                                                    </div>

                                                </div>

                                            })
                                        }

                                    </div>

                                </div>
                            )
                        }

                    </div>
                </div>
                <div className="other-detail">

                    <div>
                        <img src={scanmer} alt="scanner img" />
                    </div>
                    <div className="about">
                        <span>78-79 Dhuleshwar Garden, Behind HSBC Bank</span>
                        <span>Sardar Patel Marg, C-Scheme, Jaipur-302001</span>
                        <span>Ph .: 0141-2378001, 2379779 | Fax : 0141-2370673 |Appointments : 7023007777</span>
                        <span>Email : srkallahospital@rediffmail.com | Web .: srkallahospitals.com</span>
                    </div>
                </div>


            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ display: "flex", gap: "8px" }}><i class="ri-chat-download-line"></i>Download</button>
                <br />
                <button style={{ display: "flex", gap: "8px" }}><i class="ri-printer-line"></i> Print</button>

            </div>


        </div>
    );
}

export default Pricription