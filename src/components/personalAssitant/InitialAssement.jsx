import { useEffect, useState } from 'react';


import { doctorAPi, perosnalAssistantAPI } from '../../auth';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const validationRules = {
    height: { min: 50, max: 250, label: "Height (cm)" },
    weight: { min: 2, max: 300, label: "Weight (kg)" },
    BP: { label: "Blood Pressure (mmHg)" }, // we'll check separately
    o2: { min: 60, max: 100, label: "O₂ Saturation (%)" },
    heartRate: { min: 30, max: 200, label: "Heart Rate (bpm)" },
    sugar: { min: 40, max: 500, label: "Sugar (mg/dL)" },
    hemoglobin: { min: 5, max: 20, label: "Hemoglobin (g/dL)" },
    bodyTempreture: { min: 30, max: 45, label: "Body Temperature (°C)" },
    respiratoryRate: { min: 5, max: 50, label: "Respiratory Rate (breaths/min)" },
    bloodGroup: { label: "Blood Group" }
};


const validateForm = (patient) => {
    for (const key in validationRules) {
        const rule = validationRules[key];
        const value = patient[key];

        // Empty check
        if (value === "" || value === null) {
            toast.error(`${rule.label} is required`);
            return false;
        }

        // BP validation (simple format check)
        if (key === "BP" && !/^\d{2,3}\/\d{2,3}$/.test(value)) {
            toast.error("Blood Pressure should be in format e.g. 120/80");
            return false;
        }

        // Range validation for numeric fields
        if (rule.min && (value < rule.min || value > rule.max)) {
            toast.error(`${rule.label} should be between ${rule.min} and ${rule.max}`);
            return false;
        }
    }

    return true;
};

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
    const [isProcessing, setIsProcessing] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state?.patient || undefined;

    // useEffect(() => {

    //     // if (!data) {
    //     //     navigate("/pa/dashboard");
    //     //     return;
    //     // }
    //     console.log("Received Data:", data);

    // }, [location.state, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(patient)) {
            return
        }; // stop if validation fails
        setIsProcessing(true);
        try {
            const res = await perosnalAssistantAPI.saveInitialAssement(patient, data._id).then(res => {
                if (res.status === 200 || res.data.status === 200) {
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
                    navigate('/pa')
                }
                else {
                    setIsProcessing(false)

                    toast.error(res?.data?.message || "Failed to save vitals");
                }
            })
        } catch (error) {
            setIsProcessing(false)
            toast.error(error?.response?.data?.message || "An error occurred while saving vitals");
            console.error("while assessments", error);

        }
        finally {

            setIsProcessing(false);
        }

    };

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',

        }} className="steps">
            <span style={{
                display: 'flex',
                gap: '10px'
            }}><BsArrowLeft onClick={() => navigate(-1)} style={{
                fontSize: '40px',
                cursor: 'pointer'

            }}></BsArrowLeft> <h2>Initial Assessment (Vitals)</h2></span>
            {data && (
                <h4>Patient Name:  <span style={{
                    fontSize: '20px'
                }}>{data?.name}</span></h4>
            )}
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
                    disabled={isProcessing}
                    style={{
                        border: '1px solid black'
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                    }}
                >
                    {isProcessing ? "saving...." : "Save Vitals"}
                </button>


            </div>

        </div>

    );
};

export default InitialAssesment;