import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { adminApi, commonApi, superAdminApi } from "../../../auth";
import { Circles } from "react-loader-spinner";
import moment from "moment";
import './ViewHospital.css'
import { toast } from "react-toastify";
import { Patient_Hisotry } from "../../Utility/PatientHistory__Labtest";
import userDefaultImage from "../../../assets/defualtUserImage.jpg"
import { BiEdit } from "react-icons/bi";

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




const ViewHospital = () => {
    const [data, setData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [open, setClose] = useState(null)
    const [editMDdata, setEditMDdata] = useState(null)
    const [error, setError] = useState(null);
    const [filterPatient, setFilterPatient] = useState([]);
    const [assinDoctor, setAssignDoctor] = useState(null)
    const [hospital, sethospital] = useState(null)
    const [temphospital, setemphospital] = useState(null)
    const location = useLocation()
    const [addCustomDep, setCustomDepartment] = useState(null)
    const [categoryName, setCategoryName] = useState("")
    const [edit, setEdit] = useState(null)
    const [editTemp, setEditTemp] = useState(null);
    const [departments, setDepartments] = useState([])
    const [addDoc, setAddDoc] = useState(null);
    const [editDoc, setEditDoc] = useState(null)
    const [editDep, seteditDep] = useState(null)
    const [doctorData, setDoctorData] = useState({
        name: "",
        email: "",
        contact: "",
        experience: "",
        qualification: "",
        docId: null,
        hosId: null
    });
    const [editPaDetail, seteditPaDetail] = useState(false);
    const [showPaDetail, setshowPaDetail] = useState(true);

    const [showMD, setshowMD] = useState(true);
    const [editMD, setEditMD] = useState(false);

    function changeMD_data() {
        setEditMD(!editMD);
        setshowMD(!showMD);
    }

    const resetDocForm = () => {
        setDoctorData({
            name: "",
            email: "",
            contact: "",
            experience: "",
            qualification: "",
            appointmentFees: null
        });
    }

    const editPA = () => {
        seteditPaDetail(!editPaDetail);
        setshowPaDetail(!showPaDetail);
    }
    const hos = location.state?.hospital || undefined

    const handleAddDoctor = (index) => {

        // Required field check
        if (
            !doctorData.name ||
            !doctorData.email ||
            !doctorData.contact ||
            !doctorData.experience ||
            !doctorData.qualification ||
            !doctorData.appointmentFees
        ) {
            toast.error("Please fill all required fields!");
            return;
        }

        // Regex patterns
        const nameRegex = /^[A-Za-z ]+$/;
        const contactRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Name validation
        if (!nameRegex.test(doctorData.name)) {
            toast.error("Name must contain only alphabets!");
            return;
        }

        // Contact number validation
        if (!contactRegex.test(doctorData.contact)) {
            toast.error("Contact must be a valid 10-digit number!");
            return;
        }

        // Experience validation
        if (Number(doctorData.experience) > 100) {
            toast.error("Experience must be less than 100 years!");
            return;
        }

        // Email validation
        if (!emailRegex.test(doctorData.email)) {
            toast.error("Invalid email!");
            return;
        }

        // Add doctor to selected department
        const updatedDepartments = [...departments];
        const selectedDept = updatedDepartments[index];

        selectedDept.doctors = [...(selectedDept.doctors || []), doctorData];
        updatedDepartments[index] = selectedDept;

        setDepartments(updatedDepartments);

        toast.success("Doctor added successfully!");

        setAddDoc(null);

        // Reset form
        resetDocForm()

    };

    const handleChange = (key, value) => {
        setemphospital((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    const filter = (value) => {
        if (value.trim() === "") {
            setFilterPatient(data)
        }
        const filter = data.filter((hos) => {
            return hos.name.toLowerCase().startsWith(value.toLowerCase())
        })

        setFilterPatient(filter)

    }

    useEffect(() => {
        const fetchHospital = async () => {
            setIsProcessing(true);
            try {
                const res = await superAdminApi.getHospitalById(hos?._id);
                if (res.status === 200) {
                    sethospital(res.data?.data)
                    // initialize filter
                } else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                setError({ error: err.response?.data?.message || "Internal Server Error" });
            } finally {
                setIsProcessing(false);
            }
        };

        fetchHospital();
    }, [refresh]);


    useEffect(() => {
        if (edit === "hospitalEdit" && hospital) {
            setemphospital(JSON.parse(JSON.stringify(hospital)));
            // deep copy to avoid reference mutation
        }
    }, [edit, hospital]);


    useEffect(() => {
        const fetchPatient = async () => {
            setIsProcessing(true);
            try {

                const res = await superAdminApi.hospitalAllPaitent(hos?._id);
                if (res.status === 200) {
                    setData(res.data.data || []);
                    setFilterPatient(res.data.data || []); // initialize filter
                } else {
                    setError({ error: res.data?.message || "Something went wrong" });
                }
            } catch (err) {
                console.log(err);

                setError({ error: err.response?.data?.message || "Internal Server Error" });
            } finally {
                setIsProcessing(false);
            }
        };
        fetchPatient();
    }, []);
    const handleRemovePa = async (id) => {
        try {

            const isConfirm = confirm(`Are You Sure You Want To Delete Pa !`)
            if (!isConfirm) return
            setIsProcessing(true);
            const res = await superAdminApi.removePa(id);
            if (res.status === 200 || (await res).data.status === 200) {
                toast.success("pa remove successfully");
                setRefresh(prev => !prev);
            } else {
                toast.error("Failed to register hospital")
            }
        } catch (err) {
            console.error("Error while adding hospital:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
            setEdit(null)
        }

    }
    const handleAddPa = async (finalData) => {
        try {
            setIsProcessing(true);
            const res = await superAdminApi.addPa(finalData);

            if (res.status === 200) {
                toast.success(`PA Added for ${assinDoctor?.name}`);
                setAssignDoctor(null);
                resetDocForm()
                setRefresh(prev => !prev);

            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Internal Server Error");
        } finally {
            setIsProcessing(false);
        }
    };
    const handleEditDoc = async () => {
        try {
            setIsProcessing(true);
            const docId = editDoc?._id
            const res = await commonApi.updateProfile(editDoc);
            if (res.status === 200) {
                toast.success(`Profile Updated ${editDoc?.name}`);
                setEditDoc(null)
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Internal Server Error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleeditProfile = async () => {
        setIsProcessing(true);

        try {
            const formdata = new FormData();
            formdata.append("hospitalId", temphospital?._id);
            formdata.append("name", temphospital?.name);
            formdata.append("state", temphospital?.state);
            formdata.append("city", temphospital?.city);
            formdata.append("pinCode", temphospital?.pinCode);
            formdata.append("address", temphospital?.address);
            formdata.append("patientCategories", temphospital?.patientCategories);
            const res = await commonApi.editHospital(formdata);
            if (res.status === 200) {
                toast.success("Hospital Updated Successfully")
                setEdit(null);
            } else {
                setError({ profile: res.data?.message || "Something went wrong" });
            }

        } catch (err) {
            console.log(err);
            setError({ profile: err.response?.data?.message || "Internal Server Error" });
        } finally {
            setRefresh((prev) => !prev)
            setIsProcessing(false);
        }
    };

    const handledeletedoc = async (doc) => {
        try {
            const isConfirm = confirm(`Are You Sure You Want To Delete Dr.${doc?.name}`)

            if (!isConfirm) return

            setIsProcessing(true);
            const res = await commonApi.removeDoc(doc?._id);
            if ((await res).status === 200 || (await res).data.status === 200) {
                toast.success("Doctor remove successfully");
                setRefresh(prev => !prev);
            } else {
                toast.error("Failed to remove Doctor")
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    }

    const handelDoctorChange = (depIndex, docIndex, field, value) => {
        const updated = [...departments]
        updated[depIndex].doctors[docIndex][field] = value
        setDepartments(updated)

    }
    const handleAddDepartments = async () => {
        try {

            if (departments?.length <= 0) {
                toast.error("Please Insert At Least One Department")
                return
            }
            setIsProcessing(true);
            const data = {
                hospitalId: hospital?._id,
                departments: departments
            }
            const res = await commonApi.newDepartment(data);

            if (res.status === 200) {
                toast.success(`Departments Added Successfully`);

                setRefresh(prev => !prev);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Internal Server Error");
        } finally {
            setCustomDepartment(null);
            setDepartments([])
            resetDocForm()
            setIsProcessing(false);
        }
    };
    return <div className="viewhospital">

        <div className="cardList">
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Total Patient</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>🏥</p>
                </div>
                <h2>{hospital?.totalPatient || "0"}</h2>
                {/* <p style={{
                    color: 'rgba(125, 200, 176)',
                    fontWeight: "bold"
                }}>08%</p> */}
            </div>
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Total Prescribtion</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>🛏️</p>
                </div>
                <h2>{hospital?.totalPrescribtion || "0"}</h2>
                {/* <p style={{
                    color: 'rgba(125, 200, 176)',
                    fontWeight: "bold"
                }}>08%</p> */}
            </div>
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Total Department</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>👥</p>
                </div>
                <h2>{hospital?.supportedDepartments?.length || "N/A"}</h2>
                {/* <p style={{
                    color: 'rgba(125, 200, 176)',
                    fontWeight: "bold"
                }}>08%</p> */}
            </div>
            <div className="customCard hover" style={{

            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <h4>Total Revenue</h4>
                    <p style={{
                        fontSize: '12px'
                    }}>💰</p>
                </div>
                <h2>₹ {hospital?.totalRevenue || "0"}</h2>

            </div>

        </div>

        <div
            className="customCard"
            style={{
                marginTop: '10px'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: "space-between"
            }}>
                <h4>{"Hospital Information"}</h4>

                <div style={{
                    display: 'flex',
                    gap: '10px'
                }}>

                    <button
                        className="regular-btn"
                        onClick={() =>
                            window.open(
                                `${import.meta.env.VITE_FRONTEND_URL}/register-patient?id=${hospital?._id}`,
                                "_blank"
                            )
                        }
                    >
                        Registration Link
                    </button>

                    <button className="regular-btn" onClick={() => setEdit("hospitalEdit")}> Edit Hospital </button>
                </div>


            </div>
            <div style={{
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: "repeat(2,1fr)"
            }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Hosptial Name: <span style={{
                    fontWeight: 'normal'
                }}>{hospital?.name}</span></span>
                <span style={{

                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Location: <span style={{
                    fontWeight: 'normal'
                }}>{hospital?.city},{hospital?.state}</span></span>
            </div>
            <div style={{
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: "repeat(2,1fr)"
            }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Type:<span style={{
                    fontWeight: 'normal'
                }}> General</span></span>
                <span style={{

                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Pincode:<span style={{
                    fontWeight: 'normal'
                }}></span>{hospital?.pinCode}</span>
            </div>
            <div style={{
                marginTop: '10px',
                display: 'grid',
                gridTemplateColumns: "repeat(2,1fr)"
            }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Status: <span style={{
                    fontWeight: 'normal',
                    padding: '1px 7px 1px 7px',
                    color: 'green',
                    backgroundColor: 'lightgreen',
                    borderRadius: '10px'
                }}>Active</span></span>
                <span style={{

                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>Medical Director: <span
                    onClick={() => {
                        setClose({ type: 'md', md: hospital?.medicalDirector });
                        setEditMDdata(hospital?.medicalDirector)
                    }}
                    style={{
                        fontWeight: 'normal',
                        color: 'blue',
                        cursor: 'pointer'
                    }}>Dr.{hospital?.medicalDirector?.name}</span></span>
            </div>

            {hospital?.patientCategories?.length > 0 && (
                <div style={{
                    marginTop: '10px',
                }}>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}>Schemes:
                        <span
                            onClick={() => setEdit("hospitalEdit")}
                            style={{
                                fontWeight: 'normal',
                                color: 'blue',
                                cursor: 'pointer'

                            }}>  {hospital?.patientCategories.join(",")}</span></span>

                </div>
            )}






        </div>
        <div className="hostpitalmanagement-body">
            <div
                className="customCard"
                style={{
                    marginTop: '10px',
                    height: '350px',
                    overflowY: "scroll"
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: "space-between"
                }}>
                    <h4>{"Department Overview"}</h4>
                    <button className="common-btn" onClick={() => setCustomDepartment("new Dep")}>+ New Dep</button>
                </div>

                <div style={{
                    marginTop: '10px'
                }}>

                    {hospital?.supportedDepartments && hospital?.supportedDepartments?.map((dep, i) => {
                        return <div key={i} style={{
                            borderBottom: '0.5px solid lightgrey',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '7px'
                        }}>
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 'bold'
                            }}>{dep?.departmentName}</span>
                            <p style={{
                                fontSize: '12px',
                                color: 'blue'
                            }} href="">patient:{i + 1}</p>
                        </div>

                    })}

                </div>
            </div>
            <div
                className="customCard"
                style={{
                    marginTop: '10px',
                    height: '350px',
                    overflowY: "scroll"
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: "space-between"
                }}>
                    <h4>{"Doctor Overview"}</h4>
                </div>

                <div style={{
                    marginTop: '10px'
                }}>

                    {hospital?.supportedDepartments && hospital?.supportedDepartments?.map((dep, i) => {
                        return dep?.doctorIds?.map((doc, i) => {
                            return <div

                                key={i} className="patient-card"
                            >
                                <div

                                    style={{
                                        width: '100%',
                                        padding: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "20px" // space between items
                                    }}
                                >
                                    <span className="logo">{doc?.name.slice(0, 1).toUpperCase()}</span>
                                    <div onClick={() => { setEdit(doc); setEditTemp(doc?.personalAssitantId) }}>
                                        <p style={{ margin: 0, fontSize: '14px' }}>Dr. {doc?.name}</p>
                                        <h5 style={{ color: 'blue', fontSize: '12px' }}>{`${doc.email || "N/A"}`}</h5>
                                    </div>

                                </div>

                                <div style={{
                                    display: "flex",
                                    gap: '10px',
                                    marginRight: '10px'
                                }}>
                                    <i class="ri-edit-box-line" onClick={() => setEditDoc(doc)}></i>
                                    <i class="ri-delete-bin-7-line" onClick={() => handledeletedoc(doc)} ></i>
                                </div>
                            </div>



                        })

                    })}




                </div>
            </div>
        </div>

        <div
            className="customCard"
            style={{
                marginTop: '10px'
            }}

        >

            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <h4>{"Patient Overview"}</h4>
                <div
                    style={{
                        display: 'flex',         // add this
                        gap: '10px'      // vertically bottom         // height dena zaroori hai
                    }}
                >
                    <input
                        onChange={(e) => filter(e.target.value)}
                        style={{
                            width: '170px',
                        }}
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div>



            <div>
                <div style={{ marginTop: '10px' }}>
                    <div className="hosptialHeading">
                        <p style={{
                            fontSize: '12px'
                        }}>Patient ID</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Name</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Age</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Hospital</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Doctor</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Status</p>
                        <p style={{
                            fontSize: '12px'
                        }}>Date</p>
                    </div>

                    {isProcessing && (
                        <span style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: '50px 0'
                        }}>
                            <Circles height="40" width="40" color="#4f46e5" ariaLabel="loading" />
                            <br />Loading...
                        </span>
                    )}

                    {error?.error && (
                        <h4 style={{
                            color: 'red',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '50px 0'
                        }}>{error?.error}</h4>
                    )}

                    {!isProcessing && !error?.error && Array.isArray(filterPatient) && filterPatient.length > 0 && (
                        <>
                            {filterPatient.map((patient, i) => (
                                <div onClick={() => setClose({ type: "patient", patient: patient })} key={i} className="hosptialBody" >
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient.uid}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient.name}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient.age}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient?.hospitalId?.name || "N/A"}</p>
                                    <p style={{
                                        fontSize: '12px'
                                    }}>{patient?.doctorId?.name || "N/A"}</p>
                                    <p
                                        style={{
                                            width: '70px',
                                            fontSize: "12px",
                                            color:
                                                patient?.status === "Cancel"
                                                    ? "red"
                                                    : patient?.status === "Postponed"
                                                        ? "#b8860b"          // dark yellow
                                                        : "green",

                                            backgroundColor:
                                                patient?.status === "Cancel"
                                                    ? "#ffb3b3"          // light red
                                                    : patient?.status === "Postponed"
                                                        ? "#fff2a8"          // light yellow
                                                        : "lightgreen",

                                            padding: "5px",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        {patient?.status}
                                    </p>

                                    <p style={{
                                        fontSize: '12px'
                                    }}>{moment(patient?.createdAt).format("DD/MM/YYYY, hh:mm A") || "N/A"}</p>
                                </div>
                            ))}
                        </>
                    )}

                    {!isProcessing && !error?.error && Array.isArray(filterPatient) && filterPatient.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '50px 0' }}>
                            No Patient found
                        </p>
                    )}
                </div>
            </div>

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
                                {`P.A for ${assinDoctor.name}`}
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
                                    value={doctorData.name}
                                    onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
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
                            <button className="regular-btn" onClick={() => setAssignDoctor(null)}>Cancel</button>
                            <button
                                className="common-btn"
                                disabled={isProcessing}
                                onClick={() => handleAddPa({
                                    ...doctorData,
                                    docId: assinDoctor._id,
                                    hosId: assinDoctor?.hospitalId
                                })}
                            >
                                {isProcessing ? "saving..." : "Assign Pa"}
                            </button>

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
                        minHeight: '500px',
                        width: '800px',
                        padding: '20px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>

                        <div style={{

                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
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
                                    onClick={() => { setCustomDepartment(null); setDepartments([]); setAddDoc(null) }}
                                    className="ri-close-large-line"
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                ></i>
                            </div>
                            <div className="select_department">
                                <select
                                    onChange={(e) => {
                                        const selected = e.target.value;

                                        if (!selected) return;

                                        const dep = dummyDepartments.find((d) => d.name === selected);
                                        if (!dep) return;

                                        const isSelected = departments?.some(
                                            (d) => d.departmentName === dep.name
                                        );

                                        if (isSelected) return;

                                        setDepartments((prev) => {
                                            const updated = [
                                                ...prev,
                                                {
                                                    departmentName: dep.name,
                                                    image: dep.image,
                                                    doctors: []
                                                }
                                            ];
                                            console.log("dep updated:", updated);
                                            return updated;
                                        });



                                    }}
                                >
                                    <option value="">__Select__Department</option>

                                    {dummyDepartments.map((item, index) => (
                                        <option key={index} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>


                            </div>

                            {
                                departments?.length > 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            marginTop: "10px",
                                            height: "100%",
                                            overflowY: "scroll",
                                        }}
                                    >
                                        {departments.map((dep, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    style={{
                                                        width: "100%",
                                                        backgroundColor: "white",
                                                        border: "1px solid lightgray",
                                                        padding: "15px 15px 15px 30px",
                                                        borderRadius: "10px",
                                                        margin: "0 0 10px 10px",
                                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                                        cursor: "pointer",
                                                        position: "relative",
                                                    }}
                                                >
                                                    {/* HEADER */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                padding: "10px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "20px",
                                                            }}
                                                        >
                                                            <span style={{ fontSize: "15px", fontFamily: "cursive" }}>
                                                                {i + 1}.
                                                            </span>
                                                            <div>
                                                                <h4 style={{ fontSize: "12px" }}>
                                                                    {dep.departmentName || "Unnamed"}
                                                                </h4>
                                                                <p style={{ fontSize: "10px" }} className="reviewtag">
                                                                    {dep.doctors?.length || "0"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: "flex", gap: "10px" }}>

                                                            {
                                                                addDoc && addDoc.depIndex === i && addDoc.type === "new" ? (
                                                                    // When a modal is open for this department
                                                                    <>
                                                                        <button className="common-btn" onClick={() => handleAddDoctor(i)}>Save</button>
                                                                        <i
                                                                            className="ri-close-large-line"
                                                                            onClick={() => {

                                                                                setAddDoc(null)
                                                                                resetDocForm()
                                                                            }}
                                                                        ></i> </>
                                                                ) : 
                                                                (addDoc && addDoc.depIndex === i && addDoc.type === "edit" ? (

                                                                    <button className="common-btn" onClick={() => setAddDoc(null)}>Close</button>

                                                                ) : ((
                                                                    // Normal controls when no modal is open
                                                                    <>
                                                                        <i
                                                                            className="ri-add-large-line"
                                                                            onClick={() => setAddDoc({ type: "new", depIndex: i })}
                                                                        ></i>

                                                                        {dep.doctors?.length > 0 && (
                                                                            <i
                                                                                className="ri-edit-box-line"
                                                                                onClick={() => setAddDoc({ type: "edit", depIndex: i })}
                                                                            ></i>
                                                                        )}

                                                                        <i
                                                                            className="ri-close-large-line"
                                                                            onClick={() => {
                                                                                const updated = departments.filter((_, index) => index !== i);
                                                                                setDepartments(updated);
                                                                            }}
                                                                        ></i>
                                                                    </>
                                                                ))
                                                                )


                                                            }



                                                        </div>
                                                    </div>


                                                    {
                                                        addDoc &&

                                                        addDoc.type === "new" &&
                                                        addDoc.depIndex === i && (

                                                            <div>
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
                                                                            value={doctorData.name}
                                                                            onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                                                                        />
                                                                        {/* {errors.name && <label style={{color:"red"}}>{errors.name}</label>} */}
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
                                                                            type="Number"
                                                                            style={{ cursor: "text" }}
                                                                            placeholder="Contact Number"
                                                                            value={doctorData.contact}
                                                                            onChange={(e) => setDoctorData({ ...doctorData, contact: e.target.value })}
                                                                        />
                                                                        {/* {errors.doctorContact && <label style={{color:"red"}}>{errors.doctorContact}</label>} */}

                                                                    </label>

                                                                    <label style={{ width: '100%' }}>
                                                                        Experience (years) *
                                                                        <input
                                                                            style={{ cursor: "text" }}
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
                                                                    columnGap: '80px',
                                                                    display: "flex",
                                                                    justifyContent: "center"
                                                                }}>
                                                                    <label style={{
                                                                        width: '100%',
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        // marginTop: '10px'
                                                                    }}>
                                                                        Gender
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
                                                                        Appointment Fees *
                                                                        <input
                                                                            style={{ cursor: "text" }}
                                                                            type="number"
                                                                            placeholder="ex.500"
                                                                            value={doctorData?.appointmentFees}
                                                                            onChange={(e) => setDoctorData({ ...doctorData, appointmentFees: e.target.value })}
                                                                        />
                                                                        {/* {errors.doctorAppointmentFees && <label style={{color:"red"}}>{errors.doctorAppointmentFees}</label>} */}

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
                                                                        // marginTop: '10px'
                                                                    }}>
                                                                        Qualification *
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
                                                                        {/* {errors.doctorQualification && <label style={{color:"red"}}>{errors.doctorQualification}</label>} */}

                                                                    </label>
                                                                </div>

                                                            </div>

                                                        )

                                                    }


                                                    {
                                                        addDoc &&
                                                        addDoc.type === "edit" &&
                                                        addDoc.depIndex === i && (

                                                            <div className="editcard">
                                                                {
                                                                    departments[i]?.doctors?.map((doc, index) => {
                                                                        return (
                                                                            <div key={index} className="editdepCard">
                                                                                <div style={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'space-between'
                                                                                }}>
                                                                                    <h5>doctor:{index + 1}</h5>
                                                                                    <div style={{
                                                                                        display: 'flex',
                                                                                        justifyContent: 'center',
                                                                                        gap: '10px'
                                                                                    }}>
                                                                                        {



                                                                                            editDep !== null && editDep === index ? (<span onClick={() => {




                                                                                                seteditDep(null)
                                                                                            }}>✓</span>) : (<BiEdit onClick={() => {
                                                                                                console.log("index", index)
                                                                                                console.log("editdep", editDep)
                                                                                                seteditDep(index)
                                                                                            }}></BiEdit>)
                                                                                        }


                                                                                        <i class="ri-delete-bin-7-line" onClick={() => {
                                                                                            // const updatedDoctors = hospitalData.supportedDepartments[edit]?.doctors?.filter((_, idx) => idx !== i)
                                                                                            // const updatedDepartments = [...hospitalData.supportedDepartments]
                                                                                            // updatedDepartments[edit].doctors = updatedDoctors

                                                                                            // setHospitalData((prev) => ({
                                                                                            //     ...prev,
                                                                                            //     supportedDepartments: updatedDepartments
                                                                                            // }))

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




                                                                            </div>)
                                                                    })
                                                                }
                                                            </div>

                                                        )

                                                    }



                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            }

                        </div>


                        {/*Action Buttons */}
                        <div className="actionbtn">
                            <button disabled={isProcessing} className="regular-btn" onClick={() => {
                                setCustomDepartment(null);
                                setDepartments([])
                                setAddDoc(null)
                                resetDocForm()
                            }}
                            >Cancel</button>
                            <button className="regular-btn" disabled={isProcessing} onClick={() => {
                                console.log("subbmit", departments)
                                handleAddDepartments()
                            }}>{`${isProcessing ? "saving...." : "Add Department"}`}</button>
                        </div>
                    </div>
                </div >
            )
        }
        {
            open !== null && open.type === "patient" && (
                <div className="patientHistory">
                    <Patient_Hisotry patient={open.patient} onclose={() => setClose(null)} ></Patient_Hisotry>
                    {/* <LabTest selectedLabTest={selectedLabTest} setselectedLabTest={setselectedLabTest} labTest={labtestResult} labTestError={labTestError} labTestloading={labTestloading} onclose={() => setClose(false)} ></LabTest> */}
                </div>
            )
        }

        {
            edit === "hospitalEdit" && (
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

                    <div className="editcards">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            borderRadius: '7px'
                        }}>
                            <h4>Edit Hospital</h4>
                            <i class="ri-close-large-line" style={{
                                cursor: "pointer"
                            }} onClick={() => {
                                setEdit(null)
                            }}></i>
                        </div>

                        <div className="edit-scroll">
                            <div className="edit-detail">
                                <label htmlFor="">Hospital Name
                                    <input value={temphospital?.name} type="text" onChange={(e) => handleChange("name", e.target.value)} />
                                </label>
                                <label htmlFor="">State
                                    <input value={temphospital?.state} type="text" onChange={(e) => handleChange("state", e.target.value)} />
                                </label>
                            </div>

                            <div className="edit-detail">
                                <label htmlFor="">City
                                    <input value={temphospital?.city} type="text" onChange={(e) => handleChange("city", e.target.value)} />
                                </label>
                                <label htmlFor="">PinCode
                                    <input value={temphospital?.pinCode} type="text" onChange={(e) => handleChange("pinCode", e.target.value)} />
                                </label>
                            </div>


                            <div className="edit-detail-address">
                                <div>
                                    <label style={{
                                        width: '100%',
                                        marginTop: '10px',
                                        marginBottom: '10px'
                                    }} htmlFor="">Address
                                        <br />
                                        <textarea
                                            type="text"
                                            value={temphospital?.address}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                            placeholder="address"
                                            style={{
                                                width: '100%',
                                                borderRadius: '7px',
                                                padding: '8px',
                                                color: 'black',
                                                fontsize: "12.5px",
                                                border: "1px solid lightgray",
                                            }} name="" id="" rows="3"></textarea>
                                    </label>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    gap: '120px',

                                }}>

                                    <label style={{
                                        width: '42%'
                                    }} htmlFor="">Patient Category
                                        <input value={categoryName} type="text" onChange={(e) => {
                                            return setCategoryName(e.target.value)
                                        }} placeholder="patientCategory" />
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

                                            sethospital({ ...hospital, patientCategories: [...hospital.patientCategories, categoryName] })
                                            setCategoryName("")
                                            return
                                        }
                                        }

                                    >+ Add</button>

                                </div>

                            </div>

                            {hospital?.patientCategories?.length > 0 && (
                                <div style={{
                                    width: '100%',
                                    marginTop: '10px',
                                    display: 'flex',
                                    gap: '10px'
                                }}>
                                    {hospital.patientCategories.map((item, index) => {

                                        return <span key={index} style={{
                                            padding: '10px 17px 10px 17px',
                                            backgroundColor: 'lightgray',
                                            borderRadius: '7px',
                                            fontSize: '12px'

                                        }}>{item}  <i
                                            onClick={() => {
                                                sethospital(prev => ({
                                                    ...prev,
                                                    patientCategories: prev.patientCategories.filter((_, idx) => idx !== index)
                                                }));
                                            }}

                                            className="ri-close-large-line"
                                            style={{ cursor: 'pointer', fontSize: '12px' }}
                                        ></i></span>

                                    })}
                                </div>
                            )}


                            {error?.profile && (<p style={{ color: 'red', marginTop: '10px' }}>Error :{error?.profile}</p>)}
                        </div>
                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'end',
                            gap: '10px'
                        }}>
                            <button className="regular-btn" disabled={isProcessing} onClick={() => setEdit(null)}>Cancel</button>
                            <button className="common-btn" disabled={isProcessing} onClick={handleeditProfile}>{`${isProcessing ? "Saving....." : "Save Details"}`} </button>
                        </div>

                    </div>

                </div>
            )
        }

        {
            edit !== null && edit !== "hospitalEdit" && (
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
                    <div className="editcards">

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            borderRadius: '50%',
                            // backgroundColor:'red',
                            padding: "10px",
                        }}>
                            <h4>Dr. {edit?.name} Profile</h4>
                            <i class="ri-close-large-line" style={{
                                cursor: "pointer"
                            }} onClick={() => {
                                setEdit(null)

                            }}></i>
                        </div>
                        <div className="docProfile">
                            <div className="docWithImage">
                                <div className="docImage">
                                    <img src={userDefaultImage} alt="" />
                                </div>
                                <div className="docbasicdetails">
                                    <label htmlFor="">Name <p>Dr. {edit?.name}</p></label>
                                    <label htmlFor="">Gender <p>{edit?.gender || "Male"}</p></label>
                                    <label htmlFor="">Email <p>{edit?.email}</p></label>
                                    <label htmlFor="">Experience <p>{edit?.experience || "Fresher"}</p></label>
                                    <label htmlFor="">Qualification <p>{edit?.qualification}</p></label>
                                    <label htmlFor="">Appointment Fees <p>₹ {edit?.appointmentFees}</p></label>
                                </div>
                            </div>
                            {edit?.personalAssitantId ? (
                                <div className="paProfile">
                                    <div style={{
                                        marginTop: '7px',
                                        marginBottom: '7px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <h5>Personal Assitant Detials</h5>

                                        <div style={{
                                            display: 'flex',
                                            gap: '10px'
                                        }}>

                                            {showPaDetail &&
                                                <>
                                                    <button className="regular-btn" onClick={editPA} disabled={isProcessing}> <i class="ri-edit-box-line" ></i>Edit</button>
                                                    <button onClick={() => handleRemovePa(edit?.personalAssitantId?._id)} className="regular-btn" disabled={isProcessing}><i class="ri-delete-bin-7-line"  ></i>{`${isProcessing ? "removing..." : "Remove"}`} </button>
                                                </>
                                            }
                                            {editPaDetail &&
                                                <>
                                                    <button className="regular-btn" onClick={() => { editPA(); setEditTemp(edit?.personalAssitantId) }} >Cancel</button>
                                                    {/* <button  className="regular-btn" onClick={()=>{editPA();setEdit((prev)=>( {...prev ,{prev.personalAssitantId:editTemp} }))}}>Save </button>   */}
                                                    <button className="regular-btn" onClick={() => { editPA(); setEdit(prev => ({ ...prev, personalAssitantId: editTemp })); }}> Save</button>

                                                </>
                                            }
                                        </div>
                                    </div>
                                    {showPaDetail &&
                                        <div className="pawithImage">
                                            <div className="paImage">
                                                <img src={userDefaultImage} alt="" />
                                            </div>
                                            <div className="paBasicDetails">
                                                <label htmlFor="">Name  <p>Dr. {edit?.personalAssitantId?.name}</p></label>
                                                <label htmlFor="">Gender <p>{edit?.personalAssitantId?.gender || "Male"}</p></label>
                                                <label htmlFor="">Email <p>{edit?.personalAssitantId?.email}</p></label>
                                                <label htmlFor="">Experience <p>{edit?.personalAssitantId?.experience}</p></label>
                                                <label htmlFor="">Qualification <p>{edit?.personalAssitantId?.qualification}</p></label>
                                            </div>
                                        </div>
                                    }
                                    { }
                                    {editPaDetail &&

                                        <div className="pawithImage">
                                            <div className="paImage">
                                                <img src={userDefaultImage} alt="" />
                                            </div>
                                            <div className="paBasicDetails">
                                                <div className="PaEditdetail">
                                                    <div>
                                                        <label htmlFor="">Name</label>
                                                        <input type="text" value={editTemp?.name} onChange={(e) => setEditTemp({
                                                            ...editTemp, name: e.target.value
                                                        })} />
                                                    </div>
                                                    <div>

                                                        <label htmlFor="">Email</label>
                                                        <input type="email" value={editTemp?.email} onChange={(e) => {
                                                            setEditTemp({
                                                                ...editTemp
                                                                , email: e.target.value
                                                            })
                                                        }} />
                                                    </div>


                                                </div>
                                                <div className="PaEditdetail">
                                                    <div>

                                                        <label htmlFor="">Gender</label>
                                                        <select name="" style={{ height: "33px", border: "0.2px solid lightgray", borderRadius: "7px" }} value={editTemp?.gender || "N/A"}
                                                            onChange={(e) => {
                                                                setEditTemp({
                                                                    ...editTemp, gender: e.target.value
                                                                })
                                                            }}>
                                                            <option >Select Gender</option>
                                                            <option >Male</option>
                                                            <option >Female</option>
                                                            <option >Other</option>
                                                        </select>
                                                    </div>
                                                    <div>

                                                        <label htmlFor="">Experience</label>
                                                        <input type="number" value={editTemp?.experience} onChange={(e) => {
                                                            setEditTemp({
                                                                ...editTemp, experience: e.target.value
                                                            })
                                                        }} />
                                                    </div>
                                                </div
                                                >
                                                <div style={{ display: "flex", flexDirection: "column", }}>

                                                    <label htmlFor="">Qualification</label>
                                                    <select style={{ height: "33px", border: "0.2px solid lightgray", borderRadius: "7px" }} value={editTemp?.qualification} onChange={(e) => {
                                                        setEditTemp({
                                                            ...editTemp, qualification: e.target.value
                                                        })
                                                    }}>
                                                        <option >Select-Qulification</option>
                                                        <option >Post-graduation</option>
                                                        <option >Graduation</option>
                                                    </select>
                                                </div>

                                            </div>
                                            {/* <button onClick={ cancelPAdetail}>Cancel</button> */}
                                            {/* <button onClick={ editPA}>Save</button> */}
                                        </div>
                                    }
                                </div>

                            ) : (
                                <>
                                    <br />

                                    <button className="common-btn" onClick={() => {
                                        setAssignDoctor(edit);
                                        setEdit(null);
                                    }}>+ Add Assistant</button>
                                </>

                            )}
                        </div>
                    </div>

                </div>
            )
        }
        {
            editDoc !== null && (
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
                                {`Edit  Dr.${editDoc?.name}`}
                            </h3>
                            <i
                                onClick={() => setEditDoc(null)}
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
                                    value={editDoc?.name}
                                    onChange={(e) => setEditDoc({ ...editDoc, name: e.target.value })}
                                />
                            </label>

                            <label style={{ width: '100%' }}>
                                Email *
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={editDoc?.email}
                                    onChange={(e) => setEditDoc({ ...editDoc, email: e.target.value })}
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
                                    value={editDoc?.contact}
                                    onChange={(e) => setEditDoc({ ...editDoc, contact: e.target.value })}
                                />
                            </label>

                            <label style={{ width: '100%' }}>
                                Experience (years) *
                                <input
                                    type="number"
                                    placeholder="ex.2"
                                    value={editDoc.experience}
                                    onChange={(e) => setEditDoc({ ...editDoc, experience: e.target.value })}
                                />
                            </label>
                        </div>


                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            columnGap: '80px',
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <label style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                // marginTop: '10px'
                            }}>
                                Gender
                                <select
                                    style={{
                                        width: "100%",
                                        padding: '8px',
                                        borderRadius: '7px',
                                        color: 'black',
                                        fontsize: "12.5px",
                                        border: "1px solid lightgray",
                                    }}
                                    value={editDoc.gender}
                                    onChange={(e) => setEditDoc({ ...editDoc, gender: e.target.value })}
                                >
                                    <option>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>other</option>
                                </select>
                            </label>
                            <label style={{ width: '100%' }}>
                                Appointment Fees *
                                <input
                                    style={{ cursor: "text" }}
                                    type="number"
                                    placeholder="ex.500"
                                    value={editDoc?.appointmentFees}
                                    onChange={(e) => setEditDoc({ ...editDoc, appointmentFees: e.target.value })}
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
                                value={editDoc.qualification}
                                onChange={(e) => setEditDoc({ ...editDoc, qualification: e.target.value })}
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
                            <button className="regular-btn" onClick={() => setEditDoc(null)}>Cancel</button>
                            <button
                                className="common-btn"
                                disabled={isProcessing}
                                onClick={handleEditDoc}
                            >
                                {isProcessing ? "saving..." : "Save  Profile"}
                            </button>

                        </div>
                    </div>
                </div>
            )
        }
        {console.log("open", open)
        }
        {
            open !== null && open.type === "md" && (
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
                    <div className="editcards">

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            borderRadius: '50%',
                            // backgroundColor:'red',
                            padding: "10px",
                        }}>
                            <h4>Dr. {open.md?.name} Profile</h4>
                            <i class="ri-close-large-line" style={{
                                cursor: "pointer"
                            }} onClick={() => {
                                setClose(null)
                                setEditMD(false);
                                setshowMD(true);

                            }}></i>
                        </div>
                        <div className="docProfile">
                            <div className="docWithImage">
                                <div className="docImage">
                                    <img src={userDefaultImage} alt="" />
                                </div>
                                <div className="docbasicdetails">
                                    {showMD &&
                                        <>
                                            <label htmlFor="">Name <p>Dr. {open.md?.name}</p></label>
                                            <label htmlFor="">Gender <p>{open.md?.gender || "Male"}</p></label>
                                            <label htmlFor="">Email <p>{open.md?.email}</p></label>
                                            <label htmlFor="">Experience <p>{open.md?.experience || "5"}</p></label>
                                            <label htmlFor="">Contact <p>{open.md?.contact || "N/A"}</p></label>
                                            <label htmlFor="">Qualification <p>{open.md?.qualification || "Graduation"}</p></label>
                                        </>
                                    }
                                    {editMD && <div style={{ display: "grid", }}>
                                        <div style={{ display: "flex", width: "400px", gap: "20px", justifyContent: "start" }}>
                                            <div>
                                                <label htmlFor="">Name</label>
                                                <input type="text" value={editMDdata?.name} onChange={(e) => { setEditMDdata({ ...editMDdata, name: e.target.value }) }} />
                                            </div>
                                            <div>
                                                <label htmlFor="">Gender</label>
                                                <input type="text" value={editMDdata?.gender || "Male"} onChange={(e) => { setEditMDdata({ ...editMDdata, gender: e.target.value }) }} />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", width: "400px", gap: "20px", justifyContent: "start" }}>

                                            <div>
                                                <label htmlFor="">Email</label>
                                                <input type="text" value={editMDdata?.email} onChange={(e) => { setEditMDdata({ ...editMDdata, email: e.target.value }) }} />
                                            </div>
                                            <div>
                                                <label htmlFor="">Experience</label>
                                                <input type="text" value={editMDdata?.experience || "5"} onChange={(e) => { setEditMDdata({ ...editMDdata, experience: e.target.value }) }} />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", width: "400px", justifyContent: "start" }}>

                                            <div style={{ display: "grid", }}>
                                                <label htmlFor="">Qualification</label>
                                                <input type="text" value={editMDdata?.qualification || "Graduation"} onChange={(e) => { setEditMDdata({ ...editMDdata, qualification: e.target.value }) }} />
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                            {showMD &&
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <button style={{ width: "60px", height: "25px", margin: "20px", borderRadius: "5px", backgroundColor: "black", color: "white" }} onClick={changeMD_data} >Edit</button>
                                    {/* <button style={{width:"60px",height:"25px",margin:"20px",borderRadius:"5px",backgroundColor:"black",color:"white"}}></button> */}
                                </div>
                            }
                            {editMD &&
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <button style={{ width: "60px", height: "25px", margin: "20px", borderRadius: "5px", backgroundColor: "black", color: "white" }} onClick={() => { changeMD_data(); }} >Save</button>
                                    <button style={{ width: "60px", height: "25px", margin: "20px", borderRadius: "5px", backgroundColor: "black", color: "white" }} onClick={() => { changeMD_data(); setEditMDdata(hospital?.medicalDirector) }} >Cancel</button>
                                </div>
                            }
                        </div>
                    </div>

                </div>
            )
        }



    </div >


}

export default ViewHospital