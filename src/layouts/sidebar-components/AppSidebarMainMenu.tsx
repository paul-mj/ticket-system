import React, { useEffect, useState } from "react";
import {
    Fade,
    Menu,
    Popover,
} from "@mui/material";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getMasterDetails,
    getMasterMenuSubList,
    setActiveFilter,
    setActiveMasterDetails,
} from "../../redux/reducers/sidebar.reducer";
import { MasterDetailsParams } from "../../redux/types/sidebar-types";
import { decrypt, encrypt, RedirectUrl } from "../menu-utils";
import ListMenu from "./menu-view/ListSidebar";
import SubMenuList from "./menu-view/SubMenu";
import {
    popupComponentMenu,
} from "../../shared/components/pageviewer/popup-component";
import { isObjectEmpty } from "../../core/services/utility/utils";
import PageViewer from "../../shared/components/pageviewer/pageviewer";
import { CultureId } from "../../common/application/i18n";
import localStore from "../../common/browserstore/localstore";
import { IconMenu } from "./menu-view/IconSidebar";

/* Sidebar Main Menu */
export const AppSidebarMainMenu: React.FC<any> = ({
    toggleItem,
    menuList, 
    loading
}) => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [activeMasterMenu, setActiveMasterMenu] = useState(null);
    const [isFetchingMastersSub, setIsFetchingMastersSub] = useState(false);

    const { masterMenusSub } = useSelector(
        (state: any) => state.menus.masterMenuSub
    );
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;

    const location = useLocation();
    const { masterDetails } = useSelector(
        (state: any) => state.menus.masterDetails
    );
    const navigate = useNavigate();
    const [currentMenu, setcurrentMenu] = useState<any>(null);
    const [urlQuery, setUrlQuery] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [popupConfiguration, setPopupConfiguration] = useState<any>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const [currentAction, setCurrentAction] = useState<any>(null);

    const openPopOver = Boolean(anchorEl);

    /* Get Mastre Details From API with Initial load and Menu Click */
    const getMasterDetailsFromApi = (menu: any) => {
        const param: MasterDetailsParams = {
            UserId: userID,
            MasterId: menu.MenuId,
            CultureId: lang,
        };
        setcurrentMenu(menu);
        const isExistDetails =
            masterDetails &&
            masterDetails.some((item: any) => item.Master.MASTER_ID === menu.MenuId);
        if (!isExistDetails) {
            dispatch(getMasterDetails(param));
        }
    };

    /* Get Master Details From Store While Initial load and Store Value change */
    useEffect(() => {
        if (masterDetails?.length) {
            getMasterDetailsFromStore();
        }
    }, [masterDetails, currentMenu]);

    const getMasterDetailsFromStore = () => {
        const activeDetails =
            currentMenu && masterDetails.filter(
                (details: any) => details?.Master?.MASTER_ID === currentMenu?.MenuId
            );
        if (activeDetails?.length) {
            dispatch(setActiveMasterDetails(activeDetails)); //Set Active Menu Details,
            dispatch(setActiveFilter({ activeItem: activeDetails, isCheck: false })); // Set Active Filter
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams) {
            const queryParamValue = queryParams.get("query");
            const query = queryParamValue && JSON.parse(decrypt(queryParamValue));
            setUrlQuery(query);
            if (menuList) {
                query ? ActiveMenu(query) : ActiveMenu();
            }
        }
    }, [location.search]);

    /* Active Master menu */
    const ActiveMenu = (query?: any) => {
        if (query?.MenuId) {
            getMasterDetailsFromApi(query);
            setActiveMasterMenu(query?.MenuId);
        } else {
            setActiveMasterMenu(null);
        }
    };

    /* Read Master Submenu For the Popover Box */
    const ReadMasterMenus = (master: any, menu: any) => {
        const param: MasterDetailsParams = {
            UserId: userID,
            MasterId: menu.MenuId,
            CultureId: lang,
        };
        if (activeMasterMenu) {
            if (masterMenusSub.menuId !== menu.MenuId) {
                dispatch(getMasterMenuSubList(param));
            }
        } else {
            dispatch(getMasterMenuSubList(param));
        }
    };


     
    const onClickMenu = (
        master: any,
        menu: any,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setActiveMasterMenu(menu.MenuId);
        const params = JSON.stringify({
            MenuId: menu.MenuId,
            MasterId: menu.MenuId,
            title: menu.title,
            CriteriaMode: menu.CriteriaMode,
            ModuleId: menu.ModuleId,
            to: menu.to,
        });
        
        switch (menu.CriteriaMode) {
            case 0:
                return;
            case 3:
            case 12:
                navigate(`${RedirectUrl(menu)}?query=${encrypt(params)}`);
                return;
            case 8:
                /* Popup */
                onClickSubMenu(menu);
                return;
            case 2:
                /* New Side Menu */
                ReadMasterMenus(master, menu);
                setAnchorEl(event.currentTarget);
                return;
            default:
                return;
        }
    };

    /* Sub Child Close ans Active Set to correspondant Fullview */
    const closeSubmenuAndActiveSwitch = () => {
        urlQuery && ActiveMenu(urlQuery);
        setAnchorEl(null);
    };

    /* On Click Crieteria Mode 2, Sub Menu Item */
    const onClickSubMenu = (menu: any) => {
        setCurrentAction(menu);
        const popupConfig = popupComponentMenu(menu);
        if (!isObjectEmpty(popupConfig)) {
            setAnchorEl(null);
            setIsDialogOpen(true);
            setPopupConfiguration(popupConfig);
        }
    };

    const closeDialog = async () => {
        setIsDialogOpen(false);
    };
 
 
    return (
        <>
            {/* {lengthMenuList} */}
            {/* {lengthMenuList.length} */}
            <Row className="no-gutters">
                {/* <Col md={12} className={`${!toggleItem ? "px-0 " : ""}`}> */}



                <Col md={12} className="px-0">
                    <ul className="position-relative">
                         
                        {menuList.map((menu: any) => (
                            <div className="test" key={menu.MenuId}>
                                <h4 className="menu-main-title mt-3 mb-3 text-center">
                                    {menu.title}
                                </h4>
                                {menu.items.map((child: any, index: number) => (
                                    <div key={child.MenuId} className={`side-menu-item ${activeMasterMenu === child.MenuId ? "bg-color-active" : ""}`} >
                                        <li className={`position-relative expand ${!toggleItem ? "text-center collapsed d-flex justify-content-center" : ""}${activeMasterMenu === child.MenuId ? " active__module" : ""}`} >
                                            {toggleItem ? (
                                                <>
                                                    <ListMenu
                                                        menu={menu} 
                                                        child={child}
                                                        onClickMenu={onClickMenu}
                                                    />
                                                    <Menu
                                                        id="basic-menu"
                                                        anchorEl={anchorEl}
                                                        open={openPopOver}
                                                        onClose={closeSubmenuAndActiveSwitch}
                                                        MenuListProps={{
                                                            "aria-labelledby": "basic-button",
                                                        }}
                                                        TransitionComponent={Fade}
                                                    >
                                                        <SubMenuList
                                                            masterMenusSub={masterMenusSub}
                                                            onClickSubMenu={onClickSubMenu}
                                                        />
                                                    </Menu>
                                                </>
                                            ) : (
                                                <>
                                                    <IconMenu 
                                                        menu={menu}
                                                        child={child}
                                                        onClickMenu={onClickMenu}
                                                    />
                                                    <Popover
                                                        className="frm-menu-popover"
                                                        id="simple-popover"
                                                        open={openPopOver}
                                                        anchorEl={anchorEl}
                                                        onClose={closeSubmenuAndActiveSwitch}
                                                        anchorOrigin={{
                                                            vertical: "center",
                                                            horizontal: "right",
                                                        }}
                                                        transformOrigin={{
                                                            vertical: "center",
                                                            horizontal: "left",
                                                        }}
                                                    >
                                                        <SubMenuList
                                                            masterMenusSub={masterMenusSub}
                                                            onClickSubMenu={onClickSubMenu}
                                                        />
                                                    </Popover>
                                                </>
                                            )}
                                        </li>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </ul> 
                </Col>
            </Row>
            {popupConfiguration && (
                <PageViewer
                    open={isDialogOpen}
                    onClose={closeDialog}
                    popupConfiguration={popupConfiguration}
                />
            )}
        </>
    );
};
