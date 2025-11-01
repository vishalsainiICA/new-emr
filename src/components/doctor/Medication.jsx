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

const extractLabTests = (analysis = []) => {
    if (!Array.isArray(analysis)) return [];

    const tests = [];
    const medicines = [];

    analysis.forEach(item => {
        const args = item.args || {};
        const primary = args.primary_diagnosis || {};
        const differentials = args.differential_diagnoses || [];

        // Collect primary diagnostic tests
        const primaryTests = [
            ...(primary.diagnostic_approach?.initial_tests || []),
            ...(primary.diagnostic_approach?.confirmatory_tests || [])
        ];
        primaryTests.forEach(test => {
            tests.push({
                test,
                disease: primary.disease_name || "Unknown Disease",
                confidence: primary.confidence_score || 0
            });
        });

        // Collect differential diagnostic tests
        differentials.forEach(diff => {
            (diff.diagnostic_tests || []).forEach(test => {
                tests.push({
                    test,
                    disease: diff.disease_name || "Unknown Differential",
                    confidence: diff.confidence_score || 0
                });
            });
        });

        // Collect suggested medications
        (primary.suggested_medications || []).forEach(med => {
            medicines.push({
                drug_name: med.drug_name,
                dosage: med.dosage,
                frequency: med.frequency
            });
        });
    });

    // return both results if needed
    return { tests, medicines };
};


const analysis = [
    {
        "args": {
            "differential_diagnoses": [
                {
                    "relevance_explanation": "Emphysema is a chronic obstructive lung disease that shares the key symptoms of shortness of breath, coughing, wheezing, and chest tightness with asthma. Although less common in a 35-year-old without a known smoking history, it must be considered, especially if symptoms are progressive or if Alpha-1 antitrypsin (AAT) deficiency is suspected.",
                    "summary": "Emphysema is a chronic, progressive lung condition characterized by the destruction of the air sacs (alveoli), leading to reduced surface area for gas exchange. This results in persistent shortness of breath, chronic coughing, and often wheezing, particularly during physical activity.",
                    "treatment_approach": [
                        "Oxygen therapy",
                        "Pulmonary rehabilitation",
                        "Nutrition therapy",
                        "Avoid smoking and lung irritants"
                    ],
                    "disease_name": "Emphysema",
                    "key_symptoms": [
                        "Shortness of breath",
                        "Chest tightness",
                        "Coughing",
                        "Wheezing",
                        "Weight loss"
                    ],
                    "diagnostic_tests": [
                        "Spirometry",
                        "CT scan",
                        "Arterial blood gas analysis",
                        "Testing for AAT deficiency"
                    ],
                    "confidence_score": 0.6
                },
                {
                    "relevance_explanation": "Bronchitis, both acute and chronic, causes inflammation of the bronchial tubes, leading to a persistent cough and shortness of breath, which can mimic asthma. While wheezing is less typical than in asthma, the symptom overlap warrants its inclusion as a differential diagnosis.",
                    "summary": "Bronchitis is an inflammation of the lining of the bronchial tubes, which carry air to and from the lungs. It is characterized by a persistent cough, often producing mucus, along with shortness of breath and chest discomfort. Acute cases are usually viral, while chronic cases are often linked to smoking or prolonged exposure to irritants.",
                    "treatment_approach": [
                        "Oxygen therapy",
                        "Pulmonary rehabilitation",
                        "Breathing exercise program",
                        "Rest and hydration"
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
                        "Pulmonary function test",
                        "Sputum tests"
                    ],
                    "confidence_score": 0.55
                },
                {
                    "relevance_explanation": "Pulmonary edema presents with acute breathlessness and cough, which overlaps with the patient's symptoms. However, the patient's stable heart rate and blood pressure make a primary cardiac cause less likely. It is a critical differential to rule out, especially in cases of severe or rapidly worsening shortness of breath.",
                    "summary": "Pulmonary edema is a condition caused by excess fluid accumulation in the air spaces and parenchyma of the lungs, leading to impaired gas exchange and severe difficulty breathing. It is often a complication of heart failure, presenting with a cough, a feeling of breathlessness, and sometimes a rapid or irregular heartbeat.",
                    "treatment_approach": [
                        "Oxygen therapy",
                        "Diuretics (to remove excess fluid)",
                        "Medications to improve heart function",
                        "Treating the underlying cause"
                    ],
                    "disease_name": "Pulmonary edema",
                    "key_symptoms": [
                        "A cough",
                        "Breathless feeling",
                        "Rapid, irregular heartbeat",
                        "Anxiety",
                        "Cold, clammy skin"
                    ],
                    "diagnostic_tests": [
                        "Chest X-ray",
                        "Electrocardiogram (ECG)",
                        "Echocardiogram",
                        "Blood tests (e.g., BNP)"
                    ],
                    "confidence_score": 0.3
                }
            ],
            "primary_diagnosis": {
                "clinical_presentation": {
                    "key_findings": [
                        "Wheezing (a whistling sound during breathing)",
                        "Chest tightness",
                        "Episodic shortness of breath"
                    ],
                    "common_symptoms": [
                        "Shortness of breath",
                        "Wheezing",
                        "Chest tightness",
                        "Coughing at night"
                    ]
                },
                "treatment_plan": {
                    "advanced_options": [
                        "Biologic therapies for severe, refractory asthma",
                        "Bronchial thermoplasty (for select severe cases)",
                        "Continuous monitoring of breathing and symptoms"
                    ],
                    "first_line": [
                        "Use of a quick-relief inhaler for acute symptoms",
                        "Daily use of long-term control medications (e.g., inhaled corticosteroids)",
                        "Patient education on trigger avoidance and medication adherence"
                    ]
                },
                "relevance_explanation": "The patient's clinical presentation, characterized by the classic triad of shortness of breath, wheezing, and chest tightness, particularly with nocturnal coughing, is highly indicative of asthma. This aligns directly with the symptoms and clinical description of asthma provided in the knowledge base, making it the most probable diagnosis.",
                "summary": "Asthma is a chronic inflammatory disease of the airways characterized by recurrent episodes of wheezing, shortness of breath, chest tightness, and coughing. These symptoms result from reversible airflow obstruction and bronchospasm, often triggered by environmental factors, exercise, or respiratory infections. Effective management focuses on prevention and long-term control of airway inflammation.",
                "diagnostic_approach": {
                    "initial_tests": [
                        "Spirometry",
                        "Peak flow monitoring",
                        "Physical exam"
                    ],
                    "confirmatory_tests": [
                        "Methacholine challenge",
                        "Sputum eosinophils",
                        "Allergy testing"
                    ]
                },
                "prevention_strategies": [
                    "Identify and avoid specific asthma triggers (e.g., airborne substances, chemical fumes)",
                    "Follow a detailed asthma action plan provided by a healthcare professional",
                    "Take prescribed long-term control medications consistently",
                    "Get appropriate vaccinations (e.g., influenza, pneumonia) to avoid respiratory infections"
                ],
                "disease_name": "Asthma",
                "suggested_medications": [
                    {
                        "dosage": "90 mcg/puff",
                        "drug_name": "Albuterol (Quick-relief inhaler)",
                        "frequency": "As needed for symptoms or before exercise"
                    },
                    {
                        "dosage": "Varies by severity",
                        "drug_name": "Inhaled Corticosteroid (e.g., Fluticasone)",
                        "frequency": "Once or twice daily for long-term control"
                    }
                ],
                "confidence_score": 0.95
            },
            "clinical_recommendations": [
                "Undergo spirometry and peak flow monitoring to establish baseline lung function and confirm the degree of airway obstruction.",
                "Develop a personalized Asthma Action Plan in consultation with a healthcare provider, detailing steps for daily management, symptom worsening, and emergency situations.",
                "Receive education on the correct technique for using both quick-relief and long-term control inhalers to maximize medication efficacy.",
                "Identify and minimize exposure to known or suspected asthma triggers, such as airborne substances, chemical fumes, or cold air, potentially through allergy testing."
            ]
        },
        "type": "ClinicalAnalysis"
    }
]


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
        console.log('X', filtered);
        console.log('y', value);
        console.log('d', illnessData);

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
        try {
            // const res = await axios.post(
            //     "https://care-backend-sa3e.onrender.com/api/v1/analyze",
            //     { report_text: buildReportText(illness, symtomps, patient) }
            // );

            // const analysis = res?.data?.analysis || [];
            // console.log(analysis)
            const { tests, medicines } = extractLabTests(analysis);
            console.log("test", tests)
            console.log("mediciene", medicines)

            setLabtestResult(tests);
            setmediciene(medicines)
        } catch (err) {
            setPartialState({
                labTestError:
                    err.response?.data?.message || err.message || "Error fetching lab tests",
            });
        } finally {
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
                        boxShadow:'10px 20px 5px rg'

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