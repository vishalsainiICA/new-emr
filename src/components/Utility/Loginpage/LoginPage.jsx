import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./LoginPage.css"
import { useState } from "react";
import { commonApi } from "../../../auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const Loginpage = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState(null)
  const [email, setemail] = useState(null)
  const [error, seterror] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [value, setvalue] = useState(false);
  const [Eyelogo, setEyelogo] = useState(false);

  const handlelogin = async () => {
    try {
      setIsProcessing(true)
      if (validation()) {
        const res = await commonApi.login({ email, password });

        if (res.status === 200) {

          localStorage.setItem("token", res.data?.token);   // single token key
          localStorage.setItem("role", res.data?.role);
          // role saved

          toast.success("Login success")

          if (res.data?.role === "superadmin") {
            navigate("/super-admin/dashboard", { replace: true });
          }
          else if (res.data?.role === "doctor") {
            navigate("/doctor", { replace: true });
          }
          else if (res.data?.role === "medicalDirector") {
            navigate("/md/dashboard", { replace: true });
          }
          else if (res.data?.role === "personalAssitant") {
            navigate("/pa", { replace: true });
          }
        }
        else {
          seterror({ error: res.data?.message });
        }
      }
    } catch (error) {
      console.log("ererfv", error);
      seterror({ error: error.response?.data?.message || "Internal Server Error" });
    }
    finally {
      setIsProcessing(false)
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
            <button disabled={isProcessing} onClick={handlelogin}> {`${isProcessing ? "login...." : "Log in"}`} </button>
          </div>
          {error?.error && (<p style={{
            fontSize: '10px',
            color: 'red'
          }}>{error?.error}</p>)}
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