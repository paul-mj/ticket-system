/* Sajin 19-03-2023 */
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { WorkFlowForm } from "./workflow-form";
import { WorkFlowTable } from "./workflow-table";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import AddIcon from "@mui/icons-material/Add";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../../core/services/axios/api";
import { API } from "../../../common/application/api.config";
import axios from "axios";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import { WorkFlowFormData, WorkFlowTableRow } from "./workflow-interface";
import { readObjectData, readWorkFlow, saveWorkFlow } from "../../../common/api/masters.api";
import { toast } from "react-toastify";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { fullGridDataAction, MenuId } from "../../../common/database/enums";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { t } from "i18next";

interface apiResponse {
    process: any;
    role: any;
    extraInfo: any;
    modeView: boolean;
}


const workflowSchema = yup.object().shape({
    workFlowForm: yup.object().shape({
        code: yup.string().required("Code required"),
        workFlowNameinArabic: yup
            .string()
            .required("Workflow Name in Arabic is required"),
        workFlowNameinEnglish: yup
            .string()
            .required("Workflow Name in English is required"),
    }),
    workFlowTable: yup.array().of(
        yup.object().shape({
            FromStatus: yup.string().required("required"),
            ToStatus: yup.string().required("required"),
            RoleName: yup.string().required("required"),
        })
    ),
});


const defValues = {
    workFlowForm: {
        code: "",
        workFlowNameinArabic: "",
        workFlowNameinEnglish: "",
        Remarks: "",
        Active: true,
    },
    workFlowTable: [
        {
            FromStatus: null,
            ToStatus: null,
            RoleName: null,
            code: "",
            IsFinal: false,
            Role1: null,
            Role2: null,
        },
    ],
};

export const WorkFlowCreation = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;
   
    const { t, i18n } = useTranslation();
    const [initialDataResponse, setInitialDataResponse] = useState<apiResponse>(
        {
            process: null,
            role: null,
            extraInfo: null,
            modeView: false,
        }
    );
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    useEffect(() => {
        fetchInitailData();
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            loadEditData();
        }
    }, []);


    /* Load Initial Data For Edit */
    const loadEditData = async () => {
        if (activeAction.MenuId === MenuId.View) {
            setViewMenu(true);
        }
        const param = {
            MasterId: activeDetails[0]?.Master.MASTER_ID,
            ObjectId: rowData?.ID_,
            UserId: userID
        }
        try {
            const [objectResponse, workflowResponse] = await axios.all([
                ApiService.httpPost('objects/read', param),
                ApiService.httpGet(`workflows/read?id=${rowData?.ID_}`)
            ]);
            methods.reset(formatEditResponse(objectResponse.Data, workflowResponse.Data));
        } catch {

        }
    }

    /* Format Edit API Response */
    const formatEditResponse = (objectResponse: any, workflowResponse: any) => {
        return {
            workFlowForm: {
                code: objectResponse.OBJECT_CODE,
                workFlowNameinEnglish: objectResponse.OBJECT_NAME,
                workFlowNameinArabic: objectResponse.OBJECT_NAME_AR,
                Remarks: objectResponse.REMARKS,
                Active: (objectResponse.IS_ACTIVE === 1) ? true : false
            },
            workFlowTable: workflowResponse.map((row: any) => ({
                FromStatus: row.FROM_STATUS_ID,
                ToStatus: row.TO_STATUS_ID,
                RoleName: row.ROLE_ID,
                code: row.SORT_ORDER,
                IsFinal: (row.IS_FINAL === 1) ? true : false,
                Role1: row.ROLE_ID_1,
                Role2: row.ROLE_ID_2,
                Delete: (row.TO_DELETE === 1) ? true : false,
            }))
        }
    }

    /* Fetch Initial Data For Dropdown */
    const fetchInitailData = async () => {
        /* Parameter for ProcessStatus */
        const processParams = {
            Id: -1,
            CultureId: lang,
        };

        /* Parameter for roles */
        const roleParams = {
            UserId: userID,
            MailGroupId: null,
            CultureId: lang,
        };

        const extraInfoParams = {
            id: activeDetails[0].Master.MASTER_ID,
            CultureId: lang,
        };

        try {
            const [processResponse, roleResponse, extraInfoResponse] =
                await axios.all([
                    ApiService.httpPost(
                        API.masters.getStatusLookups,
                        processParams
                    ),
                    ApiService.httpPost(API.masters.getreadRoles, roleParams),
                    ApiService.httpPost(
                        API.masters.getExtraInfo,
                        extraInfoParams
                    ),
                ]);
            setInitialDataResponse({
                process:
                    processResponse.Valid > 0
                        ? formatProcessResponse(processResponse.Data)
                        : null,
                role:
                    roleResponse.Valid > 0
                        ? formatRoleResponse(roleResponse.Data)
                        : null,
                extraInfo:
                    extraInfoResponse.Valid > 0 ? extraInfoResponse.Info : null,
                modeView: activeAction.MenuId === MenuId.View ? true : false
            });
        } catch (error) {
            console.error(error);
        }
    };

    /* Format Process Response */
    const formatProcessResponse = (processList: any) => {
        return processList.map((row: any) => ({
            value: row.STATUS_ID,
            label: row.STATUS_NAME,
        }));
    };
    const formatRoleResponse = (roleList: any) => {
        return roleList.map((row: any) => ({
            value: row.ROLE_ID,
            label: row.ROLE_NAME,
        }));
    };

    /* Initialize Hook form */
    const methods = useForm<WorkFlowFormData>({ defaultValues: defValues, resolver: yupResolver(workflowSchema) });
    /* Initialize Hookform aray */
    const fieldArrayMethords = useFieldArray({
        control: methods.control,
        name: "workFlowTable",
    });

    /* Add New Row to Hookform Array */
    const addNewRowItem = async () => {
        const lastRowIndex = fieldArrayMethords.fields.length - 1;
        const isValid = await methods.trigger(`workFlowTable.${lastRowIndex}`);

        if (isValid) {
            fieldArrayMethords.append({
                FromStatus: null,
                ToStatus: null,
                RoleName: null,
                code: "",
                IsFinal: false,
                Role1: null,
                Role2: null,
                Delete: false
            });
        } else {
            alert("Last row is not valid");
        }
    };

    /* Delete Row */
    const deleteTableRow = (index: number) => {
        fieldArrayMethords.remove(index);
    }

    /* Dialog Close */
    const handleCloseDialog = () => {
        onCloseDialog(true);
    };

    /* On Submit */
    const onSubmit = (data: any, e: any) => onSubmitWorkFlowSave(data);
    /* Test Log */
    const onError = (errors: any, e: any) => console.log(errors, e);

    /* Workflow Save */
    const onSubmitWorkFlowSave = async (formData: WorkFlowFormData) => {
        const param = {
            Data: {
                PARENT_ID: null,
                OBJECT_TYPE: null,
                OBJECT_ID: activeAction.MenuId === MenuId.New ? -1 : rowData?.ID_,
                OBJECT_CODE: formData?.workFlowForm.code,
                OBJECT_NAME: formData?.workFlowForm.workFlowNameinEnglish,
                SHORT_NAME: "",
                OBJECT_NAME_AR: formData?.workFlowForm.workFlowNameinArabic,
                SORT_ORDER: 0,
                REMARKS: formData?.workFlowForm.Remarks,
                DATA_VALUE: 0,
                DECIMAL_01: 0,
                DECIMAL_02: 0,
                TEXT_01: "",
                TEXT_02: ""
            },
            IsActive: formData?.workFlowForm.Active ? 1 : 0,
            UserId: userID,
            DataMode: 0,
            Steps: formatGridRows(formData)
        }
        /* fullviewRowAddUpdate(112); */
        const response = await saveWorkFlow(param);
        if (response.Id > 0) {
            fullviewRowAddUpdate(response.Id);
            toast.success(response.Message)
            methods.reset(defValues);
        } else {
            toast.error(response?.Message)
        }
    } 

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({ id: responseId, status: fullGridDataAction.UpdateRow });
    } 

    const formatGridRows = (formData: WorkFlowFormData) => {
        return formData.workFlowTable.map((row: WorkFlowTableRow, index: number) => ({
            SORT_ORDER: index + 1,
            ROLE_ID: row?.RoleName,
            ROLE_ID_1: row?.Role1,
            ROLE_ID_2: row?.Role2,
            FROM_STATUS_ID: row?.FromStatus,
            TO_STATUS_ID: row?.ToStatus,
            IS_FINAL: row?.IsFinal ? 1 : 0,
            TO_DELETE: row?.Delete ? 1 : 0
        }));
    };



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
                    onClick={() => handleCloseDialog()}
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
                    <FormProvider {...methods}>
                        <div className="outlined-box mb-3">
                            <h5 className="outlined-box-head my-3">
                               {t("Workflow Details")}
                            </h5>
                            <Row>
                                <WorkFlowForm
                                    modeView={viewMenu} />
                            </Row>
                        </div>

                        <div className="outlined-box pb-3">
                            <div className="justify-content-between d-flex align-items-center mb-3">
                                <div>
                                    <h5 className="outlined-box-head my-3">
                                       {t("Details")}
                                    </h5>
                                </div>
                                {!viewMenu &&
                                    <IconButton
                                        aria-label="calendar"
                                        size="large"
                                        onClick={() => addNewRowItem()}
                                    >
                                        <AddIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                }
                            </div>
                            <WorkFlowTable
                                fieldArrayMethords={fieldArrayMethords}
                                initialDataResponse={initialDataResponse}
                                handleAddRow={addNewRowItem}
                                handleDeleteRow={(index: any) => deleteTableRow(index)}
                            />
                        </div>
                    </FormProvider>
                </Row>
            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <Row className="w-100 justify-content-between no-gutters">
                    <Col md={6}>
                        <FormInputCheckbox
                            name="workFlowForm.Active"
                            control={methods.control}
                            label={t("Active")}
                            disabled={viewMenu}
                            errors={methods.formState.errors}
                        />
                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end">
                            <Button autoFocus className="mx-3" onClick={() => handleCloseDialog()}>
                                {t("Close")}
                            </Button>
                            {!viewMenu &&
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="colored-btn"
                                    onClick={methods.handleSubmit(
                                        onSubmit,
                                        onError
                                    )}
                                >
                                    {t("Save")}
                                </Button>
                            }
                        </div>
                    </Col>
                </Row>
            </DialogActions>
        </>
    );
};
