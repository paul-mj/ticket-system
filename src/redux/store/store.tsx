import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from '../reducers/sidebar.reducer'; 
import commonReducer from '../reducers/common.reducer'; 
import gridUpdate from '../reducers/gridupdate.reducer'
import { combineReducers } from 'redux'

const reducer = combineReducers({
    menus: sidebarReducer,
    commonReducer,
    gridUpdate
  })

export default configureStore({
    reducer: reducer,
    /* middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), */
    devTools: true,
})

