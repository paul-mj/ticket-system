import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
  configs: any
}
interface Payload {
  [key: string]: any
}
interface ActionPayloadaction {
  payload: Payload;
  type: string;
}
const initialState = { configs: {} } as CounterState

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    updateConfig(state, action: ActionPayloadaction) { 
      const { payload } = action.payload;
      const newState = {
        ...state,
        configs:{
          ...state.configs,
          ...payload
        }
      } 
      return newState
    }
  },
})

export const { updateConfig } = commonSlice.actions
export default commonSlice.reducer