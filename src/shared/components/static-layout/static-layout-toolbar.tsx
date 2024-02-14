import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CultureId } from "../../../common/application/i18n";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { MenuId, UserType } from "../../../common/database/enums";
import AppConfigs from "../../../config/app.configs";
import CommonUtils from "../../../common/utils/common.utils";
import { isObjectEmpty } from "../../../core/services/utility/utils";

import './static-layout.scss'
import { Drawer, IconButton, Stack } from "@mui/material";
import TextIconAnimButton from "../Buttons/TextIconButtons/Curved/TextIconAnim";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { popupComponent } from "../pageviewer/popup-component";
import React from "react";
import PageViewer from "../pageviewer/pageviewer";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { DxGridFilter } from "../fullview/dx-grid-filter";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { updateConfig } from "../../../redux/reducers/common.reducer";
import { useDispatch } from "react-redux";




const StaticLayoutToolbar = () => {
    const { UserId, userType } = CommonUtils.userInfo;
    const lang = CultureId()
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const filterCriteria = useSelector(
        (state: any) => state.menus.filterCriteria?.filterCriteria
    );
    const [isNewMenu, setIsNewMenu] = useState<boolean>(false);
    const [newActionMenu, setNewActionMenu] = useState<any>({});
    const [masterDetails, setMasterDetails] = useState<any>({});
    const [criteriaDetails, setCriteriaDetails] = useState<any>({});
    const [isFullViewFilter, setisFullViewFilter] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    //const [masterIDComp, setMasterIDComp]= useState<any>();
    const [popupConfiguration, setPopupConfiguration] =
        React.useState<any>(null);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    useEffect(() => {
        if (activeDetails?.length) {
            setMasterDetails(activeDetails[0].Master);
            setCriteriaDetails(activeDetails[0].Criteria);
            if (activeDetails[0].Menus?.length) {
                const isNewMenu = activeDetails[0].Menus.some((item: any) => item.MenuId === MenuId.New); 
                setNewActionMenu(activeDetails[0].Menus.find((item: any) => item.MenuId === MenuId.New));
                let isincluded = true;
                if (userType === UserType.ITC) {
                    isincluded = AppConfigs.newButtonDisabledMastersITC.includes(activeDetails[0].Master.MASTER_ID)
                } else if (userType === UserType.Franchise) {
                    isincluded = AppConfigs.newButtonDisabledMastersFranchise.includes(activeDetails[0].Master.MASTER_ID)
                }
                setIsNewMenu(isNewMenu && !isincluded);
            }
            const isFilter = activeDetails[0].Criteria?.length && activeDetails[0].Criteria?.some((criteria: any, index: number) => criteria.ShowInEditor === 1);
            setisFullViewFilter(isFilter);
        }
    }, [activeDetails, userType]);

    const handleOpenDrawer = () => {
        setIsOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
    };

    const handleClickCreateNew = () => {
        const popupConfig = popupComponent(masterDetails, newActionMenu);
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration(popupConfig);
        }
    };

    const resetGrid = () => {
        dispatch(updateConfig({ action: 'reloadGalleryData', payload: { reloadGalleryData: true } }))
    }

    const closeDialog = async () => {
        setOpen(false);
    };

    return (
        <>
            <Row className="toolbar align-items-center">
                <Col md={6}>
                    {!isObjectEmpty(masterDetails) && (
                        <h5 className="page-name m-0">

                            <span className="mx-0">{masterDetails.MASTER_NAME}</span>
                        </h5>
                    )}
                </Col>
                <Col md={6} className="search-export-section">
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        {isNewMenu && (
                            <div className="add-button-outer">
                                <div className="frm-toolbar-icons">
                                    <TextIconAnimButton icon={AddOutlinedIcon} text={t("Add New")} onClick={handleClickCreateNew} fontSize="9px" />
                                    {/* <button className="icon-button">
                                        <AddOutlinedIcon />
                                        <span className="button-text">Add New</span>
                                    </button> */}
                                </div>
                            </div>
                        )}
                        <IconButton
                            aria-label="Refresh Grid"
                            size="large"
                            className="px-1 reset-grid"
                            title={`${t('Refresh Grid')}`}
                            onClick={resetGrid}
                        >
                            <RotateLeftIcon />
                        </IconButton>
                        {isFullViewFilter && (
                            <div className="add-button-outer">
                                <div className="frm-toolbar-icons">
                                    <TextIconAnimButton icon={FilterAltOutlinedIcon} text={t("Filter")} onClick={handleOpenDrawer} fontSize="9px" />
                                </div>
                                <IconButton aria-label="favorite" size="large" className="add-new-btn" title={`${t("Favorites")}`} onClick={handleOpenDrawer}>
                                    <FilterAltOutlinedIcon />
                                </IconButton>
                            </div>
                        )}
                    </Stack>
                </Col>

            </Row>
            <Drawer
                anchor={lang === 0 ? "right" : 'left'}
                open={isOpenDrawer}
                className="filter-right-drawer"
                ModalProps={{
                    BackdropProps: {
                        onClick: (event: any) => {
                            event.stopPropagation();
                        },
                    },
                }}
                PaperProps={{
                    sx: {
                        width: 350,
                    },
                }}
            >
                {
                    isOpenDrawer &&
                    <DxGridFilter handleCloseFilter={handleCloseDrawer} CriteriaDetails={criteriaDetails} ActiveDetails={activeDetails} />
                }

            </Drawer>

            {popupConfiguration && (
                <PageViewer
                    open={open}
                    onClose={closeDialog}
                    popupConfiguration={popupConfiguration}
                />
            )}
        </>
    )
}

export default StaticLayoutToolbar;
 
