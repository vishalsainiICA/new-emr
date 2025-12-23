import "./my-profile.css"

const Myprofile = () => {
    
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
                <button>Edit profile</button>
            </div>
            <hr />
            <div>
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
            </div>
        </div>
    </div>
}
export default Myprofile;