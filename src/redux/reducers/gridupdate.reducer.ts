import { createSlice } from '@reduxjs/toolkit'

interface Actions {
  actionQueueRow: any,
  badgeCount:any
}
interface Payload {
  payload: any;
  action: string;
}
interface ResetPayload {
  action: string;
}
interface ActionPayload {
  payload: Payload;
  type: string;
}
interface ActionResetPayload {
  payload: ResetPayload;
  type: string;
}
const initialState = { actionQueueRow: null, badgeCount:{action: 'update'} } as Actions

const gridUpdate = createSlice({
  name: 'gridUpdate',
  initialState,
  reducers: {
    setUpdateRow(state, action: ActionPayload) {
      const { action: actionType, payload: { response, type }
      } = action.payload;
      switch (actionType) {
        case 'actionQueue':
          state.actionQueueRow = {
            type,
            id: response.Id
          }
          break;

        default:
          break;
      }

    },
    resetUpdatedRow(state, action: ActionResetPayload) {
      const { action: actionType,
      } = action.payload;
      switch (actionType) {
        case 'actionQueue':
          state.actionQueueRow = null;
          break;

        default:
          break;
      }
    },
    updateMyActionBadge(state, action: ActionPayload){
      console.log('badgeCountStorebadgeCountStore')
      state.badgeCount = {...{action: 'reload'}}
    }
  },
})

export const { setUpdateRow,resetUpdatedRow, updateMyActionBadge } = gridUpdate.actions
export default gridUpdate.reducer