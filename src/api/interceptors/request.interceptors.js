import axios from "axios";

const  requestInterceptor=(request)=>{
 console.log("my request",request);
 
}
export default requestInterceptor