import { useCallback, useEffect, useState } from "react";
import './ReportToolbar.scss';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CollectionsIcon from '@mui/icons-material/Collections';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import { Card, CardContent, Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import ReportFilter from "../ReportFilter";
import ReportUtils from "../../report.utils";
import GridLayoutOptionsMenu from "../../../common/GridLayoutOptionsMenu";
import CloseIcon from "@mui/icons-material/Close";
import ApiService from "../../../../../core/services/axios/api";
import CommonUtils from "../../../../../common/utils/common.utils";
import { toast } from "react-toastify";
import { useConfirm } from "../../../dialogs/confirmation";
import { useTranslation } from "react-i18next";
import { Anchor } from "react-bootstrap";

const ReportToolbar = ({
    saveLayout,
    saveAsLayout,
    currentLayoutDetails,
    onFilter,
    gridOptions,
    sessionData,
    updatedOptions,
    tempSelectedLayout,
    applyLayoutStyle,
    ReportType
}: any) => {
    const confirm = useConfirm();
    const { t, i18n } = useTranslation();
    const { CultureId, UserId } = CommonUtils.userInfo;
    const { currentPage: { Master: { MASTER_ID, MASTER_NAME } }, filterData } = sessionData;
    const [currentLayout, setCurrentLayout] = useState<any>(null);
    const [state, setState] = useState({
        show: false,
    });
    const [layoutMenu, setLayoutMenu] = useState({
        Layouts: [],
        Published: []
    });
    const [publishedAnchorEl, setPublishedAnchorEl] = useState<null | HTMLElement>(null);
    const [layoutAnchorEl, setLayoutAnchorEl] = useState<null | HTMLElement>(null);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
    const [formValues, setFormValues] = useState(null);
    const [anchor, setAnchor] = useState<'left' | 'right'>('right');

    const toggleDrawer = (open: boolean) => {
        setState({ show: open });
    };
    const confirmaRemoveLayout = async (e: any) => {
        const dialogRef: any = await confirm({
            ui: "delete",
            title: `${t("Remove Layout")}`,
            description: `${t("Are you sure you want to remove this layout?")}`,
            confirmBtnLabel: `${t("Yes")}`,
            cancelBtnLabel: `${t("No")}`,
        });
        if (dialogRef) {
            removeLayout();
        }
    }
    const confirmaSaveLayout = async (e: any) => {
        const dialogRef: any = await confirm({
            ui: "confirmation",
            title: `${t("Save Layout")}`,
            description: `${t("Are you sure you want to save this layout?")}`,
            confirmBtnLabel: `${t("Yes")}`,
            cancelBtnLabel: `${t("No")}`,
        });
        if (dialogRef) {
            saveLayout(e);
        }
    }
    const readLayout = useCallback(async (Id = -1) => {
        const payload = {
            Id,
            CultureId,
            UserId
        }
        const { Appearance, State } = await ApiService.httpPost('report/readLayout', payload);
        applyLayoutStyle({ Appearance, State });
    }, [CultureId, UserId, applyLayoutStyle])
    const readLayouts = useCallback(async (tempId?: number) => {
        const storeData = ReportUtils.getSessionData();
        const { currentPage: { Master: { MASTER_ID, MASTER_NAME } } } = storeData;
        const payload = {
            Id: -1,
            MenuId: -1,
            RptId: -1,
            ReportType,
            MasterId: MASTER_ID,
            UserId,
            CultureId,
        }
        const { Layouts: UserLayout = [], Published = [] } = await ApiService.httpPost('report/readLayouts', payload);
        const Layouts = (UserLayout ?? []).filter((lyt: any) => lyt.UserId === UserId);
        let layoutData;
        const baseLayout = Published.find((lyt: any) => lyt.IsBase);
        if (baseLayout) {
            baseLayout['Display'] = MASTER_NAME;
        }
        setLayoutMenu({ Layouts: Layouts ?? [], Published: Published ?? [] });
        if (Layouts?.length) {
            if (tempId) {
                layoutData = Layouts.find((item: any) => item.ReportId === tempId);
            } else {
                const defaultLayout = Layouts.find((lyt: any) => lyt.IsDefault);
                if (defaultLayout) {
                    layoutData = defaultLayout;
                } else {
                    layoutData = baseLayout;
                }
            }
        } else {
            layoutData = baseLayout;
        }


        if (layoutData) {
            setCurrentLayout(layoutData);
            readLayout(layoutData.ReportId)
        }
    }, [CultureId, ReportType, UserId, readLayout])

    const setAsDefault = useCallback(async () => {
        const payLoad = {
            Id: currentLayout?.ReportId,
            UserId,
            CultureId
        };
        const { Message, Id } = await ApiService.httpPost('report/setDefaultLayout', payLoad);
        if (Id < 0) {
            toast.error(Message);
        } else {
            readLayout(Id);
            toast.success(Message);
        }
    }, [CultureId, UserId, currentLayout?.ReportId, readLayout])
    const removeLayout = useCallback(async () => {
        const storeData = ReportUtils.getSessionData();
        const { currentPage: { Master: { MASTER_ID } } } = storeData;
        const param = {
            Id: currentLayout?.ReportId,
            MasterId: MASTER_ID,
            MenuId: -1,
            ReportType,
            RptId: -1,
            UserId,
            CultureId
        }
        const { Message, Id } = await ApiService.httpPost('report/removeLayout', param)
        if (Id < 0) {
            toast.error(Message);
        } else {
            readLayouts();
            toast.success(Message);
        }
    }, [CultureId, ReportType, UserId, currentLayout?.ReportId, readLayouts])
    const setFilterValue = (data: any) => {
        ReportUtils.setSessionData('data', 'filterData', data);
        onFilter(data);
        setFormValues(data);
        toggleDrawer(false)
    }

    const onLayoutClickHandler = (item: any) => {
        handleLayoutClose()
        readLayout(item.ReportId)
        setCurrentLayout(item);
    }
    const onPublishedLayoutClickHandler = (item: any) => {
        handlePublishedClose();
        readLayout(item.ReportId)
        setCurrentLayout(item);
    }

    const handlePublishedClick = (event: React.MouseEvent<HTMLElement>) => {
        setPublishedAnchorEl(event.currentTarget);
    };
    const handlePublishedClose = () => {
        setPublishedAnchorEl(null);
    }
    const handleLayoutClick = (event: React.MouseEvent<HTMLElement>) => {
        setLayoutAnchorEl(event.currentTarget);
    };
    const handleLayoutClose = () => {
        setLayoutAnchorEl(null);
    }
    const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
        setOptionsAnchorEl(event.currentTarget);
    };
    const handleOptionsClose = () => {
        setOptionsAnchorEl(null);
    }

    useEffect(() => {
        if (tempSelectedLayout || tempSelectedLayout === 0) {
            readLayouts(tempSelectedLayout)
        }
    }, [readLayouts, tempSelectedLayout])
    useEffect(() => {
        readLayouts()
    }, [readLayouts])
    useEffect(() => {
        currentLayoutDetails(currentLayout);
    }, [currentLayout, currentLayoutDetails])
    useEffect(() => {
        if (filterData) {
            setFormValues(filterData);
        }
    }, [filterData])
    useEffect(() => {
        console.log(CultureId,'CultureId')
        setAnchor(CultureId ? 'left' : 'right')
    }, [CultureId])
    useEffect(() => {
        console.log(anchor,'Anchor')
    }, [anchor])
    return (
        <>
            <Card className='flex-1' variant="outlined">
                <CardContent className="p-1">
                    <div className="grid-toolbar">
                        <ul className="grid-toolbar-menu">
                            <li>
                                <IconButton aria-label="save" size="large" className="header-fav" title={`${t("Save")}`} onClick={saveAsLayout}>
                                    <SaveAsIcon />
                                </IconButton>
                            </li>
                            {(currentLayout?.ReportId && currentLayout?.ReportId !== -1) && <>
                                <li>
                                    <IconButton aria-label="saveAs" size="large" className="header-fav" title={`${t("Save As")}`} onClick={confirmaSaveLayout}>
                                        <SaveIcon />
                                    </IconButton>
                                </li>
                                <li>
                                    <IconButton aria-label="Default" size="large" className="header-fav" title={`${t("Set as Default")}`} onClick={setAsDefault}>
                                        <LabelImportantIcon />
                                    </IconButton>
                                </li>
                                <li>
                                    <IconButton aria-label="remove" size="large" className="header-fav" title={`${t("Remove")}`} onClick={confirmaRemoveLayout}>
                                        <DeleteIcon />
                                    </IconButton>
                                </li>
                            </>}
                        </ul>
                        <div className="d-flex align-items-center">
                            <h4 className="mb-0">
                                {MASTER_NAME}
                            </h4>
                        </div>
                        <ul className="grid-toolbar-menu">
                            <li>
                                <IconButton aria-label="filter" size="large" className="header-fav" onClick={() => toggleDrawer(true)}>
                                    <FilterAltIcon />
                                </IconButton>
                            </li>
                            <li>
                                <IconButton aria-label="settings" size="large" className="header-fav" onClick={handleOptionsClick}>
                                    <SettingsIcon />
                                </IconButton>
                            </li>
                            {!!layoutMenu.Layouts.length && <li>
                                <IconButton aria-label="layouts" size="large" className="header-fav" onClick={handleLayoutClick}>
                                    <CollectionsIcon />
                                </IconButton>
                            </li>}
                            {!!layoutMenu.Published.length && <li>
                                <IconButton aria-label="publishedLayouts" size="large" className="header-fav" onClick={handlePublishedClick}>
                                    <CollectionsBookmarkIcon />
                                </IconButton>
                            </li>}
                        </ul>
                    </div>
                </CardContent>
            </Card>
            <Drawer
                className="filter-right-drawer"
                anchor={anchor}
                open={state.show}
                onClose={() => toggleDrawer(false)}
            >
                <div className="d-flex justify-content-between align-items-center w-100 p-2 filter-bg">
                    <h4 className="m-0">{t("Filter")}</h4>
                    <IconButton
                        aria-label="close"
                        className="head-close-bttn"
                        onClick={() => toggleDrawer(false)}
                        sx={{
                            position: "absolute",
                            right: 4,
                            top: 4,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="px-2 py-4 h-100">
                    <ReportFilter MasterId={MASTER_ID} onSubmitFilter={setFilterValue} cssClass='report-grid-filter' patchValues={formValues} />
                </div>
            </Drawer>
            <Menu
                anchorEl={optionsAnchorEl}
                id="account-menu"
                open={!!optionsAnchorEl}
                onClose={handleOptionsClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div className="grid-layout-menu">
                    <GridLayoutOptionsMenu options={gridOptions} onUpdate={updatedOptions} />
                </div>
            </Menu>
            <Menu
                anchorEl={publishedAnchorEl}
                id="account-menu"
                open={!!publishedAnchorEl}
                onClose={handlePublishedClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {layoutMenu.Published.map((item: any) => (
                    <MenuItem key={item.ReportId} onClick={() => { onPublishedLayoutClickHandler(item) }} selected={currentLayout?.ReportId === item.ReportId}>
                        <span className="ms-1">{item.Display}</span>
                    </MenuItem>)
                )}
            </Menu>
            <Menu
                anchorEl={layoutAnchorEl}
                id="account-menu"
                open={!!layoutAnchorEl}
                onClose={handleLayoutClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {layoutMenu.Layouts.map((item: any) => (
                    <MenuItem key={item.ReportId} onClick={() => { onLayoutClickHandler(item) }} selected={currentLayout?.ReportId === item.ReportId}>
                        <span className="ms-1">{item.Display}</span>
                    </MenuItem>)
                )}

            </Menu>
        </>
    )
}
export default ReportToolbar;