import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ApiService from '../../core/services/axios/api'
import { toast } from 'react-toastify';


export const getUserInfo = createAsyncThunk('home/readEmployeeInfo', async (emplId, thunkAPI) => { 
  try {  
      const url = `home/readEmployeeInfo?emplId=${emplId}`;
      const userDataResponse = await ApiService.httpGet(url); 
      if (userDataResponse?.Valid > 0) {  
          return userDataResponse.Data;
      } else {
          toast.error(userDataResponse?.Message, { autoClose: 3000});
          return thunkAPI.rejectWithValue(userDataResponse);
      }
  } catch (e) { 
      thunkAPI.rejectWithValue(e.response.loginResponse);
  }
}); 


const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: [],
    status: null,
  },
  extraReducers: {
    [getUserInfo.pending]: (state, action) => {
      state.status = 'loading'
    },
    [getUserInfo.fulfilled]: (state, { payload }) => {
      state.userInfo = formatUserResponse(payload)
      state.status = 'success'
    },
    [getUserInfo.rejected]: (state, action) => {
      state.status = 'failed'
    },
  },
})


function formatUserResponse(payload) { 
    payload[0].PHOTO =  `data:image/png;base64, ${payload[0].PHOTO}`;
    payload[0].COMPANY_LOGO = `data:image/png;base64, ${payload[0].COMPANY_LOGO}`;
    return payload;
} 


export const userSelector = (state) => state.user;  

export default userSlice.reducer