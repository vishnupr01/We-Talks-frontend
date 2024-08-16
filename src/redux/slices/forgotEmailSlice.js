import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  forgotEmailPage: false,
}


const forgotEmailSlice = createSlice({
  name: "forgotEmailVerification",
  initialState,
  reducers: {
    Add: (state) => {
      state.forgotEmailPage= true
    },
    Delete: (state) => {
      state.forgotEmailPage = false
    }

  }
})

export const { Add,Delete} = forgotEmailSlice.actions


export default forgotEmailSlice.reducer