// redux/slices/home.js
import { createSlice } from "@reduxjs/toolkit";
const initialState={
  userInfo:false,
  user:null,
  isBlocked:false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = true
      
    },
    logout: (state) => {
      state.userInfo = false
      
    },
    setUser: (state, action) => {
      state.user = action.payload; // Update user data
    },
    clearUser: (state) => {
      state.user = null; // Clear user data
    },
    Block:(state)=>{
      state.isBlocked=true
    },
    unBlock:(state)=>{
      state.isBlocked=false
    }
  },
});

export const { login, logout,setUser,clearUser,Block,unBlock } = authSlice.actions;
export default authSlice.reducer;
