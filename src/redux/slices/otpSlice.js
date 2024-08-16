import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  pageVerified: false,
}


const OtpPageSlice = createSlice({
  name: "otpPageVerification",
  initialState,
  reducers: {
    verified: (state) => {
      state.pageVerified = true
    },
    unVerified: (state) => {
      state.pageVerified = false
    }

  }
})

export const { verified, unVerified } = OtpPageSlice.actions


export default OtpPageSlice.reducer