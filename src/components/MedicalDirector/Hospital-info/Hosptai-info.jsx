import "./Hospital-info.css"

const Hospital_info = () => {
    return <div className="my-profile-main">
        <div className="my-profile">
            <div className="md-Name">
                <div className="name-logo">
                    <span><i style={{fontSize:"30px"}} class="fa-solid fa-hospital"></i></span>
                </div>
                <div>
                    <p>Dr. Percha Medical Institute</p>
                    <span>Reg No: IND-MH-998822</span>
                </div>
                {/* <button>Edit profile</button> */}
            </div>
            <hr />
            <div style={{display:"flex",flexDirection:"column"}}>

                <div className="md-data">
                    <div className="data">
                        <p>Address</p>
                        <span>Plot 42, Sector 5, Mumbai</span>
                    </div>
                    <div className="data">
                        <p>Helpline</p>
                        <span>1800-PERCHA-MED</span>
                    </div>
                    <div className="data">
                        <p>Capacity</p>
                        <span>500 Beds (85% Occupied)</span>
                    </div>
                </div>
                <div className="md-data">
                    <div className="data">
                        <p>Ambulance</p>
                        <span>12 Active Units</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default Hospital_info;