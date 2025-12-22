import { useNavigate } from 'react-router-dom';
import './Department.css'

const Department = () => {
     const navigate = useNavigate()
    return <div className='main-Deparment'>

        <div className='Department-cards'>

            <div className='Cards'>
                <div style={{ display: "flex",justifyContent:"space-between" }}>

                    <i style={{ color: "red" }} class="fa-solid fa-heart-pulse"></i>
                    <span>Active</span>

                </div>
                <div 
                onClick={()=>navigate("/md/department-Cards")}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                    <h3>Cardiology</h3>
                    <p>Heart care, surgery, and rehabilitation.</p>
                    <div style={{display:"flex",gap:"20px"}}>
                        <span>5 Doctor</span>
                        <span>120 Patient</span>
                    </div>

                </div>
            </div>
        </div>

    </div>
}

export default Department;