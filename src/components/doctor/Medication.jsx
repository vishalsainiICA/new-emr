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
                    "relevance_explanation": "E. coli is a common bacterial cause of foodborne illness, and its symptoms—particularly severe stomach cramping and diarrhea—closely overlap with the patient's presentation. Identifying the specific strain is crucial, as some types, like E. coli O157:H7, can lead to severe complications.",
                    "summary": "E. coli refers to a group of bacteria, some strains of which are pathogenic and produce powerful toxins, leading to gastroenteritis. The illness typically ranges from mild to severe, often characterized by intense stomach cramping, tenderness, and potentially bloody diarrhea. Age and underlying health can influence the severity of the infection.",
                    "treatment_approach": [
                        "Rest and supportive care",
                        "Aggressive fluid replacement to manage dehydration",
                        "Avoidance of anti-diarrheal medications"
                    ],
                    "disease_name": "E. coli Infection (Gastroenteritis)",
                    "key_symptoms": [
                        "Severe and bloody diarrhea",
                        "Intense stomach cramping and tenderness",
                        "Nausea and vomiting"
                    ],
                    "diagnostic_tests": [
                        "Stool culture and PCR testing to detect the presence of E. coli bacteria and identify specific pathogenic strains (e.g., Shiga toxin-producing E. coli).",
                        "Complete Blood Count (CBC) to check for signs of hemolytic uremic syndrome (HUS), especially in severe cases."
                    ],
                    "confidence_score": 0.75
                },
                {
                    "relevance_explanation": "Viral gastroenteritis is a highly common cause of acute gastroenteritis that is clinically indistinguishable from many cases of bacterial food poisoning. The patient's symptoms (vomiting, diarrhea, fever, cramps) are classic for a viral etiology, such as Norovirus, which is often transmitted via contaminated food or person-to-person contact.",
                    "summary": "Viral gastroenteritis, often called the \"stomach flu,\" is an inflammation of the stomach and intestines caused by viruses like Norovirus or Rotavirus. It is characterized by the acute onset of non-bloody, watery diarrhea, vomiting, abdominal cramps, and sometimes fever. The illness is typically self-limiting, with the main risk being dehydration.",
                    "treatment_approach": [
                        "Supportive care and rest",
                        "Oral or intravenous fluid and electrolyte replacement",
                        "Antiemetics for persistent vomiting"
                    ],
                    "disease_name": "Viral Gastroenteritis",
                    "key_symptoms": [
                        "Acute onset of watery diarrhea and vomiting",
                        "Low-grade fever and general malaise",
                        "Abdominal cramps and nausea"
                    ],
                    "diagnostic_tests": [
                        "Clinical diagnosis based on symptom presentation and local outbreak patterns",
                        "Stool PCR panel for common viral pathogens (e.g., Norovirus, Rotavirus) if diagnosis is uncertain or for public health tracking"
                    ],
                    "confidence_score": 0.6
                },
                {
                    "relevance_explanation": "Parasitic infections, such as Giardiasis, are a less common but important cause of foodborne illness, often acquired through contaminated water or food. While the acute presentation can mimic bacterial or viral causes, parasitic infections tend to cause more persistent symptoms, bloating, and malabsorption.",
                    "summary": "Parasitic gastroenteritis is caused by protozoa or helminths that infect the gastrointestinal tract, often transmitted through contaminated food or water. Giardiasis, a common example, involves the parasite Giardia lamblia colonizing the small intestine, leading to symptoms like chronic diarrhea, abdominal cramps, bloating, and significant fatigue.",
                    "treatment_approach": [
                        "Antiparasitic medications (e.g., Metronidazole, Tinidazole)",
                        "Fluid and nutritional support",
                        "Symptomatic relief for cramping and nausea"
                    ],
                    "disease_name": "Parasitic Gastroenteritis (e.g., Giardiasis)",
                    "key_symptoms": [
                        "Persistent, foul-smelling, watery diarrhea",
                        "Abdominal cramping and bloating",
                        "Fatigue and weight loss (if chronic)"
                    ],
                    "diagnostic_tests": [
                        "Complete Blood Count (CBC) and blood smear to check for signs of parasitic infection (e.g., eosinophilia)",
                        "Ova and Parasite (O&P) examination of stool sample, often requiring multiple samples",
                        "Stool antigen testing for specific parasites (e.g., Giardia, Cryptosporidium)"
                    ],
                    "confidence_score": 0.5
                }
            ],
            "primary_diagnosis": {
                "relevance_explanation": "The patient's clinical picture, characterized by the acute onset of vomiting, diarrhea, stomach cramps, and fever, is the classic presentation of acute gastroenteritis caused by food poisoning. This diagnosis encompasses illness resulting from the ingestion of food or drinks contaminated with bacteria, viruses, parasites, or toxins. The symptoms directly align with the core manifestations of foodborne illness.",
                "treatment_plan": {
                    "advanced_options": [
                        "Intravenous (IV) fluid replacement for severe dehydration or persistent vomiting",
                        "Administration of specific antibiotics or antiparasitics if a bacterial or parasitic cause is confirmed and deemed necessary by a healthcare professional",
                        "Hospitalization for patients with severe symptoms, underlying comorbidities, or signs of organ damage"
                    ],
                    "first_line": [
                        "Fluid replacement with water and electrolyte-rich solutions to compensate for fluid loss",
                        "Rest to allow the digestive system to recover",
                        "Use of probiotics to help restore the gut microbiome"
                    ]
                },
                "clinical_presentation": {
                    "common_symptoms": [
                        "Vomiting",
                        "Diarrhea",
                        "Stomach cramps",
                        "Fever",
                        "Weakness",
                        "Headache",
                        "Loose stools"
                    ],
                    "key_findings": [
                        "Acute onset of gastrointestinal distress (vomiting and diarrhea)",
                        "Presence of systemic symptoms including fever and weakness",
                        "Abdominal pain and cramping localized to the stomach"
                    ]
                },
                "summary": "Food poisoning, or foodborne illness, is a common condition resulting from the consumption of contaminated food or beverages. It is caused by various pathogens, including bacteria, viruses, and parasites, or their toxins. The illness typically manifests as acute gastroenteritis, characterized by a rapid onset of symptoms such as nausea, vomiting, stomach pain and cramps, loose stools, and sometimes fever. While most cases are self-limiting, the primary concern is the risk of dehydration due to fluid loss.",
                "diagnostic_approach": {
                    "initial_tests": [
                        "Detailed history of recent food and drink consumption (within 48 hours)",
                        "Inquiry about recent travel and symptoms in other people who shared the same meal",
                        "Physical examination to assess hydration status and abdominal tenderness"
                    ],
                    "confirmatory_tests": [
                        "Stool culture to identify specific bacterial pathogens (e.g., Salmonella, Campylobacter)",
                        "Stool testing for viruses (e.g., Norovirus) and parasites (e.g., Giardia) to determine the causative agent",
                        "Testing of suspected food or drink sources if an outbreak is suspected"
                    ]
                },
                "prevention_strategies": [
                    "Practice proper food handling and preparation techniques, including cooking foods to the correct internal temperatures.",
                    "Avoid cross-contamination by keeping raw meats separate from ready-to-eat foods and using separate cutting boards.",
                    "Ensure prompt refrigeration of perishable foods and discard any food left at room temperature for too long.",
                    "Maintain excellent personal hygiene, especially frequent and thorough handwashing before eating and after using the restroom."
                ],
                "disease_name": "Food Poisoning (Foodborne Illness)",
                "confidence_score": 0.95
            },
            "clinical_recommendations": [
                "Aggressively manage fluid and electrolyte balance using oral rehydration solutions (ORS) to prevent dehydration, which is the most common complication of acute gastroenteritis.",
                "Monitor for signs of severe illness, such as persistent high fever, bloody diarrhea, inability to keep fluids down, or symptoms of neurological involvement (e.g., blurred vision, numbness), and seek immediate medical care if these occur.",
                "Avoid over-the-counter anti-diarrheal medications (like loperamide) unless specifically instructed by a healthcare professional, as they can prolong the illness or worsen outcomes in certain bacterial infections (e.g., E. coli O157:H7).",
                "Maintain strict food safety and hygiene practices at home to prevent secondary transmission, including frequent handwashing and proper cleaning of contaminated surfaces."
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
            const res = await axios.post(
                "https://care-backend-sa3e.onrender.com/api/v1/analyze",
                { report_text: buildReportText(illness, symtomps, patient) }
            );

            const analysis = res?.data?.analysis || [];
            // console.log(analysis)
            const { test, mediciene } = extractLabTests(analysis);
            console.log("test", test)
            console.log("mediciene", mediciene)

            setLabtestResult(test);
            setmediciene(mediciene)
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
                                    medication: mediciene,
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
            backgroundColor: 'white'
        }}>
            <div className="medicationPatienmedication">
                <div style={{
                    minHeight: '250px'
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

                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'

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

                    {!labTestloading && !error && Array.isArray(mediciene) && mediciene.length > 0 && (
                        <div style={{

                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginTop: '20px',
                            // minHeight: '500px'
                        }}>
                            {console.log("medicien", mediciene)
                            }
                            {mediciene.map((hos, i) => (
                                <div key={i}
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
                                            <h4 style={{ margin: 0 }}>{hos?.drug_name || "Unnamed Hospital"}</h4>
                                            <p style={{ margin: 0 }}>{`${hos?.dosage},${hos?.frequency}`}</p>
                                        </div>

                                    </div>

                                    <div>

                                        <button
                                            onClick={() => {
                                                setmediciene((prev) => [...prev, hos])
                                            }}
                                            style={{
                                                padding: '10px',
                                                fontSize: '12px',
                                                border: '1px solid black'
                                            }}>+ Add </button>
                                    </div>

                                </div>
                            ))}
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
                        mediciene.length > 0 && mediciene.map((hos, i) => {
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
                                        <h4 style={{ margin: 0 }}>{'Paracetamol' || "Unnamed Hospital"}</h4>
                                        <span>{"Once Daily"} <span></span>| {"Take After Meal"}</span>

                                    </div>

                                </div>

                                <div>

                                    <button
                                        onClick={() => {
                                            setmediciene((prev) => prev.filter((item) => item._id !== hos._id))
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