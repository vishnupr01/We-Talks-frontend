import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from 'react-redux'
import store from './redux/store/store.js'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { Toaster } from 'react-hot-toast';
import { SocketContextProvider } from './context/SocketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="566980439994-8tb2p7s999f66fn59kl4gdkq5vr75o02.apps.googleusercontent.com">
  <Provider store={store} >
    <SocketContextProvider>
    <App /> 
    </SocketContextProvider>
    <Toaster />
    <ToastContainer position='top-center'/>
    </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
