import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Typography } from "@mui/material";
import { FcLibrary } from "react-icons/fc";
import CloseIcon from "@mui/icons-material/Close";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useCallback, useEffect, useState } from "react";
import PrimaryButton from "../../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import { toast } from "react-toastify";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import CommonUtils from "../../../common/utils/common.utils";
import ApiService from "../../../core/services/axios/api";
import { useTranslation } from "react-i18next";


const SendReminderDialog = ({ open, operatorsList, TaskId, onClose }: any) => {
    const confirm = useConfirm();
    const { UserId, CultureId } = CommonUtils.userInfo;
    const [listoperators, setListoperators] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState({ checked: true, indeterminate: false })
    const [showNoData, setShowNoData] = useState(true);
    const { t } = useTranslation();

    const resetAll = useCallback(() => {
        selectAllHandler({target: { checked: false }});
        setListoperators(operatorsList);
    },[operatorsList])

    const onCloseHandler = useCallback((mode: any) => {
        onClose(mode);
        resetAll()
    }, [onClose, resetAll])
    const onSearchInput = (e: any) => {
        const { target: { value } } = e;
        setListoperators((prev: any[]) => {
            return prev.map((item: any) => {
                const isIncluded = !!value ? item.FRANCHISE_NAME.toUpperCase().includes(value.toUpperCase()) : true;
                return {
                    ...item,
                    notToShow: !isIncluded
                }
            })
        })
    }
    const selectAllHandler = (e: any) => {
        const { target: { checked: isClicked } } = e;
        setListoperators((prev: any) => {
            return prev.map((item: any) => {
                return {
                    ...item,
                    isClicked
                }
            })
        })

    }
    const filterSelectedItems = (userDet: any) => {
        setListoperators((Array: any) => Array.map((item: any) => item.FRANCHISE_NAME === userDet.FRANCHISE_NAME ? { ...item, isClicked: !item.isClicked } : item));
    }
    const buildSelectALLState = useCallback((operators: any[]) => {
        const isAnyoneSelected = operators.some((item: any) => item.isClicked);
        const isEverySelected = operators.every((item: any) => item.isClicked);
        const indeterminate = isEverySelected ? false : isAnyoneSelected;
        setSelectAll({ indeterminate, checked: (!!operators?.length && isEverySelected) })
    }, [])
    const sendReminder = useCallback(async () => {
        const userIds = listoperators.filter((user: any) => user.isClicked === true).map((user: any) => user.FRANCHISE_ID);
        if (!userIds.length) {
            toast.error(`${t('Please select atleast one operator')}`);
            return;
        }
        const param = {
            CultureId,
            TaskId,
            IsFromJob: 0,
            UserId,
            Lines: userIds,
        }
        const choice = await confirm({
            ui: "confirmation",
            title: `${t("Confirm Send Reminder")}`,
            description: `${t("Do you wish to send reminder?")}`,
            confirmBtnLabel: `${t("Yes")}`,
            cancelBtnLabel: `${t("No")}`,
        });

        if (!choice) {
            return;
        }

        const response = await ApiService.httpPost("trans/saveReminderMails", param);
        if (response.Id > 0) {
            toast.success(response?.Message, { autoClose: 3000 });
            onCloseHandler(true);
        } else {
            toast.error(response?.Message, { autoClose: 3000 });
        }
    }, [CultureId, TaskId, UserId, confirm, listoperators, onCloseHandler]);
    useEffect(() => {
        const list = listoperators.filter((element: any) => !element.notToShow);
        setShowNoData(!list.length);
        buildSelectALLState(listoperators)
    }, [buildSelectALLState, listoperators])
    useEffect(() => {
        setListoperators(operatorsList ?? [])
    }, [operatorsList])
    return (
        <Dialog onClose={onCloseHandler} open={open} fullWidth={true} maxWidth={'md'}>
            <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                <p className="dialog_title">
                    <FcLibrary className="head-icon" />
                    <span className="mx-2">{t("Operators")}
                    </span>
                </p>
                <IconButton
                    aria-label="close"
                    className="head-close-bttn"
                    onClick={() => onCloseHandler(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <div className="search-wrapper operator-search-wrap">
                    <div className="search-ip-wrap position-relative">
                        <input type="text" placeholder={t("Search")?? 'Search'} className="w-100" onInput={onSearchInput} />
                        <div className="search-icon">
                            <SearchOutlinedIcon fontSize="inherit" />
                        </div>
                    </div>
                </div>
                <p className="completion-title">{t('Operator List')}</p>
                <div>
                    <div className="each-item-wrap">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    onChange={selectAllHandler}
                                    indeterminate={selectAll.indeterminate}
                                    checked={selectAll.checked}
                                    value={selectAll.checked}
                                />
                            }
                            label={
                                <Typography variant="body1">
                                    {t("Select All")}
                                </Typography>
                            }
                        />
                    </div>
                </div>
                <div className="completion-popUp-wrapper">
                    {listoperators && listoperators.map((item: any, index: any) => (
                        <div className="completion-popUp opr-checkbox" key={`${index}-${Number(item.isClicked)}`} style={{ display: item.notToShow ? 'none' : 'flex' }}>
                            <div className="each-item-wrap">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            onChange={(e) => filterSelectedItems(item)}
                                            checked={item.isClicked}
                                        />
                                    }
                                    label={
                                        <Typography variant="body1">
                                            {item.FRANCHISE_NAME}
                                        </Typography>
                                    }
                                />
                            </div>
                        </div>
                    ))}
                    {showNoData &&
                        <div className="nodata pt-0">{t("No Data")}</div>
                    }
                </div>
            </DialogContent>
            <DialogActions className="assign-action-buttons">
                <div className="comment-head">
                    <Button autoFocus onClick={() => onCloseHandler(false)}>{t("Cancel")}</Button>
                    <PrimaryButton
                        text={t("Send Reminder")}
                        disabled={listoperators?.length === 0}
                        onClick={sendReminder}
                    />
                </div>
            </DialogActions>
        </Dialog>
    )
}
export default SendReminderDialog;