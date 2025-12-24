import { useState } from "react";
import "./my-profile.css"

const Myprofile = () => {

    const [editMDdata, setEditMDdata] = useState(false)
    const [showMDdata, setShowMDdata] = useState(true)

    const checkstage = () => {
        setEditMDdata(!editMDdata)
        setShowMDdata(!showMDdata)
    }

    return <div className="my-profile-main">
        <div className="my-profile">
            <div className="md-Name">
                <div className="name-logo">
                    <span style={{ fontSize: "25px" }}>AD</span>
                </div>
                <div>
                    <p>Dr. Amar Desai</p>
                    <span>Medical Director & Chief Surgeon</span>
                </div>
                {showMDdata &&
                    <button onClick={checkstage}>Edit profile</button>
                }
            </div>
            <hr />
            <div style={{ display: "flex", flexDirection: "column", }}>
                {editMDdata && <>
                    <div style={{ display: "flex",gap:"30px", paddingTop:"20px"}}>
                        <button onClick={checkstage}>Cancel</button>
                        <button onClick={checkstage}>Save</button>
                    </div>
                </>
                }
                {showMDdata &&
                    <div className="md-data">
                        <div className="data">
                            <p>Email</p>
                            <span>amar.desai@drpercha.com</span>
                        </div>
                        <div className="data">
                            <p>Phone</p>
                            <span>+91 99887 77665</span>
                        </div>
                        <div className="data">
                            <p>Experience</p>
                            <span>24 Years</span>
                        </div>
                    </div>
                }

                {editMDdata &&
                    <div className="md-data">
                        <div className="data">
                            <p>Email</p>
                            {/* <span>amar.desai@drpercha.com</span> */}
                            <input type="email" value="amar.desai@drpercha.com" />
                        </div>
                        <div className="data">
                            <p>Phone</p>
                            {/* <span>+91 99887 77665</span> */}
                            <input type="tel" value="+91 99887 77665" />

                        </div>
                        <div className="data">
                            <p>Experience</p>
                            {/* <span>24 Years</span> */}
                            <input type="text" value="24 Years" />

                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
}
export default Myprofile;