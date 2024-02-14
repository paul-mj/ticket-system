import { IconButton } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import MuiIconsComponent from "../../shared/components/Mui-Icons/muiicons";
import { useLocation } from "react-router-dom";
import { decrypt } from "../menu-utils";
import { menuicons } from "../../assets/images/menuicons/menuicons";
import { useDispatch, useSelector } from "react-redux";
import { updateConfig } from "../../redux/reducers/common.reducer";
import { ModuleId } from "../../common/database/enums";

type sidebarFooterProps = {
    toggleItem: boolean;
    moduleListResponse: any;
    moduleMenuClick: (value: any) => any;
};

/* Sidebar Footer */
export const AppSidebarFooter: React.FC<sidebarFooterProps> = (props) => {
    const location = useLocation();
    const { toggleItem, moduleListResponse, moduleMenuClick } = props;
    const [activeModuleItem, setActiveModuleItem] = useState(null);
    const { temporaryMenu } = useSelector((state: any) => state.menus.masterLists);


    const ActiveMenu = useCallback((query?: any) => {
        if (query?.ModuleId) {
            setActiveModuleItem(query?.ModuleId);
        } else { 
            setActiveModuleItem(moduleListResponse[0].id) 
            const defaultActiveModule = moduleListResponse?.length && moduleListResponse?.find((module: any) => module.id === ModuleId.Transactions);
            setActiveModuleItem(defaultActiveModule.id);
        }
    }, [moduleListResponse]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams) {
            const queryParamValue = queryParams.get("query");
            const query = queryParamValue && JSON.parse(decrypt(queryParamValue));
            if (moduleListResponse) {
                query ? ActiveMenu(query) : ActiveMenu();
            }
        }
    }, [ActiveMenu, location.search, moduleListResponse]);



    /* useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams) {
            const queryParamValue = queryParams.get("query");
            if (queryParamValue) {  
                const query = queryParamValue && JSON.parse(decrypt(queryParamValue)); 
                setActiveModuleItem(temporaryMenu || query?.ModuleId)
            }  
        }
    }, [location.search, temporaryMenu]); */


    const handleMenuItemClick = (item: any, key: any) => {
        moduleMenuClick(item);
        setActiveModuleItem(item.id);
    };

    return (
        <>
            <Row
                className={`frm_menu_foot no-gutters align-items-center justify-content-center h-100 ${!toggleItem ? "display-block collapsed py-2" : ""}`}
            >
                {moduleListResponse &&
                    moduleListResponse.map((item: any, index: number) => {
                        return (
                            <Col
                                md={!toggleItem ? 12 : 4}
                                key={item.id}
                                className={`${item.title} text-center py-1 position-relative ${activeModuleItem === item.id ? " active__modules" : ""}`}
                                title={item.title}
                            >
                                <IconButton
                                    aria-label="delete"
                                    size="large"
                                    className="footer-icon"
                                    onClick={() =>
                                        handleMenuItemClick(item, index)
                                    }
                                >
                                    <img className="foot-icon" src={menuicons[item.icon]} alt={item.icon} />
                                </IconButton>
                            </Col>
                        );
                    })}
            </Row>
        </>
    );
};
