
import { useState } from 'react';
import { IoChevronDown, IoChevronUp, IoCloseCircle } from 'react-icons/io5';
import "./Utility.css"

export function LabTest({ labTest = [], labTestError, labTestloading, onclose, setselectedLabTest, selectedLabTest }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLabtest, setFilteredLabtest] = useState(labTest);

    // if (labTestError) {
    //     return <p style={{ color: 'red' }}>Error: {labTestError}</p>;
    // }

    // Filter logic

    const handleAddLabtest = (labtest) => {
        const isSelected = selectedLabTest.some((t) => t.test === labtest.test);

        if (isSelected) {
            // 🔹 If already selected → remove it
            setselectedLabTest((prev) => prev.filter((t) => t.test !== labtest.test));
        } else {
            // 🔹 If not selected → add it
            setselectedLabTest((prev) => [...prev, labtest]);
        }
    };


    const handlechange = (value) => {
        if (value.trim() === '') {
            setFilteredLabtest(labTest)
        }
        const filtered = labTest.filter((item) => {
            return item?.test?.toLowerCase().startsWith(value.toLowerCase())
        })
        setFilteredLabtest(filtered)
    }

    return (
        <div className='labtest' >
            {/* Heading */}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
            }}>
                <h5 style={{
                    marginBottom: '15px',
                    color: '#333',
                    fontWeight: '600'
                }}>
                    Select Lab Tests
                </h5>
                <div>
                    <button
                        onClick={() => onclose?.(null)}
                        className='common-btn'
                        style={{
                            marginRight: '10px'
                        }}
                    >Save</button>
                    <i
                        onClick={() => {
                            onclose?.(null)
                            // setselectedLabTest([])
                        }}
                        className="ri-close-large-fill"
                        style={{
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#666',
                            transition: '0.3s',
                        }}
                        onMouseOver={(e) => e.target.style.color = 'red'}
                        onMouseOut={(e) => e.target.style.color = '#666'}
                    ></i>
                </div>

            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <input
                    type='search'
                    placeholder="Search lab test..."
                    onChange={(e) => handlechange(e.target.value)}
                    style={{
                        width: '80%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '14px'
                    }}
                />
            </div>
            {labTestloading && (
                <p>Loading.....</p>
            )}
            {
                labTestError && (
                    <p style={{
                        color: 'red'

                    }}>Error :{labTestError}</p>
                )
            }
            {
                !labTestloading && !labTestError && (
                    <div style={{
                        gap: '10px'
                    }}>

                        {
                            filteredLabtest.length > 0 ? (
                                filteredLabtest.map((test, i) => {
                                    const isSelected = selectedLabTest.some((t) => t.test === test.test);

                                    return (
                                        <div
                                            onClick={() => handleAddLabtest(test)}
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                cursor: 'pointer',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                border: '1px solid lightgray',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                marginBottom: '8px',
                                                backgroundColor: isSelected ? '#e0f7fa' : '#fafafa', // highlight selected
                                                transition: '0.2s'
                                            }}
                                        >
                                            <div>
                                                <h5 style={{ margin: 0 }}>{test.test}</h5>
                                                <p>
                                                    {test.disease}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span
                                                >
                                                    Confidence: {(test.confidence * 100).toFixed(0)}%
                                                </span>

                                                <input
                                                    type="radio"
                                                    checked={isSelected}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    );
                                })

                            ) : (
                                <p style={{ textAlign: 'center', color: '#777' }}>No lab tests found</p>
                            )}

                    </div>
                )
            }


        </div>
    );
}

export function Patient_Hisotry({ patient, onclose }) {
    const [patientDetails, setpatientDetails] = useState(false)
    const [patientHistory, setpatientHistory] = useState(false)
    const [patientprescbrition, setpatientprescbrition] = useState(false)
    const [openImage, setopenImage] = useState(null)
    const [active, setactive] = useState(null)

    return <div className='labtest'>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
        }}>
            <h3 style={{
                marginBottom: '15px',
                color: '#333',
            }}>
                {`${patient?.name} details`}
            </h3>
            <div>
                <i
                    onClick={() => {
                        onclose?.(null)
                        // setselectedLabTest([])
                    }}
                    className="ri-close-large-fill"
                    style={{
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#666',
                        transition: '0.3s',
                    }}
                    onMouseOver={(e) => e.target.style.color = 'red'}
                    onMouseOut={(e) => e.target.style.color = '#666'}
                ></i>
            </div>

        </div>
        {/* patient vitals */}
        <div>
            {patientDetails ? (
                <IoChevronDown style={{
                    cursor: 'pointer'
                }} onClick={() => setpatientDetails(false)}></IoChevronDown>
            ) : (<IoChevronUp style={{
                cursor: 'pointer'
            }} onClick={() => setpatientDetails(true)}></IoChevronUp>)}

            <div style={{
            }}>
                <h5>Patient Vitals:</h5>
            </div>

            <div className={`patient-vitals ${patientDetails ? "active" : ""}`}>
                <div className="patient-vitals-item">
                    <p>Name: <h5>{patient.name}</h5></p>
                    <p>Age: <h5>{patient.age}</h5></p>
                </div>
                <div className="patient-vitals-item">
                    <p>Gender: <h5>{patient.gender}</h5></p>
                    <p>Phone: <h5>{patient.phone}</h5></p>
                </div>
                <div className="patient-vitals-item">
                    <p>Blood Group: <h5>{patient.bloodGroup}</h5></p>
                    <p>Height: <h5>{patient.height}</h5></p>
                </div>
                <div className="patient-vitals-item">
                    <p>Weight: <h5>{patient.weight}</h5></p>
                    <p>Pulse: <h5>{patient.pulse}</h5></p>
                </div>
                <div>

                </div>
                {!patientDetails && (
                    <h5>Uploaded Documents:</h5>
                )}
                <div className="patient-history">
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        {console.log(patient)
                        }
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
                                    image: `http://localhost:8000/${file.path}`,
                                    name: "name" + i
                                })
                            }}>



                                <img src={`http://localhost:8000/${file.path}`} />
                                {/* <h5>{"Name"}{file}</h5> */}
                            </div>

                        })}
                    </div>

                </div>

                {!patientDetails && (
                    <h5>Addhar Documents:</h5>
                )}
                <div className="patient-history">
                    <div className="patient-history-images">
                        {[
                            patient.addharDocumnets.addharfrontPath,
                            patient.addharDocumnets.addharbackPath
                        ].map((image, i) => {

                            return (
                                <div className="patient-history-img-card"
                                    key={i}
                                    onClick={() => {
                                        setopenImage({
                                            image: `http://localhost:8000/${image}`,
                                            name: "name" + i
                                        })
                                    }}>
                                    <img src={`http://localhost:8000/${image}`} />
                                </div>
                            )
                        })}
                    </div>


                </div>
            </div>



        </div>



        {/* patient priscribtion */}
        <div>
            {patientprescbrition ? (
                <IoChevronDown style={{
                    cursor: 'pointer'
                }} onClick={() => setpatientprescbrition(false)}></IoChevronDown>
            ) : (<IoChevronUp style={{
                cursor: 'pointer'
            }} onClick={() => setpatientprescbrition(true)}></IoChevronUp>)}

            <div style={{
            }}>
                <h5>Patient Priscribtion:</h5>
            </div>

            <div className={`patient-vitals ${patientprescbrition ? "active" : ""}`}>
                <div className="patient-vitals-item">
                    <p>Doctor Name: <h5>{patient.doctorId.name}</h5></p>
                    <p>Experience: <h5>{patient.doctorId.experience}</h5></p>
                </div>
                <h5>Patient Dignosis</h5>
                <div className="">
                    <p>Illness/Dignosis: <h5>{patient.prescribtionId?.prescribtionId?.join(",")}</h5>
                    </p>
                    <p>Height: <h5>{patient.height}</h5></p>
                </div>

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


    </div>

}
