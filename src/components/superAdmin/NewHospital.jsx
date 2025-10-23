import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


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
    const navigate = useNavigate(-1)
    const totalSteps = 5;
    const [currentStep, setCurrentStep] = useState(1); // start at step 1
    const [categoryName, setCategoryName] = useState(null)
    const [hosptialData, setHospitalData] = useState({
        name: '',
        state: null,
        pinCode: '',
        city: '',
        permanentAddress: '',
        patientCategories: [],
        medicalDirector: {
            name: '',
            email: '',
            contact: '',
            licenseNo: '',
            signatureImage: '',
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

    // const handelChange = (key, value)


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
                            <input type="text" placeholder="Hospital Name" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">PinCode
                            <input type="text" placeholder="PinCode" />
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
                        }} htmlFor="">Hospital Name
                            <input type="text" placeholder="Hospital Name" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">PinCode
                            <input type="text" placeholder="PinCode" />
                        </label>
                    </div>

                    <label style={{
                        width: '100%'
                    }} htmlFor="">Address
                        <br />
                        <textarea
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
                            }} placeholder="PinCode" />
                        </label>
                        <button
                            onClick={() => setHospitalData({ ...hosptialData, patientCategories: [...hosptialData.patientCategories, categoryName] })}
                            style={{
                                padding: '7px',
                                width: '170px',
                                height: '40px',
                                borderRadius: '7px',
                                marginTop: '19px'
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
                            <input type="text" placeholder="Enter Full Name" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Experience
                            <input type="number" placeholder="Ex.2" />
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
                            <input type="text" placeholder="email@example.com" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Contact Number *
                            <input type="text" placeholder="+91 7340479570" />
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
                                                item.name
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
                                                    <h4 style={{ margin: 0 }}>{dep || "Unnamed Hospital"}</h4>
                                                    <p style={{ margin: 0 }}>{dep || "Unknown location"}</p>
                                                </div>

                                            </div>
                                            <div>
                                                <i class="ri-close-large-line"></i>
                                            </div>


                                        </div>
                                        <button style={{
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
                            <input type="text" placeholder="Hospital Name" />
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
                            <input type="text" placeholder="Hospital Name" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Tagline 2
                            <input type="text" placeholder="PinCode" />
                        </label>
                    </div>

                    <label style={{
                        width: '100%'
                    }} htmlFor="">Disclaimer
                        <br />
                        <textarea
                            placeholder="address"
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
                            <input type="text" placeholder="Hospital Name" />
                        </label>
                        <label style={{
                            width: '100%'
                        }} htmlFor="">Header Phone *
                            <input type="text" placeholder="PinCode" />
                        </label>
                    </div>

                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",

                            padding: '10px',

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



        </div>

        <div style={{
            marginTop: '10px',
            width: " 60vw",
            minWidth: '400px',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> previous</button>
            <button onClick={() => setCurrentStep(currentStep + 1)}>Next</button>

        </div>

    </div >

}


