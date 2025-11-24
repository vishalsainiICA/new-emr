import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./LoginPage.css"
import { useState } from "react";
import { commonApi } from "../../../auth";



function Loginpage(params) {

  const [password, setPassword] = useState(null)
  const [email, setemail] = useState(null)
  const [error, seterror] = useState(null)

  const [value, setvalue] = useState(false);
  const [Eyelogo, setEyelogo] = useState(false);

  const handlelogin = async () => {
    try {
      if (validation()) {      // <-- function ko call kiya
        const res = await commonApi.login(
          { email: email, password: password }
        );

        if (res.status === 200) {
          console.log("Login successful");
          if (res.data?.role === "medicalDirector")
            { return localStorage.setItem("SuperAdmintoken", res.data?.token)}
          if (res.data?.role === "doctor") return localStorage.setItem("Doctor", res.data?.token)
          if (res.data?.role === "perosnalAssistant") return localStorage.setItem("PerosnalAssistant", res.data?.token)
          
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validation = () => {
    if (!email) {
      seterror({ email: "Please Enter Email" });
      return false;
    }
    if (!password) {
      seterror({ password: "Please Enter Password" });
      return false;
    }
    if (email.trim() === "") {
      seterror({ email: "Email Can't be Empty" });
      return false;
    }
    if (password.trim() === "") {
      seterror({ password: "Password Can't be Empty" });
      return false;
    }
    seterror(null);
    return true;
  };


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
            <input onChange={(e) => setemail(e.target.value)} style={{ width: "100%", color: "black", cursor: "auto" }} type="email" placeholder="Enter your email" />
            {error?.email && (<p>{error?.email}</p>)}
            <label htmlFor="">Password</label>
            <div style={{ display: "flex", width: '100%', padding: '0 5px', border: "0.3px solid lightgray ", borderRadius: "7px" }} >
              <input onChange={(e) => setPassword(e.target.value)} style={{ color: "black", cursor: "auto", border: "none" }} type={value ? 'text' : 'password'} placeholder="Enter your password" />
              <span onClick={() => { setvalue(!value); setEyelogo(!Eyelogo) }}>{Eyelogo ? <BsEyeSlash /> : <BsEye />}</span>
            </div>
            {error?.password && (<p>{error?.password}</p>)}
          </div>
          <div className="login-button">
            <a href="">forgot Password?</a>
            <button onClick={handlelogin}>Log in</button>
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