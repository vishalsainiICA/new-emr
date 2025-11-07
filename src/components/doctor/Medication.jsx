import { useEffect, useState } from "react";
import { doctorAPi, superAdminApi } from "../../auth";
import { Circles } from "react-loader-spinner";
import { BsArrowLeft } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LabTest } from "./PatientHistory__Labtest";


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

    // Temporary storage
    const testSet = new Map();  // key = test name
    const medSet = new Map();   // key = drug name

    // Helper to safely add a test (no duplicates)
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

    // Helper to safely add a medicine (no duplicates)
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

    //  Primary diagnostic tests
    const primaryTests = [
        ...(primary.diagnostic_approach?.initial_tests || []),
        ...(primary.diagnostic_approach?.confirmatory_tests || [])
    ];
    primaryTests.forEach(test =>
        addTest(test, primary.disease_name || "Unknown", primary.confidence_score || 0)
    );

    //  Differential diagnostic tests
    differentials.forEach(diff => {
        (diff.diagnostic_tests || []).forEach(test =>
            addTest(test, diff.disease_name || "Unknown Differential", diff.confidence_score || 0)
        );
    });

    // Suggested medications (both primary and top-level)
    const allMedications = [
        ...(primary.suggested_medications || []),
        ...(data.suggested_medications || [])
    ];
    allMedications.forEach(med =>
        addMed(med.drug_name, med.dosage, med.frequency)
    );

    // Return unique tests and medicines
    return {
        tests: Array.from(testSet.values()),
        medicines: Array.from(medSet.values())
    };
};




const data = {
    "differential_diagnoses": [
        {
            "relevance_explanation": "Emphysema is a type of Chronic Obstructive Pulmonary Disease (COPD) that shares key symptoms with asthma, including shortness of breath, wheezing, and chest tightness. Differentiation is crucial, typically through lung function tests and imaging.",
            "summary": "A chronic lung disease where the air sacs (alveoli) are damaged, leading to air trapping and difficulty exhaling, resulting in shortness of breath and chronic cough.",
            "treatment_approach": [
                "Oxygen therapy",
                "Pulmonary rehabilitation",
                "Nutrition therapy",
                "Smoking cessation"
            ],
            "disease_name": "Emphysema",
            "key_symptoms": [
                "Shortness of breath",
                "Coughing",
                "Chest tightness or heaviness",
                "Wheezing"
            ],
            "diagnostic_tests": [
                "Spirometry",
                "Chest X-ray",
                "CT scan",
                "Arterial blood gas analysis"
            ],
            "confidence_score": 0.7
        },
        {
            "relevance_explanation": "Bronchitis, particularly chronic bronchitis, presents with a persistent cough and shortness of breath, which can mimic asthma. Sputum analysis and pulmonary function tests help distinguish it from asthma.",
            "summary": "Inflammation of the lining of the bronchial tubes, which carry air to and from the lungs. Acute cases are often viral, while chronic cases are characterized by a persistent, productive cough.",
            "treatment_approach": [
                "Oxygen therapy",
                "Pulmonary rehabilitation",
                "Breathing exercise program",
                "Rest and hydration (for acute cases)"
            ],
            "disease_name": "Bronchitis",
            "key_symptoms": [
                "Cough (often with mucus production)",
                "Shortness of breath",
                "Chest discomfort",
                "Fatigue"
            ],
            "diagnostic_tests": [
                "Chest X-ray",
                "Sputum tests",
                "Pulmonary function test"
            ],
            "confidence_score": 0.7
        },
        {
            "relevance_explanation": "Pulmonary edema, often cardiac in origin, can cause acute shortness of breath and coughing, which can be mistaken for a severe asthma attack (sometimes called 'cardiac asthma'). The presence of a rapid, irregular heartbeat suggests a potential cardiac component that must be ruled out.",
            "summary": "A condition caused by excess fluid in the lungs, which collects in the numerous air sacs, making it difficult to breathe and often resulting from underlying heart conditions.",
            "treatment_approach": [
                "Oxygen therapy",
                "Treating the underlying cause (e.g., heart failure)",
                "Diuretics (to remove excess fluid)",
                "Medications to improve heart function"
            ],
            "disease_name": "Pulmonary edema",
            "key_symptoms": [
                "Cough",
                "Severe shortness of breath",
                "Chest pain or discomfort",
                "Rapid, irregular heartbeat"
            ],
            "diagnostic_tests": [
                "Chest X-ray",
                "Electrocardiogram (ECG)",
                "Echocardiogram",
                "Blood tests (e.g., B-type natriuretic peptide)"
            ],
            "confidence_score": 0.6
        }
    ],
    "primary_diagnosis": {
        "clinical_presentation": {
            "key_findings": [
                "Airway narrowing and inflammation",
                "Reversible airflow obstruction",
                "Symptoms triggered by specific environmental factors"
            ],
            "common_symptoms": [
                "Shortness of breath",
                "Wheezing",
                "Chest tightness",
                "Coughing (especially at night)"
            ]
        },
        "treatment_plan": {
            "advanced_options": [
                "Long-term control medications (e.g., inhaled corticosteroids)",
                "Monitoring breathing and symptoms closely",
                "Following a detailed asthma action plan"
            ],
            "first_line": [
                "Quick-relief (rescue) inhaler",
                "Prevention and long-term control strategies",
                "Education on trigger avoidance"
            ]
        },
        "relevance_explanation": "The patient's clinical presentation, including recurrent shortness of breath, wheezing, chest tightness, and nocturnal coughing, is the classic symptom complex for asthma, as explicitly stated in the patient report and supported by the medical context.",
        "summary": "Asthma is a chronic respiratory condition characterized by inflammation and narrowing of the airways, which leads to recurrent episodes of wheezing, shortness of breath, chest tightness, and coughing. The severity and frequency of symptoms vary among individuals.",
        "diagnostic_approach": {
            "initial_tests": [
                "Spirometry",
                "Peak flow measurement",
                "Physical exam"
            ],
            "confirmatory_tests": [
                "Methacholine challenge (Provocative testing)",
                "Nitric oxide test",
                "Allergy testing"
            ]
        },
        "prevention_strategies": [
            "Identify and avoid asthma triggers (e.g., cold air, fumes, allergens)",
            "Follow a detailed asthma action plan",
            "Take medication as prescribed for long-term control",
            "Get vaccinated against influenza and pneumonia",
            "Monitor breathing using a peak flow meter"
        ],
        "disease_name": "Asthma",
        "confidence_score": 1.0
    },
    "clinical_recommendations": [
        "The patient should work with their healthcare provider to develop a comprehensive Asthma Action Plan, detailing daily management, how to handle worsening symptoms, and when to seek emergency care.",
        "Identify and strictly avoid known asthma triggers, which may include airborne substances, chemical fumes, cold air, or respiratory infections.",
        "Ensure the patient is educated on the proper use of both quick-relief (rescue) inhalers and long-term control medications.",
        "Maintain regular follow-up appointments to monitor lung function (e.g., with a peak flow meter) and adjust medication as necessary to maintain symptom control.",
        "Get recommended vaccinations, including the annual influenza (flu) shot and the pneumonia vaccine, to prevent respiratory infections that can trigger asthma exacerbations."
    ],
    "suggested_medications": [
        {
            "dosage": "As directed",
            "drug_name": "Ginsenoside Compound K",
            "frequency": "As directed"
        },
        {
            "dosage": "Titrated to maintain SpO2 > 90%",
            "drug_name": "Oxygen",
            "frequency": "As needed for hypoxia"
        }
    ],
    "knowledge_base_sources": [
        {
            "disease": "Pulmonary edema",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/pulmonary-edema/symptoms-causes/syc-20377009",
            "score": "N/A"
        },
        {
            "disease": "Emphysema",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/emphysema/symptoms-causes/syc-20355555",
            "score": "N/A"
        },
        {
            "disease": "Asthma",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/asthma/symptoms-causes/syc-20369653",
            "score": "N/A"
        },
        {
            "disease": "ARDS",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/ards/symptoms-causes/syc-20355576",
            "score": "N/A"
        },
        {
            "disease": "Bronchitis",
            "source_url": "https://www.mayoclinic.org/diseases-conditions/bronchitis/symptoms-causes/syc-20355566",
            "score": "N/A"
        }
    ],
    "medication_sources": [
        {
            "brand_name": "Air",
            "generic_name": "Breathing Air",
            "score": "N/A"
        },
        {
            "brand_name": "Asthma Alleviator",
            "generic_name": "Ginsenoside Compound K",
            "score": "N/A"
        },
        {
            "brand_name": "Air",
            "generic_name": "Air",
            "score": "N/A"
        },
        {
            "brand_name": "Air",
            "generic_name": "Air",
            "score": "N/A"
        },
        {
            "brand_name": "Air",
            "generic_name": "Air",
            "score": "N/A"
        }
    ]
}


export const Medication = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [patient, setPatient] = useState()
    const [symtomps, setSymptopms] = useState([])
    const [illness, setIllness] = useState([])
    const [labtestResult, setLabtestResult] = useState([])
    const [selectedLabTest, setselectedLabTest] = useState([])
    const [mediciene, setmediciene] = useState([])
    const [selectedMediciene, setselectedMediciene] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermforsymtoms, setsearchTermforsymtoms] = useState("");
    const [open, setClose] = useState(false)
    const [filteredIllness, setFilteredIllness] = useState([]);
    const [filteredsymtomps, setfilteredsymtomps] = useState([]);
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
            navigate('/doctor/dashboard')
        }
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

            console.log("✅ API response:", res.data);

            const { tests, medicines } = extractLabTests(res?.data);
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


    return <div>
        {/* patient info */}
        <div style={{
            display: 'flex',
            justifyContent: "space-between",

        }}>
            <button onClick={() => navigate(-1)}><BsArrowLeft></BsArrowLeft> Back to Dashboard</button>
            <div style={{
                display: 'flex',
                gap: '10px',

            }}>
                <button style={{
                    padding: '10px',
                    fontSize: '12px',
                    width: '105px'
                }}>View History</button>
                <button
                    onClick={() => setClose(true)}
                    disabled={labTestloading}
                    style={{
                        padding: '10px',
                        fontSize: '12px',
                        width: '105px'
                    }}>Lab Test</button>
                <button
                    onClick={() => {
                        navigate('/final-prescription', {
                            state: {
                                data: {
                                    patientInfo: patient,
                                    hospitalData: patient?.hospitalId,
                                    illnessData: illness,
                                    symtomps: symtomps,
                                    medication: selectedMediciene,
                                    selectedLabTest: selectedLabTest
                                }
                            }
                        })
                    }}
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        width: '170px',
                        border: '1px solid black'
                    }}>Generate Prescription </button>
            </div>
        </div>

        <div style={{
            marginTop: '10px',
            display: 'flex',
            gap: '10px'
        }}>
            <div className="medicationPatieninfo">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <h4>Patient Information</h4>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap'
                }}>
                    <span>Name:<h4>{patient?.name}</h4></span>
                    <span>Age:<h4>{patient?.age}</h4></span>
                    <span>Gender:<h4>{patient?.gender}</h4></span>
                    <span>Height:<h4>{patient?.initialAssementId?.height}.cm</h4></span>
                    <span>Weight:<h4>{patient?.initialAssementId?.weight}.kg</h4></span>
                    <span>BloodGroup:<h4>{patient?.initialAssementId?.bloodGroup}</h4></span>
                    <span>HeartRate:<h4>{patient?.initialAssementId?.heartRate}</h4></span>
                    <span>BP:<h4>{patient?.initialAssementId?.BP}</h4></span>
                </div>

            </div>
        </div>

        {/* Symtomps/illness */}
        <div style={{
            width: '100%',

            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            overflowY: 'scroll'
        }}>
            <div className="medicationPatienmedication">
                <div style={{
                    minHeight: '250px',

                }}>
                    <h4>Illness/Daignosis</h4>
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
                                            <h4>{ill?.illnessName}</h4>
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
                    <br />
                    <br />
                    <h4>Symptoms</h4>
                    <input type="search" placeholder="add more symtomps...." onChange={handleChangeSymtomps} value={searchTermforsymtoms} />
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
                                                <h4>{sym}</h4>
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
                    {
                        symtomps.length > 0 && (
                            <div style={{
                                display: 'flex',
                                margin: '20px',
                                gap: '10px',
                                flexWrap: 'wrap',
                                backgroundColor: 'white'
                            }}>
                                <button
                                    style={{
                                        width: '100px',
                                        border: '1px solid gray'
                                    }}
                                    onClick={() => {
                                        setSymptopms([])
                                        setIllness([])
                                    }}>clear</button>
                                {symtomps.map((sym, i) => {
                                    return (
                                        <span
                                            key={i}
                                            style={{
                                                padding: '7px 12px',
                                                backgroundColor: '#f2f2f2',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                margin: '5px',
                                                fontSize: '16px',
                                                borderRadius: '10px',
                                            }}
                                        >
                                            {sym}
                                            <i
                                                onClick={() => {
                                                    setSymptopms((prev) => prev.filter((st) => st !== sym));
                                                }}
                                                className="ri-close-line"
                                                style={{
                                                    cursor: 'pointer',
                                                    color: '#555',
                                                    transition: '0.2s',
                                                }}
                                                onMouseOver={(e) => (e.target.style.color = 'red')}
                                                onMouseOut={(e) => (e.target.style.color = '#555')}
                                            ></i>
                                        </span>
                                    );
                                })}


                            </div>

                        )
                    }

                </div>
                <div style={{
                    height: '100%',

                }}>
                    <div style={{
                        marginTop: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        boxShadow: '10px 20px 5px rg'

                    }}>
                        <h3>Suggested Medication:</h3>
                        <button
                            disabled={labTestloading}
                            onClick={() => fetchLabTest()}
                            style={{
                                backgroundColor: "lightblue"
                            }}>
                            Generate
                        </button>
                    </div>

                    {labTestloading && (
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

                    {labTestError && (
                        <h4 style={{
                            color: 'red',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '50px 0'
                        }}>{labTestError}</h4>
                    )}

                    {!labTestloading && !labTestError && Array.isArray(mediciene) && mediciene.length > 0 && (
                        <div style={{
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginTop: '20px',
                            // minHeight: '500px'
                        }}>
                            {mediciene.map((hos, i) => {

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
                                    >
                                        <div>
                                            <h4 style={{ margin: 0 }}>{hos?.drug_name || "Unnamed Hospital"}</h4>
                                            <p style={{ margin: 0 }}>{`${hos?.dosage}`}</p>
                                            <p style={{ margin: 0 }}>{`${hos?.frequency}`}</p>
                                        </div>

                                    </div>
                                    <div>
                                        <button
                                            onClick={() => {
                                                setselectedMediciene((prev) => [...prev, hos])
                                            }}
                                            style={{
                                                padding: '10px',
                                                fontSize: '12px',
                                                border: '1px solid black'
                                            }}>+ Add </button>
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
                            <h4>Lab Test:</h4>
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
                                            <h5 style={{ margin: 0 }}>{test.test || "Unnamed Hospital"}</h5>
                                            <p>{test.disease} </p>

                                        </div>

                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '10px'
                                    }}>
                                        <span
                                            style={{
                                                fontSize: '13px',
                                                color: test.confidence > 0.5 ? 'green' : 'gray'
                                            }}
                                        >
                                            Confidence: {(test.confidence * 100).toFixed(0)}%
                                        </span>
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
                        <h4>Medication:</h4>
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
                                        <h4 style={{ margin: 0 }}>{hos?.drug_name}</h4>
                                        <span>{hos?.dosage} <span></span>| {"Take After Meal"}</span>

                                    </div>

                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            setselectedMediciene((prev) => prev.filter((item) => item?.drug_name !== hos?.drug_name))
                                        }}
                                        style={{
                                            padding: '10px',
                                            fontSize: '12px',
                                            border: '1px solid black'
                                        }}>Remove </button>
                                </div>

                            </div>
                        })
                    }
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

}