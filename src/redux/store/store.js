import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import otpSlice from "../slices/otpSlice";
import authReducer from '../slices/home'
import adminReducer from "../slices/admin";
import formReducer from '../slices/form'
import forgotslice from "../slices/forgotslice";
import forgotEmailSlice from "../slices/forgotEmailSlice";

const rootReducer=combineReducers({
  otpPageverification:otpSlice,
  authSlice:authReducer,
  adminSlice:adminReducer,
  formSlice:formReducer,
  forgotpageVerification:forgotslice,
  forgotEmailVerification:forgotEmailSlice
})

const store=configureStore({
  reducer:rootReducer
})
export default store