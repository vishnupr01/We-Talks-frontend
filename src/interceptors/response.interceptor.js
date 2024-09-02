import axios from 'axios';
import { refreshToken } from '../api/user'; // Adjust the path as necessary
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
export default history



// Response Interceptor
import React from 'react'


const responseInterceptor = async (response) => {
  console.log("Response received", response);
  return response;
};

const responseErrorInterceptor = async (error) => {
  console.log("Error", error);

  if (error.response) {
    const { status } = error.response;
 console.log("current status",status);
 
    // Handle token expiration
    if (status === 401 && error.response.data.message === "Token expired") {
      console.log("Attempting to refresh token");

      try {
        await refreshToken(); // Wait for the token to be refreshed
        // Retry the original request with the new token
        const retryResponse = await Api(error.config);
        return retryResponse;
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        history.push('/login'); // Redirect to login page on token refresh failure
        return Promise.reject(refreshError);
      }
    }
    if(status===500){
      history.push('/500');
      return
    }

    switch (status) {
      case 400:
        history.push('/400'); // Custom error page for 400 Bad Request
        break;
      case 401:
        history.push('/401'); // Custom error page for 401 Unauthorized
        break;
      case 403:
        history.push('/403'); // Custom error page for 403 Forbidden
        break;
      case 404:
        history.push('/404'); // Custom error page for 404 Not Found
        break;
      case 500:
        history.push('/500'); // Custom error page for 500 Internal Server Error
        break;
      case 502:
        history.push('/502'); // Custom error page for 502 Bad Gateway
        break;
      case 503:
        history.push('/503'); // Custom error page for 503 Service Unavailable
        break;
      case 504:
        history.push('/504'); // Custom error page for 504 Gateway Timeout
        break;
      default:
        history.push('/error'); // Generic error page for other status codes
    }
  } else {
    console.error('Network Error:', error.message);
    history.push('/network-error'); // Custom error page for network issues
  }

  return Promise.reject(error);
};

export { responseInterceptor, responseErrorInterceptor };

