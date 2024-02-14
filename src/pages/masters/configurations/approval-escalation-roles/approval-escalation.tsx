import { useState, useEffect } from "react";
import { Button, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { FormInputSelect } from "../../../../shared/components/form-components/FormInputSelect";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { readEnums } from "../../../../common/api/masters.api";
import { CultureId } from "../../../../common/application/i18n";
import { formatOptionsArray } from "../../../../common/application/shared-function";
import localStore from "../../../../common/browserstore/localstore";
import axios from "axios";
import ApiService from "../../../../core/services/axios/api";
import { API } from "../../../../common/application/api.config";
import { FormInputCheckbox } from "../../../../shared/components/form-components/FormInputCheckbox";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";
import { useConfirm } from "../../../../shared/components/dialogs/confirmation";
import { HiOutlineTrash } from "react-icons/hi2";
import { HiOutlinePlusSm } from "react-icons/hi";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import AutocompleteField from "../../../../shared/components/form-components/FormAutoCompleteSelect";



/* Validation Schema */
const searchFormSchema = yup.object().shape({
    serviceType: yup.string().required("Service Type Is Required"),
});

const defaultSearchValue = {
    serviceType: '',
}


/* For Grid */
const gridSchema = yup.object().shape({
    gridList: yup.array().of(
        yup.object().shape({
            ROLE_ID: yup.number().required("required"),
            IS_APPROVAL: yup.boolean().default(false),
            IS_ESCALATION: yup.boolean().default(false),
            IS_PUBLISH: yup.boolean().default(false),
        }).test({
            test: ({ IS_APPROVAL, IS_ESCALATION }) =>
                (IS_APPROVAL || IS_ESCALATION),
            message: "At least one of Approval or Escalation must be selected",
        })
    ),
});


const defaultGridData = {
    gridList: [
        {
            ROLE_ID: null,
            IS_APPROVAL: false,
            IS_ESCALATION: false,
            IS_PUBLISH: false,
            DELETE: false,
            rowError: false
        }
    ]
}

export const ApprovalEscalationForm = (props: any) => {
    const confirm = useConfirm();
    const { t, i18n } = useTranslation();
    const { onCloseDialog, popupConfiguration } = props;
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [serviceTypeList, setServiceTypeList] = useState<any>();
    const [errorRowIndex, setErrorRowIndex] = useState<any>(null);
    const [serviceTypeSelected, setServiceTypeSelected] = useState(0);
    const [searchResponse, setSearchResponse] = useState<any>({
        roleList: []
    })
    const [isNewlyAdded, setIsNewlyAdded] = useState<any>(0);
    /* Search Form */
    const useSearchForm = useForm<any>({ resolver: yupResolver(searchFormSchema), defaultValues: defaultSearchValue });
    /* Grid Form */
    const gridDynamicForm = useForm({ resolver: yupResolver(gridSchema), defaultValues: defaultGridData });
    const gridArrayMethords = useFieldArray({ control: gridDynamicForm.control, name: "gridList" });

    const currentServiceTypeValue = useSearchForm.watch('serviceType');

    useEffect(() => {
        loadServiceTypeList();
    }, [])

    /* Load Servie Type List */
    const loadServiceTypeList = async () => {
        const enumParam = {
            Id: 304,
            CultureId: lang
        }
        const responseEnum = await readEnums(enumParam);
        if (responseEnum?.Valid > 0) {
            setServiceTypeList(formatOptionsArray(responseEnum.Data, 'ENUM_NAME', 'ENUM_ID'))
        }
    }

    /* Service Type Change */
    const selectedServiceTypeChange = async (event: number) => {
        if (isNewlyAdded === 1) {
            const choice = await confirm({
                ui: 'confirmation',
                title: `${t('Confirmation')}`,
                description: `${t('Unsaved Items in the List, Do you wish to change Service Type?')}`,
                confirmBtnLabel: `${t('Yes')}`,
                cancelBtnLabel: `${t('No')}`,
            });
            if (choice) {
                setServiceTypeSelected(event)
                onClickSearchData(event);
                setIsNewlyAdded(0);
            } else {
                useSearchForm.setValue('serviceType', currentServiceTypeValue);
            }
        } else {
            setServiceTypeSelected(event)
            onClickSearchData(event);
        }
    }

    /* Search Data Based On Service List Change */
    const onClickSearchData = async (event: number) => {
        const roleParams = {
            UserId: userID,
            MailGroupId: null,
            CultureId: lang,
        };
        const mailRoleParam = {
            Id: event,
            CultureId: lang,
        };
        try {
            const [roleResponse, gridResponse] =
                await axios.all([
                    ApiService.httpPost(API.masters.getreadRoles, roleParams),
                    ApiService.httpPost('EscalationRoles/read', mailRoleParam),
                ]);


            const formattedRoleOptions = formatOptionsArray(roleResponse.Data, 'ROLE_NAME', 'ROLE_ID');

            const roleOptions = formattedRoleOptions.map((option: any) => {
                const matchingRow = gridResponse.Data.find((rowItem: any) => rowItem.ROLE_ID === option.value);
                if (matchingRow) {
                    return {
                        ...option,
                        disabled: true
                    };
                } else {
                    return option;
                }
            });
            setSearchResponse({
                roleList: (roleResponse.Valid > 0) ? roleOptions : null
            });
            gridDynamicForm.reset(gridResponse.Data?.length ? {
                gridList: gridResponse.Data.map((item: any) => ({
                    ROLE_ID: item.ROLE_ID,
                    IS_APPROVAL: item.IS_APPROVAL,
                    IS_ESCALATION: item.IS_ESCALATION,
                    IS_PUBLISH: item.IS_PUBLISH
                })),
            } : {
                gridList: [{
                    ROLE_ID: null,
                    IS_APPROVAL: false,
                    IS_ESCALATION: false,
                    IS_PUBLISH: false
                }]
            });
        } catch (error) {
            console.error(error);
        }
    }

    /* Delete Row From Grid */
    const handleDeleteRow = async (field: any, index: number) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to Delete this?')}`,
            confirmBtnLabel: `${t('Delete')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            setSearchResponse({ roleList: deletedRoleEnable(field.ROLE_ID) });
            setIsNewlyAdded(1)
            gridArrayMethords.remove(index);
        }
    }

    /* Check box Change */
    const checkBoxChange = () => {
    }
    /* Select box Change */
    const selectChange = () => {

    }

    /* Add Row From Grid */
    const handleAddRow = async (data: any, index: any) => {
        const lastRowIndex = gridArrayMethords.fields.length - 1;
        const isValid = await gridDynamicForm.trigger(`gridList.${lastRowIndex}`);
        const gridListValues = gridDynamicForm.getValues("gridList")[lastRowIndex];

        if (isValid) {
            const roleListArr = selectedRoleDisable(gridListValues.ROLE_ID)
            setSearchResponse({ roleList: roleListArr });
            setIsNewlyAdded(1)
            gridArrayMethords.append({
                ROLE_ID: null,
                IS_APPROVAL: false,
                IS_ESCALATION: false,
                IS_PUBLISH: false,
                DELETE: false,
                rowError: false,
            });
        } else {
            toast.error(`${t('Row Values are Mandatory')}`)
        }
    };

    /* Selected Role Disabled */
    const selectedRoleDisable = (roleId: any) => searchResponse.roleList.map((item: any) => {
        if (item.value === roleId) { return { ...item, disabled: true }; }
        return item;
    });
    /* Selected Role Enabled */
    const deletedRoleEnable = (roleId: any) => searchResponse.roleList.map((item: any) => {
        if (item.value === roleId) { return { ...item, disabled: false }; }
        return item;
    });


    /* On Submit */
    const onSubmit = (data: any, e: any) => submitApprovalEscalation(data);
    /* Test Log */
    const onError = (errors: any, e: any) => {

    };


    /* Submit Approval Escalation */
    const submitApprovalEscalation = async (data: any) => {
        const [searchFormData, formValues] = [useSearchForm.getValues(), gridDynamicForm.getValues()];
        const [searchIsValid, gridIsValid] = await Promise.all([useSearchForm.trigger(), gridDynamicForm.trigger()]);

        if (searchIsValid && gridIsValid) {
            if (formValues.gridList.length > 0) {
                const choice = await confirm({
                    ui: 'confirmation',
                    title: `${t('You Are About To Save')}`,
                    description: `${t('Are you sure you want to Save this?')}`,
                    confirmBtnLabel: `${t('Continue')}`,
                    cancelBtnLabel: `${t('Cancel')}`,
                });

                if (choice) {
                    const param = {
                        UserId: userID,
                        ServiceType: searchFormData.serviceType,
                        Lines: formatLines(formValues)
                    }
                    const response = await ApiService.httpPost('escalationRoles/save', param);
                    if (response.Id > 0) {
                        const cmpltDialog = await confirm({
                            complete: true,
                            ui: 'success',
                            title: `${t('Success')}`,
                            description: response.Message,
                            confirmBtnLabel: `${t('Close')}`,
                        });
                        if (cmpltDialog) {
                            setServiceTypeSelected(0);
                            setIsNewlyAdded(0);
                            useSearchForm.setValue('serviceType', "")
                            gridDynamicForm.reset(defaultGridData);
                        }
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
            } else {
                toast.error(`${t('No Roles Available')}`)
            }
        } else {
            toast.error(`${t('All Row Values Are Mandatory')}`)
        }
    }

    const formatLines = (lines: any) => {
        return lines.gridList.map((row: any, index: number) => ({
            ROLE_ID: row.ROLE_ID,
            IS_APPROVAL: row.IS_APPROVAL ? 1 : 0,
            IS_ESCALATION: row.IS_ESCALATION ? 1 : 0,
            IS_PUBLISH: row.IS_PUBLISH ? 1 : 0,
            TO_DELETE: 0
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
                    <div className="outlined-box mb-3 pb-3">
                        <h5 className="outlined-box-head my-3">
                            {t("Service Type")}
                        </h5>
                        <Row>
                            <Col md={6}>
                                <FormInputSelect
                                    name="serviceType"
                                    control={useSearchForm.control}
                                    label={t("Service Type")}
                                    errors={useSearchForm.formState.errors}
                                    onChange={selectedServiceTypeChange}
                                    options={serviceTypeList}
                                />
                            </Col>
                        </Row>
                    </div>
                    {
                        (serviceTypeSelected !== 0) &&
                        <div className="outlined-box mb-3 pb-3">
                            <h5 className="outlined-box-head my-3">
                                {t("Approval And Escalation Roles")}
                            </h5>
                            <Row>
                                <div className="table-wrapper">
                                    <div className="table-outer approval-esc">
                                        <div className="table-header">
                                            <div className="element">{t("Role")}</div>
                                            <div className="element">{t("Approval")}</div>
                                            <div className="element">{t("Escalation")}</div>
                                            <div className="element">{t("Publish")}</div>
                                            <div className="element">{t("Delete")}</div>
                                        </div>
                                        {gridArrayMethords.fields?.length ?
                                            gridArrayMethords.fields.map(
                                                (field: any, index: number) => (
                                                    <div key={field.id} className={`table-body ${!!gridDynamicForm.formState.errors?.gridList?.[index] ? "row-error" : ""}`}>

                                                        <div className="element justify-content-center">
                                                            {/* <FormInputSelect
                                                                name={`gridList.${index}.ROLE_ID`}
                                                                control={gridDynamicForm.control}
                                                                label=""
                                                                options={searchResponse.roleList}
                                                                errors={gridDynamicForm.formState.errors}
                                                                onChange={selectChange}
                                                            /> */}
                                                            <div className="w-100">
                                                                <AutocompleteField
                                                                    control={gridDynamicForm.control}
                                                                    name={`gridList.${index}.ROLE_ID`}
                                                                    label=""
                                                                    errors={gridDynamicForm.formState.errors}
                                                                    options={searchResponse.roleList}
                                                                    onChange={selectChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="element justify-content-center">
                                                            <FormInputCheckbox
                                                                name={`gridList.${index}.IS_APPROVAL`}
                                                                control={gridDynamicForm.control}
                                                                label=""
                                                                errors={gridDynamicForm.formState.errors}
                                                                onChange={checkBoxChange}
                                                            />
                                                        </div>
                                                        <div className="element justify-content-center">
                                                            <FormInputCheckbox
                                                                name={`gridList.${index}.IS_ESCALATION`}
                                                                control={gridDynamicForm.control}
                                                                label=""
                                                                errors={gridDynamicForm.formState.errors}
                                                            />
                                                        </div>
                                                        <div className="element justify-content-center">
                                                            <FormInputCheckbox
                                                                name={`gridList.${index}.IS_PUBLISH`}
                                                                control={gridDynamicForm.control}
                                                                label=""
                                                                errors={gridDynamicForm.formState.errors}
                                                            />
                                                        </div>
                                                        <div className="element">
                                                            <div className="d-flex align-items-center justify-content-between row-action-btns h-100">
                                                                {gridArrayMethords.fields.length !== 1 && (
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        size="small"
                                                                        className="delete-trash"
                                                                        onClick={() => handleDeleteRow(field, index)}
                                                                    >
                                                                        <HiOutlineTrash />
                                                                    </IconButton>
                                                                )}
                                                                {gridArrayMethords.fields.length - 1 === index && (
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        size="small"
                                                                        className="save-add"
                                                                        onClick={() => handleAddRow(field, index)}
                                                                    >
                                                                        <HiOutlinePlusSm />
                                                                    </IconButton>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <>
                                                    <div className="no-data-table d-flex align-items-center justify-content-center py-5">
                                                        <p>{t("No Data")}</p>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </Row>
                        </div>
                    }
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
                                Close
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                //onClick={() => submitApprovalEscalation()}
                                onClick={gridDynamicForm.handleSubmit(
                                    onSubmit,
                                    onError
                                )}
                            >
                                Save
                            </Button>
                        </div>
                    </Col>
                </Row>
            </DialogActions>
        </>
    )
}

