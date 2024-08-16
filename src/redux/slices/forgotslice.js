import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  forgotPageVerified: false,
}


const forgotSlice = createSlice({
  name: "forgotPageVerification",
  initialState,
  reducers: {
    visible: (state) => {
      state.forgotPageVerified = true
    },
    invisible: (state) => {
      state.forgotPageVerified = false
    }

  }
})

export const { visible, invisible } = forgotSlice.actions


export default forgotSlice.reducer