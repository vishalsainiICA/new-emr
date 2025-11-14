import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { commonApi } from "../auth";
import { CurrentStep, dummyDepartments, extractTextFromImage, indianStates, parseAadhaarText } from "./utility/CicularAvatar";


export default function RegisterPatient() {
    const totalSteps = 5;
    const navigate = useNavigate()
    const [selectedDep, setSelectedDep] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentStep, setCurrentStep] = useState(0); // start at step 1
    const [categoryName, setCategoryName] = useState(null)
    const [hospital, setHospital] = useState()
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [aadhaarFront, setAadhaarFront] = useState(null);
    const [aadhaarBack, setAadhaarBack] = useState(null);

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
            addharNo: "",
            addharDocuments: [],
        }
    );

    const handelChange = (key, value) => {
        setPatientData((prev) => {
            const updated = { ...prev, [key]: value }
            return updated
        })
    }
    useEffect(() => {
        const fetch = async () => {
            try {

                const res = await commonApi.fetchhospitalId("690eeab9521e26ba703e4962")

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

    // 🔹 Handle Front Upload
    const handleFrontUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAadhaarFront(file);

    };

    // 🔹 Handle Back Upload
    const handleBackUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAadhaarBack(file);
    };

    useEffect(() => {
        const processBothSides = async () => {
            if (!aadhaarFront || !aadhaarBack) return;
            toast.info("Extracting text from both Aadhaar images...");

            let combinedText = "";
            const frontText = await extractTextFromImage(aadhaarFront);
            const backText = await extractTextFromImage(aadhaarBack);

            combinedText = frontText + " " + backText;

            const parsed = parseAadhaarText(combinedText);
            console.log("Parsed Aadhaar Data:", parsed);

            setPatientData((prev) => ({
                ...prev,
                name: parsed.name || prev.name,
                DOB: parsed.DOB || prev.DOB,
                gender: parsed.gender || prev.gender,
                permanentAddress: parsed.address || prev.permanentAddress,
                addharDocuments: [aadhaarFront, aadhaarBack],
                addharNo: parsed.aadhaarNumber,
                city: parsed.city,
                state: parsed.state,
                pinCode: parsed.pinCode,
            }));

            toast.success("Aadhaar details extracted successfully ");
            setCurrentStep(currentStep + 1)
        };

        processBothSides();
     }, [aadhaarFront, aadhaarBack]);

    return <div className="patientRegister" style={{color:"black"}}>

        <div style={{

            maxHeight: '700px'

         }} >
            <div className="customCard" style={{
                display: 'flex',
                justifyContent: 'space-between',
                height: '70px',
                width: '100%'
            }}>
                <h3>Patient Registeration</h3>

                <CurrentStep currentStep={currentStep} totalSteps={totalSteps}></CurrentStep>
            </div>

            <div className="hospitalOnboard">

                {/* Step 1 — Basic Details */}
                {
                    currentStep == 0 && (
                        <div className="hostpitalmanagement-body">
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'

                                }}
                                className="customCard hover "

                            >
                                <img src="src/assets/download.png" alt="addhar" />
                                <div style={{
                                    marginTop: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '10px'

                                }}>
                                </div>
                                <p style={{
                                    display: 'flex',
                                    alignItems: 'start',
                                    alignContent: 'start',
                                    justifyContent: "start"
                                }}>
                                    Front Image *
                                </p>
                                <input
                                    onChange={handleFrontUpload}
                                    style={{
                                        border: '1px solid black'
                                    }}
                                    type="file"
                                    // value={patientData.name}
                                    // onChange={(e) => handelChange("name", e.target.value)}
                                    placeholder="Enter Full Name"
                                />


                                <p>
                                    Back Image *
                                </p>
                                <input
                                    onChange={handleBackUpload}
                                    style={{
                                        border: '1px solid black'
                                    }}
                                    type="file"
                                    // value={patientData.name}
                                    // onChange={(e) => handelChange("name", e.target.value)}
                                    placeholder="Enter Full Name"
                                />


                            </div>

                            <div
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="customCard hover "
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'

                                }}

                            >
                                <img src="src/assets/download.jpg" alt="**" />
                                <h3>Fill Manually</h3>

                            </div>

                        </div>
                    )
                }
                {currentStep === 1 && (
                    <div className="steps">
                        <h4>Patient Details</h4>

                        <div style={{ display: "flex", gap: "10px" }}>
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

                        <div style={{ display: "flex", gap: "10px" }}>
                            <label style={{ width: "100%" }}>
                                Gender *
                                <select
                                    value={patientData.gender}
                                    onChange={(e) => handelChange("gender", e.target.value)}
                                    style={{ padding: "7px", borderRadius: "7px", width: "100%" }}
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

                        <div style={{ display: "flex", gap: "10px" }}>
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

                        <div style={{ display: "flex", gap: "10px" }}>
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

                        <div style={{ display: "flex", gap: "10px" }}>
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

                        </div>



                        <div style={{ display: "flex", gap: "10px" }}>


                            <label style={{ width: "100%" }}>
                                State *
                                <select
                                    value={patientData.state}
                                    onChange={(e) => handelChange("gender", e.target.value)}
                                    style={{ padding: "7px", borderRadius: "7px", width: "100%" }}
                                >

                                    <option value="">Select State</option>
                                    {indianStates.map((s, i) => (
                                        <option key={i} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label style={{ width: "100%" }}>
                                Addhar No*
                                <input
                                    type="text"
                                    value={patientData.addharNo}
                                    onChange={(e) => handelChange("addharNo", e.target.value)}
                                    placeholder="Enter addharNo"
                                />
                            </label>

                        </div>


                        {patientData.addharDocuments.length != 2 && (

                            <div style={{ display: "flex", gap: "10px" }}>


                                <label style={{ width: "100%" }}>
                                    Front Addhar *
                                    <input
                                        type="file"

                                        onChange={(e) => setAadhaarFront(e.target.files[0])}
                                        placeholder="Enter addharNo"
                                    />
                                </label>


                                <label style={{ width: "100%" }}>
                                    Back Addhar *
                                    <input
                                        type="file"
                                        value={patientData.addharNo}
                                        onChange={(e) => handelChange("addharNo", e.target.value)}
                                        placeholder="Enter addharNo"
                                    />
                                </label>

                            </div>

                        )}



                        <label style={{ width: "100%" }}>
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
                        <h4>Attendee Details</h4>

                        <div style={{ display: "flex", gap: "10px" }}>
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

                        <label style={{ width: "100%" }}>
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
                        <h4>Select Department:</h4>

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
                                        <span className="card hover"
                                            key={i}
                                            onClick={() => setSelectedDep(item)}
                                            style={{
                                                backgroundColor: isSelected ? "rgb(245, 243, 243)" : "white",
                                                // backgroundColor: isSelected ? "lightgrey" : "white",
                                                margin: '10px',
                                                display: 'flex',
                                                padding: '7px',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '10px',
                                                transition: "1s ease",
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                width: '170px',
                                                height: '70px'
                                            }}
                                        >
                                            <img
                                                style={{ width: "50px", height: "50px" }}
                                                src={matchedDept?.image || ""}
                                                alt={item.departmentName}
                                            />
                                            <span style={{
                                                fontSize: '12px'
                                            }}>{item.departmentName}</span>
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
                                            fontFamily: 'sans-serif'

                                        }}>
                                            {i + 1}.
                                            <span style={{
                                                marginLeft: '10px',
                                                fontSize: '12px'

                                            }}>
                                                {doc?.name}
                                            </span>
                                        </span>
                                        {/* 
                                        <h5 style={{
                                            marginLeft: '12px'
                                        }}>Experience:{doc?.expierience || 5}</h4> */}
                                        <span style={{
                                            fontSize: '12px',
                                            display: 'flex'
                                        }}>Experience:<span style={{
                                            fontWeight: 'bold'
                                        }}>{doc?.experience}</span ></span>
                                    </div>
                                })
                            }

                        </div>



                    </div>
                )}

                {/* Step 4 — Review & Submit */}
                {currentStep === 4 && (
                    <div className="steps">
                        <h4>Upload Documents</h4>
                        <div style={{
                            padding: '20px',
                            display: "flex",

                            border: '1px solid lightgray',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            gap: '10px'
                        }}>

                            <div style={{
                                marginTop: '12px',

                            }}>
                                <input
                                    disabled={!categoryName}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        setUploadedDocuments((prev) => [
                                            ...prev,
                                            { category: categoryName, files },
                                        ]);

                                        setCategoryName("")
                                    }}

                                />
                                {!categoryName && (
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'red'
                                    }}>Pleae Select Cateogry First</p>
                                )}

                            </div>

                            <label style={{ width: "100%" }}>
                                Category *
                                <select
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    style={{ padding: "7px", borderRadius: "7px", width: "100%", marginBottom: '25px' }}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Blood test">Blood test related</option>
                                    <option value="Xray">Xray</option>
                                    <option value="MRI & CT Scan">MRI & CT Scan</option>
                                    <option value="Other">Other</option>
                                </select>
                            </label>


                        </div>
                        {uploadedDocuments.length > 0 && (
                            <div className="uploaded-docs">
                                <h4>Uploaded Documents:</h4>
                                <br />

                                {uploadedDocuments.map((obj, index) => (
                                    <div key={index}>
                                        <h5>{obj?.category}</h5>

                                        {obj?.files?.map((file, i) => (
                                            <p key={i}>✓ {file.name || file} (Processing)</p>
                                        ))}
                                    </div>
                                ))}

                            </div>
                        )}

                    </div>
                )}
                {currentStep === 5 && (
                    <div className="steps">
                        <h4>Review & Submit</h4>

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

            {currentStep != 0 && (<div style={{
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
                    {currentStep < 5 ? "Next" : "Register"}
                </button>


            </div>)}


        </div >

    </div >

}


