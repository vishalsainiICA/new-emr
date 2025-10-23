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

export const NewHospital = () => {
    const navigate = useNavigate(-1)
    const totalSteps = 5;
    const [currentStep, setCurrentStep] = useState(1); // start at step 1
    const [tabopen, setTabOpen] = useState(null)
    const [editDepartment, setEditDepartmentData] = useState(null)
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

        <div >
            {/* step1 */}
            {currentStep == 1 && (
                <div className="hospitalOnboard">
                    <h2>Hospital Details</h2>
                    <div>
                        <input type="text" placeholder="Hospital Name" />

                        <input type="text" placeholder="PinCode" />
                    </div>
                    <div>
                        <input type="text" placeholder="Enter" />
                        <select
                            id="state"
                        // value={hosptialData.state}
                        // onChange={(e) => setHospitalData({ ...hosptialData, state: e.target.value })}
                        >
                            <option value="">-Select State -</option>
                            {indianStates.map((state) => {
                                return <option value={state}>{state}</option>
                            })}

                        </select>
                    </div>
                    <textarea rows={2} name="" id="" placeholder="Address"></textarea>
                    <div>
                        <input type="text" placeholder="category name" />

                        <select
                            className="w-[30%]" style={{
                                width: '30%',
                            }}>
                            <option value="0">Goverment</option>
                            <option value="1">Non-Goverment</option>
                        </select>
                        <button>+Add</button>
                    </div>

                </div>
            )}
            {currentStep == 2 && (
                <div className="">
                    <h2>Medical Director </h2>
                    <div>
                        <label style={{
                            display: 'flex'
                        }} htmlFor="">Name
                            <input type="text" placeholder="Hospital Name" />
                        </label>

                        <input type="text" placeholder="PinCode" />
                    </div>
                    <div>
                        <input type="text" placeholder="Enter" />
                        <select
                            id="state"
                        // value={hosptialData.state}
                        // onChange={(e) => setHospitalData({ ...hosptialData, state: e.target.value })}
                        >
                            <option value="">-Select State -</option>
                            {indianStates.map((state) => {
                                return <option value={state}>{state}</option>
                            })}

                        </select>
                    </div>
                    <textarea rows={2} name="" id="" placeholder="Address"></textarea>
                    <div>
                        <input type="text" placeholder="category name" />

                        <select
                            className="w-[30%]" style={{
                                width: '30%',
                            }}>
                            <option value="0">Goverment</option>
                            <option value="1">Non-Goverment</option>
                        </select>
                        <button>+Add</button>
                    </div>

                </div>
            )}
            {currentStep == 3 && (
                <div className="">
                    <h3>Department Setup</h3>

                    <div style={{
                        cursor: 'pointer',
                        display: "flex",
                        width: '120px',
                        height: '40px',
                        justifyContent: 'center',
                        padding: '10px',
                        gap: '10px',
                        backgroundColor: 'lightgray',
                        border: "0.1px solid black"
                    }}>
                        <input type="checkbox" />
                        <p>Cardiology</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <h4> Selected Department</h4>
                        <button>+ Add Custom</button>
                    </div>

                </div>
            )}

            {currentStep == 4 && (
                <div className="">
                    <h2>Medical Director </h2>
                    <div>
                        <label style={{
                            display: 'flex'
                        }} htmlFor="">Name
                            <input type="text" placeholder="Hospital Name" />
                        </label>

                        <input type="text" placeholder="PinCode" />
                    </div>
                    <div>
                        <input type="text" placeholder="Enter" />
                        <select
                            id="state"
                        // value={hosptialData.state}
                        // onChange={(e) => setHospitalData({ ...hosptialData, state: e.target.value })}
                        >
                            <option value="">-Select State -</option>
                            {indianStates.map((state) => {
                                return <option value={state}>{state}</option>
                            })}

                        </select>
                    </div>
                    <textarea rows={2} name="" id="" placeholder="Address"></textarea>
                    <div>
                        <input type="text" placeholder="category name" />

                        <select
                            className="w-[30%]" style={{
                                width: '30%',
                            }}>
                            <option value="0">Goverment</option>
                            <option value="1">Non-Goverment</option>
                        </select>
                        <button>+Add</button>
                    </div>

                </div>
            )}

        </div>

        <div>
            <button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep == 1}> previous</button>
            <button onClick={() => setCurrentStep(currentStep + 1)}>Next</button>

        </div>


    </div >

}


