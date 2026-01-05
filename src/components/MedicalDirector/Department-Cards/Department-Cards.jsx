import { useNavigate } from 'react-router-dom';
import './Department-Cards.css'

const DepartmentCards = () => {
    const navigate = useNavigate()
    return <div className='Deparment-Cards'>
        <div className='back-button'>
            <div onClick={() => navigate("/md/department")}> Back Department</div>
        </div>
        <div className='Department-name'>
            <div className='Department-name-section'>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <i style={{ color: "red", fontSize: "20px", backgroundColor:"lightgreen",width:"40px",height:"40px",borderRadius:"3px",display:"flex",justifyContent:"center",alignItems:"center" }} class="fa-solid fa-heart-pulse"></i>
                    <div style={{ display: "flex", flexDirection: "column", gap:"5px" }}>
                        <h2>Cardiology Department</h2>
                        <span>Head of Dept: Dr. Rajesh Koothrappali</span>
                    </div>
                </div>
                <button >Edit Detail</button>
            </div>
            <hr />
            <div className='Medical-Staf'>
                <div style={{fontSize:"15px",fontWeight:"bold", textDecoration:"underline"}}>
                    <span>Medical Staff (Cardiology)</span>
                </div>
                <div className='staff-Data'>

                    <div className='data'>
                        <span>Name</span>
                        <div>
                            <p>Dr. Rajesh Koothrappali</p>
                        </div>
                    </div>
                    <div className='data'>
                        <span>Role</span>
                        <div>
                            <p>Senior Cardiologist</p>
                        </div>
                    </div>
                    <div className='data'>
                        <span>Status</span>
                        <div>
                            <p>Available</p>
                        </div>
                    </div>
                    <div className='data' >
                        <span>Action</span>
                        <div>
                            <p>View Profile</p>
                        </div>
                    </div>

                </div>

                {/* <table className="row-only-table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>

                        <tr>
                            <td>Dr. Rajesh Koothrappali</td>
                        </tr>

                        <tr>
                            <td>Senior Cardiologist</td>
                        </tr> 
                        <tr>

                            <td>Available</td>
                        </tr> 
                    </tbody>
                        </table> */}
              
                    </div>
            </div>

        </div>
}

        export default DepartmentCards;