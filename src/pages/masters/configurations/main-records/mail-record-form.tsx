import { Box, DialogActions, DialogContent, DialogTitle, IconButton, Tab, TextField, Tooltip } from "@mui/material";
import { Row, Col, Button } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { FormInputSelect } from "../../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../../shared/components/form-components/FormInputText";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect, useState } from "react";
import { readEnums } from "../../../../common/api/masters.api";
import { CultureId } from "../../../../common/application/i18n";
import { formatOptionsArray, formatString, trimArrayElements } from "../../../../common/application/shared-function";
import ApiService from "../../../../core/services/axios/api";
import axios from "axios";
import { API } from "../../../../common/application/api.config";
import { TableNoData } from "../../../../shared/components/table/no-data";
import "../configuration.scss"
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { toast } from "react-toastify";
import { MailGroupId } from "../../../../common/database/enums";
import { FormInputMultiSelect } from "../../../../shared/components/form-components/FormInputMultiSelect";
import localStore from "../../../../common/browserstore/localstore";
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import { useConfirm } from "../../../../shared/components/dialogs/confirmation";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { HiOutlineSave } from "react-icons/hi";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


interface IApiResponse {
    mailGroupList: any,
    subEntityList: any,
    roleList: any,
    additionalRoleList: any,
    copyOfAdditionalRoleList: any,
    rolesOptionsList: any,
    mailGroupOptionsList: any,
    userOptionsList: any,
    contactOptionsList: any
}
interface IMailGroupOptions {
    label: string,
    options: any,
    selectedGroup: number,
}

/* Validation Schema */
const mainRecordSchema = yup.object().shape({
    serviceType: yup.string().required(""),
    subEntity: yup.array().min(1, "").of(yup.string()),
    mailGroupEntryType: yup.string().when("serviceType", {
        is: (value: any) => value !== "",
        then: yup.string().required("Mail Group Entry Type is Mandatory"),
        otherwise: yup.string(),
    }),
    mailGroupEntryDynamicInput: yup.string().when("mailGroupEntryType", {
        is: (value: any) => Number(value) === MailGroupId.MailId, // Only apply validation if mailGroupEntryType is "3008"
        then: yup
            .string()
            .required("")
            .test("is-email", "Must be a valid email", (value) => {
                return !value || yup.string().email().isValidSync(value);
            }),
        otherwise: yup.string().required("Field is Required"), // Show required error message if mailGroupEntryType is not "3008"
    }),
});

/* Default Values */
const defaultValues = {
    serviceType: "",
    subEntity: [],
    mailGroupEntryType: "",
    mailGroupEntryDynamicInput: "",
};

const defaultValueRow = {
    subEntityRow: [],
    mailGroupEntryTypeRow: "",
    mailGroupEntryDynamicInputRow: "",
}

export const MailRecordsForm = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;
    const confirm = useConfirm();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const lang = CultureId();
    const { t, i18n } = useTranslation();
    const [serviceTypeList, setServiceTypeList] = useState<any>();
    const [tabValue, setTabValue] = useState('1');
    const [serviceTypeSelected, setServiceTypeSelected] = useState(0);
    const [editRowSubEntityList, setEditRowSubEntityList] = useState<any>();
    const [mailGroupDynamicOptions, setMailGroupDynamicOptions] = useState<IMailGroupOptions>({
        label: '',
        options: [],
        selectedGroup: 0
    });
    const [selectionChangeResponse, setSelectionChangeResponse] = useState<IApiResponse>(
        {
            mailGroupList: null,
            subEntityList: [],
            roleList: [],
            additionalRoleList: [],
            copyOfAdditionalRoleList: [],
            rolesOptionsList: [],
            mailGroupOptionsList: [],
            userOptionsList: [],
            contactOptionsList: [],
        }
    );

    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;

    /* Form Methords */
    /* const { control, handleSubmit, formState: { errors }, watch, resetField, setValue, reset } = useForm<any>({
        resolver: yupResolver(mainRecordSchema),
        defaultValues: defaultValues,
    }); */

    const useFormAdd = useForm<any>({
        resolver: yupResolver(mainRecordSchema),
        defaultValues: defaultValues,
    });

    /* Form Methords */
    const useFormRowEdit = useForm<any>({ defaultValues: defaultValueRow });



    const currentValue = useFormAdd.watch('serviceType'); //Current Value of Service type, It can be use for previous value

    /* Handlfe Change tab */
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };


    /* Call Other API's While Service Change */
    const readServiceChangeDatas = async (id: number) => {

        const mailGroupEntryEnum = {
            id: 308,
            CultureId: lang
        }
        const EntityParam = {
            Id: userID,
            CultureId: lang,
        }
        const mailRoleParam = {
            id: id,
            CultureId: lang
        }
        const additionalRoleParams = {
            UserId: userID,
            Id: id,
            CultureId: lang,
        }
        const optionsParam = {
            UserId: userID,
            MailGroupId: null,
            CultureId: lang

        }
        try {
            const [mailGroupEntryList, subEntityList, roleList, additionalRoles, rolesOptions, mailGroupOptions, userOptions, contactOptions] =
                await axios.all([
                    ApiService.httpPost(`lookup/getEnums`, mailGroupEntryEnum),
                    ApiService.httpPost(`lookup/getSubentities`, EntityParam),
                    ApiService.httpPost('MailRoles/read', mailRoleParam),
                    ApiService.httpPost('ServiceTypeMails/read', additionalRoleParams),
                    ApiService.httpPost('mailgroups/getRoleLookups', optionsParam),
                    ApiService.httpPost('mailgroups/getMailGroupLookups', optionsParam),
                    ApiService.httpPost('mailgroups/getUserLookups', optionsParam),
                    ApiService.httpPost('mailgroups/getContactLookups', optionsParam),
                ]);
            setSelectionChangeResponse({
                mailGroupList: (mailGroupEntryList.Valid > 0 && mailGroupEntryList.Data?.length) ? formatOptionsArray(mailGroupEntryList.Data, 'ENUM_NAME', 'ENUM_ID') : null,
                subEntityList: (subEntityList.Valid > 0 && subEntityList.Data?.length) ? formatOptionsArray(subEntityList.Data, 'SUB_ENTITY_NAME', 'ID_') : [],
                roleList: (roleList.Valid > 0 && roleList.Data?.length) ? roleList.Data : null,
                additionalRoleList: (additionalRoles.Valid > 0 && additionalRoles.Data?.length) ? additionalRoles.Data.map((obj: any) => ({ ...obj, isEdit: false })) : null,
                copyOfAdditionalRoleList: (additionalRoles.Valid > 0 && additionalRoles.Data?.length) ? additionalRoles.Data.map((obj: any) => ({ ...obj, isEdit: false })) : null,
                rolesOptionsList: (rolesOptions.Valid > 0 && rolesOptions.Data?.length) ? rolesOptions.Data : null,
                mailGroupOptionsList: (mailGroupOptions.Valid > 0 && mailGroupOptions.Data?.length) ? mailGroupOptions.Data : null,
                userOptionsList: (userOptions.Valid > 0 && userOptions.Data?.length) ? userOptions.Data : null,
                contactOptionsList: (contactOptions.Valid > 0 && contactOptions.Data?.length) ? contactOptions.Data : null,
            });

        } catch (error) {
            console.error(error);
        }
    }


    ////Search and Sort #Ragesh


    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortEmail, setSortEmail] = useState<"asc" | "desc">("asc");

    const handleSearchTermChange = (event: any) => {

        // setSearchTerm(event.target.value);
        const filterdData = selectionChangeResponse?.copyOfAdditionalRoleList
            .filter(
                (person: any) =>
                    person.CONTACT_DET.toLowerCase().includes(event.target.value.toLowerCase()) ||
                    person.EMAIL_ID.toLowerCase().includes(event.target.value.toLowerCase())
            );

        setSelectionChangeResponse(prevState => ({ ...prevState, additionalRoleList: filterdData }));

    };

    const handleSort = () => {
        const sortData = selectionChangeResponse?.additionalRoleList.sort((a: any, b: any) => a.CONTACT_DET.localeCompare(b.CONTACT_DET));
        if (sortOrder === "asc") {
            setSortOrder("desc");
        }
        else {
            setSortOrder("asc");
        }
        setSelectionChangeResponse(prevState => ({ ...prevState, additionalRoleList: sortOrder === "asc" ? sortData : sortData?.reverse() }));
    }

    const handleSortEmail = () => {
        const sortData = selectionChangeResponse?.additionalRoleList.sort((a: any, b: any) => a.EMAIL_ID.localeCompare(b.EMAIL_ID));
        if (sortEmail === "asc") {
            setSortEmail("desc");
        }
        else {
            setSortEmail("asc");
        }
        setSelectionChangeResponse(prevState => ({ ...prevState, additionalRoleList: sortEmail === "asc" ? sortData : sortData?.reverse() }));
    }



    /////End Search and Sort

    /* Load Initial Data  */
    useEffect(() => {
        fetchInitailData();
    }, []);

    const fetchInitailData = async () => {
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
    const selectedServiceTypeChange = (event: any) => {
        const newDropdownValue = event;
        const alreadyRowInEditMode = selectionChangeResponse?.additionalRoleList && selectionChangeResponse?.additionalRoleList.some((x: any) => x.isEdit);
        if (!alreadyRowInEditMode) {
            resetWhileServiceChange(newDropdownValue);
            setServiceTypeSelected(newDropdownValue);
            readServiceChangeDatas(newDropdownValue);
        } else {
            useFormAdd.setValue('serviceType', currentValue);
            toast.error(`You are already in Edit Mode`);
        }

    }

    /* Reset Other Fields */
    const resetWhileServiceChange = (serviceValue: number) => {
        let updatedDefaultValues = {
            serviceType: serviceValue,
            subEntity: [],
            mailGroupEntryType: "",
            mailGroupEntryDynamicInput: ""
        };
        // Use setValues to update the form values with the updated default values
        useFormAdd.reset(updatedDefaultValues);
    }

    /* Change Mail Group */
    const selectedMailGroupChange = (event: any) => {
        console.log(selectionChangeResponse.contactOptionsList)
        useFormAdd.setValue('mailGroupEntryDynamicInput', "");
        switch (event) {
            case MailGroupId.Roles:
                setMailGroupDynamicOptions({ label: 'Roles', options: formatOptionsArray(selectionChangeResponse.rolesOptionsList, 'ROLE_NAME', 'ROLE_ID'), selectedGroup: event })
                break;
            case MailGroupId.MailGroup:
                setMailGroupDynamicOptions({ label: 'Mail Group', options: formatOptionsArray(selectionChangeResponse.mailGroupOptionsList, 'OBJECT_NAME', 'OBJECT_ID'), selectedGroup: event })
                break;
            case MailGroupId.User:
                setMailGroupDynamicOptions({ label: 'User', options: formatOptionsArray(selectionChangeResponse.userOptionsList, 'USER_FULL_NAME', 'USER_ID'), selectedGroup: event })
                break;
            case MailGroupId.MailId:
                setMailGroupDynamicOptions({ label: 'Mail Id', options: [], selectedGroup: event })
                break;
            case MailGroupId.Contact:
                setMailGroupDynamicOptions({ label: 'Contact', options: formatOptionsArray(selectionChangeResponse.contactOptionsList, 'CONTACT_NAME', 'CONTACT_ID'), selectedGroup: event })
                break;
        }
    }

 
    /* On Submit For Adding Role to Grid*/
    const onSubmit = (data: any, e: any) => {
        const { mailGroupEntryType, mailGroupEntryDynamicInput } = data;
        let isExist;
        if (mailGroupEntryType !== '30804') {
            isExist = selectionChangeResponse.additionalRoleList && selectionChangeResponse.additionalRoleList.some((item: any) => item.ENTRY_TYPE === Number(mailGroupEntryType) && item.CONTENT_ID === Number(mailGroupEntryDynamicInput));
        } else {
            isExist = selectionChangeResponse.additionalRoleList && selectionChangeResponse.additionalRoleList.some((item: any) => item.EMAIL_ID === mailGroupEntryDynamicInput);
        }


        if (isExist) {
            toast.error('Item is Already Exist');
            return;
        } else {
            addNewRole(data);
        }
    }; 

    /* Test Log */
    const onError = (errors: any, e: any) => console.log(errors, e);

    /* Add New Role */
    const addNewRole = async (formData: any) => {
        const param = {
            UpUserId: userID,
            ServiceType: Number(formData?.serviceType),
            EntryType: Number(formData?.mailGroupEntryType),
            Id: -1,
            UserId: (Number(formData?.mailGroupEntryType) === MailGroupId.User) ? formData?.mailGroupEntryDynamicInput : null, // user id
            RoleId: (Number(formData?.mailGroupEntryType) === MailGroupId.Roles) ? formData?.mailGroupEntryDynamicInput : null, //role id
            ContactId: (Number(formData?.mailGroupEntryType) === MailGroupId.Contact) ? formData?.mailGroupEntryDynamicInput : null, // contact if
            MailGroupId: (Number(formData?.mailGroupEntryType) === MailGroupId.MailGroup) ? formData?.mailGroupEntryDynamicInput : null, // type mailgroup id
            MailId: (Number(formData?.mailGroupEntryType) === MailGroupId.MailId) ? formData?.mailGroupEntryDynamicInput : null, // mail id 
            SubEntities: formData.subEntity
        }

        const cnfrmDialog = await confirm({
            ui: 'confirmation',
            title: `${t('Add New Role')}`,
            description: `${t('Do you wish to Add this Role?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (cnfrmDialog) {
            const response = await ApiService.httpPost('ServiceTypeMails/save', param);
            if (response.Id > 0) {
                const cmpltDialog = await confirm({
                    complete: true,
                    ui: 'success',
                    title: `${t('Success')}`,
                    description: response.Message,
                    confirmBtnLabel: `${t('Close')}`,
                });
                if (cmpltDialog) {
                    useFormAdd.resetField('mailGroupEntryDynamicInput')
                    /* reset(defaultValues); */
                    recallGridData();
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

    }


    const recallGridData = async () => {
        const additionalRoleParams = {
            UserId: userID,
            Id: serviceTypeSelected,
            CultureId: lang,
        }
        const response = await ApiService.httpPost('ServiceTypeMails/read', additionalRoleParams);
        if (response.Valid > 0) {
            console.log(response, 'response');
            setSelectionChangeResponse(prevState => ({
                ...prevState,
                additionalRoleList: (response.Valid > 0 && response.Data?.length) ? response.Data.map((obj: any) => ({ ...obj, isEdit: false })) : null,
                copyOfAdditionalRoleList: (response.Valid > 0 && response.Data?.length) ? response.Data : null,
            }));
        }
    }


    /* Edit Additional Roles */
    const handleEditRole = async (adRole: any, index: any) => {
        const alreadyRowInEditMode = selectionChangeResponse?.additionalRoleList.some((x: any) => x.isEdit);
        if (!alreadyRowInEditMode) {
            const newData = [...selectionChangeResponse?.additionalRoleList];
            newData[index].isEdit = true;
            setSelectionChangeResponse(prevState => ({ ...prevState, additionalRoleList: newData }));

            useFormAdd.reset();

            getEditRowSubEntityList(adRole);
            setDefaultValueWhileEditPossible(adRole);
        } else {
            await confirm({
                complete: true,
                ui: 'error',
                title: `${t('Error')}`,
                description: `${t('The Role is Already In Edit Mode. So Please Save the edited Row and Continue')}`,
                confirmBtnLabel: `${t('Close')}`,
            });
        }
    };

    const getEditRowSubEntityList = async (adRole: any) => {
        const param = {
            UserId: userID,
            Id: adRole.ID_,
            CultureId: lang
        }
        const response = await ApiService.httpPost('ServiceTypeMails/getSubEntities', param);
        if (response.Valid > 0) {

            const markedIds = response.Data.filter((d: any) => d.IS_MARKED === 1).map((d: any) => d.ID_);
            useFormRowEdit.setValue("subEntityRow", markedIds);
            /* console.log(markedIds, 'subList'); */
            /*  console.log(response.Data, 'response'); */
            const data = response.Data?.length && formatOptionsArray(response.Data, 'SUB_ENTITY_NAME', 'ID_', 'IS_READONLY', 'IS_MARKED');
            setEditRowSubEntityList(data);
            console.log(adRole);
        }
    }

    /* Set Row Value to Row Input */
    const setDefaultValueWhileEditPossible = (rowData: any) => {
        useFormRowEdit.setValue("mailGroupEntryTypeRow", rowData.ENTRY_TYPE);
        useFormRowEdit.setValue("mailGroupEntryDynamicInputRow", getDynamicFiledInRowValue(rowData));
        /* const subList = editRowSubEntityList && editRowSubEntityList.filter((x: any) => x.isMarked).map((y: any) => y.value);
        console.log(subList, 'subList'); */
        //useFormRowEdit.setValue("subEntityRow", getSubEntityArray(rowData.SUB_ENTITY_NAME)); 
        /* useFormRowEdit.setValue("subEntityRow", subList); */
        selectedMailGroupChange(rowData.ENTRY_TYPE);
        /* selectedMailGroupChange */
    }

    const getSubEntityArray = (x: string) => {
        const xArr = x.split(", ");
        const trimmedArr = trimArrayElements(xArr);
        const matches = selectionChangeResponse.subEntityList.filter((entity: any) => trimmedArr.includes(entity.label));
        const matchArr = matches.map((match: any) => match.value);
        return matchArr;
    }

    const getDynamicFiledInRowValue = (rowData: any) => {
        let returnVal;
        switch (rowData.ENTRY_TYPE) {
            case MailGroupId.Roles:
            case MailGroupId.MailGroup:
            case MailGroupId.Contact:
            case MailGroupId.User:
                returnVal = rowData.CONTENT_ID
                break;
            case MailGroupId.MailId:
                returnVal = rowData.CONTACT_DET
                break;
        }
        return returnVal;
    }


    const handleSaveRole = (adRole: any, index: any) => {
        editSaveApiCall(adRole);
    };

    /* Edit Save Role Based on Line */
    const editSaveApiCall = useFormRowEdit.handleSubmit(async (data, adRole: any) => {
        const param = {
            UpUserId: userID,
            ServiceType: Number(serviceTypeSelected),
            EntryType: Number(data?.mailGroupEntryTypeRow),
            Id: adRole.ID_,
            UserId: (data?.mailGroupEntryType === MailGroupId.User) ? data?.mailGroupEntryDynamicInputRow : null, // user id
            RoleId: (data?.mailGroupEntryType === MailGroupId.Roles) ? data?.mailGroupEntryDynamicInputRow : null, //role id
            ContactId: (data?.mailGroupEntryType === MailGroupId.Contact) ? data?.mailGroupEntryDynamicInputRow : null, // contact if
            MailGroupId: (data?.mailGroupEntryType === MailGroupId.MailGroup) ? data?.mailGroupEntryDynamicInputRow : null, // type mailgroup id
            MailId: (data?.mailGroupEntryType === MailGroupId.MailId) ? data?.mailGroupEntryDynamicInputRow : null, // mail id 
            SubEntities: data.subEntityRow
        }
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Update')}`,
            description: `${t('Are you sure you want to Update this?')}`,
            confirmBtnLabel: `${t('Update')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const response = await ApiService.httpPost('ServiceTypeMails/save', param);
            if (response.Id > 0) {
                const cmpltDialog = await confirm({
                    complete: true,
                    ui: 'success',
                    title: `${t('Success')}`,
                    description: response.Message,
                    confirmBtnLabel: `${t('Close')}`,
                });
                if (cmpltDialog) {
                    recallGridData();
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
    });

    const handleDeleteRole = async (adRole: any, index: number) => {
        /* Call Api Before If success remove from grid */
        const param = {
            UserId: userID,
            Id: adRole.ID_,
            CultureId: lang
        }

        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to Delete this?')}`,
            confirmBtnLabel: `${t('Delete')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const response = await ApiService.httpPost('serviceTypeMails/delete', param);
            if (response.Id > 0) {
                const newData = [...selectionChangeResponse?.additionalRoleList];
                newData.splice(index, 1);
                setSelectionChangeResponse(prevState => ({ ...prevState, additionalRoleList: newData }));
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
                    <div className="outlined-box mb-3">
                        <h5 className="outlined-box-head my-3">
                            {t("Add Mail Records")}
                        </h5>
                        <Row className="mb-3">
                            <Col md={4}>
                                <FormInputSelect
                                    name="serviceType"
                                    control={useFormAdd.control}
                                    label={t("Service Type")}
                                    errors={useFormAdd.formState.errors}
                                    onChange={selectedServiceTypeChange}
                                    options={serviceTypeList}
                                />
                            </Col>
                        </Row>
                        {
                            serviceTypeSelected !== 0 && <>
                                <Row className="mb-3 no-gutters">
                                    <Col md={12} className="add_frm_wrap pt-3 px-0 mb-3 white_bg_ips">
                                        <Row className="no-gutters">
                                            <Col md={11}>
                                                <Row>
                                                    <Col md={3} className="mb-3">
                                                        <FormInputSelect
                                                            name="mailGroupEntryType"
                                                            control={useFormAdd.control}
                                                            label={t("Mail Group Type")}
                                                            errors={useFormAdd.formState.errors}
                                                            options={selectionChangeResponse.mailGroupList}
                                                            onChange={selectedMailGroupChange}
                                                            hideError={true}
                                                        />
                                                    </Col>
                                                    {mailGroupDynamicOptions.selectedGroup !== 0 && (
                                                        <Col md={3} className="mb-3">
                                                            {mailGroupDynamicOptions.selectedGroup === MailGroupId.MailId ? (
                                                                <FormInputText
                                                                    name="mailGroupEntryDynamicInput"
                                                                    control={useFormAdd.control}
                                                                    label={mailGroupDynamicOptions.label}
                                                                    errors={useFormAdd.formState.errors}
                                                                    hideError={true}
                                                                />
                                                            ) : (
                                                                <FormInputSelect
                                                                    name="mailGroupEntryDynamicInput"
                                                                    control={useFormAdd.control}
                                                                    label={mailGroupDynamicOptions.label}
                                                                    errors={useFormAdd.formState.errors}
                                                                    options={mailGroupDynamicOptions.options}
                                                                    hideError={true}
                                                                />
                                                            )}
                                                        </Col>
                                                    )}
                                                    <Col md={6} className="mb-3">
                                                        <FormInputMultiSelect
                                                            name="subEntity"
                                                            control={useFormAdd.control}
                                                            label={t("Sub Entity")}
                                                            errors={useFormAdd.formState.errors}
                                                            hideError={true}
                                                            options={selectionChangeResponse.subEntityList}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={1}>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Tooltip title={`${t("Add New")}`}>
                                                        <IconButton
                                                            aria-label="add"
                                                            size="large"
                                                            className="add-icon-bttn"
                                                            onClick={useFormAdd.handleSubmit(
                                                                onSubmit,
                                                                onError
                                                            )}
                                                        >
                                                            <ControlPointOutlinedIcon sx={{ fontSize: 20 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        }
                    </div>

                    {serviceTypeSelected !== 0 && (
                        <div className="outlined-box pb-3">
                            <Box sx={{ width: '100%' }} className="frm__tab__head">
                                <TabContext value={tabValue}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="frm-role-search-section">
                                        <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                            <Tab label={t("Additional Role List")} value="1" />
                                            <Tab label={t("Role List")} value="2" />
                                        </TabList>
                                        {/* <TextField type="text" placeholder="Search" onChange={handleSearchTermChange} /> */}
                                        <div className="search-wrapper" onChange={handleSearchTermChange}>
                                            <div className="frm-search-ip-wrap position-relative">
                                                <input type="text" placeholder={t("Search")?? 'Search'} className="w-100" />
                                                <div className="search-icon">
                                                    <SearchOutlinedIcon fontSize="inherit" />
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                    <TabPanel value="1" className="pt-4 p-2">
                                        {/* <TextField type="text" placeholder="Search" onChange={handleSearchTermChange} /> */}
                                        <Row>
                                            <Col md={12} className="frm_htm_tble">

                                                <div className="table-wrapper">
                                                    <div className="table-outer mail-record">
                                                        <div className="table-header">
                                                            <div className="element">{t("Type")}</div>
                                                            <div className="element" onClick={() => handleSort()}>{t("Name")}</div>
                                                            <div className="element" onClick={() => handleSortEmail()}>{t("Email ID")}</div>
                                                            <div className="element">{t("Sub Entity")}</div>
                                                            <div className="element"></div>
                                                        </div>
                                                        {
                                                            selectionChangeResponse?.additionalRoleList?.length ? (
                                                                selectionChangeResponse?.additionalRoleList.map((adRole: any, index: number) => {
                                                                    if (!adRole.isEdit) {
                                                                        return (
                                                                            <div key={index} className="table-body">
                                                                                <div className="element">
                                                                                    <p className="m-0 d-flex align-items-center h-100">{adRole.RECORD_TYPE}</p>
                                                                                </div>
                                                                                <div className="element">
                                                                                    <p className="m-0 d-flex align-items-center h-100">{adRole.CONTACT_DET}</p>
                                                                                </div>
                                                                                <div className="element">
                                                                                    <p className="m-0 d-flex align-items-center h-100">{adRole.EMAIL_ID}</p>
                                                                                </div>
                                                                                <div className="element">
                                                                                    <p className="m-0 d-flex align-items-center h-100">{adRole.SUB_ENTITY_NAME}</p>
                                                                                </div>
                                                                                <div className="element">
                                                                                    <div className="d-flex row-action-bttns justify-content-center no-gutters">
                                                                                        <Tooltip title={`${t("Edit")}`}>
                                                                                            <IconButton
                                                                                                aria-label="calendar"
                                                                                                size="small"
                                                                                                className="px-1 edit-pencil"
                                                                                                onClick={() => handleEditRole(adRole, index)}
                                                                                            >
                                                                                                <HiOutlinePencilSquare />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                        <Tooltip title={`${t("Delete")}`}>
                                                                                            <IconButton
                                                                                                aria-label="calendar"
                                                                                                size="small"
                                                                                                className="px-1 delete-trash"
                                                                                                onClick={() => handleDeleteRole(adRole, index)}
                                                                                            >
                                                                                                <HiOutlineTrash />
                                                                                            </IconButton>
                                                                                        </Tooltip>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (

                                                                            <div key={index} className="table-body">
                                                                                <div className="element">
                                                                                    {/* <FormInputSelect
                                                                                    name="mailGroupEntryTypeRow"
                                                                                    control={useFormRowEdit.control}
                                                                                    label=""
                                                                                    errors={useFormRowEdit.formState.errors}
                                                                                    options={selectionChangeResponse.mailGroupList}
                                                                                    onChange={selectedMailGroupChange}
                                                                                    disabled={true}
                                                                                /> */}
                                                                                    <p className="m-0 d-flex align-items-center h-100">{adRole.RECORD_TYPE}</p>
                                                                                </div>
                                                                                <div className="element">
                                                                                    {mailGroupDynamicOptions.selectedGroup !== 0 && (
                                                                                        <>
                                                                                            {mailGroupDynamicOptions.selectedGroup === MailGroupId.MailId ? (
                                                                                                <p className="m-0 d-flex align-items-center h-100">{adRole.CONTACT_DET}</p>
                                                                                            ) : (
                                                                                                <p className="m-0 d-flex align-items-center h-100">{adRole.CONTACT_DET}</p>

                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                                <div className="element">
                                                                                    {mailGroupDynamicOptions.selectedGroup !== 0 && (
                                                                                        <>
                                                                                            {mailGroupDynamicOptions.selectedGroup === MailGroupId.MailId ? (
                                                                                                <p className="m-0 d-flex align-items-center h-100">{adRole.EMAIL_ID}</p>
                                                                                            ) : (
                                                                                                <p className="m-0 d-flex align-items-center h-100">{adRole.EMAIL_ID}</p>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                                <div className="element">
                                                                                    <FormInputMultiSelect
                                                                                        name="subEntityRow"
                                                                                        control={useFormRowEdit.control}
                                                                                        label=""
                                                                                        errors={useFormRowEdit.formState.errors}
                                                                                        options={editRowSubEntityList}
                                                                                    />
                                                                                </div>
                                                                                <div className="element">
                                                                                    <div className="d-flex row-action-bttns justify-content-center no-gutters">
                                                                                        <Tooltip title={`${t("Save")}`}>
                                                                                            <IconButton
                                                                                                aria-label="calendar"
                                                                                                size="small"
                                                                                                className="px-1 save-outlined"
                                                                                                onClick={() => handleSaveRole(adRole, index)}
                                                                                            >
                                                                                                <HiOutlineSave />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                        <Tooltip title={`${t("Delete")}`}>
                                                                                            <IconButton
                                                                                                aria-label="calendar"
                                                                                                size="small"
                                                                                                className="px-1 delete-trash"
                                                                                                onClick={() => handleDeleteRole(adRole, index)}
                                                                                            >
                                                                                                <HiOutlineTrash />
                                                                                            </IconButton>
                                                                                        </Tooltip>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                })
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


                                            </Col>
                                        </Row>
                                    </TabPanel>
                                    <TabPanel value="2" className="pt-4 p-2">
                                        <Row>
                                            <Col md={12} className="frm_htm_tble">
                                                <div className="table-wrapper">
                                                    <div className="table-outer mail-record-roleType">
                                                        <div className="table-header">
                                                            <div className="element">{t("Role Type")}</div>
                                                        </div>
                                                        {
                                                            selectionChangeResponse?.roleList?.length ? (
                                                                selectionChangeResponse?.roleList.map((role: any, index: number) => (
                                                                    <div key={index} className="table-body">
                                                                        <div className="element">
                                                                            <p className="m-0">{role.ROLE_NAME}</p>
                                                                        </div>
                                                                    </div>
                                                                ))
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
                                            </Col>
                                        </Row>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </div>
                    )}

                </Row >
            </DialogContent >
        </>
    )
};