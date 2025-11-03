import { useState } from 'react';


import { doctorAPi } from '../../auth';
import { toast } from 'react-toastify';


const InitialAssesment = () => {
    const [patient, setPatient] = useState({
        uid: "",
        height: null,
        weight: null,
        BP: null,
        bloodGroup: null,
        o2: null,
        heartRate: null,
        sugar: null,
        hemoglobin: null,
        bodyTempreture: null,
        respiratoryRate: null,
    });
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [InputedDocuments, setInputedDocuments] = useState([{ document: null }]);
    const [isUidVerified, setUidVerify] = useState(null)

    const handleAddMoreDocument = () => {
        setInputedDocuments([...InputedDocuments, { document: null }])
    }

    const handleVerifyUID = async () => {
        setIsProcessing(true)
        try {
            const res = await doctorAPi.verifyHUD(patient.uid)
                .then(res => {
                    if (res?.status === 200) {
                        toast.success(res?.data?.message);
                        setIsProcessing(false)
                        setUidVerify(true)
                    }
                    else {
                        setIsProcessing(false)
                        setUidVerify(false)
                        toast.error(res?.data?.message);
                    }

                })

        } catch (error) {
            toast.error(error.response.data.message || 'Internal Server Error')
            setIsProcessing(false)
            setUidVerify(false)
            console.log('error when verify uid', error);
        }
        finally {
            setIsProcessing(false);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const res = doctorAPi.saveInitialAssement(patient).then(res => {
                // fetchBranches();
                // onCancel();
                if (res.status === 200) {
                    setIsProcessing(false);
                    setPatient({
                        uid: "",
                        height: "",
                        weight: "",
                        BP: "",
                        bloodGroup: "",
                        o2: "",
                        heartRate: "",
                        sugar: "",
                        hemoglobin: "",
                        bodyTempreture: "",
                        respiratoryRate: "",
                    })
                    toast.success(res.data.message)

                }
                else {
                    setIsProcessing(false);
                    setUidVerify(null)
                    toast.success(res?.data?.message);
                }
            })
        } catch (error) {
            setUidVerify(null)
            setIsProcessing(false)
            console.log('while assessments', error);
        }
        finally {
            setUidVerify(null)
            setIsProcessing(false);
        }

    };

    const handleDocumentUpload = (e) => {
        const files = e.target.files;
        if (files) {
            const fileNames = Array.from(files).map(file => file.name);
            setUploadedDocuments([...uploadedDocuments, ...fileNames]);

            setTimeout(() => {
                setPatient(prev => ({
                    ...prev,
                    medicalHistory: prev.medicalHistory + (prev.medicalHistory ? '\n' : '') +
                        '• Previous diagnosis: Hypertension (2020)\n• Previous surgery: Appendectomy (2018)\n• Chronic conditions: Diabetes Type 2'
                }));
            }, 1500);
        }
    };

    return (

        <div style={{
            backgroundColor: 'white',
            padding: '20px',

        }} className="steps">
            <h2>Initial Assessment (Vitals)</h2>
            <div style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <label style={{ width: "100%" }}>
                        Height (cm)
                        <input
                            type="number"
                            value={patient.height || ""}
                            onChange={(e) => setPatient({ ...patient, height: e.target.value })}
                            placeholder="Enter Height"
                        />
                    </label>

                    <label style={{ width: "100%" }}>
                        Weight (kg)
                        <input
                            type="number"
                            value={patient.weight || ""}
                            onChange={(e) => setPatient({ ...patient, weight: e.target.value })}
                            placeholder="Enter Weight"
                        />
                    </label>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <label style={{ width: "100%" }}>
                        Blood Pressure (mmHg)
                        <input
                            type="text"
                            value={patient.BP || ""}
                            onChange={(e) => setPatient({ ...patient, BP: e.target.value })}
                            placeholder="e.g. 120/80"
                        />
                    </label>

                    <label style={{ width: "100%" }}>
                        O₂ Saturation (%)
                        <input
                            type="number"
                            value={patient.o2 || ""}
                            onChange={(e) => setPatient({ ...patient, o2: e.target.value })}
                            placeholder="Enter O₂ Level"
                        />
                    </label>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <label style={{ width: "100%" }}>
                        Heart Rate (bpm)
                        <input
                            type="number"
                            value={patient.heartRate || ""}
                            onChange={(e) => setPatient({ ...patient, heartRate: e.target.value })}
                            placeholder="Enter Heart Rate"
                        />
                    </label>

                    <label style={{ width: "100%" }}>
                        Sugar (mg/dL)
                        <input
                            type="number"
                            value={patient.sugar || ""}
                            onChange={(e) => setPatient({ ...patient, sugar: e.target.value })}
                            placeholder="Enter Sugar Level"
                        />
                    </label>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <label style={{ width: "100%" }}>
                        Hemoglobin (g/dL)
                        <input
                            type="number"
                            value={patient.hemoglobin || ""}
                            onChange={(e) => setPatient({ ...patient, hemoglobin: e.target.value })}
                            placeholder="Enter Hemoglobin"
                        />
                    </label>

                    <label style={{ width: "100%" }}>
                        Body Temperature (°C)
                        <input
                            type="number"
                            value={patient.bodyTempreture || ""}
                            onChange={(e) =>
                                setPatient({ ...patient, bodyTempreture: e.target.value })
                            }
                            placeholder="Enter Temperature"
                        />
                    </label>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <label style={{ width: "100%" }}>
                        Respiratory Rate (breaths/min)
                        <input
                            type="number"
                            value={patient.respiratoryRate || ""}
                            onChange={(e) =>
                                setPatient({ ...patient, respiratoryRate: e.target.value })
                            }
                            placeholder="Enter Respiratory Rate"
                        />
                    </label>

                    <label style={{ width: "100%" }}>
                        Blood Group
                        <select
                            value={patient.bloodGroup || ""}
                            onChange={(e) => setPatient({ ...patient, bloodGroup: e.target.value })}
                            style={{ padding: "10px", borderRadius: "7px", width: "100%" }}
                        >
                            <option value="">Select Blood Group</option>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div style={{
                marginTop: '10px',
                width: " 60vw",
                minWidth: '400px',
                display: 'flex',
                justifyContent: 'space-between'
            }}>

                <button
                    style={{
                        border: '1px solid black'
                    }}
                    onClick={(e) => {
                        e.preventDefault();

                        if (currentStep < 5) {
                            setCurrentStep(currentStep + 1);
                        } else {

                            handleSubmit(e);
                        }
                    }}
                >
                    {"Save Hospital"}
                </button>


            </div>

        </div>

    );
};

export default InitialAssesment;