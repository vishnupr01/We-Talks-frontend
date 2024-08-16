import { useSelector } from "react-redux";
import Otp from "../pages/User/Otp";
import { Navigate } from "react-router-dom";
import ForgotComponent from "../pages/User/Forgot";
import ChangePassword from "../pages/User/ChangePassword";

function ForgotEmailVerify(){
  const status=useSelector((state)=>state.forgotEmailVerification.forgotEmailPage)
  console.log(status)
  if (status === undefined) {
    return <div>Loading...</div>;
  }
  return(
    <div>
      {status?<ForgotComponent/>:<Navigate to={"/login"}/>}
    </div>
  )
}
export default ForgotEmailVerify