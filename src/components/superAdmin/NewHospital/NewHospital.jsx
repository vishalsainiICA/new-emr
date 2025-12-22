import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { superAdminApi } from "../../../auth";
import { FaArrowLeft } from "react-icons/fa";
import './NewHospital.css'

import testimg from "../../../assets/download.jpg"
import { BiAlignRight, BiBorderRight, BiCheck, BiDockRight, BiEdit, BiRightArrow } from "react-icons/bi";
import { IndianStates } from "../../Utility/PatientHistory__Labtest";


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
    const [editDep, seteditDep] = useState(null)

    const [hospitalData, setHospitalData] = useState({
        name: '',
        state: null,
        pinCode: '',
        city: '',
        totalBeds: '',
        hospitalCategory: '',
        address: '',
        patientCategories: [],
        medicalDirector: {
            name: '',
            email: '',
            contact: '',
            experience: '',
            image: null,
            gender: ''
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

    const [hospitalDatacopy, setHospitalDatacopy] = useState({})
    const [mdDatacopy, setMDdatacopy] = useState({})

    const [doctorData, setDoctorData] = useState({
        name: "",
        email: "",
        contact: "",
        experience: "",
        qualification: "",
        gender: "",
        appointmentFees: null
    });


    const [errors, setErrors] = useState({
        name: '',
        state: null,
        pinCode: '',
        city: '',
        totalBeds: '',
        hospitalCategory: '',
        address: '',
        patientCategories: [],
        medicalDirectorName: '',
        medicalDirectorContact: '',
        medicalDirectorEmail: '',
        medicalDirectorExperience: '',
        medicalDirectorImage: '',
        medicalDirectorgender: '',
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


    const [doctorDetail, setDoctordetail] = useState(null)

    // ================= REGEX ==================

    // Hospital
    // const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;?

    const hospitalNameRegex = /^[A-Za-z\s]+$/;
    const cityRegex = /^[A-Za-z\s]+$/;
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    const addressRegex = /^[A-Za-z0-9\s,./#-]+$/;
    const categoryRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

    // Director
    const directorNameRegex = /^[A-Za-z\s]+$/;
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const contactRegex = /^[6-9][0-9]{9}$/;
    const experienceRegex = /^(?:[1-9]|[1-9][0-9])$/;

    // Doctor
    const nameRegex = /^[A-Za-z\s]+$/;
    const doctorEmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const doctorContactRegex = /^[6-9][0-9]{9}$/;
    const qualificationRegex = /^[A-Za-z.\s]+$/;
    const feesRegex = /^[1-9][0-9]{2,4}$/;

    // Department
    const departmentNameRegex = /^[A-Za-z\s]+$/;



    const checkfield = () => {

        const errors = {}
        // step 1 Validation
        if (currentStep === 1) {
            if (!hospitalData.name) errors.name = "Hospital Name is required"
            if (hospitalData.name && !hospitalNameRegex.test(hospitalData.name)) { errors.name = "Only alphabets allowed"; }
            if (!hospitalData.state) errors.state = " state is required"
            if (!hospitalData.city) errors.city = "City is required"
            if (hospitalData.city && !cityRegex.test(hospitalData.city)) { errors.city = "Only alphabets"; }
            if (!hospitalData.pinCode) errors.pinCode = " pinCode is required"
            if (!hospitalData.totalBeds) errors.totalBeds = " totalBeds is required"
            if (!hospitalData.hospitalCategory) errors.hospitalCategory = " hospitalCategory is required"
            if (hospitalData.pinCode && !pinCodeRegex.test(hospitalData.pinCode)) { errors.pinCode = "Invalid Pincode (6 digits)"; }
            if (!hospitalData.address) errors.address = " address is required"
            //   if (!addressRegex.test(hospitalData.address)) {errors.address = "Invalid address format";}
            if (hospitalData.patientCategories?.length === 0) errors.patientCategories = " Patient Category  is required"
            //    if (!categoryRegex.test(cat)) {errors.patientCategories = "Invalid category name";}
        }

        // step 2 Validation

        if (currentStep == 2) {
            if (!hospitalData.medicalDirector?.name) errors.medicalDirectorName = "Medical director Name is required"
            if (hospitalData.medicalDirector?.name && !directorNameRegex.test(hospitalData.medicalDirector.name)) { errors.medicalDirectorName = "Only alphabets Allowed"; }
            if (!hospitalData.medicalDirector?.experience) errors.medicalDirectorExperience = "Medical director Experience is required"
            if (!hospitalData.medicalDirector?.gender) errors.medicalDirectorgender = "Medical director Gender is required"
            if (hospitalData.medicalDirector?.experience && !experienceRegex.test(hospitalData.medicalDirector.experience)) { errors.medicalDirectorExperience = "Invalid experience (1-99)"; }
            if (!hospitalData.medicalDirector?.contact) errors.medicalDirectorContact = "Medical director contact is required"
            if (hospitalData.medicalDirector?.contact && hospitalData.medicalDirector?.contact.length !== 10) errors.medicalDirectorContact = "Medical director Number Must be 10 digits"
            if (!hospitalData.medicalDirector?.email) errors.medicalDirectorEmail = "Medical director email is required"
            if (hospitalData.medicalDirector?.email && !gmailRegex.test(hospitalData.medicalDirector?.email)) { errors.medicalDirectorEmail = "Only Gmail address allowed"; }
            // medical director Image Optional
            //   if(!hospitalData.medicalDirector?.image) errors.medicalDirectorImage="Medical director Document  is required"
        }

        if (currentStep === 3) {
            if (hospitalData.supportedDepartments.length === 0) errors.supportedDepartments = "Please Select Department is Required"
            //  if(hospitalData.supportedDepartments?.doctors?.length=== 0) errors.supportedDepartmentsdoctors="Please Add  One doctor  is Required"

            const hasDoctor = hospitalData.supportedDepartments.every(
                (dep) => dep.doctors && dep.doctors.length > 0);

            if (!hasDoctor) errors.supportedDepartmentsdoctors = "Each department must have at least one doctor";

        }
        if (doctorDetail === 3 && hospitalData.supportedDepartments.length !== 0) {
            if (doctorDetail == 1) {
                if (!doctorData.name) errors.name = "Doctor name is required"
                if (!doctorData.email) errors.doctorEmail = "Doctor Email is required"
                if (doctorData?.email && !gmailRegex.test(doctorData?.email)) { errors.doctorEmail = "Only Gmail address allowed"; }
                if (!doctorData.experience) errors.doctorExperience = "Doctor Experience is required"
                if (!doctorData.qualification) errors.doctorQualification = "Doctor Qualification is required"
                if (!doctorData.contact) errors.doctorContact = "Doctor Contact Number is required"
                if (!doctorData.appointmentFees) errors.doctorAppointmentFees = "Doctor Appointment Fee is required"
                const isTrue = hospitalData.supportedDepartments.some((item) => item?.doctors?.length === 0)
            }
        }

        if (currentStep === 4) {
            // hospital data
            if (!hospitalDatacopy?.name) errors.name = "Hospital Name is required"
            if (hospitalDatacopy.name && !hospitalNameRegex.test(hospitalDatacopy.name)) { errors.name = "Only alphabets allowed"; }
            if (!hospitalDatacopy.state) errors.state = " state is required"
            if (!hospitalDatacopy.city) errors.city = "City is required"
            if (hospitalDatacopy.city && !cityRegex.test(hospitalDatacopy.city)) { errors.city = "Only alphabets"; }
            if (!hospitalDatacopy.pinCode) errors.pinCode = " pinCode is required"
            if (hospitalDatacopy.pinCode && !pinCodeRegex.test(hospitalDatacopy.pinCode)) { errors.pinCode = "Invalid Pincode (6 digits)"; }
            if (!hospitalDatacopy.address) errors.address = " address is required"

            // MD data

            if (!hospitalDatacopy?.medicalDirector?.name) errors.medicalDirectorName = "Medical director Name is required"
            if (hospitalDatacopy?.medicalDirector?.name && !directorNameRegex.test(hospitalDatacopy.medicalDirector.name)) { errors.medicalDirectorName = "Only alphabets Allowed"; }
            if (!hospitalDatacopy?.medicalDirector?.gender) errors.medicalDirectorgender = "Medical director Gender is required"
            if (!hospitalDatacopy?.medicalDirector?.experience) errors.medicalDirectorExperience = "Medical director Experience is required"
            if (hospitalDatacopy?.medicalDirector?.experience && !experienceRegex.test(hospitalDatacopy?.medicalDirector.experience)) { errors.medicalDirectorExperience = "Invalid experience (1-99)"; }
            if (!hospitalDatacopy?.medicalDirector?.contact) errors.medicalDirectorContact = "Medical director contact is required"
            if (hospitalDatacopy?.medicalDirector?.contact && hospitalDatacopy?.medicalDirector?.contact.length !== 10) errors.medicalDirectorContact = "Medical director Number Must be 10 digits"
            if (!hospitalDatacopy?.medicalDirector?.email) errors.medicalDirectorEmail = "Medical director email is required"
            if (hospitalDatacopy?.medicalDirector?.email && !gmailRegex.test(hospitalDatacopy?.medicalDirector?.email)) { errors.medicalDirectorEmail = "Only Gmail address allowed"; }



        }


        setErrors(errors);

        return Object.keys(errors).length === 0;
    }

    const handelChange = (key, value) => {
        console.log("key");

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
        if (!doctorData.name || !doctorData.email || !doctorData.contact || !doctorData.experience || !doctorData.qualification || !doctorData.appointmentFees) {
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
            name: "",
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

    const [editHospital, setEditHospital] = useState(false)
    const [showHospital, setShowHospital] = useState(true)
    const [showMD, setShowMD] = useState(true)
    const [editMD, setEditMD] = useState(false)


    function Edithospitadata() {
        setShowHospital(!showHospital)
        setEditHospital(!editHospital)
    }

    function EditMDdata() {
        setShowMD(!showMD)
        setEditMD(!editMD)
    }

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
                        }} htmlFor="">Hospital Name <p className="star">*</p>
                            <input
                                // pattern="^[A-Za-z\s]+$"
                                type="text"
                                value={hospitalData?.name}
                                placeholder="Hospital Name"
                                // onWheel={(e) => e.preventDefault()}
                                onChange={(e) => handelChange("name", e.target.value)}
                            />
                            {errors.name && <label style={{ color: "red" }}>{errors.name}</label>}

                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">PinCode  <p className="star">*</p>
                            <input
                                type="tel"
                                maxLength={6}
                                style={{
                                    cursor: "text",
                                    //   pointerEvents: "none"

                                }}
                                onWheel={(e) => { e.target.blur() }}
                                value={hospitalData?.pinCode}
                                onChange={(e) => { handelChange("pinCode", e.target.value.replace(/\D/g, "")) }}
                                placeholder="PinCode" />
                            {errors.pinCode && <label style={{ color: "red" }}>{errors.pinCode}</label>}

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
                        }} htmlFor="">City <p className="star">*</p>
                            <input type="text" value={hospitalData?.city}
                                onChange={(e) => handelChange("city", e.target.value)} placeholder="Enter City" />
                            {errors.city && <label style={{ color: "red" }}>{errors.city}</label>}
                        </label>
                        <label style={{
                            width: '100%',
                        }} htmlFor="">State <p className="star">*</p>
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
                                {IndianStates.map((s, i) => {
                                    return <option key={i} value={s}>{s}</option>
                                })}
                            </select>
                            {errors.state && <label style={{ color: "red" }}>{errors.state}</label>}
                        </label>
                    </div>

                    <label style={{
                        width: '100%'
                    }} htmlFor="">Address <p className="star">*</p>
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
                        {errors.address && <label style={{ color: "red" }}>{errors.address}</label>}
                    </label>

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '100px',
                        // marginTop: '10px',

                    }}>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Total Beds <p className="star">*</p>
                            <input type="tel" maxLength={4} value={hospitalData?.totalBeds}
                                onChange={(e) => handelChange("totalBeds", e.target.value.replace(/\D/g, ""))} placeholder="ex.450 .beds " />
                            {errors.totalBeds && <label style={{ color: "red" }}>{errors.totalBeds}</label>}
                        </label>
                        <label style={{
                            width: '100%',
                        }} htmlFor="">Hospital Category <p className="star">*</p>
                            <select
                                type="text"
                                value={hospitalData?.hospitalCategory}
                                onChange={(e) => handelChange("hospitalCategory", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: '8px',
                                    borderRadius: '7px',
                                    color: 'black',
                                    fontsize: "12.5px",
                                    border: "1px solid lightgray",
                                }}
                                name="" id="">
                                <option value="">Select Category</option>
                                <option value="Government">Government Hospital</option>
                                <option value="Semi Government">Semi Government Hospital</option>
                                <option value="Multi-Speciality">Multispeciality Hospital</option>
                                <option value="Super-Speciality">Super Speciality Hospital</option>
                                <option value="Private">Private Hospital</option>

                            </select>
                            {errors.hospitalCategory && <label style={{ color: "red" }}>{errors.hospitalCategory}</label>}
                        </label>
                    </div>


                    {/* patient category */}
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        alignContent: 'center',
                        alignItems: 'center',
                        gap: '10px'

                    }}>
                        <label style={{
                            width: '42%'
                        }} htmlFor="">Patient Category  <p className="star">*</p>
                            <input value={categoryName} type="text" placeholder="ex. Jan Addhar"
                                onChange={(e) => {
                                    return setCategoryName(e.target.value)
                                }} />
                            {errors.patientCategories && <label style={{ color: "red" }}>{errors.patientCategories}</label>}
                        </label>
                        <button

                            style={{
                                marginTop: '10px',
                                width: '60px',
                                height: '30px',
                                cursor: 'pointer',
                                backgroundColor: 'lavender',
                                outline: 'none',
                                border: '0.5px solid lightgrey',
                                borderRadius: '10px'
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
                    <hr />

                    <div className="page-handler">
                        <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> ← Back</button>
                        <button
                            disabled={isProcessing}
                            onClick={(e) => {
                                e.preventDefault();
                                const val = checkfield();

                                if (currentStep < 5 && val) {
                                    setCurrentStep(currentStep + 1);
                                } else if (currentStep === 2) {

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
                        }} htmlFor="">Name <p className="star">*</p>
                            <input
                                prefix="Dr."
                                value={hospitalData?.medicalDirector?.name}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        name: e.target.value
                                    }
                                })}
                                type="text" placeholder="Enter Full Name" />
                            {errors.medicalDirectorName && <label style={{ color: "red" }}>{errors.medicalDirectorName}</label>}
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Experience <p className="star">*</p>
                            <input
                                style={{ cursor: "text" }}
                                maxLength={2}
                                value={hospitalData?.medicalDirector?.experience}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        experience: e.target.value.replace(/\D/g, "")
                                    }
                                })}
                                type="tel" placeholder="Ex.2" />
                            {errors.medicalDirectorExperience && <label style={{ color: "red" }}>{errors.medicalDirectorExperience}</label>}

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
                        }} htmlFor="">Email <p className="star">*</p>
                            <input value={hospitalData?.medicalDirector?.email}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        email: e.target.value
                                    }
                                })} type="text" placeholder="email@example.com" />
                            {errors.medicalDirectorEmail && <label style={{ color: "red" }}>{errors.medicalDirectorEmail}</label>}

                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Contact Number <p className="star">*</p>
                            <input
                                style={{ cursor: "text" }}
                                maxLength={10}
                                value={hospitalData?.medicalDirector?.contact}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        contact: e.target.value.replace(/\D/g, "")
                                    }
                                })}
                                type="tel" placeholder="+91 7340479570" />
                            {errors.medicalDirectorContact && <label style={{ color: "red" }}>{errors.medicalDirectorContact}</label>}

                        </label>
                    </div>
                    <div style={{
                        marginTop: '10px',
                        columnGap: '80px',
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <label style={{
                            width: '100%',
                            // marginTop: '10px'
                        }}>
                            Gender  <p className="star">*</p>
                            <select
                                style={{
                                    width: "100%",
                                    padding: '8px',
                                    borderRadius: '7px',
                                    color: 'black',
                                    fontsize: "12.5px",
                                    border: "1px solid lightgray",
                                }}
                                value={hospitalData.medicalDirector.gender}
                                onChange={(e) => setHospitalData({
                                    ...hospitalData, medicalDirector: {
                                        ...hospitalData.medicalDirector,
                                        gender: e.target.value
                                    }
                                })}>
                                <option>Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>other</option>
                            </select>
                            {errors.medicalDirectorgender && <label style={{ color: "red" }}>{errors.medicalDirectorgender}</label>}
                        </label>
                        <label
                            style={{
                                width: '100%',
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
                                })} />
                            {errors.medicalDirectorImage && <label style={{ color: "red" }}>{errors.medicalDirectorImage}</label>}

                        </label>
                    </div>

                    <hr />

                    <div className="page-handler" >
                        <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1} >← Back</button>
                        <button
                            disabled={isProcessing}
                            onClick={(e) => {

                                const val = checkfield();
                                if (currentStep < 5 && val) {
                                    setCurrentStep(currentStep + 1);
                                } else if (currentStep === 3) {

                                    handleSubmit(e);
                                }
                            }}
                        >
                            {currentStep < 5 ? "Next →" : "Save Hospital"}
                        </button>
                    </div>
                </div>
            )}
            {currentStep == 3 && (
                <div className="steps">
                    <h3>Department Setup</h3>

                    {errors.supportedDepartments && <label style={{ color: "red" }}>{errors.supportedDepartments}</label>}

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

                        {errors.supportedDepartmentsdoctors && <label style={{ color: "red" }}>{errors.supportedDepartmentsdoctors}</label>}
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
                                                    <BiEdit onClick={() => setEdit(i)}></BiEdit>

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
                                            className="addButton"
                                            style={{
                                                width: '100%'
                                            }}

                                        ><i class="ri-group-line"></i>+ Doctor</button>


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
                                setHospitalDatacopy(hospitalData);
                                // setMDdatacopy()
                                e.preventDefault();
                                const val = checkfield()
                                if (currentStep < 5 && val) {
                                    setCurrentStep(currentStep + 1);
                                } else if (currentStep === 4) {

                                    handleSubmit(e);
                                }
                            }}
                        >
                            {currentStep < 5 ? "Next →" : "Save Hospital"}
                        </button>
                    </div>

                </div>
            )}
            {
                currentStep == 4 && (
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
                                {showHospital &&
                                    <span><i onClick={Edithospitadata} class="ri-edit-box-line"></i></span>
                                }
                                {editHospital &&
                                    <div style={{ display: "flex", gap: "30px", }}>
                                        <button style={{ width: "55px", backgroundColor: "black", color: "white", borderRadius: "5px" }}
                                            onClick={() => {
                                                Edithospitadata();
                                                setHospitalDatacopy(hospitalData);
                                            }}
                                        >Cancel</button>
                                        <button style={{ width: "55px", backgroundColor: "black", color: "white", borderRadius: "5px" }}
                                            onClick={() => {
                                                const val = checkfield();

                                                if (val) {
                                                    setHospitalData(hospitalDatacopy);
                                                    Edithospitadata();
                                                }
                                            }}>Save</button>
                                    </div>
                                }
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: "column",
                                flexWrap: 'wrap',  // line break agar space kam ho toh
                                gap: '15px',
                                padding: "10px"
                                // justifyContent: 'space-between',
                            }}>
                                {showHospital &&
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", }}>
                                        <div className="HospitaldataEdit">
                                            <div>
                                                <p className="reviewtag">Name: </p>
                                                <span >{hospitalData.name}</span>
                                            </div>
                                            <div>
                                                <p className="reviewtag">State:</p>
                                                <span >{hospitalData.state}</span>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit">

                                            <div>
                                                <p className="reviewtag">City:</p>
                                                <span >{hospitalData.city}</span>
                                            </div>
                                            <div>
                                                <p className="reviewtag"> Pincode: </p>
                                                <span >{hospitalData.pinCode}</span>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit">

                                            <div>
                                                <p className="reviewtag">Address:</p>
                                                <span >{hospitalData.address}</span>
                                            </div>
                                            <div>
                                                <p className="reviewtag">Patient Categories:</p>
                                                <span >{hospitalData.patientCategories.join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                }




                                {editHospital &&

                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", }}>
                                        <div className="HospitaldataEdit">
                                            <div>
                                                <p className="reviewtag">Name: </p>
                                                {/* <span >{hospitalData.name}</span> */}
                                                <input
                                                    type="text"
                                                    value={hospitalDatacopy?.name}
                                                    onChange={(e) => setHospitalDatacopy({ ...hospitalDatacopy, name: e.target.value })} />
                                                <div>
                                                    {errors.name && <label style={{ color: "red" }}>{errors.name}</label>}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="reviewtag">State:</p>
                                                {/* <span >{hospitalData.state}</span> */}
                                                {/* <input type="text" value={hospitalDatacopy?.state}
                                                    onChange={(e) => { setHospitalDatacopy({ ...hospitalDatacopy, state: e.target.value }) }} /> */}
                                                <select
                                                    type="text"
                                                    value={hospitalDatacopy?.state}
                                                    onChange={(e) => handelChange("state", e.target.value)}
                                                    style={{
                                                        width: "182px",
                                                        padding: '8px',
                                                        borderRadius: '7px',
                                                        color: 'black',
                                                        fontsize: "12.5px",
                                                        border: "1px solid lightgray",
                                                    }}
                                                    name="" id="">
                                                    <option value="">Select_State</option>
                                                    {IndianStates.map((s, i) => {
                                                        return <option key={i} value={s}>{s}</option>
                                                    })}
                                                </select>
                                                <div>
                                                    {errors.state && <label style={{ color: "red" }}>{errors.state}</label>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit">

                                            <div>
                                                <p className="reviewtag">City:</p>
                                                {/* <span >{hospitalData.city}</span> */}
                                                <input type="text" value={hospitalDatacopy?.city}
                                                    onChange={(e) => { setHospitalDatacopy({ ...hospitalDatacopy, city: e.target.value }) }} />
                                                <div>
                                                    {errors.city && <label style={{ color: "red" }}>{errors.city}</label>}
                                                </div>

                                            </div>
                                            <div>
                                                <p className="reviewtag"> Pincode: </p>
                                                {/* <span >{hospitalData.pinCode}</span> */}
                                                <input type="tel"
                                                    maxLength={6}
                                                    minLength={6}
                                                    value={hospitalDatacopy?.pinCode}
                                                    onChange={(e) => { setHospitalDatacopy({ ...hospitalDatacopy, pinCode: e.target.value.replace(/\D/g, "") }) }} />
                                                <div>
                                                    {errors.pinCode && <label style={{ color: "red" }}>{errors.pinCode}</label>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit">

                                            <div>
                                                <p className="reviewtag">Address:</p>
                                                {/* <span >{hospitalData.address}</span> */}
                                                <input type="text" value={hospitalDatacopy?.address}
                                                    onChange={(e) => { setHospitalDatacopy({ ...hospitalDatacopy, address: e.target.value }) }} />

                                                <div>
                                                    {errors.address && <label style={{ color: "red" }}>{errors.address}</label>}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }
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
                                {showMD &&
                                    <span><i onClick={EditMDdata} class="ri-edit-box-line"></i></span>
                                }
                                {editMD &&
                                    <div style={{ display: "flex", gap: "30px", }}>
                                        <button style={{ width: "55px", backgroundColor: "black", color: "white", borderRadius: "5px" }}
                                            onClick={() => {
                                                EditMDdata();
                                                setHospitalDatacopy(hospitalData);
                                            }}>Cancel</button>
                                        <button style={{ width: "55px", backgroundColor: "black", color: "white", borderRadius: "5px" }}
                                            onClick={() => {
                                                const val = checkfield();

                                                if (val) {
                                                    setHospitalData(hospitalDatacopy);
                                                    EditMDdata();
                                                }
                                            }} >Save</button>
                                        <br />
                                    </div>
                                }

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
                                            height: "60px",
                                            border: "2px solid lightgray",
                                            borderRadius: "10px",
                                            // backgroundColor:"gray"
                                        }}
                                            // src={testimg}
                                            src={URL.createObjectURL(hospitalData?.medicalDirector?.image)}
                                            alt="image" />
                                    )
                                    }

                                </div>
                                {showMD &&
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", }}>
                                        <div className="HospitaldataEdit2">
                                            <div>
                                                <p className="reviewtag">Name: </p>
                                                <span >{hospitalData.medicalDirector.name}</span>
                                            </div>
                                            <div>
                                                <p className="reviewtag">Gender:</p>
                                                <span >{hospitalData.medicalDirector.gender}</span>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit2">

                                            <div>
                                                <p className="reviewtag">Email:</p>
                                                <span >{hospitalData.medicalDirector.email}</span>
                                            </div>
                                            <div>
                                                <p className="reviewtag"> Experience: </p>
                                                <span >{hospitalData.medicalDirector.experience}</span>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit2">

                                            <div>
                                                <p className="reviewtag">Contact:</p>
                                                <span >{hospitalData.medicalDirector.contact}</span>
                                            </div>
                                        </div>
                                    </div>
                                }


                                {editMD &&
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", }}>
                                        <div className="HospitaldataEdit2">
                                            <div>
                                                <p className="reviewtag">Name:</p>
                                                {/* <span >{hospitalData.medicalDirector.name}</span> */}
                                                <input type="text" value={hospitalDatacopy?.medicalDirector?.name}
                                                    onChange={(e) => setHospitalDatacopy((prev) => ({ ...prev, medicalDirector: { ...prev.medicalDirector, name: e.target.value, }, }))} />
                                                <div>
                                                    {errors.medicalDirectorName && <label style={{ color: "red" }}>{errors.medicalDirectorName}</label>}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="reviewtag">Gender:</p>
                                                {/* <span >{hospitalData.medicalDirector.gender}</span> */}
                                                <select
                                                    style={{
                                                        width: "150px",
                                                        padding: '8px',
                                                        borderRadius: '7px',
                                                        color: 'black',
                                                        fontsize: "12.5px",
                                                        border: "1px solid lightgray",
                                                    }}
                                                    value={hospitalDatacopy?.medicalDirector?.gender}
                                                    onChange={(e) => setHospitalData({
                                                        ...hospitalDatacopy, medicalDirector: {
                                                            ...hospitalDatacopy.medicalDirector,
                                                            gender: e.target.value
                                                        }
                                                    })}>
                                                    <option>Select Gender</option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>other</option>
                                                </select>
                                                <div>
                                                    {errors.medicalDirectorgender && <label style={{ color: "red" }}>{errors.medicalDirectorgender}</label>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit2">

                                            <div>
                                                <p className="reviewtag">Email:</p>
                                                {/* <span >{hospitalData.medicalDirector.email}</span> */}
                                                <input type="text" value={hospitalDatacopy?.medicalDirector?.email}
                                                    onChange={(e) => setHospitalDatacopy((prev) => ({ ...prev, medicalDirector: { ...prev.medicalDirector, email: e.target.value, }, }))} />
                                                <div>
                                                    {errors.medicalDirectorEmail && <label style={{ color: "red" }}>{errors.medicalDirectorEmail}</label>}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="reviewtag"> Experience: </p>
                                                {/* <span >{hospitalData.medicalDirector.experience}</span> */}
                                                <input type="text" value={hospitalDatacopy?.medicalDirector?.experience}
                                                    onChange={(e) => setHospitalDatacopy((prev) => ({ ...prev, medicalDirector: { ...prev.medicalDirector, experience: e.target.value, }, }))} />
                                                <div>
                                                    {errors.medicalDirectorExperience && <label style={{ color: "red" }}>{errors.medicalDirectorExperience}</label>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="HospitaldataEdit2">

                                            <div>
                                                <p className="reviewtag">Contact:</p>
                                                {/* <span >{hospitalData.medicalDirector.contact}</span> */}
                                                <input type="tel"
                                                    maxLength={10}
                                                    value={hospitalDatacopy?.medicalDirector?.contact}
                                                    onChange={(e) => setHospitalDatacopy((prev) => ({ ...prev, medicalDirector: { ...prev.medicalDirector, contact: e.target.value.replace(/\D/g, "") }, }))} />
                                                <div>
                                                    {errors.medicalDirectorContact && <label style={{ color: "red" }}>{errors.medicalDirectorContact}</label>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }



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
                                onClick={() => { setCurrentStep(currentStep - 1); EditMDdata(); Edithospitadata(); }} disabled={currentStep == 1}> ← Back</button>
                            <button
                                disabled={isProcessing}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const val = checkfield();
                                    // Edithospitadata();
                                    if (currentStep < 4) {
                                        setCurrentStep(currentStep + 1);
                                    } else if (val) {

                                        handleSubmit(e);
                                    }
                                }}
                            >
                                {currentStep < 4 ? " Next →" : `${isProcessing ? "saving...." : "Save Hospital"}`}
                            </button>
                        </div>
                    </div>

                )
            }
        </div >

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
                                // onClick={() => {{setDoctordetail(0); checkfield();} setAssignDoctor(null)}}
                                onClick={() => { setAssignDoctor(null) }}
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
                                Name <p className="star">*</p>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={doctorData.name}
                                    onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                                />
                                {errors.name && <label style={{ color: "red" }}>{errors.name}</label>}
                            </label>

                            <label style={{ width: '100%' }}>
                                Email <p className="star">*</p>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={doctorData.email}
                                    onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                                />
                                {errors.doctorEmail && <label style={{ color: "red" }}>{errors.doctorEmail}</label>}

                            </label>
                        </div>

                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '80px'
                        }}>
                            <label style={{ width: '100%' }}>
                                Contact Number  <p className="star">*</p>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    style={{ cursor: "text" }}
                                    placeholder="Contact Number"
                                    value={doctorData.contact}
                                    onChange={(e) => setDoctorData({ ...doctorData, contact: e.target.value.replace(/\D/g, "") })}
                                />
                                {errors.doctorContact && <label style={{ color: "red" }}>{errors.doctorContact}</label>}

                            </label>

                            <label style={{ width: '100%' }}>
                                Experience (years)  <p className="star">*</p>
                                <input
                                    style={{ cursor: "text" }}
                                    type="tel"
                                    maxLength={2}
                                    placeholder="ex.2"
                                    value={doctorData.experience}
                                    onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value.replace(/\D/g, "") })}
                                />
                                {errors.doctorExperience && <label style={{ color: "red" }}>{errors.doctorExperience}</label>}

                            </label>
                        </div>

                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '80px',
                            justifyContent: "center"
                        }}>
                            <label style={{
                                width: '100%',
                                // marginTop: '10px'
                            }}>
                                Gender  <p className="star">*</p>
                                <select
                                    style={{
                                        width: "100%",
                                        padding: '8px',
                                        borderRadius: '7px',
                                        color: 'black',
                                        fontsize: "12.5px",
                                        border: "1px solid lightgray",
                                    }}
                                    value={doctorData.gender}
                                    onChange={(e) => setDoctorData({ ...doctorData, gender: e.target.value })}
                                >
                                    <option>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>other</option>
                                </select>
                            </label>
                            <label style={{ width: '100%' }}>
                                Appointment Fees  <p className="star">*</p>
                                <input
                                    style={{ cursor: "text" }}
                                    type="tel"
                                    maxLength={4}
                                    placeholder="ex.500"
                                    value={doctorData?.appointmentFees}
                                    onChange={(e) => setDoctorData({ ...doctorData, appointmentFees: e.target.value.replace(/\D/g, "") })}
                                />
                                {errors.doctorAppointmentFees && <label style={{ color: "red" }}>{errors.doctorAppointmentFees}</label>}

                            </label>
                        </div>
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '80px'
                        }}>
                            <label style={{
                                width: '100%',
                                // marginTop: '10px'
                            }}>
                                Qualification  <p className="star">*</p>
                                <select
                                    style={{
                                        width: "100%",
                                        padding: '8px',
                                        borderRadius: '7px',
                                        color: 'black',
                                        fontsize: "12.5px",
                                        border: "1px solid lightgray",
                                    }}
                                    value={doctorData.qualification}
                                    onChange={(e) => setDoctorData({ ...doctorData, qualification: e.target.value })}
                                >
                                    <option value="">Select_Degree</option>
                                    <option value="Graduation">Graduation</option>
                                    <option value="Post-Graduation">Post-Graduation</option>
                                </select>
                                {errors.doctorQualification && <label style={{ color: "red" }}>{errors.doctorQualification}</label>}

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
                            <button className="addButton"
                                onClick={() => {
                                    //  setDoctordetail(1);
                                    //  checkfield();
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

        {
            edit !== null && (
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
                                { console.log("hh", hospitalData?.supportedDepartments?.length) }
                            }}></i>
                        </div>

                        {
                            hospitalData.supportedDepartments[edit]?.doctors?.map((doc, index) => {
                                return (
                                    <div key={index} className="editdepCard">
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <h5>doctor:{index + 1}</h5>
                                            <div className="controller">
                                                {console.log("hh", hospitalData?.supportedDepartments[edit].doctors?.length)}
                                                {
                                                    editDep !== null && editDep === index ? (<span onClick={() => {
                                                        seteditDep(null)
                                                    }}>✓</span>) : (<BiEdit className="editItems" onClick={() => {
                                                        console.log("index", index)
                                                        console.log("editdep", editDep)
                                                        seteditDep(index)
                                                    }}></BiEdit>)
                                                }


                                                <i class="ri-delete-bin-7-line editItems" onClick={() => {
                                                    const updatedDoctors = hospitalData.supportedDepartments[edit]?.doctors?.filter((_, idx) => idx !== index)
                                                    const updatedDepartments = [...hospitalData.supportedDepartments]
                                                    updatedDepartments[edit].doctors = updatedDoctors

                                                    setHospitalData((prev) => ({
                                                        ...prev,
                                                        supportedDepartments: updatedDepartments
                                                    }))




                                                    if (!hospitalData?.supportedDepartments[edit].doctors?.length === 0) {
                                                        setEdit(null)
                                                        console.log("hh", hospitalData?.supportedDepartments[edit].doctors?.length)
                                                    }


                                                }}></i>

                                            </div>

                                        </div>

                                        {
                                            editDep != null && editDep === index ? (<div className="editdep">
                                                <label htmlFor="">Name
                                                    <input type="text" onChange={(e) => handelDoctorChange(i, index, "name", e.target.value)} value={doc?.name} />
                                                </label>
                                                <label htmlFor="
                                                                                                                        ">Email
                                                    <input type="text" onChange={(e) => handelDoctorChange(i, index, "email", e.target.value)} value={doc?.email} />

                                                </label>
                                                <label htmlFor="">Contact

                                                    <input type="text" onChange={(e) => handelDoctorChange(i, index, "contact", e.target.value)} value={doc?.contact} />
                                                </label>

                                                <label htmlFor="">Experience

                                                    <input type="text" onChange={(e) => handelDoctorChange(i, index, "experience", e.target.value)} value={doc?.experience} />

                                                </label>

                                                <label htmlFor="">Qualification
                                                    <select
                                                        style={{
                                                            width: "100%",
                                                            padding: '8px',
                                                            borderRadius: '7px',
                                                            color: 'black',
                                                            fontsize: "12.5px",
                                                            border: "1px solid lightgray",
                                                        }}
                                                        value={doc?.qualification}
                                                        onChange={(e) => handelDoctorChange(editDep, i, "qualification", e.target.value)}
                                                    >
                                                        <option value="">Select_Degree</option>
                                                        <option value="Graduation">Graduation</option>
                                                        <option value="Post-Graduation">Post-Graduation</option>
                                                    </select>
                                                </label>


                                            </div>) : (<div className="editdepshow">
                                                <label htmlFor="">Name
                                                    <p>{doc?.name}</p>

                                                </label>
                                                <label htmlFor="
                                                                                                                        ">Email
                                                    <p>{doc?.email}</p>

                                                </label>
                                                <label htmlFor="">Contact

                                                    <p>{doc?.contact}</p>                                                                                    </label>

                                                <label htmlFor="">Experience

                                                    <p>{doc?.experience}</p>
                                                </label>

                                                <label htmlFor="">Qualification
                                                    <p>{doc?.qualification}</p>
                                                </label>


                                            </div>)
                                        }




                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
            )
        }

    </div >

}


