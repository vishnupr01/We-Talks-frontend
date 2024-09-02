import axios from "axios";

const requestInterceptor = (config) => {
  console.log("my request", config);
  return config
}
const requestErrorInterceptor = (error) => {
  console.log("request error:", error);
  return Promise.reject(error)

}
export {requestInterceptor,requestErrorInterceptor}