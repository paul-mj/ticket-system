import { Button, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { CultureId } from "../../../../common/application/i18n";
import localStore from "../../../../common/browserstore/localstore";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import axios from "axios";
import ApiService from "../../../../core/services/axios/api";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormInputSelect } from "../../../../shared/components/form-components/FormInputSelect";
import { formatOptionsArray } from "../../../../common/application/shared-function";
import { useConfirm } from "../../../../shared/components/dialogs/confirmation";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import AutocompleteField from "../../../../shared/components/form-components/FormAutoCompleteSelect";


const defaultGridData = {
    gridList: [
        {
            SERVICE_ID: "",
            SERVICE_NAME: "",
            EN_TEMPLATE_ID: null,
            AR_TEMPLATE_ID: null,
        }
    ]
}



export const MailtypeEmailTemplate = (props: any) => {
    const confirm = useConfirm();
    const { t, i18n } = useTranslation();
    const { onCloseDialog, popupConfiguration } = props;
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [dropdownData, setDropdownData] = useState<any>()

    /* Grid Form */
    const gridDynamicForm = useForm({ defaultValues: defaultGridData });
    const gridArrayMethords = useFieldArray({ control: gridDynamicForm.control, name: "gridList" });


    useEffect(() => {
        loadInitialData();
    }, [])

    const loadInitialData = async () => {
        const EnumParam = {
            Procedure: "FRM_MASTER.MAIL_TYPE_TEMPLATES_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: []
        };

        const EnumTemplate = {
            Procedure: "FRM_MASTER.EMAIL_TEMPLATES_LOOKUP_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: []
        };
        try {
            const [mailTypeList, templateList] =
                await axios.all([
                    ApiService.httpPost('data/getTable', EnumParam),
                    ApiService.httpPost('data/getTable', EnumTemplate),
                ]);


            gridDynamicForm.reset({
                gridList: mailTypeList?.Data.map((item: any) => ({
                    SERVICE_ID: item.SERVICE_TYPE,
                    SERVICE_NAME: item.SERVICE_TYPE_NAME,
                    EN_TEMPLATE_ID: item.EN_TEMPLATE_ID,
                    AR_TEMPLATE_ID: item.AR_TEMPLATE_ID
                    //   WF_ID: item.WF_ID,
                })),
            });
            setDropdownData(formatOptionsArray(templateList?.Data, 'TEMPLATE_NAME', 'ID'));
            console.log(templateList?.Data);

        } catch (error) {
            console.error(error);
        }
    }

    const submitServiceTypeTemplate = async () => {
        const formValues = gridDynamicForm.getValues();
        const param = {
            UserId: userID,
            Lines: formValues.gridList.map((item: any) => ({
                SERVICE_TYPE: item.SERVICE_ID,
                EN_TEMPLATE_ID: item.EN_TEMPLATE_ID,
                AR_TEMPLATE_ID: item.AR_TEMPLATE_ID
            }))
        }



        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Save')}`,
            description: `${t('Are you sure you want to Save this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });


        if (choice) {
            const response = await ApiService.httpPost('emailTemplate/saveMailTypeTemplates', param);
            if (response.Id > 0) {
                await confirm({
                    complete: true,
                    ui: 'success',
                    title: `${t('Success')}`,
                    description: response.Message,
                    confirmBtnLabel: `${t('Close')}`,
                });
            } else {
                await confirm({
                    complete: true,
                    ui: 'error',
                    title: `${t('Error')}`,
                    description: response.Message,
                    confirmBtnLabel: `${t('Close')}`,
                });
            }
        }


    }


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
            <DialogContent dividers className="dialog-content-wrapp fixed-500">

                <Row>
                    <div className="outlined-box p-3">
                        <Row>
                            <div className="table-wrapper">
                                <div className="table-outer apprescal-period">
                                    <div className="table-header">
                                        <div className="element">{t("Service Type")}</div>
                                        <div className="element">{t("English Template")}</div>
                                        <div className="element">{t("Arabic Template")}</div>
                                    </div>

                                    {gridArrayMethords.fields &&
                                        gridArrayMethords.fields.map(
                                            (field: any, index: number) => (

                                                <div key={field.id} className={`table-body ${field.rowError ? "row-error" : ""}`}>
                                                    <div className="element d-flex align-items-center">
                                                        <p className="m-0">{field.SERVICE_NAME}</p>
                                                    </div>
                                                    <div className="element">
                                                        {/* <FormInputSelect
                                                            name={`gridList.${index}.EN_TEMPLATE_ID`}
                                                            control={gridDynamicForm.control}
                                                            label=""
                                                            options={dropdownData}
                                                            errors={gridDynamicForm.formState.errors}
                                                        //  onChange={onChange}
                                                        /> */}
                                                        <div className="w-100">
                                                            <AutocompleteField
                                                                control={gridDynamicForm.control}
                                                                name={`gridList.${index}.EN_TEMPLATE_ID`}
                                                                label={t("")}
                                                                errors={gridDynamicForm.formState.errors}
                                                                options={dropdownData}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="element">
                                                        {/* <FormInputSelect
                                                            name={`gridList.${index}.AR_TEMPLATE_ID`}
                                                            control={gridDynamicForm.control}
                                                            label=""
                                                            //  defaultValue={`gridList.${index}.ESCL_PERIOD_ID`}
                                                            options={dropdownData}
                                                            errors={gridDynamicForm.formState.errors}
                                                        /> */}
                                                        <div className="w-100">
                                                            <AutocompleteField
                                                                control={gridDynamicForm.control}
                                                                name={`gridList.${index}.AR_TEMPLATE_ID`}
                                                                label={t("")}
                                                                errors={gridDynamicForm.formState.errors}
                                                                options={dropdownData}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </Row>
                    </div>
                </Row>
            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <Row className="w-100 justify-content-between no-gutters">
                    <Col md={6}>

                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end">

                            <Button
                                autoFocus
                                className="mx-3"
                                onClick={() => onCloseDialog(true)}
                            >
                                {t("Close")}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                onClick={() => submitServiceTypeTemplate()}
                            >
                                {t("Save")}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </DialogActions>
        </>
    )
}