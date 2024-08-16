// redux/slices/home.js
import { createSlice } from "@reduxjs/toolkit";
const initialState={
  adminInfo:false,
  admin:null
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    Adminlogin: (state, action) => {
      state.adminInfo = true
      
    },
    Adminlogout: (state) => {
      state.adminInfo = false
      
    },
    setAdmin: (state, action) => {
      state.admin = action.payload; 
    },
    clearAdmin: (state) => {
      state.admin = null; 
    },
  },
});

export const { Adminlogin, Adminlogout,setAdmin,clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
