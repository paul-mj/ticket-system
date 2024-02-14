import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../core/services/axios/api';
import { toast } from 'react-toastify';
import localStore from '../../common/browserstore/localstore';
import { useTranslation } from 'react-i18next';


export const loginUser = createAsyncThunk('user/login', async (param, thunkAPI) => { 
  const { t, i18n } = useTranslation(); 
    try {  
        const loginResponse = await ApiService.httpPost('user/login', param);  
        if (loginResponse?.Valid > 0) {
            localStore.setLoggedInfo(loginResponse);
            toast.success(`${t("User authenticated successfully")}`, {autoClose: 3000});
            return loginResponse;
        } else {
            toast.error(loginResponse?.Message, { autoClose: 3000});
            return thunkAPI.rejectWithValue(loginResponse);
        }
    } catch (e) { 
        thunkAPI.rejectWithValue(e.response.loginResponse);
    }
}); 

 const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loginData: {},
        isFetching: false,
        isSuccess: false,
        isError: false, 
    },
    reducers: {
      clearState: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isFetching = false;
        return state;
      },
    },
    extraReducers: {
      [loginUser.fulfilled]: (state, { payload }) => { 
        state.loginData = payload;
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      },
      [loginUser.rejected]: (state, { payload }) => { 
        state.isFetching = false;
        state.isError = true; 
      },
      [loginUser.pending]: (state) => {
        state.isFetching = true;
      }, 
    },
  });
  
  export const authSelector = (state) => state.auth;          
  export const { clearState } = authSlice.actions;
  export default authSlice.reducer;

