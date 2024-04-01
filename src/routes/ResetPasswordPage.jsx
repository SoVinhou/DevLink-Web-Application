import ResetPassword from "../ResetPassword/ResetPassword";
import NavBar from "../NavBar";
import Bottom from "../Bottom";
import EmailBox from "../EmailBox";


function LogInPage() {
  return (
    <div>
      <NavBar />
      <ResetPassword />
      <EmailBox />
      <Bottom />
    </div>
  )
}

export default LogInPage;