import { useState, useEffect } from "react";
import "./Patientregistration.css"
import adharimg from "../../../assets/download.png"
import manulimg from "../../../assets/download.jpg"
import { PiTrademarkRegisteredThin } from "react-icons/pi";
import { CurrentStep, dummyDepartments, extractTextFromImage, parseAadhaarText } from "../../utility/CicularAvatar";
import { commonApi } from "../../../auth";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Patientregisteration = () => {
  const totalSteps = 5;
  const [selectedDep, setSelectedDep] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
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

  const location  = useLocation()
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
                    <label htmlFor="">Name *</label>
                    <input type="text" />
                  </div>
                  <div >
                    <label htmlFor="">Age *</label>
                    <input type="number" />
                  </div>
                </div>
                <div className="distance">
                  <div >
                    <label htmlFor="">Gender *</label>
                    <input type="text" />
                  </div>
                  <div >
                    <label htmlFor="">Date of Birth</label>
                    <input type="text" />
                  </div>
                </div>
                <div className="distance">
                  <div >
                    <label htmlFor="">Phone *</label>
                    <input type="number" />
                  </div>
                  <div >
                    <label htmlFor="">WhatsApp Number</label>
                    <input type="number" />
                  </div>
                </div>
                <div className="distance">
                  <div >
                    <label htmlFor="">Email</label>
                    <input type="email" />
                  </div>
                  <div >
                    <label htmlFor="">Nationality</label>
                    <input type="text" />
                  </div>
                </div>
                <div className="distance">
                  <div >
                    <label htmlFor="">PinCode</label>
                    <input type="number" />
                  </div>
                  <div >
                    <label htmlFor="">City</label>
                    <input type="text" />
                  </div>
                </div>
                <div className="distance">
                  <div >
                    <label htmlFor="">State *</label>
                    <input type="text" />
                  </div>
                  <div >
                    <label htmlFor="">Addhar No*</label>
                    <input type="number" />
                  </div>
                </div>
                <div className="distance">
                  <div >
                    <label htmlFor="">Front Addhar *</label>
                    <input type="file" />
                  </div>
                  <div >
                    <label htmlFor="">Back Addhar *</label>
                    <input type="file" />
                  </div>
                </div>
               <div className="distance">
                <div >
                  <label htmlFor="">Address</label>
                  {/* <input type="text" name="" id="" /> */}
                  <textarea style={{ width: "100%", padding: "10px", borderRadius: "7px" }} name="" id=""></textarea>
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
                  <input type="text" placeholder="Attendee Name" />
                </div>
                <div >
                  <label htmlFor="">Phone Number *</label>
                  <input type="number" placeholder="+91 XXXX XXXX XX" />
                </div>
              </div>
              <div >
                <label htmlFor="">Relation with Patient</label>
                <input type="text" placeholder="Father/Mother/Gurdian/etc." />
              </div>
              </form>
            </div>
          )}

          {/* Step 3 — Basic Details */}
          {currentStep === 3 && (
            <div className="patient-step-3">
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

          {/* Step 4 — Basic Details */}
          {currentStep == 4 && (
            <div className="patient-step-4">
              <h4>Upload Documents</h4>
              <div className="upload-file">
                <div>
                  <form action="">
                    <input type="file" />
                  </form>
                </div>
                <div>
                  <form action="" style={{ marginBottom: "20px", display: "grid" }}>
                    <label htmlFor="">Category *</label>
                    <select style={{ width: "150px", height: "30px", color: "black", borderRadius: "10px", padding: "5px", border: "0.3px solid lightgray", }} name="" id="category">
                      <option value="">Select Category</option>
                      <option value="">Blood Test realeted</option>
                      <option value="">Xray</option>
                      <option value="">MRI CT scan</option>
                      <option value="">other</option>
                    </select>
                  </form>
                </div>
              </div>
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
                  <span>Name:</span>
                  <span>Age:</span>
                  <span>Gender:</span>
                  <span>Phone:</span>
                  <span>Email:</span>
                  <span>Address:</span>
                </div>
              </div>
              <div style={{
                width: "100%",
                borderRadius: "20px",
                border: "0.3px solid lightgray",
              }}>
                <p>Attendee Information</p>
                <div>
                  <span>Name:</span>
                  <span>Phone:</span>
                  <span>Relation:</span>
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
                // disabled={isProcessing}
                onClick={(e) => {
                  e.preventDefault();

                  if (currentStep < 5) {
                    setCurrentStep(currentStep + 1);
                  } else {

                    // handleSubmit(e);
                  }
                }}
              >
                {currentStep < 5 ? "Next →" : <><PiTrademarkRegisteredThin />Register</>}
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