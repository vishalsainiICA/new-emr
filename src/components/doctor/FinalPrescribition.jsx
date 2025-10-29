import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

const FinalPrescription = () => {
    const [state, setState] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const data = location.state?.data;
        if (!data) {
            navigate("/doctor/dashboard");
            return;
        }

        console.log("Received Data:", data);
        setState(data);
    }, [location.state, navigate]);

    if (!state) return <p>Loading...</p>;

    return (
        <div style={{
            width: "100vw",
            padding: '30px',
            backgroundColor: 'rgba(249, 250, 251)'

        }}>
            <div style={{
                display: 'flex',
                justifyContent: "space-between",
                border: '1px solid lightgrey',
                minHeight: '70px',
                maxHeight: '50px',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',  // 👈 subtle shadow
                backgroundColor: 'white',
                borderRadius: '6px',
                marginBottom: '20px'
            }}>
                <button onClick={() => navigate(-1)}>
                    <BsArrowLeft /> Back to Dashboard
                </button>

                <div style={{
                    display: 'flex',
                    gap: '10px'
                }}>
                    <button style={{
                        padding: '10px',
                        fontSize: '12px',
                        width: '105px'
                    }}><i class="ri-printer-line"></i> Print</button>

                    <button
                        onClick={() => {
                            navigate('/doctor/final-prescription', {
                                state: {
                                    data: {
                                        patientInfo: patient,
                                        hospitalData: patient?.hospitalId,
                                        illnessData: symtomps
                                    }
                                }
                            })
                        }}
                        style={{
                            padding: '10px',
                            fontSize: '14px',
                            width: '170px',
                            border: '1px solid black',
                            backgroundColor: '#f8f8f8',
                            boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' // 👈 optional shadow for this button too
                        }}
                    >
                        <i class="ri-download-line"></i> Download PDF
                    </button>
                </div>
            </div>

            <div className="finalprescription">
                <div className="heading">
                    <h3>Manipal hospital</h3>
                    <h4>Manipal hospital</h4>
                    <p>MBBBS</p>
                    <p>+91 98765 00000 , dr.arun@citymedical.com</p>
                </div>
                <div className="Info">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',


                    }}>
                        <h3>Patient Details:</h3>
                        <span>
                            <h5>
                                {new Date().toLocaleTimeString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h5>
                        </span>


                    </div>

                    <div style={{
                        marginTop: '20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',  // 2 columns
                        gap: '10px',
                    }}>
                        <h5>Name : Vishal Saini</h5>
                        <h5>Age : 26</h5>
                        <h5>Gender : Male</h5>
                        <h5>Phone : 9876543210</h5>
                        <h5>Address : Delhi</h5>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <div style={{
                        minHeight: '100px'
                    }}>
                        <h3>Diagnosis:</h3>
                        {console.log('state', state)
                        }
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
                    <hr />
                    <h1>℞ </h1>
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
                                                        <span>{i + 1} <span>Paracetamol</span></span>
                                                        <p>Acetaminophen 500mg</p>
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

                {/* <div style={{
                    backgroundColor: 'rgba(240, 242, 245)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50px',
                   
                }}>
                    <p style={{
                        fontSize: '15px',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: '1.4'
                    }}>
                        This is a computer-generated prescription and is valid without signature<br />
                        City Medical Center • +91 98765 00000 • dr.arun@citymedical.com
                    </p>
                </div> */}

            </div>

        </div >
    );
};

export default FinalPrescription;
