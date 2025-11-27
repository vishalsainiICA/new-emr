import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import { BsArrow90DegLeft, BsArrowBarLeft, BsArrowLeft } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Medication.css"
import addImg from "../../../assets/download.png"
// import { LabTest } from "./PatientHistory__Labtest";
import { IoChevronDown, IoChevronDownCircleSharp, IoChevronUp, IoCloseCircle } from "react-icons/io5";
import { doctorAPi, superAdminApi } from "../../../auth";

import Switch from "react-switch";
import { LabTest } from "../../Utility/PatientHistory__Labtest";

const buildReportText = (illness = [], symtomps = [], patient = {}) => {
    // Get illness names safely
    const illnessNames = Array.isArray(illness)
        ? illness.map(item => item.illnessName || item).join(", ")
        : illness;

    // Get all symptoms (flatten if nested)
    const allSymptoms = Array.isArray(symtomps)
        ? symtomps.flatMap(item => item.symptoms || item).join(", ")
        : symtomps;

    const report_text = `
Illness: ${illnessNames || "Not specified"}.
Symptoms: ${allSymptoms || "Not specified"}.
Gender: ${patient?.gender || "N/A"}
Age: ${patient?.age || "N/A"}
Height: ${patient?.initialAssementId?.height || "N/A"} cm
Weight: ${patient?.initialAssementId?.weight || "N/A"} kg
BloodGroup: ${patient?.initialAssementId?.bloodGroup || "N/A"}
HeartRate: ${patient?.initialAssementId?.heartRate || "N/A"}
BP: ${patient?.initialAssementId?.BP || "N/A"}
  `;

    return report_text.trim();
};

const extractLabTests = (data = {}) => {
    const primary = data.primary_diagnosis || {};
    const differentials = data.differential_diagnoses || [];

    // Temporary storage (avoid duplicates)
    const testSet = new Map();
    const medSet = new Map();

    // Helper: add test safely
    const addTest = (test, disease, confidence) => {
        if (!test) return;
        const key = test.trim().toLowerCase();
        if (!testSet.has(key)) {
            testSet.set(key, {
                test,
                disease,
                confidence
            });
        }
    };

    // Helper: add medicine safely
    const addMed = (drug_name, dosage, frequency) => {
        if (!drug_name) return;
        const key = drug_name.trim().toLowerCase();
        if (!medSet.has(key)) {
            medSet.set(key, {
                drug_name,
                dosage: dosage || "Not specified",
                frequency: frequency || "Not specified"
            });
        }
    };

    // 🧪 Primary diagnostic tests
    const primaryTests = [
        ...(primary.diagnostic_approach?.initial_tests || []),
        ...(primary.diagnostic_approach?.confirmatory_tests || [])
    ];
    primaryTests.forEach(test =>
        addTest(test, primary.disease_name || "Unknown", primary.confidence_score || 0)
    );

    // 🧪 Differential diagnostic tests
    differentials.forEach(diff => {
        (diff.diagnostic_tests || []).forEach(test =>
            addTest(test, diff.disease_name || "Unknown Differential", diff.confidence_score || 0)
        );
    });

    // 💊 Suggested medications (primary + top-level)
    const allMedications = [
        ...(primary.suggested_medications || []),
        ...(data.suggested_medications || [])
    ];
    allMedications.forEach(med =>
        addMed(med.drug_name, med.dosage, med.frequency)
    );

    // ✅ Return unique items
    return {
        tests: Array.from(testSet.values()),
        medicines: Array.from(medSet.values())
    };
};

const data = {
    "differential_diagnoses": [
        {
            "relevance_explanation": "The patient is a known diabetic presenting with unexplained weight loss and symptoms of severe hyperglycemia. DKA is a life-threatening complication that must be ruled out immediately, as it is characterized by high blood sugar and ketone levels (KB 3).",
            "summary": "Diabetic Ketoacidosis is a severe, acute complication of diabetes resulting from a profound lack of insulin, leading to the body breaking down fat for energy. This process produces ketones, causing the blood to become acidic (KB 3).",
            "treatment_approach": [
                "Intravenous fluids",
                "Insulin therapy",
                "Electrolyte replacement"
            ],
            "disease_name": "Diabetic Ketoacidosis (DKA)",
            "key_symptoms": [
                "Unexplained weight loss",
                "High blood sugar level",
                "Loss of appetite"
            ],
            "diagnostic_tests": [
                "A blood ketone level",
                "Blood acidity tests",
                "Blood electrolyte tests"
            ],
            "confidence_score": 0.7
        },
        {
            "relevance_explanation": "While the primary presentation suggests hyperglycemia, the symptoms of dizziness, blurred vision, and fatigue are also classic signs of low blood sugar (KB 1, KB 2). Intermittent or nocturnal hypoglycemia may be occurring, especially if the patient is on insulin therapy.",
            "summary": "Hypoglycemia is a condition defined by blood sugar levels dropping below 70 mg/dL (KB 2). It is a common complication in diabetes, often caused by an imbalance between medication, food intake, and physical activity.",
            "treatment_approach": [
                "Fast-acting carbohydrates (15 to 20 grams)",
                "Glucagon injection (KB 2)",
                "Review of medication and eating habits"
            ],
            "disease_name": "Hypoglycemia",
            "key_symptoms": [
                "Dizziness",
                "Blurred vision",
                "Fatigue",
                "Anxiety"
            ],
            "diagnostic_tests": [
                "Blood sugar levels",
                "Continuous glucose monitoring"
            ],
            "confidence_score": 0.4
        }
    ],
    "primary_diagnosis": {
        "clinical_presentation": {
            "key_findings": [
                "Fatigue",
                "Pale skin",
                "Shortness of breath",
                "Cold hands and feet"
            ],
            "common_symptoms": [
                "Frequent urination",
                "Excessive thirst",
                "Unexplained weight loss",
                "Blurred vision"
            ]
        },
        "treatment_plan": {
            "advanced_options": [
                "Continuous glucose monitor (KB 1)",
                "Glucagon auto-injector pen or emergency syringe kit (KB 1)",
                "Treatment for underlying anemia"
            ],
            "first_line": [
                "Medicine adjustments by a professional (KB 1)",
                "Nutrition counseling (KB 2)",
                "Frequent blood sugar monitoring"
            ]
        },
        "relevance_explanation": "The patient's history of Diabetes combined with the cardinal symptoms of polyuria (frequent urination), polydipsia (excessive thirst), unexplained weight loss, and blurred vision are highly indicative of significantly uncontrolled blood sugar levels. The additional symptoms of fatigue and pallor suggest associated anemia or chronic complications.",
        "summary": "Diabetes Mellitus is a chronic metabolic disorder characterized by sustained high blood sugar (hyperglycemia) due to defects in insulin production or action. Uncontrolled hyperglycemia leads to osmotic symptoms and metabolic derangements, which, if left untreated, can progress to severe complications like Diabetic Ketoacidosis (KB 3).",
        "diagnostic_approach": {
            "initial_tests": [
                "Blood sugar level (KB 3)",
                "Complete blood count",
                "Urinalysis (KB 3)"
            ],
            "confirmatory_tests": [
                "A blood ketone level",
                "Blood acidity (KB 3)",
                "HbA1c"
            ]
        },
        "prevention_strategies": [
            "Eat nutritious foods (KB 5)",
            "Maintain a healthy weight (KB 5)",
            "Engage in regular exercise (KB 5)",
            "Avoid tobacco/smoke (KB 5)"
        ],
        "disease_name": "Diabetes Mellitus (Uncontrolled Hyperglycemia)",
        "confidence_score": 0.95
    },
    "clinical_recommendations": [
        "Immediate comprehensive laboratory workup, including a Complete Blood Count (CBC) to evaluate the reported anemia (pale skin, fatigue), HbA1c, serum glucose, and blood ketone levels.",
        "Urgent consultation with an endocrinologist to review and adjust the current diabetes medication regimen (medicine adjustments, per KB 1) to achieve better glycemic control.",
        "Initiate intensive nutrition counseling (KB 2) to optimize dietary habits and carbohydrate intake, which is crucial for managing blood sugar levels.",
        "Provide the patient with education on recognizing and managing both hyperglycemic and hypoglycemic emergencies, including the proper use of a continuous glucose monitor (KB 1) and emergency glucagon (KB 2)."
    ],
    "suggested_medications": [
        {
            "dosage": "Individualized (Units per injection)",
            "drug_name": "Insulin glulisine",
            "frequency": "Before meals or as directed by physician"
        },
        {
            "dosage": "Individualized (Units per injection)",
            "drug_name": "Insulin human",
            "frequency": "Once or twice daily, or as directed by physician"
        }
    ],
    "knowledge_base_sources": [
        {
            "disease": "Diabetic hypoglycemia",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/diabetic-hypoglycemia/symptoms-causes/syc-20371525",
            "score": "N/A"
        },
        {
            "disease": "Hypoglycemia",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/hypoglycemia/symptoms-causes/syc-20373685",
            "score": "N/A"
        },
        {
            "disease": "Diabetic ketoacidosis",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/diabetic-ketoacidosis/symptoms-causes/syc-20371551",
            "score": "N/A"
        },
        {
            "disease": "Thrombocytosis",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/thrombocytosis/symptoms-causes/syc-20378315",
            "score": "N/A"
        },
        {
            "disease": "Arteriosclerosis / atherosclerosis",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/arteriosclerosis-atherosclerosis/symptoms-causes/syc-20350569",
            "score": "N/A"
        }
    ],
    "medication_sources": [
        {
            "brand_name": "Glucose",
            "generic_name": "Dextrose anhydrous",
            "score": "N/A"
        },
        {
            "brand_name": "GILTUSS DIABETIC EX",
            "generic_name": "GILTUSS DIABETIC EX",
            "score": "N/A"
        },
        {
            "brand_name": "Apidra SoloStar",
            "generic_name": "insulin glulisine",
            "score": "N/A"
        },
        {
            "brand_name": "",
            "generic_name": "Insulin human",
            "score": "N/A"
        },
        {
            "brand_name": "",
            "generic_name": "Insulin human",
            "score": "N/A"
        }
    ]
}

const patientData = {
    name: "Vishal Singh",
    age: 28,
    gender: "Male",
    phone: "+91 9876543210",
    bloodGroup: "B+",
    height: "175 cm",
    weight: "70 kg",
    temperature: "98.6°F",
    pulse: "78 bpm"
};

const Medication = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [final, setFinal] = useState("Provisional");
    const [symtomps, setSymptopms] = useState([])
    const [illness, setIllness] = useState([])
    const [labtestResult, setLabtestResult] = useState([])
    const [selectedLabTest, setselectedLabTest] = useState([])
    const [mediciene, setmediciene] = useState([])
    const [selectedMediciene, setselectedMediciene] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermforsymtoms, setsearchTermforsymtoms] = useState("");
    const [open, setClose] = useState(false)
    const [patientDetails, setpatientDetails] = useState(false)
    const [symtom_popup, setSymtom_popup] = useState(false)
    const [active, setactive] = useState(null)
    const [filteredIllness, setFilteredIllness] = useState([]);
    const [filteredsymtomps, setfilteredsymtomps] = useState([]);
    const [openImage, setopenImage] = useState(null)
    const [patient, setPatient] = useState(null)
    const [state, setState] = useState({
        hospitalData: [],
        illnessData: [],
        filterHospital: [],
        labTest: [],
        labTestError: null,
        labTestloading: false,
        error: null,
        loadingHospital: false,
        loadingIllness: false,
    });

    useEffect(() => {
        const patient = location.state?.patient || undefined
        if (!patient) {
            navigate('/doctor')
        }
        console.log("patietn", patient);

        setPatient(patient)
    }, [patient])

    const setPartialState = (updates) =>
        setState((prev) => ({ ...prev, ...updates }));

    //   illness
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim() === "") {
            setFilteredIllness([]);
            return;
        }

        // Filter illness (case-insensitive startsWith)
        const filtered = illnessData.filter((ill) =>
            ill.illnessName.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredIllness(filtered);
    };

    const handleChangeSymtomps = (e) => {
        const value = e.target.value;
        setsearchTermforsymtoms(value);

        if (value.trim() === "") {
            setfilteredsymtomps([]);
            return;
        }

        // Corrected filter logic
        const filtered = illnessData.filter((ill) =>
            ill.symptoms.some((sym) =>
                sym.toLowerCase().startsWith(value.toLowerCase())
            )
        );

        setfilteredsymtomps(filtered);
    };

    // Fetch Hospitals
    useEffect(() => {
        const fetchHospital = async () => {
            setPartialState({ loadingHospital: true, error: null });
            try {
                const res = await superAdminApi.getHosptialMetrices();
                const hospitalData = res?.data?.data || [];
                setPartialState({
                    hospitalData,
                    filterHospital: hospitalData?.TopPerformanceHospital || [],
                });
            } catch (err) {
                setPartialState({
                    error:
                        err.response?.data?.message ||
                        err.message ||
                        "Error fetching hospitals",
                });
            } finally {
                setPartialState({ loadingHospital: false });
            }
        };

        fetchHospital();
    }, []);

    // Fetch Illnesses (independent)
    useEffect(() => {
        const fetchIllness = async () => {
            setPartialState({ loadingIllness: true, error: null });
            try {
                const res = await doctorAPi.getAllIllness();
                const illnessData = res?.data?.data || [];
                setPartialState({
                    illnessData,
                });
            } catch (err) {
                setPartialState({
                    error:
                        err.response?.data?.message ||
                        err.message ||
                        "Error fetching illnesses",
                });
            } finally {
                setPartialState({ loadingIllness: false });
            }
        };

        fetchIllness();
    }, []);


    const fetchLabTest = async () => {
        setPartialState({ labTestloading: true, labTestError: null });
        console.log("📤 Starting API call to clinical-analysis...");

        try {
            const payload = { report_text: buildReportText(illness, symtomps, patient) };
            console.log("📦 Request payload:", payload);

            const res = await axios.post(
                "https://care-backend-sa3e.onrender.com/api/v1/clinical-analysis",
                payload,
                { timeout: 30000 }
            );

            console.log("API response:", res.data?.data);

            const { tests, medicines } = extractLabTests(res?.data?.data);
            // await new Promise(resolve => setTimeout(resolve, 10000));
            // console.log("⏳ Slept 10 seconds, continuing...");
            // const { tests, medicines } = extractLabTests(data);
            console.log("🧪 Tests extracted:", tests);
            console.log("💊 Medicines extracted:", medicines);

            setLabtestResult(tests);
            setmediciene(medicines);
        } catch (err) {
            console.error("❌ Axios error:", err);
            setPartialState({
                labTestError:
                    err.response?.data?.message || err.message || "Error fetching lab tests",
            });
        } finally {
            console.log("🏁 Finished API call");
            setPartialState({ labTestloading: false });
        }
    };



    const {
        hospitalData,
        illnessData,
        filterHospital,
        loadingHospital,
        loadingIllness,
        labTest,
        labTestError,
        labTestloading,
        error,
    } = state;


    return (
        <div className="medication-page">


            <div className="med-head">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div onClick={() => navigate(-1)} className="med-card">
                        <h5><BsArrowLeft></BsArrowLeft> Back To Dashboard</h5>
                    </div>
                    <div className="med-card">

                        <div className="med-toggle">
                            <p>Provisonal</p>
                            <Switch
                                checked={final === "Final"}
                                onChange={(checked) => setFinal(checked ? "Final" : "Provisional")}
                                onColor="#d32f2f"          // Green background
                                offColor="#00c853"         // Red background
                                onHandleColor="#ffffff"    // White knob
                                offHandleColor="#ffffff"
                                height={22}
                                width={48}
                                handleDiameter={20}
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                            <p>Final</p>
                        </div>
                        <button
                            disabled={labTestloading}
                            onClick={() => navigate("/prescribtion", {
                                state: {
                                    data: {
                                        patientInfo: patient,
                                        type: final,
                                        // hospitalData: patient?.hospitalId,
                                        illnessData: illness,
                                        symtomps: symtomps,
                                        medication: selectedMediciene,
                                        selectedLabTest: selectedLabTest
                                    }
                                }
                            })}
                            style={{
                                backgroundColor: "#c8a2ff",
                                width: '100px',
                                padding: "10px",
                                cursor: 'pointer',
                                alignItems: 'center',
                                outline: "none",
                                border: "none",
                                borderRadius: '10px'
                            }}>
                            Generate
                        </button>





                    </div>

                </div>

                <div className="medication-heading-card">

                    {patientDetails ? (
                        <IoChevronDown style={{
                            cursor: 'pointer'
                        }} onClick={() => setpatientDetails(false)}></IoChevronDown>
                    ) : (<IoChevronUp style={{
                        cursor: 'pointer'
                    }} onClick={() => setpatientDetails(true)}></IoChevronUp>)}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <h5>Patient Vitals:</h5>
                        <h5>Patient History:</h5>
                    </div>
                    <div className={`medication-heading ${patientDetails ? "open" : "closed"}`}>
                        <div className="patient-vitals">
                            <div className="patient-vitals-item">
                                <p>Name: <h5>{patientData.name}</h5></p>
                                <p>Age: <h5>{patientData.age}</h5></p>
                            </div>

                            <div className="patient-vitals-item">
                                <p>Gender: <h5>{patientData.gender}</h5></p>
                                <p>Phone: <h5>{patientData.phone}</h5></p>
                            </div>

                            <div className="patient-vitals-item">
                                <p>Blood Group: <h5>{patientData.bloodGroup}</h5></p>
                                <p>Height: <h5>{patientData.height}</h5></p>
                            </div>

                            <div className="patient-vitals-item">
                                <p>Weight: <h5>{patientData.weight}</h5></p>
                                <p>Pulse: <h5>{patientData.pulse}</h5></p>
                            </div>
                        </div>

                        <hr style={{
                            width: '2px'
                        }} />
                        <div className="patient-history">
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                gap: '10px'
                            }}>
                                {patient?.pastDocuments?.map((doc, i) => {
                                    let isSelected = doc._id
                                    return <span className={active?.id === isSelected ? "line" : "none"} onClick={() => setactive({ id: doc._id, files: doc.files })}>{doc.category}</span>
                                })}


                                {/* <span className={active === "Xray" ? "line" : "none"} onClick={() => setactive("Xray")}>Xray</span>
                                <span className={active === "MRI-CT-Scan" ? "line" : "none"} onClick={() => setactive("MRI-CT-Scan")}>MRI & CT Scan</span>
                                <span className={active === "Other" ? "line" : "none"} onClick={() => setactive("Other")}>Other</span> */}
                            </div>

                            <div className="patient-history-images">
                                {active && active?.files.map((file, i) => {

                                    return <div className="patient-history-img-card" key={i} onClick={() => {
                                        setopenImage({
                                            image: `${import.meta.env.VITE_BASE_URL}/${file.path}`,
                                            name: "name" + i
                                        })
                                    }}>



                                        <img src={`${import.meta.env.VITE_BASE_URL}/${file.path}`} />
                                        {/* <h5>{"Name"}{file}</h5> */}
                                    </div>

                                })}


                            </div>

                        </div>
                    </div>

                </div>

            </div>

            <div className="medication-body" >
                <div className="medicationPatienmedication">
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                    }}>
                        <div>
                            <h5>Illness/Daignosis</h5>
                            <input type="search" onChange={handleChange} placeholder="type illness" value={searchTerm} />
                            {filteredIllness.length > 0 && searchTerm.trim() !== "" && (
                                <>
                                    <div className="illnessSuggenstion">
                                        {filteredIllness?.map((ill, i) => {
                                            const isSelected = illness.some((item) => item._id === ill._id)
                                            return <div
                                                onClick={() => {
                                                    setIllness((prevIllnesses) => {
                                                        const isSelected = prevIllnesses.some((item) => item._id === ill._id);

                                                        if (isSelected) {
                                                            // Deselect: illness remove + uske symptoms bhi remove
                                                            setSymptopms((prevSymptoms) =>
                                                                prevSymptoms.filter(
                                                                    (sym) => !ill.symptoms.includes(sym) // remove all symptoms of deselected illness
                                                                )
                                                            );
                                                            return prevIllnesses.filter((item) => item._id !== ill._id);
                                                        } else {
                                                            //Select: illness add + uske symptoms bhi add (avoid duplicates)
                                                            setSymptopms((prevSymptoms) => {
                                                                const newSymptoms = [...prevSymptoms];
                                                                ill.symptoms.forEach((s) => {
                                                                    if (!newSymptoms.includes(s)) {
                                                                        newSymptoms.push(s);
                                                                    }
                                                                });
                                                                return newSymptoms;
                                                            });
                                                            return [...prevIllnesses, ill];
                                                        }
                                                    });
                                                    setSearchTerm('')
                                                }}

                                                key={i} className="illCard">
                                                <div>
                                                    <h5>{ill?.illnessName}</h5>
                                                    <p style={{
                                                    }}>{ill?.illnessName}</p>
                                                </div>
                                                {isSelected && (
                                                    <i
                                                        className="ri-check-line"
                                                        style={{
                                                            fontSize: "24px",
                                                            color: "green",
                                                            marginLeft: "10px",
                                                        }}
                                                    ></i>
                                                )}


                                            </div>
                                        })}
                                    </div>

                                </>

                            )}
                        </div>
                        <div className="symtompsSuggestion">
                            <h5>Symptoms</h5>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <input type="search" placeholder="add more symtomps...." onChange={handleChangeSymtomps} value={searchTermforsymtoms} />

                                {labtestResult.length > 0 && (
                                    <button
                                        onClick={() => setClose(true)}
                                        disabled={labTestloading}
                                        style={{
                                            backgroundColor: "lightblue",
                                            width: '120px',
                                            padding: "7px",
                                            cursor: 'pointer',
                                            alignItems: 'center',
                                            outline: "none",
                                            border: 'none',
                                            fontSize: '12px',
                                            borderRadius: '10px'
                                        }}>
                                        LabTests
                                    </button>
                                )}


                            </div>

                            {filteredsymtomps.length > 0 && searchTermforsymtoms.trim() !== "" && (
                                <>
                                    <div className="illnessSuggenstion">
                                        {filteredsymtomps?.map((ill, i) => {
                                            return ill.symptoms?.map((sym) => {
                                                const isSelected = symtomps.some((item) => item === sym)
                                                return <div
                                                    onClick={() => {
                                                        if (!symtomps.includes(sym)) {
                                                            setSymptopms((prev) => [...prev, sym]);
                                                        }
                                                        setsearchTermforsymtoms("");
                                                        setfilteredsymtomps([]);
                                                    }}

                                                    key={i} className="illCard">
                                                    <div>
                                                        <h5>{sym}</h5>
                                                        <p style={{
                                                        }}>{ill?.illnessName}</p>
                                                    </div>
                                                    {isSelected && (
                                                        <i
                                                            className="ri-check-line"
                                                            style={{
                                                                fontSize: "24px",
                                                                color: "green",
                                                                marginLeft: "10px",
                                                            }}
                                                        ></i>
                                                    )}


                                                </div>

                                            })

                                        })}
                                    </div>

                                </>

                            )}


                        </div>

                    </div>
                    <div style={{
                    }}>
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            boxShadow: '10px 20px 5px rg'

                        }}>
                            <h5>Medication:</h5>

                        </div>
                        {labTestloading && (
                            <p style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                padding: '50px 0'
                            }}>
                                <Circles height="40" width="40" color="#4f46e5" ariaLabel="loading" />
                                <br />Loading...
                            </p>
                        )}

                        {labTestError && (
                            <h5 style={{
                                color: 'red',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '50px 0'
                            }}>{labTestError}</h5>
                        )}

                        {!labTestloading && !labTestError && Array.isArray(mediciene) && mediciene.length > 0 && (
                            <div className="medication-card" style={{

                            }}>
                                {mediciene.map((hos, i) => {
                                    return <div key={i}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '10px',
                                            backgroundColor: 'white',
                                            borderBottom: '1px solid lightgray',
                                            borderRadius: '10px',
                                            cursor: 'pointer'
                                        }}>
                                        <div>
                                            <h5 >{hos?.drug_name || "Unnamed Hospital"}</h5>
                                            <p >{`${hos?.dosage}`}</p>
                                            <p >{`${hos?.frequency}`}</p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setselectedMediciene((prev) => [...prev, hos])
                                                }}
                                                className="common-btn">+ Add </button>
                                        </div>

                                    </div>
                                })}
                            </div>
                        )}

                        {!loadingHospital && !error && Array.isArray(filterHospital) && filterHospital.length === 0 && (
                            <p
                                style={{ textAlign: 'center', padding: '50px 0' }}
                            >No hospitals found</p>
                        )}
                    </div>
                </div>
                <div className="selectedMediciene">
                    {selectedLabTest.length > 0 && (
                        <div style={{
                            marginBottom: '20px',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <h5>Lab Test:</h5>
                            </div>
                            {
                                selectedLabTest.length > 0 && selectedLabTest.map((test, i) => {
                                    return <div key={i}
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
                                                <h5 >{test.test || "Unnamed Hospital"}</h5>
                                                <p>{test.disease} </p>

                                            </div>

                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <p
                                                style={{
                                                    fontSize: '13px',
                                                    color: test.confidence > 0.5 ? 'green' : 'gray'
                                                }}
                                            >
                                                Confidence: {(test.confidence * 100).toFixed(0)}%
                                            </p>
                                            <i onClick={() => {
                                                setselectedLabTest((prev) => prev.filter((t) => t.test !== test.test));
                                            }} class="ri-delete-bin-6-line"></i>

                                        </div>

                                    </div>
                                })
                            }
                        </div>
                    )}
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <h5>Mediciene:</h5>
                        </div>
                        {
                            selectedMediciene.length > 0 && selectedMediciene.map((hos, i) => {
                                return <div key={i}
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
                                            <h5 >{hos?.drug_name}</h5>
                                            <p>{hos?.dosage} <p></p>| {"Take After Meal"}</p>

                                        </div>

                                    </div>
                                    <div>
                                        <i onClick={() => {
                                            setselectedMediciene((prev) => prev.filter((item) => item?.drug_name !== hos?.drug_name))
                                        }} class="ri-delete-bin-6-line"></i>
                                    </div>

                                </div>
                            })
                        }
                    </div>

                </div>
                <div>

                </div>
            </div>
            {
                openImage && (
                    <div className="openImage" >
                        <div className="openImageCard">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <h3>{openImage.name}</h3>
                                < IoCloseCircle onClick={() => setopenImage(null)} style={{
                                    cursor: 'pointer'
                                }}></IoCloseCircle>
                            </div>
                            <img src={openImage.image} alt={openImage.name} />

                        </div>

                    </div>
                )
            }
            <div className={`symtomPopup ${symtom_popup ? "open" : "none"}`}>
                <div style={{

                }}>
                    {symtom_popup ? (
                        <IoChevronDown
                            style={{ cursor: "pointer" }}
                            onClick={() => setSymtom_popup(false)}
                        />
                    ) : (
                        <IoChevronUp
                            style={{ cursor: "pointer" }}
                            onClick={() => setSymtom_popup(true)}
                        />
                    )}

                </div>


                <div className="symtomPopup-card">

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white"
                    }}>
                        <h4>Selected</h4>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '10px'
                        }}>
                            <button
                                disabled={labTestloading}
                                onClick={() => fetchLabTest()}
                                style={{
                                    backgroundColor: "lightblue",
                                    width: '100px',
                                    padding: "5px",
                                    cursor: 'pointer',
                                    alignItems: 'center'
                                }}>
                                Generate
                            </button>
                            <button
                                style={{
                                    width: "100px",
                                    border: "1px solid gray",
                                    padding: "5px",
                                    cursor: "pointer",
                                    borderRadius: "10px"
                                }}
                                onClick={() => {
                                    setSymptopms([]);
                                    setIllness([]);
                                }}
                            >
                                Clear
                            </button>
                        </div>

                    </div>

                    {/* Illness list */}
                    <div style={{ marginTop: "10px" }}>
                        <h5>Illness:</h5>
                        <div className="selected-illness">
                            {illness.length > 0 &&
                                illness.map((ill, i) => (
                                    <p key={i}>
                                        {ill.illnessName}
                                        <i
                                            onClick={() =>
                                                setIllness((prev) =>
                                                    prev.filter((item) => item.illnessName !== ill.illnessName)
                                                )
                                            }
                                            className="ri-close-line"
                                            style={{
                                                cursor: "pointer",
                                                color: "#555",
                                                transition: "0.2s",
                                            }}
                                            onMouseOver={(e) => (e.target.style.color = "red")}
                                            onMouseOut={(e) => (e.target.style.color = "#555")}
                                        ></i>
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Symptoms list */}
                    <div className="selected-symtomps">
                        <h5>Symptoms:</h5>
                        {symtomps.length > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    margin: "20px",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    backgroundColor: "white",
                                }}
                            >
                                {symtomps.map((sym, i) => (
                                    <p key={i} className="patient">
                                        {sym}
                                        <i
                                            onClick={() =>
                                                setSymptopms((prev) => prev.filter((st) => st !== sym))
                                            }
                                            className="ri-close-line"
                                            style={{
                                                cursor: "pointer",
                                                color: "#555",
                                                transition: "0.2s",
                                            }}
                                            onMouseOver={(e) => (e.target.style.color = "red")}
                                            onMouseOut={(e) => (e.target.style.color = "#555")}
                                        ></i>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {
                open && (
                    <div className="patientHistory">
                        <LabTest selectedLabTest={selectedLabTest} setselectedLabTest={setselectedLabTest} labTest={labtestResult} labTestError={labTestError} labTestloading={labTestloading} onclose={() => setClose(false)} ></LabTest>
                    </div>
                )
            }
        </div >
    )


}

export default Medication