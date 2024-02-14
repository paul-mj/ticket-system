import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MuiIconsComponent from "../Mui-Icons/muiicons";
import { useSelector } from "react-redux";
import { isObjectEmpty } from "../../../core/services/utility/utils";
import { popupComponent } from "../pageviewer/popup-component";
import PageViewer from "../pageviewer/pageviewer";
import { fullViewRowDataContext } from '../../../common/providers/viewProvider'
import { MasterId, MenuId } from "../../../common/database/enums";
import { toast } from "react-toastify";
import { A } from "@fullcalendar/core/internal-common";
import { deleteObject } from "../../../common/api/masters.api";
import localStore from "../../../common/browserstore/localstore";
import { useConfirm } from "../dialogs/confirmation";
import { useTranslation } from "react-i18next";


const DxGridActions: React.FC<any> = (props) => {
    const confirm = useConfirm(); 
    const { t, i18n } = useTranslation();
    const [popupConfiguration, setPopupConfiguration] = React.useState<any>(null);
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const [open, setOpen] = React.useState(false);
    const closeDialog = async () => {
        setOpen(false);
    };
    const [rowDataValue, setrowDataValue] = useState<any>();
    const [currentAction, setCurrentAction] = useState<any>(null);

    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    /* Single Action Buttons */
    const SingleActionButton = () => {

        const handleClickAction = (action: object) => {
            console.log(action);
            setCurrentAction(action);
            actionButtonClick(action);
        };

        return (
            <>
                {props.actionButtons.map((action: any, index: number) => (
                    <div className="d-flex align-items-center justify-content-center" key={index}>
                        <IconButton
                            key={index}
                            aria-label="delete"
                            size="large"
                            className="menu-icon-button"
                            onClick={() => handleClickAction(action)}
                        >
                            <MuiIconsComponent iconName={action.MenuIcon} />
                        </IconButton>
                    </div>
                ))}
            </>
        );
    };

    /* Multiple Action Buttons */
    const MultiActionButton = () => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
            null
        );
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClickAction = (action: object) => {
            setCurrentAction(action);
            setAnchorEl(null);
            actionButtonClick(action);
        };

        return (
            <>
                <div className="d-flex align-items-center justify-content-center">
                    <IconButton
                        aria-label="more"
                        id="grid-action-more"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </div>


                <Menu
                    id="grid-action-more-menu"
                    MenuListProps={{ "aria-labelledby": "long-button" }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClickAction}
                >
                    {props.actionButtons.map((action: any) => (
                        <MenuItem key={action.MenuId} onClick={() => handleClickAction(action)}>
                            <ListItemIcon>
                                <MuiIconsComponent iconName={action.MenuIcon} />
                            </ListItemIcon>
                            <ListItemText className="act-item-text">
                                {action.MenuName}
                            </ListItemText>
                        </MenuItem>
                    ))}
                </Menu>
            </>
        );
    };


    /* Action Click Controller */
    const actionButtonClick = async (actionMenu: any) => { 
        switch (actionMenu.MenuId) {
            case MenuId.Edit:
                EditGridRow(actionMenu);
                break;
            case MenuId.Delete:
                DeleteGridRow(actionMenu);
                break;
            case MenuId.View:
                pageviewerDialog(actionMenu);
                break;
            case MenuId.ToggleActiveStatus:
                pageviewerDialog(actionMenu);
                break;
            case MenuId.ResetPassword:
                if (props.rowData && props.rowData?.ALLOW_PASSWORD_RESET_ === 0) {
                    showDialogError(actionMenu);
                    return;
                } else {
                    pageviewerDialog(actionMenu);
                }
                break;
            case MenuId.ChangeStatus:
            case MenuId.CloseTransaction:
            case MenuId.Unpublish: 
                if ((actionMenu?.MenuId === MenuId.Unpublish) && (props.rowData && props.rowData?.ALLOW_UNPUBLISH_ === 0)) {
                    showDialogError(actionMenu);
                    return;
                }
                if ((actionMenu?.MenuId === MenuId.CloseTransaction) && (props.rowData && props.rowData?.ALLOW_CLOSE_TRANS_ === 0)) {
                    showDialogError(actionMenu);
                    return;
                }
                pageviewerDialog(actionMenu);
                break;
        }
    }


    const showDialogError = async (actionMenu: any) => {
        let Message = `Current action not allowed at this stage`;
        /* switch (actionMenu?.MenuId) {
            case MenuId.Edit:
                Message = 'Edit is not allowed in this transaction';
                break;
            case MenuId.CloseTransaction:
                Message = 'Current Action not allowed at this stage';
                break;
            case MenuId.UnpublishModification:
                Message = 'Close Transaction is not allowed in this transaction';
                break;
        } */

        await confirm({
            complete: true,
            ui: 'warning',
            title: `${t('Warning')}`,
            description: Message,
            confirmBtnLabel: `${t('Close')}`,
        });
    };


    const EditGridRow = async (actionMenu: any) => {
        if (props.rowData?.IS_EDITABLE_ === 0) {
            await confirm({
                complete: true,
                ui: 'warning',
                title: `${t('Warning')}`,
                description: `${t("Edit is not allowed in this stage")}`,
                confirmBtnLabel: `${t('Close')}`,
            });
        } else {
            /* const popupConfig = popupComponent(activeDetails[0].Master, actionMenu);
            setrowDataValue(props.rowData)
            if (!isObjectEmpty(popupConfig)) {
                setOpen(true);
                setPopupConfiguration(popupConfig);
            } */
            pageviewerDialog(actionMenu);
        }
    }

    /* const ToggleStatus = async (actionMenu: any) => { 
        const popupConfig = popupComponent(activeDetails[0].Master, actionMenu, props.rowData);
        setrowDataValue(props.rowData)
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration(popupConfig);
        }
    }

    const ViewGridRow = async (actionMenu: any) => { 
        const popupConfig = popupComponent(activeDetails[0].Master, actionMenu, props.rowData);
        setrowDataValue(props.rowData)
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration(popupConfig);
        }
    } */

    const pageviewerDialog = (actionMenu: any) => {
        const popupConfig = popupComponent(activeDetails[0].Master, actionMenu, props.rowData);
        setrowDataValue(props.rowData)
        if (!isObjectEmpty(popupConfig)) {
            setOpen(true);
            setPopupConfiguration(popupConfig);
        }
    }



    const DeleteGridRow = async (actionMenu: any) => {
        const Param = { 
            MasterId: activeDetails[0].Master.MASTER_ID,
            ObjectId: props.rowData.ID_,
            UserId: userID
        }
        const response = await deleteObject(Param);
        if (response?.Id > 0) {
            toast.success(`${t("Deleted Sucessfully")}`)
        }
        else {
            toast.error(response?.Message)
        }
    }

    const fullViewContext = {
        rowData: rowDataValue,
        activeAction: currentAction,
    }
    /* data */
    // console.log(fullViewContext, 'full view data');

    return (
        <>
            {props.actionButtons && props.actionButtons?.length > 1 ? (
                <MultiActionButton />
            ) : (
                <SingleActionButton />
            )}
            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupConfiguration && <PageViewer open={open} onClose={closeDialog} popupConfiguration={popupConfiguration} />}
            </fullViewRowDataContext.Provider>
        </>
    );
};

export default DxGridActions;
