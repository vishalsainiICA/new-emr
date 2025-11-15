import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./Loginpage.css"
import { useState } from "react";



function Loginpage(params) {

  const [value, setvalue] = useState(false);
  const [Eyelogo, setEyelogo] = useState(false);

  return (
    <div className="Login_page">
      <div className="login-page-detail">
        <div className="login">
          <span>Log in</span>
          <p>Welcome Back! Please enter your details</p>
        </div>

        <div className="all-detai">
          <div className="detail">
            <label htmlFor="">Email</label>
            <input style={{ width:"100%", color: "black", cursor: "auto" }} type="email" placeholder="Enter your email" />
            <label htmlFor="">Password</label>
            <div style={{ display: "flex", width: '100%', padding: '0 5px', border: "0.3px solid lightgray ", borderRadius: "7px" }} >
              <input style={{ color: "black", cursor: "auto", border: "none" }} type={value ? 'text' : 'password'} placeholder="Enter your password" />
              <span onClick={() => { setvalue(!value); setEyelogo(!Eyelogo) }}>{Eyelogo ? <BsEyeSlash /> : <BsEye />}</span>
            </div>
          </div>
          <div className="login-button">
            <a href="">forgot Password?</a>
            <button>Log in</button>
          </div>


        </div>

        <div className="other-detail">
          <span> Or continue with </span>
          <div style={{ display: "flex", gap: "5px" }}>
            <span>Don't have account? </span>
            {/* <span>Sign up</span> */}
            <a href="">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loginpage;