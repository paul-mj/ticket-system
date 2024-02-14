import { useCallback, useEffect, useState } from "react"
import ApiService from "../../../../core/services/axios/api";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close";
import './localization.scss';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { FormInputText } from "../../../../shared/components/form-components/FormInputText";
import { error } from "console";
import { Col, Row } from "react-bootstrap";
import localStore from "../../../../common/browserstore/localstore";
import { useConfirm } from "../../../../shared/components/dialogs/confirmation";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import DataGrid, { Column, Editing, FilterRow, Scrolling, Sorting } from "devextreme-react/data-grid";

const localValue = {
    defaultValues: [{
        ID: '',
        AR_CAPTION: '',
        EN_CAPTION: '',
        LOCALE_KEY: ''
    }]
}

export const LocalizationForm = (props: any) => {
    const confirm = useConfirm();
    const { t, i18n } = useTranslation();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const { onCloseDialog, popupConfiguration } = props;
    const [localizeData, setLocalizeData] = useState<any>();

    const initialLoad = useCallback(async () => {
        const response = await ApiService.httpGet("data/readLocalisationData");
        setLocalizeData(response?.Data);
    }, [])

    useEffect(() => {
        initialLoad();
    }, [initialLoad]);


    const handlerowUpdate = (e: any) => {
        setTimeout(() => {
            const newArray = localizeData.map((x: any) => {
                if (x.ID === e.key.ID) {
                    return { ...e.key }
                }
                return x;
            });
            setLocalizeData(newArray);
        });
    }

    const onClickToSaveLocale = async () => {
        console.log(localizeData);
        const Param = {
            UserId: userID,
            Lines: localizeData || []
        }
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Save')}`,
            description: `${t('Are you sure you want to Save this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            try {
                const response = await ApiService.httpPost("data/saveLocalisationData", Param);
                if (response.Valid > 0) {
                    toast.success(`${t("Saved Sucessfully")}`);
                } else { toast.success(response?.Message); }
            }
            catch (e: any) {
                toast.success(e?.message);
            }
        }
    }

    /*const onSubmit = methods?.handleSubmit(async (data: any) => {
         const Param = {
            UserId: userID,
            Lines: data?.defaultValues ? data?.defaultValues : []
        }
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Save')}`,
            description: `${t('Are you sure you want to Save this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            try {
                const response = await ApiService.httpPost("data/saveLocalisationData", Param);
                if (response.Valid > 0) {
                    toast.success(`${t("Saved Sucessfully")}`);
                } else { toast.success(response?.Message); }
            }
            catch (e: any) {
                toast.success(e?.message);
            }
        } 
    })*/

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                <p className="dialog_title">
                    <PixOutlinedIcon className="head-icon" />
                    <span className="mx-2">
                        {popupConfiguration && popupConfiguration.DialogHeading}
                    </span>
                </p>
                <IconButton
                    aria-label="close"
                    className="head-close-bttn"
                    onClick={() => onCloseDialog(true)}
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
            <DialogContent dividers className="dialog-content-wrapp">
                <Row>
                    <div className="outlined-box pb-3">
                        <h5 className="outlined-box-head my-3"> </h5>
                        <DataGrid
                            dataSource={localizeData}
                            showBorders={true}
                            width="100%"
                            key="ID_"
                            height="100%"
                            showColumnLines={true}
                            showRowLines={true}
                            rowAlternationEnabled={true}
                            onRowUpdating={handlerowUpdate}
                        >
                            <Scrolling
                                mode="virtual"
                                rowRenderingMode="virtual"
                            />
                            <Sorting mode="single" />
                            <FilterRow visible={true} />
                            <Editing
                                mode="cell"
                                allowUpdating={true}
                            />
                            
                            <Column
                                dataField="serialNumber"
                                caption={t("Sl No")}
                                alignment="center"  
                                allowSorting={false}
                                allowEditing={false}
                                calculateCellValue={(rowData: any) => rowData.ID}  
                                width={80}
                            />
                            <Column
                                dataField="EN_CAPTION" 
                                allowSorting={true}
                                caption={t("In English")}
                                allowEditing={false}
                            ></Column>
                            <Column
                                dataField="AR_CAPTION" 
                                allowSorting={true}
                                caption={t("In Arabic")}
                                allowEditing={true}
                                alignment='right'
                                cssClass={'dx-input-border'}
                            ></Column>

                        </DataGrid>

                    </div>
                </Row>
            </DialogContent>
            <DialogActions className="dialog-action-buttons">

                <Col md={6}>
                    <div className="d-flex justify-content-end">
                        <Button
                            autoFocus
                            onClick={() => onCloseDialog(true)}
                            className="mx-3"
                        >
                            {t("Close")}
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            className="colored-btn"
                            onClick={onClickToSaveLocale}
                        >
                            {t("Save")}
                        </Button>

                    </div>
                </Col>

            </DialogActions>

        </>
    )
}