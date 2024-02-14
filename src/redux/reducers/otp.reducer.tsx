
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otpSent: false,
  errorMessage: null,
  apiResponse: null
};

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    sendOTP: (state, action) => {
      state.otpSent = true;
      state.errorMessage = null;
      state.apiResponse = action.payload; 
    },
    setErrorMessage: (state, action) => {
      console.log(action, 'action action action action action action action action');
      state.errorMessage = action.payload;
    },
  },
});
export const { sendOTP, setErrorMessage } = otpSlice.actions;

export default otpSlice.reducer;
