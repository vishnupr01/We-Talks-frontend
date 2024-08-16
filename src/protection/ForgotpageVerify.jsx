import { useSelector } from "react-redux";
import Otp from "../pages/User/Otp";
import { Navigate } from "react-router-dom";
import ForgotComponent from "../pages/User/Forgot";
import ChangePassword from "../pages/User/ChangePassword";

function ForgotPageVerify(){
  const status=useSelector((state)=>state.forgotpageVerification?.forgotPageVerified)
  console.log("hey otp")
  if (status === undefined) {
    return <div>Loading...</div>;
  }
  return(
    <div>
      {status?<ChangePassword/>:<Navigate to={"/login"}/>}
    </div>
  )
}
export default ForgotPageVerify