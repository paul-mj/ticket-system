import { createSlice, createAsyncThunk, combineReducers } from "@reduxjs/toolkit";
import ApiService from "../../core/services/axios/api";
import { API } from "../../common/application/api.config";
import { AsyncThunk } from "../../common/application/async.thunk";
import { ModuleMenuParamType, MasterMenuParams, initialStateModule, initialStateMaster, MasterDetailsParams, initialStateMasterDetails, initialStateActiveMasterDetails, initialStateMasterSub, MasterMenuSubParams, initialFilterState, initialMasterListState } from "../types/sidebar-types";
import { CriteriaInputMode, MasterId } from "../../common/database/enums";
import { RedirectUrlWithLink, encrypt } from "../../layouts/menu-utils";
import CommonUtils from "../../common/utils/common.utils";



/* export const getModuleMenus = createAsyncThunk(AsyncThunk.ModuleList, async (param: ModuleMenuParamType, thunkAPI) => {
    try {
        const response = await ApiService.httpPost(API.getModules, param);
        if (response.Valid > 0) {
            console.log(response.Data, 'response.Data Sidebar Reducer')
            return response.Data;
        }
    } catch (e) { }
});


export const getMasterMenuList = createAsyncThunk(AsyncThunk.MasterMenus, async (param: MasterMenuParams, thunkAPI) => {
    try {
        const response = await ApiService.httpPost(API.getMasters, param);
        if (response.Valid > 0) { 
            return { menu: addKeyToMenu(response.Menus, param), apiParam: param };
        }
    } catch (e) { }
});  */


/* Get Modules Menu */
export const getModuleMenus = createAsyncThunk(AsyncThunk.ModuleList, async (param: any, thunkAPI) => {
    try {
        const response = await ApiService.httpPost(API.getModules, param);
        if (response.Valid > 0) {
            const promises = response.Data.map((item: any, index: number) => {
                const masterMenuParams = {
                    UserId: param.Id,
                    ModuleId: item?.id,
                    CultureId: param.CultureId
                }
                return ApiService.httpPost(API.getMasters, masterMenuParams);
            });
            const listResponse = await Promise.all(promises);
            const x = listResponse.map((res, index) => {
                return {
                    id: response.Data[index].id,
                    menu: addKeyToMenu(res.Menus, param)
                }
            });
            thunkAPI.dispatch(getMasterMenuListAll(x));
            return response.Data;
        }
    } catch (e) { }
});

/* Get Master Menus */
export const getMasterMenuListAll = createAsyncThunk(AsyncThunk.MasterMenus, async (param: any, thunkAPI) => {
    try {
        return param;
    } catch (e) { }
});
export const resetTemporaryOnClick = createAsyncThunk(AsyncThunk.MasterMenus, async (param: any, thunkAPI) => {
    try {
        thunkAPI.dispatch(resetTemporaryMenu())
    } catch (e) { }
});

export const updateMasterListFavorite = createAsyncThunk('masterlists/toggleFavorite', async (menuId: any, thunkAPI) => {
    try {
        thunkAPI.dispatch(updateMasterData(menuId));
        return menuId;
    } catch (e) {
        console.log(e)
    }
});


const masterListMenuListSlice = createSlice({
    name: 'masterlists',
    initialState: initialMasterListState,
    reducers: {
        clearMasterListState: (state) => {
            state.List = [];
            state.temporaryMenu = null;
        },
        resetTemporaryMenu: (state) => {
            state.temporaryMenu = null
        }, updateMasterData: (state, action) => {
            const findNode = (MenuId: number, list: any): any => {
                // console.log(list,MenuId)
                const found = list.find((f: any) => f.MenuId === MenuId);
                if (found) {
                    return found
                } else {
                    if (list.items?.length) {
                        return findNode(MenuId, list.items);
                    }
                }
            }
            const masterList = state.List;
            function changeFavorite(MenuId: number) {
                let result;
                for (const module of masterList) {
                    for (const masters of module.menu) {
                        const rs = findNode(MenuId, masters.items)
                        if (rs) {
                            result = rs;
                        }
                    }
                }
                return result;
            }
            const updatedData = changeFavorite(action.payload);
            if (updatedData) {
                updatedData.IsFavorite = Number(!Boolean(updatedData.IsFavorite));
                state.temporaryMenu = updatedData.ModuleId
            }
            state.List = masterList;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMasterMenuListAll.fulfilled, (state, action) => {
            if(action.payload) {
                state.List = [...state.List, ...action.payload];
            }
        });
    },
});




export const addKeyToMenu = (menu: any, param?: any) => {
    for (let i = 0; i < menu.length; i++) {
        const menuItem = menu[i];
        if (menuItem.CriteriaMode === 0) {
            const params = JSON.stringify({
                MenuId: menuItem.MenuId,
                ModuleId: menuItem.ModuleId,
                MasterId: menuItem.MenuId,
                to: menuItem.to,
            });
            menuItem.redirectUrl = `${RedirectUrlWithLink(menuItem)}?query=${encrypt(params)}`;
        }
        if (menuItem.items && menuItem.items.length > 0) {
            addKeyToMenu(menuItem.items);
        }
    }
    return menu;
}

/* Get Master Menus  Sub */
export const getMasterMenuSubList = createAsyncThunk(AsyncThunk.MasterSubMenus, async (param: MasterMenuSubParams, thunkAPI) => {
    try {
        const response = await ApiService.httpPost(API.getMasterSubMenu, param);
        if (response.Valid > 0) {
            return { menu: response.Menus, apiParam: param };
        }
    } catch (e) { }
});

/* Get Master Menus */
/* export const getMasterDetails = createAsyncThunk(AsyncThunk.MasterDetails, async (param: MasterDetailsParams, thunkAPI) => {
    try {
        const response = await ApiService.httpPost(API.getMasterDetail, param); 
        if (response.Valid > 0) {  
            return response;
        }
    } catch (e) { }
}); */

export const getMasterDetails = createAsyncThunk(AsyncThunk.MasterDetails, async (param: MasterDetailsParams, thunkAPI) => {
    try {
        const response = await ApiService.httpPost(
            API.getMasterDetail,
            param
        );
        if (response.Valid > 0) {
            const criteria = response?.Criteria;
            if (!criteria || criteria.length === 0) {
                return response;
            }
            const promises = criteria.map((detail: any) => {
                const getOtherParams = {
                    FillProcName: detail.FillProcName,
                    CultureId: param.CultureId,
                    DisplayFields: detail.KeyCol,
                    FieldCaptions: detail.DispCol,
                    RoleId: -1,
                    UserIdRequired: detail.UserIdRequired,
                };
                const getEnumsParams = {
                    CultureId: param.CultureId,
                    Id: detail.InputValue,
                    Mode: detail.InputMode,
                };
                if (detail.InputMode === CriteriaInputMode.Other) {
                    return ApiService.httpPost('data/getDataForTableCriteria', getOtherParams).then((detail1: any) => {
                        if (detail1.Valid > 0) {
                            const newArray = detail1.Data.map((item: any) => {
                                return {
                                    Id: item.ENUM_ID,
                                    Description: item.ENUM_NAME
                                }
                            });
                            Object.assign(detail, { list: newArray });
                        }
                    });
                } else if (detail.InputMode === CriteriaInputMode.Master || detail.InputMode === CriteriaInputMode.Enum) {
                    return ApiService.httpPost('data/getDataForCriteria', getEnumsParams).then((detail2: any) => {
                        if (detail2.Valid > 0) {
                            const newArray = detail2.Data.map((item: any) => {
                                return {
                                    Id: item.ENUM_ID,
                                    Description: item.ENUM_NAME
                                }
                            });
                            Object.assign(detail, { list: newArray });
                        }
                    });
                } else {
                    return Promise.resolve();
                }
            });
            await Promise.all(promises);
            return response;
        }
    } catch (e) { }
});

/* Active Master Details */
export const setActiveMasterDetails = createAsyncThunk(AsyncThunk.SetActiveMasterDetails, async (param: any, thunkAPI) => {
    try {
        return param;
    } catch (e) { }
});

/* Active Filter */
export const setActiveFilter = createAsyncThunk(AsyncThunk.SetActiveFilter, async (param: any, thunkAPI) => {
    try {
        return param;
    } catch (e) { }
});

/* Module Menu Slice */
const moduleMenuslice = createSlice({
    name: "modules",
    initialState: initialStateModule,
    reducers: {
        clearModuleState: (state) => {
            state.error = null;
            state.moduleMenus = [];
            state.loading = false;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getModuleMenus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(getModuleMenus.fulfilled, (state, action: any) => {
            state.loading = false;
            state.moduleMenus = action.payload;
        });
        builder.addCase(getModuleMenus.rejected, (state, { payload }) => {
            state.loading = false;
        });
    },
});




export const getMasterMenuList = createAsyncThunk(AsyncThunk.MasterMenus, async (param: any, thunkAPI) => {
    return {}
});


/* Master Menu Slice */
const masterMenuSlice = createSlice({
    name: "masters",
    initialState: initialStateMaster,
    reducers: {
        clearMasterState: (state) => {
            state.error = null;
            state.masterMenus = [];
            state.loading = false;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMasterMenuList.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getMasterMenuList.fulfilled, (state, action: any) => {
            state.loading = false;
            state.masterMenus = { moduleId: action.payload?.apiParam?.ModuleId, list: action.payload?.menu };
        });
        builder.addCase(getMasterMenuList.rejected, (state, { payload }) => {
            state.loading = false;
        });
    },
});


/* Master Menu Sub List */
const masterMenuSubSlice = createSlice({
    name: "masterMenuSub",
    initialState: initialStateMasterSub,
    reducers: {
        clearMasterSubState: (state) => {
            state.error = null;
            state.masterMenusSub = [];
            state.loading = false;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMasterMenuSubList.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getMasterMenuSubList.fulfilled, (state, action: any) => {
            state.loading = false;
            state.masterMenusSub = { menuId: action.payload.apiParam?.MasterId, list: action.payload.menu };
        });
        builder.addCase(getMasterMenuSubList.rejected, (state, { payload }) => {
            state.loading = false;
        });
    },
});

/* Master Details While Clicking Each Menu */
const masterMenuDetailsSlice = createSlice({
    name: 'masterdetails',
    initialState: initialStateMasterDetails,
    reducers: {
        clearMasterDetailsState: (state) => {
            state.error = null;
            state.masterDetails = [];
            state.loading = false;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMasterDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getMasterDetails.fulfilled, (state: any, action: any) => {
            state.loadingMaster = false;
            state.masterDetails.push(action.payload);
        });
        builder.addCase(getMasterDetails.rejected, (state, { payload }) => {
            state.loading = false;
        });
    },
})

/* Save Active Master Details */
const activeMasterDetailsSlice = createSlice({
    name: 'activemasterdetails',
    initialState: initialStateActiveMasterDetails,
    reducers: {
        clearActiveDetailsState: (state) => {
            state.error = null;
            state.activeDetails = {};
            state.loading = false;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setActiveMasterDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(setActiveMasterDetails.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.activeDetails = action.payload;
        });
        builder.addCase(setActiveMasterDetails.rejected, (state, { payload }) => {
            state.loading = false;
        });
    },
})

/* Save Active Filter */
const activeFilterSlice = createSlice({
    name: 'filterCriteriaDetails',
    initialState: initialFilterState,
    reducers: {
        clearFilterState: (state) => {
            state.error = null;
            state.filterCriteria = [];
            state.loading = false;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setActiveFilter.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(setActiveFilter.fulfilled, (state: any, action: any) => {
            state.loading = false;
            const activeItem = action.payload?.activeItem[0];

            const existingFilterCriteriaIndex = state.filterCriteria.findIndex((item: any) => item.masterId === activeItem?.Master?.MASTER_ID);

            if (action.payload.isCheck) {
                if (existingFilterCriteriaIndex !== -1) {
                    // if masterId exists, update its criteria
                    state.filterCriteria[existingFilterCriteriaIndex].criteria = activeItem.Criteria;
                } else {
                    // if masterId doesn't exist, add a new item to the filterCriteria array
                    if (activeItem.Criteria?.length) {
                        state.filterCriteria.push({
                            masterId: activeItem.Master.MASTER_ID,
                            criteria: activeItem.Criteria
                        });
                    }
                }
            } else {
                if (existingFilterCriteriaIndex !== -1) {
                    // if masterId exists, don't add a new item
                    return;
                } else {
                    // if masterId doesn't exist, add a new item to the filterCriteria array
                    if (activeItem && activeItem.Criteria?.length) {
                        state.filterCriteria.push({
                            masterId: activeItem.Master.MASTER_ID,
                            criteria: activeItem.Criteria
                        });
                    }
                }
            }
        });
        builder.addCase(setActiveFilter.rejected, (state, { payload }) => {
            state.loading = false;
        });
    },
})

export const { clearModuleState } = moduleMenuslice.actions;
export const { clearMasterState } = masterMenuSlice.actions;
export const { clearMasterSubState } = masterMenuSubSlice.actions;
export const { clearMasterDetailsState } = masterMenuDetailsSlice.actions;
export const { clearActiveDetailsState } = activeMasterDetailsSlice.actions;
export const { clearFilterState } = activeFilterSlice.actions;
export const { clearMasterListState } = masterListMenuListSlice.actions;
export const { updateMasterData } = masterListMenuListSlice.actions;
export const { resetTemporaryMenu } = masterListMenuListSlice.actions;

const menuReducer = combineReducers({
    moduleMenus: moduleMenuslice.reducer,
    masterMenu: masterMenuSlice.reducer,
    masterMenuSub: masterMenuSubSlice.reducer,
    masterDetails: masterMenuDetailsSlice.reducer,
    activeDetails: activeMasterDetailsSlice.reducer,
    filterCriteria: activeFilterSlice.reducer,
    masterLists: masterListMenuListSlice.reducer,
});

export default menuReducer;