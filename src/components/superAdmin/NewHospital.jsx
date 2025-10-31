import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { superAdminApi } from "../../auth";


const CurrentStep = ({ currentStep, totalSteps }) => {
    // calculate progress in %
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div style={{ margin: "10px 0" }}>
            {/* Step text */}
            <p style={{ fontWeight: "500", marginBottom: "6px" }}>
                Step {currentStep} of {totalSteps}
            </p>

            {/* Progress Bar */}
            <div
                style={{
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        backgroundColor: "#007bff",
                        height: "100%",
                        transition: "width 0.3s ease",
                    }}
                ></div>
            </div>
        </div>
    );
};
const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
];

const dummyDepartments = [
    { icon: "❤️", name: "Cardiology" },
    { icon: "👂", name: "ENT" },
    { icon: "📷", name: "Radiology" },
    { icon: "🧠", name: "Neurology" },
    { icon: "🦴", name: "Orthopedics" },
    { icon: "👶", name: "Pediatrics" },
    { icon: "🔬", name: "General Surgery" },
    { icon: "💊", name: "Dermatology" }
];


export const NewHospital = () => {
    const totalSteps = 5;
    const navigate = useNavigate(-1)
    const [assinDoctor, setAssignDoctor] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentStep, setCurrentStep] = useState(1); // start at step 1
    const [categoryName, setCategoryName] = useState(null)
    const [hosptialData, setHospitalData] = useState({
        name: '',
        state: null,
        pinCode: '',
        city: '',
        address: '',
        patientCategories: [],
        medicalDirector: {
            name: '',
            email: '',
            contact: '',
            experience: '',
        },
        supportedDepartments: [],
        customLetterPad: {
            headerName: '',
            disclaimer: '',
            tagline1: '',
            tagline2: '',
            watermarkImg: '',
            watermarkText: '',
            headerEmail: '',
            headerPhone: '',
        }
    });
    const [doctorData, setDoctorData] = useState({
        doctorName: "",
        email: "",
        contact: "",
        experience: "",
        qualification: ""
    });

    const handelChange = (key, value) => {
        setHospitalData((prev) => {
            const updated = { ...prev, [key]: value }
            return updated
        })
    }

    const handleAddDoctor = () => {
        if (!doctorData.doctorName || !doctorData.email) {
            toast.error("Please fill all required fields!");
            return;
        }

        const updatedDepartments = [...hosptialData.supportedDepartments];
        const selectedDept = updatedDepartments[assinDoctor];

        selectedDept.doctors = [...(selectedDept.doctors || []), doctorData];
        updatedDepartments[assinDoctor] = selectedDept;

        setHospitalData({ ...hosptialData, supportedDepartments: updatedDepartments });
        toast.success("Doctor added successfully!");
        setAssignDoctor(null);
        setDoctorData({
            doctorName: "",
            email: "",
            contact: "",
            experience: "",
            qualification: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Debugging
        try {

            const res = await superAdminApi.addHospital(hosptialData);
            if ((await res).status === 200 || (await res).data.status === 200) {
                toast.success(res?.data?.message || "Hospital registered successfully");
                navigate(-1)
            } else {
                toast.error("Failed to register hospital")
            }
        } catch (err) {
            console.error("Error while adding hospital:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };
    return <div>

        <span
            onClick={() => navigate(-1)}
            style={{
                cursor: 'pointer',
            }
            }><FaArrowLeft></FaArrowLeft> Back to Hospitals</span>

        <h2>New Hospital</h2>
        <CurrentStep currentStep={currentStep} totalSteps={totalSteps}></CurrentStep>

        <div className="hospitalOnboard" >
            {/* step1 */}
            {currentStep == 1 && (
                <div className="steps" >
                    <h2>Hospital Details</h2>

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '10px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Hospital Name
                            <input
                                type="text"
                                value={hosptialData?.name}
                                onChange={(e) => handelChange("name", e.target.value)}
                                placeholder="Hospital Name"
                            />

                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">PinCode
                            <input type="text" value={hosptialData?.pinCode}
                                onChange={(e) => handelChange("pinCode", e.target.value)} placeholder="PinCode" />
                        </label>
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '10px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">City
                            <input type="text" value={hosptialData?.city}
                                onChange={(e) => handelChange("city", e.target.value)} placeholder="Enter City" />
                        </label>
                        <label style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column'

                        }} htmlFor="">State*
                            <select
                                type="text"
                                value={hosptialData?.state}
                                onChange={(e) => handelChange("state", e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '7px'
                                }}
                                name="" id="">
                                <option value="">Select_State</option>
                                {indianStates.map((s, i) => {
                                    return <option key={i} value={s}>{s}</option>
                                })}
                            </select>
                        </label>
                    </div>

                    <label style={{
                        width: '100%'
                    }} htmlFor="">Address
                        <br />
                        <textarea
                            type="text"
                            value={hosptialData?.address}
                            onChange={(e) => handelChange("address", e.target.value)}
                            placeholder="address"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '7px'
                            }} name="" id="" rows="3"></textarea>
                    </label>
                    {/* patient category */}
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Patient Category
                            <input type="text" onChange={(e) => {
                                return setCategoryName(e.target.value)
                            }} placeholder="patientCategory" />
                        </label>
                        <button
                            onClick={() => {
                                if (!categoryName || categoryName === '') {
                                    toast.error('Please Enter Scheme Name')
                                    return
                                }
                                return setHospitalData({ ...hosptialData, patientCategories: [...hosptialData.patientCategories, categoryName] })

                            }
                            }
                            style={{
                                padding: '7px',
                                width: '170px',
                                height: '40px',
                                borderRadius: '7px',
                                marginTop: '19px',
                                backgroundColor: 'lightskyblue'
                            }}
                        >+ Add</button>
                    </div>
                    {console.log(hosptialData.patientCategories.length)}

                    {hosptialData.patientCategories.length > 0 && (


                        <div style={{
                            width: '100%',
                            marginTop: '10px',
                            display: 'flex',
                            gap: '10px'
                        }}>
                            {hosptialData.patientCategories.map((item) => {

                                return <span style={{
                                    padding: '10px 17px 10px 17px',
                                    backgroundColor: 'lightgray',
                                    borderRadius: '7px'

                                }}>{item} </span>

                            })}
                        </div>
                    )}


                </div>
            )}
            {currentStep == 2 && (
                <div className="steps" >
                    <h2>Medical Director Details</h2>

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '10px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Name *
                            <input
                                value={hosptialData?.medicalDirector?.name}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, medicalDirector: {
                                        ...hosptialData.medicalDirector,
                                        name: e.target.value
                                    }
                                })}
                                type="text" placeholder="Enter Full Name" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Experience
                            <input value={hosptialData?.medicalDirector?.experience}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, medicalDirector: {
                                        ...hosptialData.medicalDirector,
                                        experience: e.target.value
                                    }
                                })}
                                type="number" placeholder="Ex.2" />
                        </label>
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '10px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Email
                            <input value={hosptialData?.medicalDirector?.email}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, medicalDirector: {
                                        ...hosptialData.medicalDirector,
                                        email: e.target.value
                                    }
                                })} type="text" placeholder="email@example.com" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Contact Number *
                            <input
                                value={hosptialData?.medicalDirector?.contact}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, medicalDirector: {
                                        ...hosptialData.medicalDirector,
                                        contact: e.target.value
                                    }
                                })}
                                type="text" placeholder="+91 7340479570" />
                        </label>
                    </div>
                    <div
                        style={{
                            width: "100%",

                            padding: '20px',
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "0.7px solid black",
                            marginTop: '10px',
                            borderRadius: '7px'
                        }}
                    >
                        <label
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            Image*
                            <input
                                style={{
                                    textAlign: "center",
                                }}
                                type="file"
                            />
                        </label>
                    </div>

                </div>
            )}
            {currentStep == 3 && (
                <div className="steps">
                    <h3>Department Setup</h3>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}>
                        {
                            dummyDepartments.map((item, i) => {
                                return <span
                                    onClick={() => {
                                        return setHospitalData({
                                            ...hosptialData, supportedDepartments: [
                                                ...hosptialData.supportedDepartments,
                                                {
                                                    departmentName: item.name,
                                                    doctors: []
                                                }
                                            ]
                                        })
                                    }}
                                    style={{
                                        margin: '10px',
                                        display: 'flex',
                                        padding: '7px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px'

                                    }} key={i}>
                                    <input

                                        type="checkbox" style={{
                                            height: '25px',
                                            width: '20px',
                                            minWidth: '10px',
                                        }} />{item.name}</span>
                            })
                        }
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <h4> Selected Department</h4>
                        <button>+ Add Custom</button>
                    </div>

                    {
                        hosptialData.supportedDepartments.length > 0 && (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                {hosptialData.supportedDepartments.map((dep, i) => {
                                    return <div key={i}
                                        style={{
                                            width: '450px',
                                            backgroundColor: 'white',
                                            border: '1px solid lightgray',
                                            padding: '15px 15px 15px 30px',
                                            borderRadius: '10px',
                                            margin: '0 0 10px 10px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div key={i}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div
                                                style={{

                                                    padding: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "20px" // space between items
                                                }}
                                            >
                                                <span style={{ fontSize: '18px', fontFamily: 'cursive' }}>{i + 1}.</span>
                                                <div>
                                                    <h4 style={{ margin: 0 }}>{dep.departmentName || "Unnamed"}</h4>
                                                    <p style={{ margin: 0 }}>{dep.doctors?.length || "0"}</p>
                                                </div>

                                            </div>
                                            <div>
                                                <i class="ri-close-large-line"></i>
                                            </div>


                                        </div>
                                        <button
                                            onClick={() => setAssignDoctor(i)}
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'lightgrey',
                                                border: 'none'
                                            }}><i class="ri-group-line"></i>+ Doctor</button>
                                    </div>


                                })}
                            </div>
                        )
                    }

                </div>
            )}
            {currentStep == 4 && (
                <div className="steps" >
                    <h2>Custom Letterhead</h2>

                    <div style={{
                        display: 'flex',
                        width: '100%',

                        gap: '10px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Header Name *
                            <input type="text"
                                value={hosptialData.customLetterPad.headerName}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, customLetterPad: {
                                        ...hosptialData.customLetterPad,
                                        headerName: e.target.value
                                    }
                                })}
                                placeholder="Hospital Name" />
                        </label>
                        {/* <label style={{
                            width: '100%'
                        }} htmlFor="">PinCode
                            <input type="text" placeholder="PinCode" />
                        </label> */}
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',

                        gap: '10px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Tagline 1
                            <input value={hosptialData.customLetterPad.tagline1}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, customLetterPad: {
                                        ...hosptialData.customLetterPad,
                                        tagline1: e.target.value
                                    }
                                })} type="text" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Tagline 2
                            <input value={hosptialData.customLetterPad.tagline2}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, customLetterPad: {
                                        ...hosptialData.customLetterPad,
                                        tagline2: e.target.value
                                    }
                                })} type="text" />
                        </label>
                    </div>

                    <label style={{
                        width: '100%'
                    }} htmlFor="">Disclaimer
                        <br />
                        <textarea
                            placeholder="disclaimer"
                            value={hosptialData.customLetterPad.disclaimer}
                            onChange={(e) => setHospitalData({
                                ...hosptialData, customLetterPad: {
                                    ...hosptialData.customLetterPad,
                                    disclaimer: e.target.value
                                }
                            })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '7px'
                            }} name="" id="" rows="3"></textarea>
                    </label>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '10px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Header Email *
                            <input value={hosptialData.customLetterPad.headerEmail}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, customLetterPad: {
                                        ...hosptialData.customLetterPad,
                                        headerEmail: e.target.value
                                    }
                                })} type="text" placeholder="hosptial@example.com" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Header Phone *
                            <input value={hosptialData.customLetterPad.headerPhone}
                                onChange={(e) => setHospitalData({
                                    ...hosptialData, customLetterPad: {
                                        ...hosptialData.customLetterPad,
                                        headerPhone: e.target.value
                                    }
                                })} type="text" placeholder="ex.+91 (7340479570)" />
                        </label>
                    </div>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        Watermark*
                        <input
                            style={{
                                border: '1px solid black',
                                textAlign: "center",
                            }}
                            type="file"
                        />
                    </label>
                </div>
            )}
            {currentStep == 5 && (
                <div className="steps" >
                    <h2>Review & Submit</h2>
                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid lightgray',
                            padding: '15px 15px 15px 30px',
                            borderRadius: '10px',
                            margin: '0 0 10px 10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            minHeight: '150px',

                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <h3>Hospital Details</h3>
                            <span><i onClick={() => setCurrentStep(1)} class="ri-edit-box-line"></i></span>

                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',  // line break agar space kam ho toh
                            gap: '15px',
                            justifyContent: 'space-between',
                        }}>
                            <p style={{ margin: 0 }}>
                                Name: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.name}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                State: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.state}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                City: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.city}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Pincode: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.pinCode}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Address: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.address}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Patient Categories: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {hosptialData.patientCategories.join(', ')}
                                </span>
                            </p>
                        </div>



                    </div>
                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid lightgray',
                            padding: '15px 15px 15px 30px',
                            borderRadius: '10px',
                            margin: '0 0 10px 10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            minHeight: '150px',

                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <h3>Medical Director</h3>
                            <span><i onClick={() => setCurrentStep(2)} class="ri-edit-box-line"></i></span>

                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',  // line break agar space kam ho toh
                            gap: '15px',
                            justifyContent: 'space-between',
                        }}>
                            <p style={{ margin: 0 }}>
                                Name: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.medicalDirector.name}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Email: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.medicalDirector.email}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Experience: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.medicalDirector.experience}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Contact: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.medicalDirector.contact}</span>
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid lightgray',
                            padding: '15px 15px 15px 30px',
                            borderRadius: '10px',
                            margin: '0 0 10px 10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            minHeight: '150px',

                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',

                            }}
                        >
                            <h3>Departments & Doctors</h3>
                            <span><i onClick={() => setCurrentStep(3)} class="ri-edit-box-line"></i></span>

                        </div>
                        {

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}>
                                {hosptialData.supportedDepartments.length > 0 && hosptialData.supportedDepartments.map((dep, i) => {
                                    return <div style={{
                                        backgroundColor: 'lightgray',
                                        borderLeft: '7px solid green',
                                        padding: '10px',
                                        width: '170px',
                                        borderRadius: '10px'


                                    }}>
                                        <p>{dep?.departmentName}</p>
                                        <p>{dep?.doctors?.length}</p>
                                    </div>
                                })}
                            </div>

                        }
                    </div>
                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid lightgray',
                            padding: '15px 15px 15px 30px',
                            borderRadius: '10px',
                            margin: '0 0 10px 10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            minHeight: '150px',

                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <h3>Letterhead Details</h3>
                            <span><i onClick={() => setCurrentStep(4)} class="ri-edit-box-line"></i></span>

                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',  // line break agar space kam ho toh
                            gap: '15px',
                            justifyContent: 'space-between',
                        }}>
                            <p style={{ margin: 0 }}>
                                Name: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.customLetterPad.headerName}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Email: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.customLetterPad.headerEmail}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Phone: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.customLetterPad.headerPhone}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Tagline1: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.customLetterPad.tagline1}</span>
                            </p>

                            <p style={{ margin: 0 }}>
                                Tagline2: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{hosptialData.customLetterPad.tagline2}</span>
                            </p>
                        </div>

                    </div>
                </div>

            )}
        </div>
        <div style={{
            marginTop: '10px',
            width: " 60vw",
            minWidth: '400px',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> Previous</button>
            <button
                disabled={isProcessing}
                onClick={(e) => {
                    e.preventDefault();

                    if (currentStep < 5) {
                        setCurrentStep(currentStep + 1);
                    } else {
                        handleSubmit(e);
                    }
                }}
            >
                {currentStep < 5 ? "Next" : "Save Hospital"}
            </button>


        </div>

        {assinDoctor !== null && (
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
                            {`Add Doctor for ${hosptialData?.supportedDepartments[assinDoctor].departmentName}`}
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
                        <button onClick={() => setAssignDoctor(null)}>Cancel</button>
                        <button onClick={handleAddDoctor}>Add Doctor</button>
                    </div>
                </div>
            </div>
        )}


    </div >

}


