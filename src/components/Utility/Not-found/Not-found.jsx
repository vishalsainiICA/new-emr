import './Not-found.css'
import notfundimg from "../../../assets/Not_Found_img.jpg"
const Errorpage = () => {
    return (
        <div className="Errorpage-main">

            <div className='error-contain'>
                <div style={{display:"flex", gap:"20px"}}>
                <h1>404 — Page Not Found </h1>
                <h1 style={{color:"red"}}>!</h1>
                </div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <p>We can’t seem to find the page you’re looking for.</p>
                <img src={notfundimg} alt="" />
                <div style={{display:"flex", justifyContent:"center",alignItems:"center", gap:"10px"}}>
                <span >Go to </span>
                <a href="">dashboard</a>
                <span>or</span>
                <a href="">login</a>
                </div>
               
                </div>
            </div>

        </div>
    )
}

export default Errorpage;