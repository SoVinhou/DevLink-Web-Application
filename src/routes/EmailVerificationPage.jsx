import NavBar from "../NavBar";
import EmailBox from "../EmailBox";
import Bottom from "../Bottom";
import VerifyEmail from "../VerifyEmail/VerifyEmail";

function EmailVerificationPage() {
  return (
    <div>
        <NavBar />
        <VerifyEmail />
        <EmailBox />
        <Bottom />
    </div>
  )
}

export default EmailVerificationPage;