import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { adminApi, commonApi, superAdminApi } from "../../../auth";
import { Circles } from "react-loader-spinner";
import moment from "moment";
import './ViewHospital.css'
import { toast } from "react-toastify";
import { Patient_Hisotry } from "../../Utility/PatientHistory__Labtest";

const ViewHospital = () => {
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [open, setClose] = useState(false)
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);
    const [assinDoctor, setAssignDoctor] = useState(null)
    const [hospital, sethospital] = useState(null)
    const location = useLocation()
    const [doctorData, setDoctorData] = useState({
        doctorName: "",
        email: "",
        contact: "",
        experience: "",
        qualification: "",
        docId: null,
        hosId: null
    });

    const hos = location.state?.hospital || undefined

    const filter = (value) => {
        if (value.trim() === "") {
            setFilterPatient(data)
        }
        const filter = data.filter((hos) => {
            return hos.name.toLowerCase().startsWith(value.toLowerCase())
        })

        setFilterPatient(filter)

    }

    useEffect(() => {
        const fetchHospital = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await superAdminApi.getHospitalById(hos?._id);
                if (res.status === 200) {
                    sethospital(res.data?.data)
                    // initialize filter
                } else {
                    setError(res.data?.message || "Something went wrong");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Internal Server Error");
            } finally {
                setIsProcessing(false);
            }
        };

        fetchHospital();
    }, [refresh]);

    useEffect(() => {
        const fetchPatient = async () => {
            setIsProcessing(true);
            setError(null);
            try {

                const res = await superAdminApi.hospitalAllPaitent(hos?._id);
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterPatient(res.data.data || []); // initialize filter
                } else {
                    setError(res.data?.message || "Something went wrong");
                }
            } catch (err) {
                console.log(err);

                setError(err.response?.data?.message || "Internal Server Error");
            } finally {
                setIsProcessing(false);
            }
        };
        fetchPatient();
    }, []);


    const handleRemovePa = async (id) => {
        try {
            setIsProcessing(true);
            const res = await superAdminApi.removePa(id);
            if ((await res).status === 200 || (await res).data.status === 200) {
                toast.success("pa remove successfully");
                setRefresh(prev => !prev);
            } else {
                toast.error("Failed to register hospital")
            }
        } catch (err) {
            console.error("Error while adding hospital:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    }

    const handleAddPa = async () => {
        try {
            setIsProcessing(true)
            const res = await superAdminApi.addPa(doctorData)
            if (res.status === 200) {
                toast.success(`Pa Added for ${assinDoctor?.name}`)
                setAssignDoctor(null)
                setRefresh(prev => !prev);
            }
        } catch (error) {
            console.log(err);
            toast.success(err.response?.data?.message || "Internal Server Error");
        }
        finally {
            setIsProcessing(false)
        }
    }


    return <div className="viewhospital">

        <div className="cardList">
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Total Patient</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>🏥</p>
                </div>
                <h2>{hospital?.totalPatient || "N/A"}</h2>
                {/* <p style={{
                    color: 'rgba(125, 200, 176)',
                    fontWeight: "bold"
                }}>08%</p> */}
            </div>
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Total Prescribtion</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>🛏️</p>
                </div>
                <h2>{hospital?.totalPrescribtion || "N/A"}</h2>
                {/* <p style={{
                    color: 'rgba(125, 200, 176)',
                    fontWeight: "bold"
                }}>08%</p> */}
            </div>
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Total Department</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>👥</p>
                </div>
                <h2>{hospital?.supportedDepartments?.length || "N/A"}</h2>
                {/* <p style={{
                    color: 'rgba(125, 200, 176)',
                    fontWeight: "bold"
                }}>08%</p> */}
            </div>
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Revenue</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>👨‍⚕️</p>
                </div>
                <h2>{hospital?.totalRevenue || "N/A"}</h2>

            </div>

        </div>

        <div
            className="customCard"
            style={{
                marginTop: '10px'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: "space-between"
            }}>
                <h4>{"Hospital Information"}</h4>

                <a style={{
                    fontSize: '12px',
                    padding: '0 7px 0 7px'

                }}

                    className="commonBtn" href={`https://new-emr-pqlz.onrender.com/register-patient?id=${hospital?._id}`}
                    // className="commonBtn" href={`http://localhost:5173/register-patient?id=${hospital?._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >Patient Registeratiion Link <i style={{
                    fontSize: '20px'
                }} class="ri-external-link-line"></i></a>
            </div>
            <div style={{
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: "repeat(2,1fr)"
            }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Hosptial Name: <span style={{
                    fontWeight: 'normal'
                }}>{hospital?.name}</span></span>
                <span style={{

                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Location: <span style={{
                    fontWeight: 'normal'
                }}>{hospital?.city},{hospital?.state}</span></span>
            </div>
            <div style={{
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: "repeat(2,1fr)"
            }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Type:<span style={{
                    fontWeight: 'normal'
                }}> General</span></span>
                <span style={{

                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Pincode:<span style={{
                    fontWeight: 'normal'
                }}></span>{hospital?.pinCode}</span>
            </div>
            <div style={{
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: "repeat(2,1fr)"
            }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Status: <span style={{
                    fontWeight: 'normal'
                }}>Active</span></span>
                <span style={{

                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Director: <span style={{
                    fontWeight: 'normal'
                }}>{hospital?.medicalDirector?.name}</span></span>
            </div>
        </div>
        <div className="hostpitalmanagement-body">
            <div
                className="customCard"
                style={{
                    marginTop: '10px',
                    height: '350px',
                    overflowY: "scroll"
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: "space-between"
                }}>
                    <h4>{"Department Overview"}</h4>
                    {/* <button className="common-btn">+ New Doctor</button> */}
                </div>

                <div style={{
                    marginTop: '10px'
                }}>

                    {hospital?.supportedDepartments && hospital?.supportedDepartments?.map((dep, i) => {
                        return <div key={i} style={{
                            borderBottom: '0.5px solid lightgrey',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '7px'
                        }}>
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 'bold'
                            }}>{dep?.departmentName}</span>
                            <p style={{
                                fontSize: '12px',
                                color: 'blue'
                            }} href="">patient:{i + 1}</p>
                        </div>

                    })}

                </div>
            </div>
            <div
                className="customCard"
                style={{
                    marginTop: '10px',
                    height: '350px',
                    overflowY: "scroll"
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: "space-between"
                }}>
                    <h4>{"Doctor Overview"}</h4>
                </div>

                <div style={{
                    marginTop: '10px'
                }}>

                    {hospital?.supportedDepartments && hospital?.supportedDepartments?.map((dep, i) => {
                        return dep?.doctorIds?.map((doc, i) => {
                            return <div key={i} style={{
                                borderBottom: '0.5px solid lightgrey',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '7px'
                            }}>
                                <div>
                                    <p style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold'
                                    }}>{doc?.name}</p>
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'blue'
                                    }}>{doc?.email}</p>
                                </div>
                                {
                                    doc?.personalAssitantId ?
                                        (
                                            <div>
                                                <h5>Pa Details:  </h5>
                                                <p style={{
                                                    fontSize: '13px',
                                                    fontWeight: 'bold'
                                                }}>name:  {doc?.personalAssitantId?.name}</p>
                                                <p style={{
                                                    fontSize: '12px',
                                                    color: 'blue'
                                                }}>{doc?.personalAssitantId?.email}</p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAssignDoctor(doc)}
                                                className="common-btn"
                                            >
                                                + Add Pa
                                            </button>
                                        )
                                }

                            </div>
                        })

                    })}

                </div>
            </div>
        </div>

        <div
            className="customCard"
            style={{
                marginTop: '10px'
            }}

        >

            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <h4>{"Patient Overview"}</h4>
                <div
                    style={{
                        display: 'flex',         // add this
                        gap: '10px'      // vertically bottom         // height dena zaroori hai
                    }}
                >
                    <input
                        onChange={(e) => filter(e.target.value)}
                        style={{
                            width: '170px',
                        }}
                        type="text"
                        placeholder="Search"
                    />
                    <input style={{
                        width: '170px',
                    }} type="date" />

                </div>
            </div>



            <div>
                <div style={{ marginTop: '10px' }}>
                    <div className="hosptialHeading">
                        <p style={{
                            fontSize: '12px'
                        }}>Patient ID</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Name</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Age</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Hospital</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Doctor</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Date</p>
                    </div>

                    {isProcessing && (
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

                    {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length > 0 && (
                        <>
                            {filterPatient.map((patient, i) => (
                                <div onClick={() => setClose(patient)} key={i} className="hosptialBody" >
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient.uid}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient.name}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient.age}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient?.hospitalId?.name || "N/A"}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient?.doctorId?.name || "N/A"}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{moment(patient?.createdAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</p>
                                </div>
                            ))}
                        </>
                    )}

                    {!isProcessing && !error && Array.isArray(filterPatient) && filterPatient.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '50px 0' }}>
                            No Patient found
                        </p>
                    )}
                </div>
            </div>

        </div>

        {
            assinDoctor !== null && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(19, 5, 5, 0.6)',
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        minHeight: '400px',
                        width: '600px',
                        padding: '20px',
                        borderRadius: '10px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3>
                                {`P.A for ${assinDoctor.name}`}
                            </h3>
                            <i
                                onClick={() => setAssignDoctor(null)}
                                className="ri-close-large-line"
                                style={{ cursor: 'pointer', fontSize: '20px' }}
                            ></i>
                        </div>

                        {/*Doctor Data Form */}
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '10px'
                        }}>
                            <label style={{ width: '100%' }}>
                                Name *
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={doctorData.doctorName}
                                    onChange={(e) => setDoctorData({ ...doctorData, doctorName: e.target.value })}
                                />
                            </label>

                            <label style={{ width: '100%' }}>
                                Email *
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={doctorData.email}
                                    onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                                />
                            </label>
                        </div>

                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '10px'
                        }}>
                            <label style={{ width: '100%' }}>
                                Contact Number *
                                <input
                                    type="text"
                                    placeholder="Contact Number"
                                    value={doctorData.contact}
                                    onChange={(e) => setDoctorData({ ...doctorData, contact: e.target.value })}
                                />
                            </label>

                            <label style={{ width: '100%' }}>
                                Experience (years) *
                                <input
                                    type="number"
                                    placeholder="ex.2"
                                    value={doctorData.experience}
                                    onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value })}
                                />
                            </label>
                        </div>

                        <label style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '10px'
                        }}>
                            Qualification *
                            <select
                                style={{ padding: '10px', borderRadius: '7px' }}
                                value={doctorData.qualification}
                                onChange={(e) => setDoctorData({ ...doctorData, qualification: e.target.value })}
                            >
                                <option value="">Select_Degree</option>
                                <option value="Graduation">Graduation</option>
                                <option value="Post-Graduation">Post-Graduation</option>
                            </select>
                        </label>

                        {/*Action Buttons */}
                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'end',
                            gap: '10px'
                        }}>
                            <button className="regular-btn" onClick={() => setAssignDoctor(null)}>Cancel</button>
                            <button className="common-btn" disabled={isProcessing} onClick={() => {

                                setDoctorData({ ...doctorData, docId: assinDoctor._id, hosId: assinDoctor?.hospitalId })
                                // console.log("dodo", doctorData);
                                // console.log("assinDoctor", assinDoctor._id);
                                handleAddPa()
                            }} >{isProcessing ? "saving..." : "Assign Pa"}</button>
                        </div>
                    </div>
                </div>
            )
        }
        {
            // addCustomDep !== null && (
            //     <div style={{
            //         position: 'absolute',
            //         inset: 0,
            //         zIndex: 9999,
            //         display: 'flex',
            //         justifyContent: 'center',
            //         alignItems: 'center',
            //         backdropFilter: 'blur(10px)',
            //         backgroundColor: 'rgba(19, 5, 5, 0.6)',
            //     }}>
            //         <div style={{
            //             backgroundColor: 'white',
            //             minHeight: '400px',
            //             width: '600px',
            //             padding: '20px',
            //             borderRadius: '10px',
            //             display: 'flex',
            //             flexDirection: 'column',
            //             justifyContent: 'space-between'
            //         }}>
            //             <div style={{
            //                 display: 'flex',
            //                 justifyContent: 'space-between',
            //                 alignItems: 'center'
            //             }}>
            //                 <h3>
            //                     {`New Department`}
            //                 </h3>
            //                 <i
            //                     onClick={() => setCustomDepartment(null)}
            //                     className="ri-close-large-line"
            //                     style={{ cursor: 'pointer', fontSize: '20px' }}
            //                 ></i>
            //             </div>

            //             <label style={{ width: '100%' }}>
            //                 Name *
            //                 <input
            //                     type="text"
            //                     placeholder="Name"
            //                     value={addCustomDep.name}
            //                     onChange={(e) => setCustomDepartment({ ...addCustomDep, name: e.target.value })}
            //                 />
            //             </label>

            //             <label style={{
            //                 width: '100%',
            //                 display: 'flex',
            //                 flexDirection: 'column',
            //                 marginTop: '10px'
            //             }}>
            //                 Department Image *
            //                 <input
            //                     value={addCustomDep.image}
            //                     onChange={(e) => setCustomDepartment({ ...addCustomDep, image: e.target.value })}
            //                     style={{
            //                         border: '0.5px solid black'
            //                     }} type="file"></input>
            //             </label>

            //             {/*Action Buttons */}
            //             <div style={{
            //                 marginTop: '30px',
            //                 display: 'flex',
            //                 justifyContent: 'end',
            //                 gap: '10px'
            //             }}>
            //                 <button onClick={() => setCustomDepartment(null)}>Cancel</button>
            //                 <button onClick={handelAddCustomDepartment}>Add Department</button>
            //             </div>
            //         </div>
            //     </div>
            // )
        }
        {
            open && (
                <div className="patientHistory">
                    <Patient_Hisotry patient={open} onclose={() => setClose(false)} ></Patient_Hisotry>
                    {/* <LabTest selectedLabTest={selectedLabTest} setselectedLabTest={setselectedLabTest} labTest={labtestResult} labTestError={labTestError} labTestloading={labTestloading} onclose={() => setClose(false)} ></LabTest> */}
                </div>
            )
        }

    </div>


}

export default ViewHospital