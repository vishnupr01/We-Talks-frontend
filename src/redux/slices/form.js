import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  formVerified: false
}
const formSlice = createSlice({
  name: "formVerification",
  initialState,
  reducers: {
    available: (state) => {
      state.formVerified = true
    },
    unAvailable: (state) => {
      state.formVerified = false
    }
  }
})
export const {available,unAvailable}=formSlice.actions
export default formSlice.reducer