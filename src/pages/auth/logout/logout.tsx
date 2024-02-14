import { useDispatch } from "react-redux";
import localStore from "../../../common/browserstore/localstore";
import ApiService from "../../../core/services/axios/api"; 
import { clearActiveDetailsState, clearFilterState, clearMasterDetailsState, clearMasterSubState, clearModuleState } from "../../../redux/reducers/sidebar.reducer";
import { useNavigate } from "react-router-dom";

export const FrmLogout = async (confirm: any) => { // pass confirm as a prop
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function clearStore () {
        dispatch(clearModuleState());
        dispatch(clearModuleState());
        dispatch(clearMasterSubState());
        dispatch(clearMasterDetailsState());
        dispatch(clearActiveDetailsState());
        dispatch(clearFilterState());
    }  
 
    try {
        const accessToken = localStore.getToken();
        const paramData = {
            Token: accessToken,
            AppId: 2,
        };
       
       
        const response = await ApiService.httpPost('user/logout', paramData);
        if (response.Id > 0) {
            localStore.clearAll(); 
            navigate('/auth/itclogin');
        }
        clearStore();
    } catch (error) {
        console.error(error);
    }
};