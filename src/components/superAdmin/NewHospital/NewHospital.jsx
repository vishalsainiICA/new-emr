import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { superAdminApi } from "../../../auth";
import { FaArrowLeft } from "react-icons/fa";
import './NewHospital.css'

import testimg from "../../../assets/download.jpg"


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
                        transition: "all 0.3s ease",
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
    { image: new URL("../../../assets/DepartmentsImages/cardiology.png", import.meta.url).href, name: "Cardiology" },
    { image: new URL("../../../assets/DepartmentsImages/audiologist.png", import.meta.url).href, name: "ENT" },
    { image: new URL("../../../assets/DepartmentsImages/medical.png", import.meta.url).href, name: "Radiology" },
    { image: new URL("../../../assets/DepartmentsImages/neurology.png", import.meta.url).href, name: "Neurology" },
    { image: new URL("../../../assets/DepartmentsImages/arthritis.png", import.meta.url).href, name: "Orthopedics" },
    { image: new URL("../../../assets/DepartmentsImages/pediatrics.png", import.meta.url).href, name: "Pediatrics" },
    { image: new URL("../../../assets/DepartmentsImages/anesthesia.png", import.meta.url).href, name: "General Surgery" },
    { image: new URL("../../../assets/DepartmentsImages/skin.png", import.meta.url).href, name: "Dermatology" }
];



export const NewHospital = () => {
    const totalSteps = 4;
    const navigate = useNavigate(-1)
    const [assinDoctor, setAssignDoctor] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentStep, setCurrentStep] = useState(1); // start at step 1
    const [categoryName, setCategoryName] = useState("")
    const [addCustomDep, setCustomDepartment] = useState(null)
    const [edit, setEdit] = useState(null)

    const [hospitalData, setHospitalData] = useState({
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
            image: null
        },
        supportedDepartments: [],
        customLetterPad: {
            headerName: '',
            disclaimer: '',
            tagline1: '',
            tagline2: '',
            watermarkImg: null,
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
        qualification: "",
        appointmentFees: null
    });


    const [errors,setErrors]=useState({
         name: '',
        state: null,
        pinCode: '',
        city: '',
        address: '',
        patientCategories: [],
         medicalDirectorName:'',
         medicalDirectorContact:'',
         medicalDirectorEmail:'',
         medicalDirectorExperience:'',
         medicalDirectorImage:'',
        customLetterPad: {
            headerName: '',
            disclaimer: '',
            tagline1: '',
            tagline2: '',
            watermarkImg: null,
            watermarkText: '',
            headerEmail: '',
            headerPhone: '',
        }
    });

    const checkfield=()=>{
      
        const errors ={}
        // step 1 Validation
      if( currentStep==1)
      {
          if (!hospitalData.name) errors.name ="Hospital Name is required"
          if (!hospitalData.state) errors.state =" state is required"
          if (!hospitalData.city) errors.city ="City is required"
          if (!hospitalData.pinCode) errors.pinCode =" pinCode is required"
          if (!hospitalData.address) errors.address =" address is required"
          if (hospitalData.patientCategories?.length === 0) errors.patientCategories =" Patient Category  is required"
      }

       // step 2 Validation

       if( currentStep==2)
        {
          if(!hospitalData.medicalDirector?.name) errors.medicalDirectorName="Medical director Name is required"
          if(!hospitalData.medicalDirector?.experience) errors.medicalDirectorExperience="Medical director Experience is required"
          if(!hospitalData.medicalDirector?.contact) errors.medicalDirectorContact="Medical director contact is required"
          if(hospitalData.medicalDirector?.contact && hospitalData.medicalDirector?.contact.length !==10) errors.medicalDirectorContact="Medical director Number Must be 10 digits"
          if(!hospitalData.medicalDirector?.email) errors.medicalDirectorEmail="Medical director email is required"
          // medical director Image Optional
        //   if(!hospitalData.medicalDirector?.image) errors.medicalDirectorImage="Medical director Document  is required"
       }
       
       if( currentStep ===3)
       {
         if(hospitalData.supportedDepartments.length === 0) errors.supportedDepartments="Please Select Department is Required"
        //  if(hospitalData.supportedDepartments?.doctors?.length=== 0) errors.supportedDepartmentsdoctors="Please Add  One doctor  is Required"
         
        const hasDoctor = hospitalData.supportedDepartments.every(
         (dep) => dep.doctors && dep.doctors.length > 0);

        if(!hasDoctor)errors.supportedDepartmentsdoctors = "Each department must have at least one doctor";
        
     }

    //    if( currentStep ===3 && hospitalData.supportedDepartments.length !==0)
    //    {
    //       if(!doctorData.doctorName) errors.doctorName ="Doctor name is required"
    //       if(!doctorData.email) errors.doctorEmail ="Doctor Email is required"
    //       if(!doctorData.experience) errors.doctorExperience ="Doctor Experience is required"
    //       if(!doctorData.qualification) errors.doctorQualification ="Doctor Qualification is required"
    //       if(!doctorData.contact) errors.doctorContact ="Doctor Contact Number is required"
    //       if(!doctorData.appointmentFees) errors.doctorAppointmentFees ="Doctor Appointment Fee is required"
         
    //        const isTrue = hospitalData.supportedDepartments.some((item)=> item?.doctors?.length===0)
    //    }


        setErrors(errors);
        
        return Object.keys(errors).length === 0;
    }

    const handelChange = (key, value) => {
        setHospitalData((prev) => {
            const updated = { ...prev, [key]: value }
            return updated
        })
    }

    const handelDoctorChange = (depIndex, docIndex, field, value) => {

        const updated = [...hospitalData.supportedDepartments]

        updated[depIndex].doctors[docIndex][field] = value

        setHospitalData((prev) => ({
            ...prev,
            supportedDepartments: updated
        }))
        return
    }

    const handleAddDoctor = () => {
        if (!doctorData.doctorName || !doctorData.email || !doctorData.contact || !doctorData.experience || !doctorData.qualification || !doctorData.appointmentFees) {
            toast.error("Please fill all required fields!");
            return;
        }

        const updatedDepartments = [...hospitalData.supportedDepartments];
        const selectedDept = updatedDepartments[assinDoctor];

        selectedDept.doctors = [...(selectedDept.doctors || []), doctorData];
        updatedDepartments[assinDoctor] = selectedDept;

        setHospitalData({ ...hospitalData, supportedDepartments: updatedDepartments });
        toast.success("Doctor added successfully!");
        setAssignDoctor(null);
        setDoctorData({
            doctorName: "",
            email: "",
            contact: "",
            experience: "",
            qualification: "",
            appointmentFees: null
        });
    };
    const handelAddCustomDepartment = () => {

        if (!addCustomDep.name || !addCustomDep.image) {
            toast.error("Please fill all required fields!");
            return;
        }
        setCustomDepartment(null)
        toast.success("Department Add Successfully!");

        return;

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Debugging

        const formdata = new FormData()

        formdata.append("name", hospitalData.name);
        formdata.append("state", hospitalData.state);
        formdata.append("pinCode", hospitalData.pinCode);
        formdata.append("city", hospitalData.city);
        formdata.append("address", hospitalData.address);

        formdata.append("patientCategories", JSON.stringify(hospitalData.patientCategories))
        formdata.append("supportedDepartments", JSON.stringify(hospitalData.supportedDepartments));
        formdata.append(
            "medicalDirector",
            JSON.stringify({
                name: hospitalData.medicalDirector.name,
                email: hospitalData.medicalDirector.email,
                contact: hospitalData.medicalDirector.contact,
                experience: hospitalData.medicalDirector.experience
            })
        );

        formdata.append("medicalDirectorImage", hospitalData.medicalDirector.image);
        formdata.append("watermarkImg", hospitalData.customLetterPad.watermarkImg);

        // 5Nested object (customLetterPad)
        formdata.append(
            "customLetterPad",
            JSON.stringify({
                headerName: hospitalData.customLetterPad.headerName,
                disclaimer: hospitalData.customLetterPad.disclaimer,
                tagline1: hospitalData.customLetterPad.tagline1,
                tagline2: hospitalData.customLetterPad.tagline2,
                watermarkText: hospitalData.customLetterPad.watermarkText,
                headerEmail: hospitalData.customLetterPad.headerEmail,
                headerPhone: hospitalData.customLetterPad.headerPhone,
            })
        );



        try {

            const res = await superAdminApi.addHospital(hospitalData);
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
    return <div className="New-hospital">

        <div className="customCard" style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}>
            <div className="hospitalMangement" >
                <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', }}><FaArrowLeft></FaArrowLeft> Back to Hospitals</span>
                <h3>New Hospital</h3>
            </div>
            <div style={{
                width: '40%'
            }}>
                <CurrentStep currentStep={currentStep} totalSteps={totalSteps}></CurrentStep>
            </div>

        </div>


        <div className="hospitalOnboard" >
            {/* step1 */}
            {currentStep == 1 && (
                <div className="steps" >

                    <h3>Hospital Details </h3>

                    <hr />

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '100px',
                        marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Hospital Name
                            <input
                                type="text"
                                value={hospitalData?.name}
                                placeholder="Hospital Name"
                                onChange={(e) => handelChange("name", e.target.value)}
                            />
                            {errors.name && <label style={{color:"red"}}>{errors.name}</label>}

                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">PinCode
                            <input type="text" value={hospitalData?.pinCode}
                                onChange={(e) => handelChange("pinCode", e.target.value)} placeholder="PinCode" />
                            {errors.pinCode && <label style={{color:"red"}}>{errors.pinCode}</label>}

                        </label>
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '100px',
                        // marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">City
                            <input type="text" value={hospitalData?.city}
                                onChange={(e) => handelChange("city", e.target.value)} placeholder="Enter City" />
                            {errors.city && <label style={{color:"red"}}>{errors.city}</label>}
                        </label>
                        <label style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column'

                        }} htmlFor="">State*
                            <select
                                type="text"
                                value={hospitalData?.state}
                                onChange={(e) => handelChange("state", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: '8px',
                                    borderRadius: '7px',
                                    color: 'black',
                                    fontsize: "12.5px",
                                    border: "1px solid lightgray",
                                }}
                                name="" id="">
                                <option value="">Select_State</option>
                                {indianStates.map((s, i) => {
                                    return <option key={i} value={s}>{s}</option>
                                })}
                            </select>
                            {errors.state && <label style={{color:"red"}}>{errors.state}</label>}
                        </label>
                    </div>

                    <label style={{
                        width: '100%'
                    }} htmlFor="">Address
                        <br />
                        <textarea
                            type="text"
                            value={hospitalData?.address}
                            onChange={(e) => handelChange("address", e.target.value)}
                            placeholder="address"
                            style={{
                                width: '100%',
                                borderRadius: '7px',
                                padding: '8px',
                                color: 'black',
                                fontsize: "12.5px",
                                border: "1px solid lightgray",
                            }} name="" id="" rows="3"></textarea>
                            {errors.address && <label style={{color:"red"}}>{errors.address}</label>}
                    </label>


                    {/* patient category */}
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '120px',

                    }}>
                        <label style={{
                            width: '42%'
                        }} htmlFor="">Patient Category
                            <input value={categoryName} type="text"placeholder="patientCategory"
                             onChange={(e) => {
                                return setCategoryName(e.target.value)
                            }} />
                            {errors.patientCategories && <label style={{color:"red"}}>{errors.patientCategories}</label>}
                        </label>
                        <div className="add-button" style={{ display: "flex", alignItems: "end" }}>
                            <button
                                className="main-button"
                                style={{
                                    width: '80px'
                                }}
                                onClick={() => {
                                    if (!categoryName || categoryName === '') {
                                        toast.error('Please Enter Scheme Name')
                                        return
                                    }

                                    setHospitalData({ ...hospitalData, patientCategories: [...hospitalData.patientCategories, categoryName] })
                                    setCategoryName("")
                                    return

                                }
                                }

                            >+ Add</button>
                        </div>
                    </div>
                    <hr />

                    <div className="page-handler">
                        <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> ← Back</button>
                        <button
                            disabled={isProcessing}
                            onClick={(e) => {
                                e.preventDefault();
                                const val=checkfield();

                                if (currentStep < 5 && val) {
                                    setCurrentStep(currentStep + 1);
                                } else if(currentStep === 2)  {

                                    handleSubmit(e);
                                }
                            }}
                        >
                            {currentStep < 5 ? "Next →" : "Save Hospital"}
                        </button>
                    </div>





                    {hospitalData.patientCategories.length > 0 && (


                        <div style={{
                            width: '100%',
                            marginTop: '10px',
                            display: 'flex',
                            gap: '10px'
                        }}>
                            {hospitalData.patientCategories.map((item, index) => {

                                return <span key={index} style={{
                                    padding: '10px 17px 10px 17px',
                                    backgroundColor: 'lightgray',
                                    borderRadius: '7px',
                                    fontSize: '15px'

                                }}>{item}  <i
                                    onClick={() => {
                                        setHospitalData(prev => ({
                                            ...prev,
                                            patientCategories: prev.patientCategories.filter((_, idx) => idx !== index)
                                        }));
                                    }}

                                    className="ri-close-large-line"
                                    style={{ cursor: 'pointer', fontSize: '15px' }}
                                ></i></span>

                            })}
                        </div>
                    )}


                </div>
            )}
            {currentStep == 2 && (
                <div className="steps" >
                    <h3>Medical Director Details</h3>
                    <hr />

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '120px',
                        // marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Name *
                            <input
                                value={hospitalData?.medicalDirector?.name}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        name: e.target.value
                                    }
                                })}
                                type="text" placeholder="Enter Full Name" />
                            {errors.medicalDirectorName && <label style={{color:"red"}}>{errors.medicalDirectorName}</label>}
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Experience
                            <input value={hospitalData?.medicalDirector?.experience}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        experience: e.target.value
                                    }
                                })}
                                type="number" placeholder="Ex.2" />
                            {errors.medicalDirectorExperience && <label style={{color:"red"}}>{errors.medicalDirectorExperience}</label>}

                        </label>
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '120px',
                        // marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Email
                            <input value={hospitalData?.medicalDirector?.email}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        email: e.target.value
                                    }
                                })} type="text" placeholder="email@example.com" />
                            {errors.medicalDirectorEmail && <label style={{color:"red"}}>{errors.medicalDirectorEmail}</label>}

                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Contact Number *
                            <input
                                value={hospitalData?.medicalDirector?.contact}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        contact: e.target.value
                                    }
                                })}
                                type="text" placeholder="+91 7340479570" />
                            {errors.medicalDirectorContact && <label style={{color:"red"}}>{errors.medicalDirectorContact}</label>}

                        </label>
                    </div>
                    <div
                        style={{
                            width: "100%",

                            padding: '20px',
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "0.7px solid lightgray",
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
                                accept="image/*"
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        image: e.target.files[0]
                                    }
                                })}
                            />
                            {errors.medicalDirectorImage && <label style={{color:"red"}}>{errors.medicalDirectorImage}</label>}

                        </label>
                    </div>
                    <hr />

                    <div className="page-handler" >
                        <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1} >← Back</button>
                        <button
                            disabled={isProcessing}
                            onClick={(e) => {

                                 const val=checkfield();
                                if (currentStep < 5 && val) {
                                    setCurrentStep(currentStep + 1);
                                } else if(currentStep===3) {

                                    handleSubmit(e);
                                }
                            }}
                        >
                            {currentStep < 5 ? "Next →" : "Save Hospital"}
                        </button>
                    </div>
                </div>
            )}
            {console.log("error" , errors)
            }
            {currentStep == 3 && (
                <div className="steps">
                    <h3>Department Setup</h3>

                    {errors.supportedDepartments && <label style={{color:"red"}}>{errors.supportedDepartments}</label>}

                    <hr />

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        {
                            dummyDepartments.map((item, i) => {
                                const isSelected = hospitalData.supportedDepartments.some((dep) => dep.departmentName === item.name)
                                return <div className="departmentCard"
                                    onClick={() => {
                                        if (isSelected) {
                                            return
                                        }
                                        return setHospitalData({
                                            ...hospitalData, supportedDepartments: [
                                                ...hospitalData.supportedDepartments,
                                                {
                                                    departmentName: item.name,
                                                    image: item.image,
                                                    doctors: []
                                                }
                                            ]
                                        })
                                    }}

                                    key={i}>
                                    <img style={{
                                        width: '40px',
                                        height: '40px'
                                    }} src={item.image} alt={item.name} />
                                    <span>
                                        {item.name}
                                    </span>
                                </div>
                            })
                        }
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <h4> Selected Department </h4>
                                             
                    {errors.supportedDepartmentsdoctors && <label style={{color:"red"}}>{errors.supportedDepartmentsdoctors}</label>}
                        {/* {errors.medicalDirectorName && <label style={{color:"red"}}>{errors.medicalDirectorName}</label>} */}

                        {/* <button className="card hover" style={{
                            width: '160px',
                            height: "40px",
                            transition: "1s ease",
                            backgroundColor: "lightgreen"
                        }} onClick={() => setCustomDepartment({ name: '', image: '' })}>+ Add Custom</button> */}
                    </div>
                    {
                        hospitalData.supportedDepartments.length > 0 && (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}>
                                {hospitalData.supportedDepartments.map((dep, i) => {
                                    return <div key={i}
                                        style={{
                                            width: '350px',
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
                                                    <h4 >{dep.departmentName || "Unnamed"}</h4>
                                                    <p className="reviewtag">{dep.doctors?.length || "0"}</p>
                                                </div>

                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px'
                                            }}>
                                                {dep.doctors?.length !== 0 && (
                                                    <i class="ri-edit-box-line" onClick={() => setEdit(i)}></i>
                                                )}

                                                <i class="ri-close-large-line" onClick={() => {
                                                    const updated = hospitalData.supportedDepartments.filter((item, index) => index !== i)
                                                    setHospitalData((prev) => {
                                                        return { ...prev, supportedDepartments: updated }
                                                    })
                                                }}></i>
                                            </div>


                                        </div>
                                        <button
                                            onClick={() => setAssignDoctor(i)}
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'lightgrey',
                                                border: 'none',
                                                padding: '10px',
                                                borderRadius: '10px'
                                            }}><i class="ri-group-line"></i>+ Doctor</button>
                                    </div>


                                })}
                            </div>
                        )
                    }
                    <hr />
                    <div className="page-handler" >
                        <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> ← Back</button>
                        <button
                            disabled={isProcessing}
                            onClick={(e) => {
                                e.preventDefault();
                                  const val=checkfield()
                                if (currentStep < 5 && val) {
                                    setCurrentStep(currentStep + 1);
                                } else if(currentStep === 4) {

                                    handleSubmit(e);
                                }
                            }}
                        >
                            {currentStep < 5 ? "Next →" : "Save Hospital"}
                        </button>
                    </div>

                </div>
            )}
            {currentStep == 4 && (
                <div className="steps" >
                    <h3>Review & Submit</h3>
                    <hr />
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
                        <div className="review-strategy" >
                            <h3>Hospital Details</h3>
                            <span><i onClick={() => setCurrentStep(1)} class="ri-edit-box-line"></i></span>

                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',  // line break agar space kam ho toh
                            gap: '15px',
                            justifyContent: 'space-between',
                        }}>
                            <p className="reviewtag">
                                Name: <span >{hospitalData.name}</span>
                            </p>

                            <p className="reviewtag">
                                State: <span >{hospitalData.state}</span>
                            </p>

                            <p className="reviewtag">
                                City: <span >{hospitalData.city}</span>
                            </p>

                            <p className="reviewtag">
                                Pincode: <span >{hospitalData.pinCode}</span>
                            </p>

                            <p className="reviewtag">
                                Address: <span >{hospitalData.address}</span>
                            </p>

                            <p className="reviewtag">
                                Patient Categories: <span >
                                    {hospitalData.patientCategories.join(', ')}
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
                            className="review-strategy"
                        >
                            <h3>Medical Director</h3>
                            <span><i onClick={() => setCurrentStep(2)} class="ri-edit-box-line"></i></span>

                        </div>

                        <div style={{
                            display: 'flex',
                            // line break agar space kam ho toh
                            gap: '15px',

                        }}>
                            <div style={{
                                width: '80px'
                            }}>
                                {hospitalData?.medicalDirector?.image && (
                                    <img style={{
                                        width: "60px",
                                        height: "60px"
                                    }}
                                        // src={testimg}
                                        src={URL.createObjectURL(hospitalData?.medicalDirector?.image)}
                                        alt="image" />
                                )
                                }

                            </div>

                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: "space-between",

                            }}>
                                <p className="reviewtag">
                                    Name: <span >{hospitalData.medicalDirector.name}</span>
                                </p>

                                <p className="reviewtag">
                                    Email: <span >{hospitalData.medicalDirector.email}</span>
                                </p>

                                <p className="reviewtag">
                                    Experience: <span >{hospitalData.medicalDirector.experience}</span>
                                </p>

                                <p className="reviewtag">
                                    Contact: <span >{hospitalData.medicalDirector.contact}</span>
                                </p>
                            </div>

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
                            className="review-strategy"
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
                                {hospitalData.supportedDepartments.length > 0 && hospitalData.supportedDepartments.map((dep, i) => {
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
                    {/* <div
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
                            className="review-strategy"
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
                            <p className="reviewtag">
                                Name: <span>{hospitalData.customLetterPad.headerName}</span>
                            </p>

                            <p className="reviewtag">
                                Email: <span >{hospitalData.customLetterPad.headerEmail}</span>
                            </p>

                            <p className="reviewtag">
                                Phone: <span >{hospitalData.customLetterPad.headerPhone}</span>
                            </p>

                            <p className="reviewtag">
                                Tagline1: <span >{hospitalData.customLetterPad.tagline1}</span>
                            </p>

                            <p className="reviewtag">
                                Tagline2: <span >{hospitalData.customLetterPad.tagline2}</span>
                            </p>
                        </div>

                    </div> */}
                    <hr />

                    <div className="saveHospital" >
                        <button style={{
                            padding: "7px",
                            color: "white",
                            backgroundColor: "black",
                            borderRadius: "10px",
                            outline: "none",
                            cursor: "pointer"
                        }}
                            onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> ← Back</button>
                        <button
                            disabled={isProcessing}
                            onClick={(e) => {
                                e.preventDefault();

                                if (currentStep < 4) {
                                    setCurrentStep(currentStep + 1);
                                } else {

                                    handleSubmit(e);
                                }
                            }}
                        >
                            {currentStep < 4 ? " Next →" : `${isProcessing ? "saving...." : "Save Hospital"}`}
                        </button>
                    </div>
                </div>

            )}
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
                    // gap: "50px"
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        minHeight: '400px',
                        width: '600px',
                        padding: '20px',
                        borderRadius: '10px',
                        display: "grid",
                        gap: "10px"
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                         }}>
                            <h3>
                                {`Add Doctor for ${hospitalData?.supportedDepartments[assinDoctor].departmentName}`}
                            </h3>
                            <i
                                onClick={() => setAssignDoctor(null)}
                                className="ri-close-large-line"
                                style={{ cursor: 'pointer', fontSize: '20px' }}
                            ></i>
                        </div>
                        <hr />
                        {/*Doctor Data Form */}
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '80px'
                         }}>
                            <label style={{ width: '100%' }}>
                                Name *
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={doctorData.doctorName}
                                    onChange={(e) => setDoctorData({ ...doctorData, doctorName: e.target.value })}
                                />
                    {/* {errors.doctorName && <label style={{color:"red"}}>{errors.doctorName}</label>} */}
                            </label>

                            <label style={{ width: '100%' }}>
                                Email *
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={doctorData.email}
                                    onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                                />
                     {/* {errors.doctorEmail && <label style={{color:"red"}}>{errors.doctorEmail}</label>} */}

                            </label>
                        </div>

                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '80px'
                        }}>
                            <label style={{ width: '100%' }}>
                                Contact Number *
                                <input
                                    type="text"
                                    placeholder="Contact Number"
                                    value={doctorData.contact}
                                    onChange={(e) => setDoctorData({ ...doctorData, contact: e.target.value })}
                                />
                    {/* {errors.doctorContact && <label style={{color:"red"}}>{errors.doctorContact}</label>} */}

                            </label>

                            <label style={{ width: '100%' }}>
                                Experience (years) *
                                <input
                                    type="number"
                                    placeholder="ex.2"
                                    value={doctorData.experience}
                                    onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value })}
                                />
                    {/* {errors.doctorExperience && <label style={{color:"red"}}>{errors.doctorExperience}</label>} */}

                            </label>
                        </div>

                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '80px'
                        }}>
                            <label style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: '10px'
                            }}>
                                Qualification *
                                <select
                                    style={{ padding: '10px', borderRadius: '7px', border: '0.3px solid lightgray' }}
                                    value={doctorData.qualification}
                                    onChange={(e) => setDoctorData({ ...doctorData, qualification: e.target.value })}
                                >
                                    <option value="">Select_Degree</option>
                                    <option value="Graduation">Graduation</option>
                                    <option value="Post-Graduation">Post-Graduation</option>
                                </select>
                    {/* {errors.doctorQualification && <label style={{color:"red"}}>{errors.doctorQualification}</label>} */}

                            </label>
                            <label style={{ width: '100%' }}>
                                Appointment Fees *
                                <input
                                    type="number"
                                    placeholder="ex.500"
                                    value={doctorData?.appointmentFees}
                                    onChange={(e) => setDoctorData({ ...doctorData, appointmentFees: e.target.value })}
                                />
                    {/* {errors.doctorAppointmentFees && <label style={{color:"red"}}>{errors.doctorAppointmentFees}</label>} */}

                            </label>
                        </div>


                        <hr />

                        {/*Action Buttons */}
                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'end',
                            gap: '10px'
                        }}>
                            <button className="regular-btn" onClick={() => setAssignDoctor(null)}>Cancel</button>
                            <button className="common-btn"
                             onClick={()=>{
                                // checkfield()
                                handleAddDoctor();
                                }}>Add Doctor</button>
                        </div>
                    </div>
                </div>
            )
        }
        {
            addCustomDep !== null && (
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
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3>
                                {`New Department`}
                            </h3>
                            <i
                                onClick={() => setCustomDepartment(null)}
                                className="ri-close-large-line"
                                style={{ cursor: 'pointer', fontSize: '20px' }}
                            ></i>
                        </div>

                        <label style={{ width: '100%' }}>
                            Name *
                            <input
                                type="text"
                                placeholder="Name"
                                value={addCustomDep.name}
                                onChange={(e) => setCustomDepartment({ ...addCustomDep, name: e.target.value })}
                            />
                        </label>

                        <label style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '10px'
                        }}>
                            Department Image *
                            <input
                                value={addCustomDep.image}
                                onChange={(e) => setCustomDepartment({ ...addCustomDep, image: e.target.value })}
                                style={{
                                    border: '0.5px solid black'
                                }} type="file"></input>
                        </label>

                        {/*Action Buttons */}
                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'end',
                            gap: '10px'
                        }}>
                            <button onClick={() => setCustomDepartment(null)}>Cancel</button>
                            <button onClick={handelAddCustomDepartment}>Add Department</button>
                        </div>
                    </div>
                </div>
            )
        }

        {edit !== null && (
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

                <div className="editcard">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        borderRadius: '7px'
                    }}>
                        <h4>{hospitalData.supportedDepartments[edit]?.departmentName}</h4>
                        <i class="ri-close-large-line" style={{
                            cursor: "pointer"
                        }} onClick={() => {
                            setEdit(null)
                        }}></i>
                    </div>

                    {
                        hospitalData.supportedDepartments[edit]?.doctors?.map((doc, i) => {
                            return <div key={i} className="editdep">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <h5>doctor:{i + 1}</h5>
                                    <i class="ri-delete-bin-7-line" onClick={() => {
                                        const updatedDoctors = hospitalData.supportedDepartments[edit]?.doctors?.filter((_, idx) => idx !== i)
                                        const updatedDepartments = [...hospitalData.supportedDepartments]
                                        updatedDepartments[edit].doctors = updatedDoctors

                                        setHospitalData((prev) => ({
                                            ...prev,
                                            supportedDepartments: updatedDepartments
                                        }))

                                    }}></i>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '10px'
                                }}>
                                    <input type="text" onChange={(e) => handelDoctorChange(edit, i, "doctorName", e.target.value)} value={doc?.doctorName} />
                                    <input type="text" onChange={(e) => handelDoctorChange(edit, i, "email", e.target.value)} value={doc?.email} />
                                    <input type="text" onChange={(e) => handelDoctorChange(edit, i, "contact", e.target.value)} value={doc?.contact} />
                                    <input type="text" onChange={(e) => handelDoctorChange(edit, i, "experience", e.target.value)} value={doc?.experience} />
                                    <input type="text" onChange={(e) => handelDoctorChange(edit, i, "qualification", e.target.value)} value={doc?.qualification} />
                                </div>

                            </div>
                        })
                    }
                </div>

            </div>
        )}

    </div >

}


