import React, { useCallback, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
    getMasterMenuList,
    getModuleMenus,
    resetTemporaryOnClick,
} from "../redux/reducers/sidebar.reducer";
import { AppSidebarFooter } from "./sidebar-components/AppSidebarFooter";
import { AppSidebarAddNew } from "./sidebar-components/AppSidebarAddNew";
import { AppSidebarMainMenu } from "./sidebar-components/AppSidebarMainMenu";
import { AppSidebarLogo } from "./sidebar-components/AppSidebarLogo";
import "./layout.scss";
import { CultureId } from "../common/application/i18n";
import i18n from 'i18next';
import localStore from "../common/browserstore/localstore";
import { useLocation } from "react-router-dom";
import { decrypt } from "./menu-utils";
import { updateConfig } from "../redux/reducers/common.reducer";
import { ModuleId, sideBarMenu } from "../common/database/enums";
import CommonUtils from "../common/utils/common.utils";
type sidebarProps = {
    toggleStatusInput: boolean;
};
const AppSidebar: React.FC<sidebarProps> = ({ toggleStatusInput }) => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const location = useLocation();
    const { UserId, CultureId } = CommonUtils.userInfo;
    const { moduleMenus, loading } = useSelector((state: any) => state.menus.moduleMenus);
    const { List, temporaryMenu } = useSelector((state: any) => state.menus.masterLists);
    const [currentMasterList, SetCurrentMasterList] = useState<any>([]);

    /* Module Menu Click */
    const getMasterMenus = useCallback((module: any) => {
        if (module.id === sideBarMenu.Report) {
            dispatch(updateConfig({
                action: 'reportMenu', payload: {
                    reportActiveMenu: { clicked: true }
                }
            }))
        }
        if (List && List?.length) {
            const moduleList = List?.find((x: any) => x.id === module.id);
            if (moduleList) {
                SetCurrentMasterList(moduleList.menu);
            }  
        }
    }, [List, dispatch]);

    /* Load Master Menus */
    useEffect(() => {
        const masterMenuparam = {
            Id: UserId,
            CultureId
        };
        dispatch(getModuleMenus(masterMenuparam));
    }, [CultureId, UserId, dispatch]);

    /* Master Menu API Calling */
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams) {
            const queryParamValue = queryParams.get("query");
            if (queryParamValue) {   
                const query = queryParamValue && JSON.parse(decrypt(queryParamValue));  
                getMasterMenus({ id: temporaryMenu || query?.ModuleId });
            } else if (moduleMenus?.length) { 
                /* Default Active Transaction Menu */
                const defaultActiveMaster = moduleMenus?.length && moduleMenus?.find((module: any) => module.id === ModuleId.Transactions);
                getMasterMenus(defaultActiveMaster);
            }
        }
    }, [moduleMenus, getMasterMenus, location.search, temporaryMenu]);


    useEffect(() => {
        dispatch(resetTemporaryOnClick({}))
    }, [dispatch, location.search])

    return (
        <>
            {/* <div className="logo_header">
                <AppSidebarLogo toggleItem={toggleStatusInput} />
            </div> */}
            <div className={`menu_list ${moduleMenus?.length >= 3 ? 'max-icon-height' : 'min-icon-height'}`}>
                {currentMasterList && (
                    <AppSidebarMainMenu
                        toggleItem={toggleStatusInput}
                        menuList={currentMasterList}
                        loading={loading}
                    />
                )}
            </div>
            <div className="compose-wrapper">
               
                <div className={`compose postion-absolute ${moduleMenus?.length >= 3 ? 'icon-height' : ''}`}>
                    <AppSidebarAddNew toggleItem={toggleStatusInput} />
                </div> 
                <div className="footer_menu">
                    {moduleMenus && moduleMenus?.length > 0 && (
                        <AppSidebarFooter
                            toggleItem={toggleStatusInput}
                            moduleListResponse={moduleMenus}
                            moduleMenuClick={getMasterMenus}
                        />
                    )}
                </div>
            </div>
        </>
    );
};
export default AppSidebar;