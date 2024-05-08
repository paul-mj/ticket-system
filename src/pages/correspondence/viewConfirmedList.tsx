import { Button, Dialog, DialogContent, DialogTitle, IconButton, Box, Tab, DialogActions, FormControlLabel, Checkbox, Typography } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import { FcLibrary } from "react-icons/fc";
import { Col } from "react-bootstrap";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import { toast } from "react-toastify";
import ApiService from "../../core/services/axios/api";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const schema = yup.object().shape({
    Remarks: yup.string()
});

export const ViewConfirmedList = (props: any) => {
    const { open, onClose, taskId, listCompletion } = props;
    const confirm = useConfirm();
    const lang = CultureId();
    const { t } = useTranslation();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [listoperators, setListoperators] = useState<any>(listCompletion);
    const [selectAll, setSelectAll] = useState({ checked: true, indeterminate: false })
    const [showNoData, setShowNoData] = useState(true);

    const { control, handleSubmit, formState: { errors, isValid }, setError, clearErrors, getValues, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            Remarks: "",
        },
    });
    const resetAll = useCallback(() => {
        selectAllHandler({target: { checked: false }});
        reset();
        setListoperators(listCompletion);
    },[listCompletion, reset])
    const onCloseHandler = useCallback((mode: any) => {
        onClose(mode);
        resetAll()
    }, [onClose, resetAll])

    const filterSelectedItems = (userDet: any) => {
        setListoperators((Array: any) => Array.map((item: any) => item.FRANCHISE_NAME === userDet.FRANCHISE_NAME ? { ...item, isClicked: !item.isClicked } : item));
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
    const onClickChangeStatus = useCallback(async (StatusId: number) => {
        const { Remarks } = getValues();
        if (StatusId === 34 && !Remarks) {
            setError('Remarks', { message: `${t('Required Field')}`, type: "required" })
        } else {
            clearErrors('Remarks');
        }
        if (!Object.keys(errors).length) {
            const apiCall = async (data: any) => {
                const { Remarks } = data;
                const userIds = listoperators.filter((user: any) => user.isClicked === true).map((user: any) => user.FRANCHISE_ID);
                if (!userIds.length) {
                    toast.error(`${t('Please select atleast one operator')}`);
                    return;
                }
                const param = {
                    CultureId: lang,
                    TaskId: taskId,
                    UserId: userID,
                    Lines: userIds,
                    Remarks: Remarks,
                    StatusId
                }
                const choice = await confirm({
                    ui: "confirmation",
                    title: `${t("Confirm Completion")}`,
                    description: `Do you wish to ${StatusId === 24 ? 'approve' : 'reject'} completion?`,
                    confirmBtnLabel: `${t("Yes")}`,
                    cancelBtnLabel: `${t("No")}`,
                });

                if (!choice) {
                    return;
                }

                const response = await ApiService.httpPost("trans/updateTaskITCStatus", param);
                if (response.Id > 0) {
                    toast.success(response?.Message, { autoClose: 3000 });
                    onCloseHandler(true); 
                } else {
                    toast.error(response?.Message, { autoClose: 3000 });
                }
            }
            handleSubmit(apiCall)();
        }
    }, [clearErrors, confirm, errors, getValues, handleSubmit, lang, listoperators, onCloseHandler, setError, taskId, userID]);
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
    const buildSelectALLState = useCallback((operators: any[]) => {
        const isAnyoneSelected = operators.some((item: any) => item.isClicked);
        const isEverySelected = operators.every((item: any) => item.isClicked);

        const indeterminate = isEverySelected ? false : isAnyoneSelected;

        setSelectAll({ indeterminate, checked: isEverySelected })
    }, [])
    useEffect(() => {
        setListoperators(listCompletion);
    },[listCompletion])
    useEffect(() => {
        const list = listoperators.filter((element: any) => !element.notToShow);
        setShowNoData(!list.length);
        buildSelectALLState(listoperators)
    }, [buildSelectALLState, listoperators])
    return (
        <React.Fragment>
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
                    <Col md={12} className="pt-3">
                        <FormInputText
                            name="Remarks"
                            control={control}
                            label={t("Remarks")}
                            errors={errors}
                            onChange={() => clearErrors('Remarks')}
                        />
                    </Col>

                </DialogContent>
                <DialogActions>
                    <DialogActions className="assign-action-buttons">
                        <div className="comment-head">
                            <Button autoFocus onClick={() => onCloseHandler(false)}>{t("Cancel")}</Button>
                            <PrimaryButton
                                text={t("Reject Completion")}
                                cssClass="btn-reject"
                                disabled={listoperators?.length === 0}
                                onClick={() => onClickChangeStatus(34)}
                            />
                            <PrimaryButton
                                text={t("Approve Completion")}
                                cssClass="ms-2"
                                disabled={listoperators?.length === 0}
                                onClick={() => onClickChangeStatus(24)}
                            />
                        </div>
                    </DialogActions>
                </DialogActions>

            </Dialog>

        </React.Fragment >
    )

}
