import React, { useEffect, useState } from "react";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { CultureId } from "../../common/application/i18n";
import localStore from "../../common/browserstore/localstore";
import ApiService from "../../core/services/axios/api";
import { popupComponent } from "../../shared/components/pageviewer/popup-component";
import { isObjectEmpty } from "../../core/services/utility/utils";
import { API } from "../../common/application/api.config";
import { MenuId } from "../../common/database/enums";
import PageViewer from "../../shared/components/pageviewer/pageviewer";
import { fullViewRowDataContext } from "../../common/providers/viewProvider";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

/* Sidebar Add New Button */
export const AppSidebarAddNew: React.FC<any> = ({ toggleItem }) => {
    const langId = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [menuList, setMenuList] = useState<any>(null);
    const [openPageViewer, setOpenPageViewer] = React.useState(false);
    const [popupConfiguration, setPopupConfiguration] = React.useState<any>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t, i18n } = useTranslation();
    const onClickComposeButton = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (menu?: string) => {
        setAnchorEl(null);
        getMasterDetailsFromApi(menu)
        console.log(menu && menu);
    };

    useEffect(() => {
        getComposeMenuList();
    }, []);

    const getComposeMenuList = async () => {
        const param = {
            Procedure: "FRM_TRANS.MY_NEW_TRANS_MASTERS_SPR",
            UserId: userID,
            CultureId: langId,
            Criteria: []
        }
        try {
            const response = await ApiService.httpPost('data/getTable', param);
            if (response?.Valid > 0) {
                setMenuList(response.Data)
            }

        } catch (error) {
            console.error(error);
        }
    }

    const getMasterDetailsFromApi = async (menu: any) => {
        const param = {
            UserId: userID,
            MasterId: menu.MASTER_ID,
            CultureId: langId,
        };
        const response = await ApiService.httpPost(API.getMasterDetail, param);
        if (response?.Valid > 0) {
            const popupConfig = popupComponent(response?.Master, { MenuId: MenuId.New, MenuName: "New" });
            if (!isObjectEmpty(popupConfig)) {
                setOpenPageViewer(true);
                setPopupConfiguration(popupConfig);
            }
        }
    };

    const closeDialog = async () => {
        setOpenPageViewer(false);
    };

    const fullViewContext = {
        rowData: null,
        activeAction: { MenuId: MenuId.New, MenuName: "New" },
    }

    return (
        <>
            {menuList && menuList.length > 0 ?
                <Row className="no-gutters align-items-center justify-content-center compose h-100">
                    <Col md={12} className="text-center">
                        {toggleItem ? (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AddIcon />}
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={onClickComposeButton}
                                className="compose-btn"
                            >
                                {t("Compose")}
                            </Button>
                        ) : (
                            <div className="button-outer">
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    aria-controls={open ? "basic-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={onClickComposeButton}
                                    className="compose-ico-btn"
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        )}
                    </Col>
                    <Menu
                        className="compose-drop-menu"
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => handleClose()}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        {menuList.map((item: any, index: number) => (
                            <MenuItem onClick={() => handleClose(item)} key={index}>
                                {item?.MASTERS}
                            </MenuItem>
                        ))}

                    </Menu>
                </Row>
                : ''}




            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupConfiguration && (
                    <PageViewer
                        open={openPageViewer}
                        onClose={closeDialog}
                        popupConfiguration={popupConfiguration}
                    />
                )}
            </fullViewRowDataContext.Provider>
        </>
    );
};
