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

const extractLabTests = (analysis) => {
    if (!Array.isArray(analysis)) return [];

    const tests = [];

    analysis.forEach(item => {
        const args = item.args || {};
        const primary = args.primary_diagnosis;
        const differentials = args.differential_diagnoses || [];

        // Primary diagnosis tests
        if (primary?.diagnostic_approach?.confirmatory_tests) {
            primary.diagnostic_approach.confirmatory_tests.forEach(t => {
                tests.push({
                    test: t,
                    disease: primary.disease_name,
                    confidence: primary.confidence_score || 0,
                });
            });
        }

        // Differential diagnoses tests
        differentials.forEach(diff => {
            (diff.diagnostic_tests || []).forEach(t => {
                tests.push({
                    test: t,
                    disease: diff.disease_name,
                    confidence: diff.confidence_score || 0,
                });
            });
        });
    });

    return tests;
};




export const Medication = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [patient, setPatient] = useState()
    const [symtomps, setSymptopms] = useState([])
    const [illness, setIllness] = useState([])
    const [selectedLabTest, setselectedLabTest] = useState([])
    const [mediciene, setmediciene] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setClose] = useState(false)
    const [filteredIllness, setFilteredIllness] = useState([]);
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

    useEffect(() => {
        const fetchLabTest = async () => {
            setPartialState({ labTestloading: true, labTestError: null });
            try {
                const res = await axios.post(
                    "https://care-backend-sa3e.onrender.com/api/v1/analyze",
                    { report_text: buildReportText(illness, symtomps, patient) }
                );

                const analysis = res?.data?.data?.analysis || [];
                const labTests = extractLabTests(analysis);

                setPartialState({ labTest: labTests });
            } catch (err) {
                setPartialState({
                    labTestError:
                        err.response?.data?.message || err.message || "Error fetching lab tests",
                });
            } finally {
                setPartialState({ labTestloading: false });
            }
        };

        fetchLabTest();
    }, [symtomps, illness]);



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
                                    illnessData: symtomps,
                                    medication: mediciene
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
                    <input type="search" onChange={handleChange} placeholder="Enter Illness Related" />
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
                    <input type="search" placeholder="Enter Illness Related" />
                    {/* {filteredIllness.length > 0 && searchTerm.trim() !== "" && (
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

                    )} */}
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
                    <h3>Suggested Medication:</h3>
                    {loadingHospital && (
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

                    {error && (
                        <h4 style={{
                            color: 'red',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '50px 0'
                        }}>{error}</h4>
                    )}

                    {!loadingHospital && !error && Array.isArray(filterHospital) && filterHospital.length > 0 && (
                        <div style={{

                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginTop: '20px',
                            // minHeight: '500px'
                        }}>
                            {filterHospital.map((hos, i) => (
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
                                            <h4 style={{ margin: 0 }}>{hos.name || "Unnamed Hospital"}</h4>
                                            <p style={{ margin: 0 }}>{`${hos.city},${hos.state}`}</p>
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
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <h4>Lab Test:</h4>
                            <h4>Total: {selectedLabTest.length}</h4>
                        </div>
                        {
                            selectedLabTest.length > 0 && selectedLabTest.map((hos, i) => {
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
                )}
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <h4>Medication:</h4>
                        <h4>Total: {mediciene.length}</h4>
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


        {open && (
            <div className="patientHistory">
                <LabTest labTest={labTest} labTestError={labTestError} labTestloading={labTestloading} onclose={() => setClose(false)} ></LabTest>
            </div>
        )}

    </div >

}