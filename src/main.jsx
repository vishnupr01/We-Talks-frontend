import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store/store.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { SocketContextProvider } from './context/SocketContext.jsx'
import axios from 'axios'
import Api from './services/axios.js'
import { refreshToken } from './api/user.js'


Api.interceptors.request.use(
  request => {
    console.log("got requestttt", request);
    return request;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);
Api.interceptors.response.use(
  async (response) => {
    // Log or modify the response if needed
    console.log(response);
    return response;
  },
  async (error) => {
    console.log("Current error:", error);

    try {
      console.log("whattt jokee");
      
      if (error.response && error.response.data.message === "Token expired") {
        console.log("function is working");
        
        await refreshToken(); // Wait for the token to be refreshed
        // Optionally, retry the original request with the new token here
      }
      // Handle response error
      console.error('Response error:', error);
      return Promise.reject(error);
      
    } catch (err) {
      console.error('Error handling token expiration:', err);
      return Promise.reject(err);
    }
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="566980439994-8tb2p7s999f66fn59kl4gdkq5vr75o02.apps.googleusercontent.com">
      <Provider store={store} >
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
        <Toaster />
        <ToastContainer position='top-center' />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
