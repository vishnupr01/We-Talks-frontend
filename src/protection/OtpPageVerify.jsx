import { useSelector } from "react-redux";
import Otp from "../pages/User/Otp";
import { Navigate } from "react-router-dom";

function OtpPageVerify(){
  const status=useSelector((state)=>state.otpPageverification?.pageVerified)
  console.log("hey otp")
  if (status === undefined) {
    return <div>Loading...</div>;
  }
  return(
    <div>
      {status?<Otp/>:<Navigate to={"/login"}/>}
    </div>
  )
}
export default OtpPageVerify