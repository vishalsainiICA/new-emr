import { useState, useEffect } from "react";
import "./Patientregistration.css"
import adharimg from "../../../assets/download.png"
import manulimg from "../../../assets/download.jpg"
import { PiTrademarkRegisteredThin } from "react-icons/pi";
import { commonApi } from "../../../auth";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrentStep, dummyDepartments, extractTextFromImage, parseAadhaarText } from "../../Utility/CicularAvatar";
import { IndianStates } from "../../Utility/PatientHistory__Labtest";
const calculateAge = (dob) => {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

const Patientregisteration = () => {
  const totalSteps = 4;
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
      departmentId: '',
      doctorId: null,
      addharNo: '',
      addharDocuments: [],
    }
  );

  const [errors, setErrors] = useState({

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
    departmentId: '',
    doctorId: null,
    addharNo: '',
  });

  // ============== COMMON REGEX (Global Use) =================
   const NAME_REGEX = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
   const NUMBER_REGEX = /^[0-9]+$/;
   const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
   const pinCodeRegex = /^[1-9][0-9]{5}$/;
   const addressRegex = /^[A-Za-z0-9\s,./#-]+$/;


  function cheakfield() {

    const errors = {};

    // Step 1
    if (currentStep == 1) {
      if (!patientData.name) errors.name = "Patient Name is Required"
      if (patientData.name && !NAME_REGEX.test(patientData.name.trim())) {errors.name = "Only alphabets";}
      if (!patientData.DOB) errors.DOB = "Patient DOB is Required"
      if (!patientData.age) errors.age = "Patient age is Required"
      if (patientData.age && !NUMBER_REGEX.test(patientData.age)) {errors.age = "Only numbers allowed";}
      if (patientData.age < 0 || patientData.age > 120) {errors.age = "Enter valid age";}
      if (!patientData.city) errors.city = "Patien.city is Required"
      if (patientData.city && !NAME_REGEX.test(patientData.city.trim())) {errors.city = "Invalid city name";}
      if (!patientData.gender) errors.gender = "Patient gender is Required"
      if (!patientData.phone) errors.phone = "Patient phone is Required"
      if (patientData.phone && patientData.phone.length !== 10) errors.phone = "contact   Number must be 10 digit "
      if (patientData.whatsApp && patientData.whatsApp.length !==10) errors.whatsApp ="Whatapp Number Must be 10 digits"
      if(patientData.email  &&!gmailRegex.test(patientData.email)) { errors.email = "Invalid Gmail Address"; }
      if (!patientData.pinCode) errors.pinCode = "pincode is required"
      if (patientData.pinCode && !pinCodeRegex.test(patientData.pinCode)) {errors.pinCode = "Invalid Pincode (6 digits)";}
     
      if (!patientData.permanentAddress) errors.permanentAddress = "Patient Address is Required"
      
      if (!patientData.nationality) errors.nationality = "Patient Nationality is Required"
      if (!patientData.state) errors.state = "Patient Name is Required"
      if (!patientData.addharNo) errors.addharNo = "Patient Aadhar Number is required"
      if (patientData.addharNo && patientData.addharNo.length !== 12) errors.addharNo = "Patient Aadhar Number must be 12 digit"
      if (!aadhaarFront) errors.aadhaarFront = "Patient Aadhar Front Image is required"
      if (!aadhaarBack) errors.aadhaarBack = "Patient Aadhar Back Image is required"
    }

    if (currentStep == 2) {
      if (!patientData.attendeeName) errors.attendeeName = "Aattendee Name is required "
      if (patientData.attendeeName && !NAME_REGEX.test(patientData.attendeeName.trim())) {errors.attendeeName = "Only alphabets";}
      if (!patientData.attendeePhone) errors.attendeePhone = "Aattendee Contact Number  is required "
      if (patientData.attendeePhone && patientData.attendeePhone.length !== 10) errors.attendeePhone = "Aattendee Contact Number must be 10 digit "
      if (!patientData.attendeeRelation) errors.attendeeRelation = "Aattendee Relation is required "
      if (patientData.attendeeRelation && !NAME_REGEX.test(patientData.attendeeRelation.trim())) {errors.attendeeRelation = "Only alphabets";}
    }

    if (currentStep == 3) {
      if (!selectedDep) errors.selectedDep = "Select Department first"
      if (!patientData.doctorId) errors.doctorId = "Select Doctor first"
    }

    setErrors(errors)

    return Object.keys(errors).length === 0;

  }



  const navigate = useNavigate()


  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const hospitalId = query.get("id");

  console.log("Hospital ID:", hospitalId)
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
    console.log("call");

    e.preventDefault();
    setIsProcessing(true);

    try {
      const formdata = new FormData();
      // multiple d

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

      formdata.append("hospitalId", hospitalId)

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
      navigate("/super-admin/dashboard");
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
          <h3>Patient Registeration</h3>
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
                    {errors.name && <label style={{ color: "red", marginTop: "5px" }}>{errors.name}</label>}
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
                    {errors.DOB && <label style={{ color: "red", marginTop: "5px" }}>{errors.DOB}</label>}

                  </div>
                </div>

                <div className="distance">
                  <div>
                    <label>Gender *</label>
                    <select value={patientData.gender}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        gender: e.target.value
                      })} >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="other">other</option>
                    </select>
                    {errors.gender && <label style={{ color: "red", marginTop: "5px" }}>{errors.gender}</label>}

                  </div>

                  <div>
                    <label>Age *</label>
                    <input
                      type="number"
                      value={patientData.age}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        age: e.target.value
                      })}

                    />
                    {errors.age && <label style={{ color: "red", marginTop: "5px" }}>{errors.age}</label>}

                  </div>
                </div>

                <div className="distance">
                  <div>
                    <label>Phone *</label>
                    <input
                      type="number"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        phone: e.target.value
                      })}
                    />
                    {errors.phone && <label style={{ color: "red", marginTop: "5px" }}>{errors.phone}</label>}
                  </div>

                  <div>
                    <label>WhatsApp Number</label>
                    <input
                      type="number"
                      value={patientData.whatsApp}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        whatsApp: e.target.value
                      })}
                    />
                    {errors.whatsApp && <label style={{ color: "red", marginTop: "5px" }}>{errors.whatsApp}</label>}

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
                    {errors.email && <label style={{ color: "red", marginTop: "5px" }}>{errors.email}</label>}

                  </div>

                  <div>
                    <label>Nationality</label>
                    <select value={patientData.nationality} onChange={(e) => setPatientData({
                      ...patientData,
                      nationality: e.target.value
                    })}>
                      <option value="">Select_Nationality</option>
                      <option value="Indian">Indian</option>
                      <option value="NRI">NRI (Non-Resident Indian)</option>
                      <option value="Foreign National">Foreign National</option>
                      <option value="OCI">OCI (Overseas Citizen of India)</option>
                      <option value="PIO">PIO (Person of Indian Origin)</option>
                    </select>
                    {errors.nationality && <label style={{ color: "red", marginTop: "5px" }}>{errors.nationality}</label>}

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
                    {errors.pinCode && <label style={{ color: "red", marginTop: "5px" }}>{errors.pinCode}</label>}

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
                    {errors.city && <label style={{ color: "red", marginTop: "5px" }}>{errors.city}</label>}

                  </div>
                </div>


                <div className="distance">
                  <div>
                    <label>State *</label>

                    <select
                      type="text"
                      value={patientData.state}
                      onChange={(e) => setPatientData({
                        ...patientData,
                        state: e.target.value
                      })}
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
                    {errors.state && <label style={{ color: "red", marginTop: "5px" }}>{errors.state}</label>}

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
                    {errors.addharNo && <label style={{ color: "red", marginTop: "5px" }}>{errors.addharNo}</label>}

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
                      {errors.aadhaarFront && <label style={{ color: "red", marginTop: "5px" }}>{errors.aadhaarFront}</label>}

                    </div>

                    <div>
                      <label>Back Aadhaar *</label>
                      <input
                        type="file"
                        onChange={(e) => setAadhaarBack(e.target.files[0])}
                      />
                      {errors.aadhaarBack && <label style={{ color: "red", marginTop: "5px" }}>{errors.aadhaarBack}</label>}

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
                    {errors.permanentAddress && <label style={{ color: "red", marginTop: "5px" }}>{errors.permanentAddress}</label>}

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
                    <input type="text"
                      value={patientData?.attendeeName} placeholder="Attendee Name"
                      onChange={(e) => setPatientData({
                        ...patientData,
                        attendeeName: e.target.value
                      })} />
                    {errors.attendeeName && <label style={{ color: "red", marginTop: "5px" }}>{errors.attendeeName}</label>}

                  </div>
                  <div >
                    <label htmlFor="">Phone Number *</label>
                    <input onChange={(e) => setPatientData({
                      ...patientData,
                      attendeePhone: e.target.value
                    })} type="number" value={patientData?.attendeePhone} placeholder="+91 XXXX XXXX XX" />
                    {errors.attendeePhone && <label style={{ color: "red", marginTop: "5px" }}>{errors.attendeePhone}</label>}

                  </div>
                </div>
                <div >
                  <label htmlFor="">Relation with Patient</label>
                  <select style={{

                    width: "100%",
                    padding: '7px',
                    borderRadius: '7px',
                    color: 'black',
                    fontsize: "12.5px",
                    border: "1px solid lightgray",
                  }} value={patientData?.attendeeRelation} name="relationWithPatient" onChange={(e) => setPatientData({
                    ...patientData,
                    attendeeRelation: e.target.value
                  })}>
                    <option value="">Select Relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Husband">Husband</option>
                    <option value="Wife">Wife</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.attendeeRelation && <label style={{ color: "red", marginTop: "5px" }}>{errors.attendeeRelation}</label>}

                </div>
              </form>
            </div>
          )}

          {/* Step 3 — Basic Details */}
          {currentStep === 3 && (
            <div className="patient-step-3">
              <div>
                <h4>Select Department:</h4>
                {errors.selectedDep && <label style={{ color: "red", marginTop: "5px" }}>{errors.selectedDep}</label>}

              </div>

              <div className="main-select-content">

                {
                  hospital?.supportedDepartments?.map((item, i) => {
                    const isSelected = selectedDep?.departmentName === item.departmentName;

                    //Find matching dummy department image
                    const matchedDept = dummyDepartments.find(
                      (dep) => dep.name === item.departmentName
                    );

                    return (
                      <span className="card-hover"
                        key={i}
                        onClick={() => setSelectedDep(item)}
                        style={{
                          backgroundColor: isSelected ? "rgb(245, 243, 243)" : "white"
                        }}>
                        <div>
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={matchedDept?.image || ""}

                          />
                          <span style={{
                            fontSize: '12px'
                          }}>{item.departmentName}</span>
                        </div>
                      </span>
                    );
                  })
                }

              </div>


              <div style={{
                marginTop: '10px',
              }}>
                <h4> Doctors: </h4>
                {errors.doctorId && <label style={{ color: "red", marginTop: "5px" }}>{errors.doctorId}</label>}
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

          {/* Step 4 — Basic Details */}
          {currentStep == 4 && (
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
                    {!categoryName && (
                      <p style={{
                        fontSize: '12px',
                        color: 'orange',
                        boxShadow:"1px"
                        
                      }}>Pleae Select Cateogry First</p>
                    )}
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
          {currentStep == 5 && (
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
                  const val = cheakfield()
                  if (currentStep < 4 && val) {
                    setCurrentStep(currentStep + 1);
                  } else if (currentStep === 4) {

                    handleSubmit(e);
                  }
                }}
              >
                {currentStep < 4
                  ? "Next →"
                  : `${isProcessing ? "saving....." : "Register Patient"}`
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