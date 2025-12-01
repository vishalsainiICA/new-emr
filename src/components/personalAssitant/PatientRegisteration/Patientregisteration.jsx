import { useState, useEffect } from "react";
import "./Patientregistration.css"
import adharimg from "../../../assets/download.png"
import manulimg from "../../../assets/download.jpg"
import { PiTrademarkRegisteredThin } from "react-icons/pi";

import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrentStep, dummyDepartments, extractTextFromImage, parseAadhaarText } from "../../Utility/CicularAvatar";
import { commonApi, perosnalAssistantAPI } from "../../../auth";
import { BsArrowLeft } from "react-icons/bs";
const calculateAge = (dob) => {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Agar birthday abhi nahi aaya iss saal
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};


const Patientregisteration = () => {
  const totalSteps = 3;
  const [selectedDep, setSelectedDep] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false)
  const [categoryName, setCategoryName] = useState(null)
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [hospital, setHospital] = useState()
  const [patientData, setPatientData] = useState(
    {
      name: '',
      age: null,
      gender: '',
      pinCode: '',
      phone: null,
      email: '',
      permanentAddress: '',
      whatsApp: null,
      DOB: '',
      city: '',
      state: '',
      nationality: '',
      patienCategory: null,
      attendeeName: '',
      attendeePhone: null,
      attendeeRelation: '',
      addharNo: '',
      addharDocuments: [],
    }
  );

  const [errors, setErrors] = useState({});


  const location = useLocation()
  const navigate = useNavigate()
  const pa = location.state?.pa
  const hospitalId = pa?.hospitalId;
  console.log("pa", pa);


  useEffect(() => {
    const fetch = async () => {
      try {

        const res = await commonApi.fetchhospitalId(hospitalId)

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
      if (!aadhaarFront || !aadhaarBack || currentStep == 1) return;
      toast.info("Extracting text from both Aadhaar images...");

      let combinedText = "";
      const frontText = await extractTextFromImage(aadhaarFront);
      const backText = await extractTextFromImage(aadhaarBack);

      combinedText = frontText + " " + backText;

      const parsed = parseAadhaarText(combinedText);
      console.log("Parsed Aadhaar Data:", parsed);
      console.log("Parsed Aadhaar Data:", parsed?.aadhaarNumber);


      setPatientData((prev) => ({
        ...prev,
        name: parsed.name,
        DOB: parsed.DOB || prev.DOB,
        age: parsed.DOB ? calculateAge(parsed.DOB) : prev.age,
        gender: parsed.gender || prev.gender,
        permanentAddress: parsed.address || prev.permanentAddress,
        addharDocuments: [aadhaarFront, aadhaarBack],
        addharNo: parsed.aadhaarNumber ? parsed.aadhaarNumber.trim() : prev.addharNo,
        city: parsed.city,
        state: parsed.state,
        pinCode: parsed.pinCode,
      }));

      setPatientData((prev) => ({
        ...prev,
        addharNo: parsed.aadhaarNumber ? parsed.aadhaarNumber.trim() : prev.addharNo

      }))

      toast.success("Aadhaar details extracted successfully ");
      console.log(patientData);

      setCurrentStep(currentStep + 1)
    };

    processBothSides();
  }, [aadhaarFront, aadhaarBack]);

  const validationRules = {
    name: "Name is required",
    age: "Age is required",
    phone: "Phone is required",
    email: "Email is required",
    city: "City required",
    state: "State required",
    attendeeName: "Attendee required",
  };
  const validateForm = () => {
    let errors = {};

    Object.keys(validationRules).forEach((key) => {
      if (!patientData[key] || patientData[key] === "") {
        errors[key] = validationRules[key];
      }
    });

    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const formdata = new FormData();
      // multiple d

      formdata.append("hospitalId", hospitalId)
      formdata.append("doctorId", pa?.doctorId?._id)
      formdata.append("registerarId", pa?._id)
      uploadedDocuments.forEach((doc, index) => {
        formdata.append(`categories[${index}]`, doc.category);
        formdata.append(`fileCount[${index}]`, doc.files.length);
        doc.files.forEach((file) => {
          formdata.append("documents", file);
        });
      });

      formdata.append("addharfront", aadhaarFront)
      formdata.append("addharback", aadhaarBack)
      // patient details append
      Object.keys(patientData).forEach((key) => {

        let value = patientData[key]

        if (typeof value === "object" && value !== null && !(value instanceof File)) {
          value = JSON.stringify(value);
        }
        formdata.append(key, value ?? "");
      });

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
        addharDocuments: [],
        hospitalId: null,
        pastDocumnents: []
      });
      setUploadedDocuments([]);
      navigate("/pa");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };



  const handleValidation = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!patientData.name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);

  }

  return (
    <div className="Patientregiteration-main">

      <div className="patient-view-form">

        <div className="patientregisteration-header">
          <h3><button className="common-btn" onClick={() => navigate(-1)}> ← Back</button> Patient Registeration</h3>
          <CurrentStep currentStep={currentStep} totalSteps={totalSteps}></CurrentStep>
        </div>
        <hr />
        <hr />


        <div className=" patient-steps">


          {/* Step 0 — Basic Details */}
          {currentStep == 0 && (
            <div className="patient-step-0">

              <div className="img-1">
                <img src={adharimg} alt="adhar img" />
                <form action="">
                  <label htmlFor="">Front Image*</label>

                  <input
                    onChange={handleFrontUpload}
                    type="file" />

                  <label htmlFor="">Back Image*</label>
                  <input
                    onChange={handleBackUpload}
                    type="file" />
                </form>
              </div>
              <div className="img-2" onClick={() => setCurrentStep(currentStep + 1)}>
                <img src={manulimg} alt="manual img" width="225px" height="225px" />
                <h4>Fill Manually</h4>
              </div>
            </div>
          )}
          {/* <hr /> */}

          {/* Step 1 — Basic Details */}
          {currentStep == 1 && (

            <div className="patient-step-1">
              <h4>Patient Detail</h4>
              <form className="All-detail" action="">

                <div className="distance">
                  <div>
                    <label>Name *</label>
                    <input
                      type="text"
                      value={patientData.name}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        name: e.target.value
                      })}
                    />
                    {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

                  </div>

                  <div>
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      value={patientData.DOB}
                      onChange={(e) => {
                        const dob = e.target.value;
                        const age = calculateAge(dob);

                        setPatientData({
                          ...patientData,
                          DOB: dob,
                          age: age
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="distance">
                  <div className="">
                    <label>Gender *</label>
                    <select
                      name="gender"
                      value={patientData.gender}
                      onChange={(e) =>
                        setPatientData({ ...patientData, gender: e.target.value })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>

                  </div>

                  <div>
                    <label>Age *</label>
                    <input
                      type="text"
                      value={patientData.age}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        age: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="distance">
                  <div>
                    <label>Phone *</label>
                    <input
                      type="number"
                      maxLength={10}
                      value={patientData.phone}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        phone: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <label>WhatsApp Number</label>
                    <input
                      type="number"
                      maxLength={10}
                      value={patientData.whatsApp}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        whatsApp: e.target.value
                      })}
                    />
                  </div>
                </div>


                <div className="distance">
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      value={patientData.email}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        email: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <label>Nationality</label>
                    <input
                      type="text"
                      value={patientData.nationality}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        nationality: e.target.value
                      })}
                    />
                  </div>
                </div>


                <div className="distance">
                  <div>
                    <label>PinCode</label>
                    <input
                      type="number"
                      value={patientData.pinCode}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        pinCode: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <label>City</label>
                    <input
                      type="text"
                      value={patientData.city}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        city: e.target.value
                      })}
                    />
                  </div>
                </div>


                <div className="distance">
                  <div>
                    <label>State *</label>
                    <input
                      type="text"
                      value={patientData.state}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        state: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <label>Aadhaar No *</label>
                    <input
                      type="number"
                      value={patientData.addharNo}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        addharNo: e.target.value
                      })}
                    />
                  </div>
                </div>
                {(!aadhaarFront || !aadhaarBack) && (
                  <div className="distance">
                    <div>
                      <label>Front Aadhaar *</label>
                      <input
                        type="file"
                        onChange={(e) => setAadhaarFront(e.target.files[0])}
                      />
                    </div>

                    <div>
                      <label>Back Aadhaar *</label>
                      <input
                        type="file"
                        onChange={(e) => setAadhaarBack(e.target.files[0])}
                      />
                    </div>
                  </div>
                )}



                <div className="distance">
                  <div>
                    <label>Address</label>
                    <textarea
                      style={{ width: "100%", padding: "10px", borderRadius: "7px" }}
                      value={patientData.permanentAddress}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        permanentAddress: e.target.value
                      })}
                    />
                  </div>
                </div>

              </form>

            </div>
          )}


          {/* Step 2 — Basic Details */}
          {currentStep == 2 && (
            <div className="patient-step-2">
              <h4>Attendee Details</h4>
              <form>
                <div className="hold-data-div">
                  <div >
                    <label htmlFor="">Name *</label>
                    <input type="text" onChange={(e) => setPatientData({
                      ...patientData,
                      attendeeName: e.target.value
                    })} value={patientData?.attendeeName} placeholder="Attendee Name" />
                  </div>
                  <div >
                    <label htmlFor="">Phone Number *</label>
                    <input onChange={(e) => setPatientData({
                      ...patientData,
                      attendeePhone: e.target.value
                    })} type="number" value={patientData?.attendeePhone} placeholder="+91 XXXX XXXX XX" />
                  </div>
                </div>
                <div >
                  <label htmlFor="">Relation with Patient</label>
                  <input onChange={(e) => setPatientData({
                    ...patientData,
                    attendeeRelation: e.target.value
                  })} type="text" value={patientData?.attendeeRelation} placeholder="Father/Mother/Gurdian/etc." />
                </div>
              </form>
            </div>
          )}

          {/* Step 3 — Basic Details */}

          {currentStep == 3 && (
            <div className="patient-step-4">
              <h4>Upload Documents</h4>
              <div className="upload-file">
                <div>
                  <form action="">
                    <input
                      multiple
                      disabled={!categoryName}
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setUploadedDocuments((prev) => [
                          ...prev,
                          { category: categoryName, files },
                        ]);

                        setCategoryName("")
                      }} type="file" />
                    {!categoryName && (
                      <p style={{
                        fontSize: '12px',
                        color: 'red'
                      }}>Pleae Select Cateogry First</p>
                    )}
                  </form>
                </div>
                <div>
                  <form action="" style={{ marginBottom: "20px", display: "grid" }}>
                    <label htmlFor="">Category *</label>
                    <select
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      style={{ width: "150px", height: "30px", color: "black", borderRadius: "10px", padding: "5px", border: "0.3px solid lightgray", }} name="" id="category">

                      <option value="">Select Category</option>
                      <option value="Prescription">Prescription</option>
                      <option value="Blood test">Blood test related</option>
                      <option value="Xray">Xray</option>
                      <option value="MRI & CT Scan">MRI & CT Scan</option>
                      <option value="Other">Other</option>
                    </select>
                  </form>
                </div>
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

          {/* Step 5 — Basic Details */}
          {currentStep == 4 && (
            <div className="patient-step-5">
              <h4>Reviwe & Submit</h4>
              <div style={{
                width: "100%",
                borderRadius: "20px",
                border: "0.3px solid lightgray",
              }}>
                <p>Patient Information</p>
                <div>
                  <span>Name:{patientData.name}</span>
                  <span>Age:{patientData.age}</span>
                  <span>Gender:{patientData.gender}</span>
                  <span>Phone:{patientData.phone}</span>
                  <span>Email:{patientData.email}</span>
                  <span>Address: {patientData.permanentAddress}</span>
                </div>
              </div>
              <div style={{
                width: "100%",
                borderRadius: "20px",
                border: "0.3px solid lightgray",
              }}>
                <p>Attendee Information</p>
                <div>
                  <span>Name:{patientData.attendeeName}</span>
                  <span>Phone:{patientData.attendeePhone}</span>
                  <span>Relation:{patientData.attendeeRelation}</span>
                </div>
              </div>
            </div>
          )}

        </div>


        {currentStep != 0 && (
          <div className="page-handler">
            <div>
              <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> ← Back</button>
              <button

                disabled={isProcessing}
                onClick={(e) => {
                  if (currentStep < 3) {
                    setCurrentStep(currentStep + 1);
                  } else {

                    handleSubmit(e);
                  }
                }}
              >
                {
                  currentStep < 3
                    ? "Next →"
                    : isProcessing
                      ? "Saving..."
                      : "Register"
                }
              </button>
            </div>

          </div>)}

        <div className="other-detail">

        </div>

      </div>

    </div>
  );
}

export default Patientregisteration