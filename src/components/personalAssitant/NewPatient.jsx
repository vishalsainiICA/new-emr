import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { commonApi, superAdminApi } from "../../auth";
import { FaArrowLeft } from "react-icons/fa";



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
    { image: new URL('../../assets/DepartmentsImages/cardiology.png', import.meta.url).href, name: "Cardiology" },
    { image: new URL('../../assets/DepartmentsImages/audiologist.png', import.meta.url).href, name: "ENT" },
    { image: new URL('../../assets/DepartmentsImages/medical.png', import.meta.url).href, name: "Radiology" },
    { image: new URL('../../assets/DepartmentsImages/arthritis.png', import.meta.url).href, name: "Orthopedics" },
    { image: new URL('../../assets/DepartmentsImages/pediatrics.png', import.meta.url).href, name: "Pediatrics" },
    { image: new URL('../../assets/DepartmentsImages/anesthesia.png', import.meta.url).href, name: "General Surgery" },
    { image: new URL('../../assets/DepartmentsImages/skin.png', import.meta.url).href, name: "Dermatology" },
    { image: new URL('../../assets/DepartmentsImages/neurology.png', import.meta.url).href, name: "Neurology" },
];


export default function NewPatient() {
    const totalSteps = 5;
    const navigate = useNavigate()
    const [selectedDep, setSelectedDep] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentStep, setCurrentStep] = useState(1); // start at step 1
    const [categoryName, setCategoryName] = useState(null)
    const [hospital, setHospital] = useState()
    const [addCustomDep, setCustomDepartment] = useState(null)
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [patientData, setPatientData] = useState(
        {
            name: '',
            age: null,
            gender: '',
            pinCode: '',
            phone: null,
            email: '',
            permanentAddress: '',
            currentAddress: '',
            whatsApp: null,
            DOB: '',
            city: '',
            state: '',
            nationality: '',
            patienCategory: null,
            attendeeName: '',
            attendeePhone: null,
            attendeeRelation: '',
            departmentId: '',
            doctorId: null,
            addharDocuments: [],
        }
    );
    const [doctorData, setDoctorData] = useState({
        doctorName: "",
        email: "",
        contact: "",
        experience: "",
        qualification: ""
    });

    const handelChange = (key, value) => {
        setPatientData((prev) => {
            const updated = { ...prev, [key]: value }
            return updated
        })
    }
    useEffect(() => {
        const fetch = async () => {
            try {

                const res = await commonApi.fetchhospitalId("6908988170e584cca0dad6d2")

                if (res.status == 200 || res.data.status === 200) {
                    setHospital(res?.data?.data)
                    return
                }
                else {
                    toast.error(res?.data?.message)
                }

            } catch (error) {
                console.log(error);
                // 
                // toast.error(error?.response?.data?.message || 'Internal Server Error')

            }

        }

        fetch()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const formdata = new FormData();
            // multiple documents
            uploadedDocuments.forEach((file) => {
                formdata.append("pastDocumnents", file);
            });

            // patient details append
            Object.keys(patientData).forEach((key) => {

                let value = patientData[key]

                if (typeof value === "object" && value !== null && !(value instanceof File)) {
                    value = JSON.stringify(value);
                }
                formdata.append(key, value ?? "");
            });

            // formdata.append("hospitalId", "6908988170e584cca0dad6d2")

            const res = await commonApi.registerPatient(formdata);
            toast.success(res?.data?.message || "Patient registered successfully");

            // reset
            setPatientData({
                name: '',
                age: null,
                gender: '',
                phone: null,
                email: '',
                permanentAddress: '',
                currentAddress: '',
                whatsApp: null,
                DOB: '',
                city: '',
                state: '',
                nationality: '',
                patienCategory: null,
                attendeeName: '',
                attendeePhone: null,
                attendeeRelation: '',
                departmentId: '',
                doctorId: null,
                addharDocuments: [],
                hospitalId: null,
                pastDocumnents: []
            });
            setUploadedDocuments([]);
            navigate(-1);
        } catch (err) {
            console.log(err);

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
            }><FaArrowLeft></FaArrowLeft> Back to Patient</span>

        <h2>New Patient</h2>
        <CurrentStep currentStep={currentStep} totalSteps={totalSteps}></CurrentStep>

        <div className="hospitalOnboard">

            {/* Step 1 — Basic Details */}
            {currentStep === 1 && (
                <div className="steps">
                    <h2>Patient Details</h2>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <label style={{ width: "100%" }}>
                            Name *
                            <input
                                type="text"
                                value={patientData.name}
                                onChange={(e) => handelChange("name", e.target.value)}
                                placeholder="Enter Full Name"
                            />

                        </label>

                        <label style={{ width: "100%" }}>
                            Age *
                            <input
                                type="number"
                                value={patientData.age}
                                onChange={(e) => handelChange("age", e.target.value)}
                                placeholder="Enter Age"
                            />
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <label style={{ width: "100%" }}>
                            Gender *
                            <select
                                value={patientData.gender}
                                onChange={(e) => handelChange("gender", e.target.value)}
                                style={{ padding: "10px", borderRadius: "7px", width: "100%" }}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>

                        <label style={{ width: "100%" }}>
                            Date of Birth
                            <input
                                type="date"
                                value={patientData.DOB}
                                onChange={(e) => handelChange("DOB", e.target.value)}
                            />
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <label style={{ width: "100%" }}>
                            Phone *
                            <input
                                type="text"
                                value={patientData.phone}
                                onChange={(e) => handelChange("phone", e.target.value)}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </label>

                        <label style={{ width: "100%" }}>
                            WhatsApp Number
                            <input
                                type="text"
                                value={patientData.whatsApp}
                                onChange={(e) => handelChange("whatsApp", e.target.value)}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <label style={{ width: "100%" }}>
                            Email
                            <input
                                type="email"
                                value={patientData.email}
                                onChange={(e) => handelChange("email", e.target.value)}
                                placeholder="email@example.com"
                            />
                        </label>
                        <label style={{ width: "100%" }}>
                            Nationality
                            <input
                                type="text"
                                value={patientData.nationality}
                                onChange={(e) => handelChange("nationality", e.target.value)}
                                placeholder="Indian"
                            />
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <label style={{ width: "100%" }}>
                            PinCode
                            <input
                                type="text"
                                value={patientData.pinCode}
                                onChange={(e) => handelChange("pinCode", e.target.value)}
                                placeholder="Enter PinCode"
                            />
                        </label>

                        <label style={{ width: "100%" }}>
                            City
                            <input
                                type="text"
                                value={patientData.city}
                                onChange={(e) => handelChange("city", e.target.value)}
                                placeholder="Enter City"
                            />
                        </label>

                        <label style={{ width: "100%" }}>
                            State
                            <select
                                value={patientData.state}
                                onChange={(e) => handelChange("state", e.target.value)}
                                style={{ padding: "10px", borderRadius: "7px" }}
                            >
                                <option value="">Select State</option>
                                {indianStates.map((s, i) => (
                                    <option key={i} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label style={{ width: "100%", marginTop: "10px" }}>
                        Address
                        <textarea
                            value={patientData.permanentAddress}
                            onChange={(e) => handelChange("permanentAddress", e.target.value)}
                            placeholder="Enter Address"
                            rows="3"
                            style={{ width: "100%", padding: "10px", borderRadius: "7px" }}
                        ></textarea>
                    </label>
                </div>
            )}

            {/* Step 2 — Attendee Details */}
            {currentStep === 2 && (
                <div className="steps">
                    <h2>Attendee Details</h2>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <label style={{ width: "100%" }}>
                            Name *
                            <input
                                type="text"
                                value={patientData.attendeeName}
                                onChange={(e) => handelChange("attendeeName", e.target.value)}
                                placeholder="Attendee Name"
                            />
                        </label>

                        <label style={{ width: "100%" }}>
                            Phone Number *
                            <input
                                type="text"
                                value={patientData.attendeePhone}
                                onChange={(e) => handelChange("attendeePhone", e.target.value)}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </label>
                    </div>

                    <label style={{ width: "100%", marginTop: "10px" }}>
                        Relation with Patient
                        <input
                            type="text"
                            value={patientData.attendeeRelation}
                            onChange={(e) => handelChange("attendeeRelation", e.target.value)}
                            placeholder="Father / Mother / Guardian / etc."
                        />
                    </label>
                </div>
            )}

            {/* Step 3 — Document Upload */}
            {currentStep === 3 && (
                <div className="steps">
                    <h3>Select Department:</h3>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}>

                        {
                            hospital?.supportedDepartments?.map((item, i) => {
                                const isSelected = selectedDep?.departmentName === item.departmentName;

                                //Find matching dummy department image
                                const matchedDept = dummyDepartments.find(
                                    (dep) => dep.name === item.departmentName
                                );

                                return (
                                    <span
                                        key={i}
                                        onClick={() => setSelectedDep(item)}
                                        style={{
                                            backgroundColor: isSelected ? "lightgrey" : "",
                                            margin: "10px",
                                            display: "flex",
                                            padding: "7px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "10px",
                                            border: "0.5px solid gray",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            width: "170px",
                                            height: "70px",
                                        }}
                                    >
                                        <img
                                            style={{ width: "50px", height: "50px" }}
                                            src={matchedDept?.image || ""}
                                            alt={item.departmentName}
                                        />
                                        <span>{item.departmentName}</span>
                                    </span>
                                );
                            })
                        }

                    </div>


                    <div style={{
                        marginTop: '10px',
                    }}>
                        <h4> Doctors: </h4>
                        {
                            selectedDep && selectedDep?.doctorIds?.map((doc, i) => {
                                const isSelected = patientData?.doctorId === doc?._id
                                return <div
                                    onClick={() => {
                                        setPatientData((prev) => {
                                            return { ...prev, doctorId: doc._id }
                                        })
                                    }}

                                    style={{
                                        border: '0.2px solid lightgrey',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        width: '300px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginTop: '10px',
                                        backgroundColor: isSelected ? 'rgb(247, 231, 231)' : ''

                                    }}>

                                    <span style={{
                                        fontSize: '25px',
                                        fontFamily: 'sans-serif'

                                    }}>
                                        {i + 1}.
                                        <span style={{
                                            marginLeft: '10px',

                                        }}>
                                            {doc?.name}
                                        </span>
                                    </span>

                                    <h4 style={{
                                        marginLeft: '12px'
                                    }}>Experience:{doc?.expierience || 5}</h4>
                                </div>
                            })
                        }

                    </div>



                </div>
            )}

            {/* Step 4 — Review & Submit */}
            {currentStep === 4 && (
                <div className="steps">
                    <h2>Upload Documents</h2>
                    <div style={{
                        padding: '20px',
                        display: "flex",
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '0.2px solid lightgray',
                        cursor: 'pointer',
                        borderRadius: '10px'
                    }}>
                        <input
                            style={{
                                cursor: 'pointer'
                            }}
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                                const files = Array.from(e.target.files)
                                return setUploadedDocuments((prev) => [...prev, ...files])
                            }}

                        />

                    </div>
                    {uploadedDocuments.length > 0 && (
                        <div className="uploaded-docs">
                            <h4>Uploaded Documents:</h4>

                            {uploadedDocuments.map((doc, index) => {
                                // console.log("doc", doc)

                                return <p key={index}>✓ {doc.name} (Processing )</p>
                            })}
                        </div>
                    )}

                </div>
            )}
            {currentStep === 5 && (
                <div className="steps">
                    <h2>Review & Submit</h2>

                    <div
                        style={{
                            backgroundColor: "white",
                            border: "1px solid lightgray",
                            padding: "15px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>Patient Information</h3>
                        <p><b>Name:</b> {patientData.name}</p>
                        <p><b>Age:</b> {patientData.age}</p>
                        <p><b>Gender:</b> {patientData.gender}</p>
                        <p><b>Phone:</b> {patientData.phone}</p>
                        <p><b>Email:</b> {patientData.email}</p>
                        <p><b>Address:</b> {patientData.permanentAddress}</p>
                    </div>

                    <div
                        style={{
                            backgroundColor: "white",
                            border: "1px solid lightgray",
                            padding: "15px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            marginTop: "10px",
                        }}
                    >
                        <h3>Attendee Information</h3>
                        <p><b>Name:</b> {patientData.attendeeName}</p>
                        <p><b>Phone:</b> {patientData.attendeePhone}</p>
                        <p><b>Relation:</b> {patientData.attendeeRelation}</p>
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

    </div >

}


