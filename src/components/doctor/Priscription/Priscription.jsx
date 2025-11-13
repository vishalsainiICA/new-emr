import "./Priscription.css"
import srk from "../../../assets/srk-removebg-preview.png"
import scanmer from "../../../assets/Screenshot 2025-11-12 122020.png"
import nabh from "../../../assets/nabh-accreditated-inodaya-hospital.png"
import nabl from "../../../assets/nabl-logo-png_seeklogo-398757.png"

const Pricription = () => {
    return (
        <div className="priscription">
                  <button style={{display:"flex",gap:"8px"}}> <i class="ri-arrow-left-circle-line"></i>Back</button>
            <div className="prisciption-detail-form">
                <div className="logo-and-detail">
                    <img src={srk} alt="logo-hospital" />
                    <div
                        style={{width:'50%',
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center",
                            justifyContent:"center",
                            gap:"10px"
                        }}
                    >
                        <div className="certified-logo">
                            <img src={nabh} alt="logo-hospital" style={{height:'60px', width:'90px'}} />
                            <img src={nabl} alt="logo-hospital" style={{height:'50px', width:'70px'}} />
                        </div>

                        <div className="lable-input">
                            <div style={{ width: "100%", display: "grid", alignItems: "center", }}>
                                <label htmlFor="">BP :</label>
                                <label htmlFor="">PULSE :</label>
                                <label htmlFor="">WEIGHT :</label>
                                <label htmlFor="">LMP :</label>
                            </div>

                            <div>
                                <input type="text" />
                                <input type="text" />
                                <input type="text" />
                                <input type="text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="patient-box">
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>Rx</span>
                    {/* <input type="text" style={ {border:"none"}} /> */}
                </div>

                <div className="other-detail">

                    <div>
                        <img src={scanmer} alt="scanner img" />
                    </div>
                    <div className="about">
                        <span>78-79 Dhuleshwar Garden, Behind HSBC Bank</span>
                        <span>Sardar Patel Marg, C-Scheme, Jaipur-302001</span>
                        <span>Ph .: 0141-2378001, 2379779 | Fax : 0141-2370673 |Appointments : 7023007777</span>
                        <span>Email : srkallahospital@rediffmail.com | Web .: srkallahospitals.com</span>
                    </div>
                </div>

            </div>
            <div  style={{display:"flex", gap:"10px"}}>
                  <button  style={{display:"flex",gap:"8px"}}><i class="ri-chat-download-line"></i>Download</button>
                  <br />
                  <button style={{display:"flex",gap:"8px"}}><i class="ri-printer-line"></i> Print</button>

            </div>
        </div>
    );
}

export default Pricription