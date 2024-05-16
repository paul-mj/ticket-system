
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import "./fullview.scss";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import { MenuId, UserType } from "../../../common/database/enums";
import { isObjectEmpty } from "../../../core/services/utility/utils";
import { popupComponent } from "../pageviewer/popup-component";
import PageViewer from "../pageviewer/pageviewer";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import { CultureId } from "../../../common/application/i18n";
import { useTheme } from '@mui/material/styles';
import { DxGridFilter } from "./dx-grid-filter";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AppConfigs from "../../../config/app.configs";
import CommonUtils from "../../../common/utils/common.utils";
import TextIconAnimButton from "../Buttons/TextIconButtons/Curved/TextIconAnim";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { useTranslation } from "react-i18next";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import GridLayoutOptionsMenu from "../common/GridLayoutOptionsMenu";
import { useConfirm } from "../dialogs/confirmation";

type Anchor = "left" | "right";

const FullviewToolbar: React.FC<any> = ({ searchText, setSearchText, onExport, onColumnChoose, resetGrid, saveLayout, deleteLayout, gridOptions, updatedOptions }) => {
    const [search, setSearch] = useState('');
    const { CultureId, userType } = CommonUtils.userInfo;
    const icon1 = "AddCircleOutlineOutlined";
    const icon2 = "FilterAltOutlined";
    const { t } = useTranslation();
    const confirm = useConfirm();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const [isNewMenu, setIsNewMenu] = useState<boolean>(false);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
    const [newActionMenu, setNewActionMenu] = useState<any>({});
    const [masterDetails, setMasterDetails] = useState<any>({});
    const [criteriaDetails, setCriteriaDetails] = useState<any>({});
    const [isFullViewFilter, setisFullViewFilter] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    //const [masterIDComp, setMasterIDComp]= useState<any>();
    const [popupConfiguration, setPopupConfiguration] =
        React.useState<any>(null);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const theme = useTheme();

    const handleOpenDrawer = () => {
        setIsOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
    };

    useEffect(() => {
        setSearch(searchText ?? '')
    }, [searchText])
    useEffect(() => {
        setSearchText(search)
    }, [search, setSearchText])
    useEffect(() => {
        if (activeDetails?.length) {
            setMasterDetails(activeDetails[0].Master);
            setCriteriaDetails(activeDetails[0].Criteria);
            if (activeDetails[0].Menus?.length) {
                const isNewMenu = activeDetails[0].Menus.some(
                    (item: any) => item.MenuId === MenuId.New
                );
                setNewActionMenu(
                    activeDetails[0].Menus.find(
                        (item: any) => item.MenuId === MenuId.New
                    )
                );
                /* let isincluded = true;
                if (userType === UserType.ITC) {
                    isincluded = AppConfigs.newButtonDisabledMastersITC.includes(activeDetails[0].Master.MASTER_ID)
                } else if (userType === UserType.Franchise) {
                    isincluded = AppConfigs.newButtonDisabledMastersFranchise.includes(activeDetails[0].Master.MASTER_ID)
                }
                setIsNewMenu(isNewMenu && !isincluded); */
                setIsNewMenu(isNewMenu);
            }
            const isFilter = activeDetails[0].Criteria?.length && activeDetails[0].Criteria?.some((criteria: any, index: number) => criteria.ShowInEditor === 1);
            setisFullViewFilter(isFilter);
            setSearch('');
        }
    }, [activeDetails, userType]);

    const handleClickCreateNew = () => {
        const popupConfig = popupComponent(masterDetails, newActionMenu);
        console.log(activeDetails[0]?.Master.MASTER_ID + "Master Id :")
        console.log(newActionMenu)
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration(popupConfig);
        }
    };

    const closeDialog = async () => {
        setOpen(false);
    };


    const fullViewContext = {
        rowData: null,
        activeAction: newActionMenu,
    }
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleStateClick = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event, 'event')
        setAnchorEl(event.currentTarget);
    };
    const handleStateClose = () => {
        setAnchorEl(null);
    };
    const saveLayoutClickHandler = async () => {
        const dialogRef: any = await confirm({
            ui: "confirmation",
            title: `${t("Save Layout")}`,
            description: `${t("Are you sure you want to save this layout?")}`,
            confirmBtnLabel: `${t("Yes")}`,
            cancelBtnLabel: `${t("No")}`,
        });

        if (dialogRef) {
            handleStateClose();
            saveLayout();
        }
    }
    const removeLayoutClickHandler = async () => {
        const dialogRef: any = await confirm({
            ui: "delete",
            title: `${t("Remove Layout")}`,
            description: `${t("Are you sure you want to remove this layout?")}`,
            confirmBtnLabel: `${t("Yes")}`,
            cancelBtnLabel: `${t("No")}`,
        });
        if (dialogRef) {
            handleStateClose();
            deleteLayout();
        }
    }
    const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
        setOptionsAnchorEl(event.currentTarget);
    };
    const handleOptionsClose = () => {
        setOptionsAnchorEl(null);
    }

    return (
        <>
            <Row className="toolbar align-items-center">
                <Col md={4}>
                    {!isObjectEmpty(masterDetails) && (
                        <h5 className="page-name m-0">
                            {/* <span className="title-icon">
                        <MuiIconsComponent iconName={masterDetails.WEB_ICON} />
                    </span> */}
                            {/* <img className="master-icon" src={menuicons[masterDetails.WEB_ICON]} alt={masterDetails.icon} /> */}
                            <span className="mx-0">{masterDetails.MASTER_NAME}</span>
                        </h5>
                    )}
                </Col>
                <Col md={8} className="search-export-section">
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        <div className="grid-search">
                            <input
                                type="text"
                                id="grid-search"
                                name="gridsearch"
                                placeholder={t("Search") ?? 'Search'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <SearchOutlinedIcon fontSize="inherit" />
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <IconButton aria-label="favorite" size="large" className="layout-menu-btn" onClick={handleOptionsClick} title="Settings">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton aria-label="favorite" size="large" className="layout-menu-btn" onClick={handleStateClick} title="Layout Chooser">
                                <BackupTableIcon />
                            </IconButton>
                            {/* <IconButton aria-label="favorite" size="large" className="layout-menu-btn" onClick={onColumnChoose} title="Column Chooser">
                                <ViewWeekOutlinedIcon />
                            </IconButton> */}
                        </div>
                        <div className="add-button-outer d-flex">
                            {/* <div className="frm-toolbar-icons">
                                <TextIconAnimButton icon={FileDownloadOutlinedIcon} text={`${t("Export")}`} onClick={onExport} fontSize="9px" />
                            </div> */}
                            <IconButton aria-label="favorite" size="large" className="layout-menu-btn" title={`${t("Export")}`} onClick={onExport}>
                                <FileDownloadOutlinedIcon />
                            </IconButton>
                            {/* <IconButton aria-label="favorite" size="large" className="add-new-btn" title={`${t("Export")}`} onClick={onExport}>
                                <FileDownloadOutlinedIcon />
                            </IconButton> */}
                            <IconButton
                                aria-label="Refresh Grid"
                                size="large"
                                className="px-1 reset-grid"
                                title={`${t('Refresh Grid')}`}
                                onClick={resetGrid}
                            >
                                <RotateLeftIcon />
                            </IconButton>
                        </div>
                        {isNewMenu && (
                            <div className="add-button-outer"> 
                                <div className="">
                                    <div className="frm-toolbar-icons">
                                        <TextIconAnimButton icon={AddOutlinedIcon} text={`${t("Add New")}`} onClick={handleClickCreateNew} fontSize="9px" />
                                    </div>
                                    {/* <button className="icon-button">
                                        <AddOutlinedIcon />
                                        <span className="button-text">Add New</span>
                                    </button> */}
                                    <IconButton
                                        aria-label="Refresh Grid"
                                        size="large"
                                        className="add-new-hide add-grid"
                                        onClick={handleClickCreateNew}
                                    >
                                        <AddOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                        )}


                        {isFullViewFilter && (
                            <div className="add-button-outer">
                                <div className="frm-toolbar-icons">
                                    <TextIconAnimButton icon={FilterAltOutlinedIcon} text={`${t("Filter")}`} onClick={handleOpenDrawer} fontSize="9px" />
                                </div>
                                <IconButton aria-label="favorite" size="large" className="add-new-btn add-grid" title={`${t("Filter")}`} onClick={handleOpenDrawer}>
                                    <FilterAltOutlinedIcon />
                                </IconButton>
                            </div>
                        )}
                    </Stack>
                </Col>
            </Row>

            <Menu
                anchorEl={anchorEl}
                id="layout-menu"
                open={!!anchorEl}
                onClose={handleStateClose}
                onClick={handleStateClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={saveLayoutClickHandler}>
                    <SaveIcon /><span className="ms-1">{t("Save Layout")}</span>
                </MenuItem>
                <MenuItem onClick={removeLayoutClickHandler}>
                    <DeleteIcon /><span className="ms-1">{t("Delete Layout")}</span>
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={optionsAnchorEl}
                id="settings-menu"
                open={!!optionsAnchorEl}
                onClose={handleOptionsClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div className="grid-layout-menu">
                    <GridLayoutOptionsMenu options={gridOptions} onUpdate={updatedOptions} />
                </div>
            </Menu>
            <Drawer
                anchor={CultureId === 0 ? "right" : 'left'}
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
                <DxGridFilter handleCloseFilter={handleCloseDrawer} CriteriaDetails={criteriaDetails} ActiveDetails={activeDetails} />
            </Drawer> 
            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupConfiguration && (
                    <PageViewer
                        open={open}
                        onClose={closeDialog}
                        popupConfiguration={popupConfiguration}
                    />
                )}
            </fullViewRowDataContext.Provider>
        </>
    );
};

export default FullviewToolbar;
