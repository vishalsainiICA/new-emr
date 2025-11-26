import "./Priscription.css"
import srk from "../../../assets/srk-removebg-preview.png"
import scanmer from "../../../assets/Screenshot 2025-11-12 122020.png"
import nabh from "../../../assets/nabh-accreditated-inodaya-hospital.png"
import nabl from "../../../assets/nabl-logo-png_seeklogo-398757.png"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useRef } from "react"
import { doctorAPi } from "../../../auth"
import { toast } from "react-toastify"
import moment from "moment"

const Pricription = () => {
    const navigate = useNavigate()
    const [state, setState] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false)
    const location = useLocation();
    const pdfRef = useRef();
    const downloadPDF = () => {
        const input = pdfRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("prescription.pdf");
        });
    };

    const generatePDFBlob = () => {
        return new Promise((resolve) => {
            const input = pdfRef.current;

            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

                // 👉 pdf को Blob में convert करें
                const pdfBlob = pdf.output("blob");

                resolve(pdfBlob);
            });
        });
    };


    useEffect(() => {
        const data = location.state?.data;
        if (!data) {
            navigate("/doctor");
            return;
        }
        console.log("Received Data:", data);
        setState(data);
    }, [location.state, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const form = new FormData()
            const pdfBlob = await generatePDFBlob();
            console.log("state", state);
            console.log("blog", pdfBlob);
            form.append("prescriptionImage", pdfBlob, "prescription.pdf");
            form.append("patientId", state?.patientInfo?._id)
            form.append("initialAssementId", state?.patientInfo?.initialAssementId._id)
            form.append("doctorId", state?.patientInfo?.doctorId)
            form.append("hospitalId", state?.patientInfo?.hospitalId)
            form.append("prescriptionType", state?.type)
            form.append("prescriptionMediciene", JSON.stringify(state?.medication))
            form.append("illness", JSON.stringify(state?.illnessData))
            form.append("symptoms", JSON.stringify(state?.symtomps))
            form.append("labTest", JSON.stringify(state?.selectedLabTest));


            const res = await doctorAPi.savePrescribtion(form);
            toast.success(res?.data?.message || "successfully");
            navigate("/doctor")
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="priscription">
            <button onClick={() => navigate(-1)} style={{ display: "flex", gap: "8px" }}> <i class="ri-arrow-left-circle-line" ></i>Back</button>
            <div className="prisciption-detail-form" ref={pdfRef}>
                <div className="logo-and-detail">
                    <div style={{ width: "70%", backgroundColor: "Back" }}>
                        <img src={srk} height="70px" width="250px" alt="logo-hospital" />
                        <div className="User-inf">
                            <div style={{ display: "flex", gap: "50px" }}>
                                <div style={{ width: "100%", display: "grid", alignItems: "center", }}>
                                    <label htmlFor="">Reg.No.</label>
                                    {/* <input type="text" div/> */}
                                    <div className="user-detail"><p>{state?.patientInfo?.age}</p></div>
                                    <label htmlFor="">Name :</label>
                                    <div className="user-detail"><p>{state?.patientInfo?.name}</p></div>
                                    <label htmlFor="">Age/Sex :</label>
                                    <div className="user-detail"><p>{state?.patientInfo?.gender}</p></div>
                                </div>

                                <div style={{ width: "100%", display: "grid", alignItems: "center", }}>
                                    <label htmlFor="">Reg.Date</label>
                                    <div className="user-detail"><p>{state?.patientInfo?.DOB}</p></div>
                                    <label htmlFor="">Attendee Relation :</label>
                                    <div className="user-detail"><p>{state?.patientInfo?.attendeeRelation}</p></div>
                                    <label htmlFor="">Mobile.No</label>
                                    <div className="user-detail"><p>{state?.patientInfo?.phone}</p></div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Adderess :</label>
                                <div className="user-detail"><p style={{ overflow: "hidden" }}>Jaipur</p></div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            width: '35%',
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                            // backgroundColor:"gold"
                        }}
                    >
                        <div className="certified-logo">
                            <img src={nabh} alt="logo-hospital" style={{ height: '60px', width: '90px' }} />
                            <img src={nabl} alt="logo-hospital" style={{ height: '60px', width: '70px' }} />
                        </div>

                        <div className="lable-input">
                            <div style={{ width: "100%", display: "grid", alignItems: "center", }}>
                                <label htmlFor="">BP :</label>
                                <label htmlFor="">HEART RATE :</label>
                                <label htmlFor="">WEIGHT :</label>
                                <label htmlFor=""> BLOOD GROUP:</label>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "5px", }}>
                                <div className="user-detail"><p>{state?.patientInfo?.initialAssementId?.BP}</p></div>
                                <div className="user-detail"><p>{state?.patientInfo?.initialAssementId?.heartRate}</p></div>
                                <div className="user-detail"><p>{state?.patientInfo?.initialAssementId?.weight}</p></div>
                                <div className="user-detail"><p>{state?.patientInfo?.initialAssementId?.bloodGroup}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="patient-box">
                    <div className="RX">
                        <span style={{ fontSize: "20px", fontWeight: "bold" }}>Rx</span>
                        <div className="RX">
                            <p>{`Type: ${state?.type}`}</p>
                            <p>{moment().format("DD-MM-YYYY hh:mm A")}</p>
                        </div>
                    </div>


                    <br />
                    <div style={{
                        // minHeight: '100px',
                        padding: "4px 30px"
                    }}>
                        {
                            state?.illnessData && (
                                <div style={{
                                    margin: '10px',
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: "center",
                                    flexWrap: 'wrap'
                                }}>
                                    <h4>Diagnosis:</h4>
                                    {state?.illnessData?.map((item) => {
                                        return <p style={{
                                            fontSize: '14px'
                                        }}>{item?.illnessName
                                            }</p>
                                    })}
                                </div>

                            )
                        }
                    </div>

                    <div style={{
                        // minHeight: '100px',
                        padding: "0px 40px"
                    }}>
                        <h4>Presenting Symptoms:</h4>
                        {
                            state?.symtomps && (
                                <div style={{
                                    margin: '10px',
                                    display: 'flex',
                                    gap: '15px',
                                    flexWrap: 'wrap'
                                }}>
                                    {state?.symtomps?.map((item) => {
                                        return <p style={{
                                            borderRadius: '10px',
                                            padding: '5px',
                                            backgroundColor: 'rgba(240, 242, 245)',
                                            fontSize: '10px'
                                        }}>{item
                                            }</p>

                                    })}
                                </div>

                            )
                        }
                    </div>
                    <div style={{
                        padding: "0px 40px"
                    }}>
                        {
                            state?.selectedLabTest?.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} >
                                    <h4>
                                        Recommended Lab Tests:
                                    </h4>

                                    <div style={{
                                        borderLeft: '10px solid skyblue',
                                        borderRadius: '0 0 0 10px',
                                        display: "flex",
                                        flexDirection: "column"
                                        , gap: "10px"
                                    }} >
                                        {
                                            state?.selectedLabTest.map((lab, i) => {
                                                return <div style={{
                                                    padding: '2px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: "11px"
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
                                    <h4>
                                        Prescribed Medications:
                                    </h4>

                                    <div style={{
                                        marginTop: '10px',
                                        padding: '7px',
                                        borderRadius: '7px',
                                        borderLeft: '10px solid skyblue',
                                        fontSize: "11px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "5px",
                                    }}
                                    >
                                        {
                                            state?.medication.map((med, i) => {

                                                return <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}>

                                                    <div style={{ width: "70%", display: "flex", gap: "5px" }}>
                                                        <span>{i + 1}</span>
                                                        <span>{med?.drug_name}</span>
                                                        <p>{med?.dosage}</p>
                                                    </div>
                                                    <div style={{
                                                        width: "30%",
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
                <button onClick={downloadPDF} style={{ display: "flex", gap: "8px", width: '150px', cursor: 'pointer' }}><i class="ri-chat-download-line"></i>Download(.pdf)</button>
                <br />
                <button disabled={isProcessing} onClick={(e) => handleSubmit(e)} style={{ display: "flex", gap: "8px", width: '150px', cursor: 'pointer' }}>{` ${isProcessing ? "Saving...." : "Save And Continue`"}`}</button>
            </div>
        </div>
    );
}

export default Pricription