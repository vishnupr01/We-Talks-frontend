import { useSelector } from "react-redux";
import Otp from "../pages/User/Otp";
import { Navigate } from "react-router-dom";
import FormComponent from "../pages/User/GoogeForm";

function GooglePrivate(){
  const status=useSelector((state)=>state.formSlice?.formVerified)
  console.log("hey otp")
  return(
    <div>
      {status?<FormComponent/>:<Navigate to={"/login"}/>}
    </div>
  )
}
export default GooglePrivate