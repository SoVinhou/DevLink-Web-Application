import { Link } from 'react-router-dom';
import './VerifyEmail.css'
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const navigate = useNavigate();

  const handle = () => {
    navigate('/LogIn');
  }

  return (
    <div className="Verifyemail-container">
      <div class="Verifyemail-box">
          <img src = {require("../images/ticks.png")} alt="logo" className='ForgotPassword-img' />
          <h2>Please Check your email</h2>
          <p style={{ textAlign:"center", margin: "0 7%", lineHeight:"1.5"}}>An email has been sent with a link to reset your password/verify your email. Click Login once you have finished.</p>
          <button className="btn btnFil" onClick={handle} style={{marginTop:"30px"}}> Login </button>
          <p style={{marginTop: "-35px", marginBottom: "-0px", fontSize: "15px", fontWeight:"bold"}}> **Please check your spam folder if you cannot find the email** </p>
      </div>
    </div>

  )
}

export default VerifyEmail;