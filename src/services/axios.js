import axios from 'axios';
 // Adjust import based on your project structure

// Create an Axios instance
const Api = axios.create({
  baseURL: 'https://wetalks.vkart.fun/', // Adjust baseURL as needed
  withCredentials: true,
});

// Axios interceptor function
export const axiosInterceptor = (navigate) => {

  Api.interceptors.request.use(
    (config) => {
      console.log("Request:", config);
      return config;
    },
    (error) => {
      console.log("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  Api.interceptors.response.use(
    (response) => {
      console.log("Response:", response);
      return response;
    },
    async (error) => {
      console.log("Response error:", error);
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          if (error.message === "token expired") {
            navigate("/login");
          }
        } else if (status === 500) {
          navigate("/500");
          console.log("Internal server error");
        }
      }
      return Promise.reject(error);
    }
  );
};

export default Api;
