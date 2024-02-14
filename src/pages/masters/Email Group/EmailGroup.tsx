import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
   } from "@material-ui/core";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { enumDet, ExtraValues, FormValues, MailGroupGridType, objectDet } from "../../../common/typeof/MasterTypeof";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getContactMailGroup, getMailGroup, getRoles, getUserMailGroup, mailgroupsSave, mailGroupSubEntities, readEnums, readMailGroup, readObjectData, readObjectValue, readObjInfo, saveObject } from "../../../common/api/masters.api";
import { Col, Row } from "react-bootstrap";
import DataGrid, { Column, Editing, Selection } from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";
import { FormInputMultiSelect } from "../../../shared/components/form-components/FormInputMultiSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import { MenuId, fullGridDataAction } from "../../../common/database/enums";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { formatOptionsArray } from "../../../common/application/shared-function";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}

const EmailGroup = (props: FranchiseRequestDialogProps) => {

    const validationSchema = yup.object().shape({
        objEnumBooolean: yup.boolean(),
        objObjectBoolean: yup.boolean(),
        objName: yup.string().required(''),
        objNameArabic: yup.string().required(''),       
        subEntity: yup.array().min(1).of(yup.string()),    
    });
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const {  reset, handleSubmit, control, setValue,  formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            objParentID: 0,
            objectEnum: 0,
            objEnumBooolean: false,
            objObjectBoolean: false,
            objCode: '',
            objName: '',
            objNameArabic: '',
            shortName: '',
            remarks: '',
            subEntity: [],
            mailGroup: '',           
            subEntityName: '',
            Active: true
        }
    });
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const confirm = useConfirm();   
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const { t, i18n } = useTranslation();
    const [scroll, setScroll] = React.useState<any>("paper");
    const [compName, setCompName] = useState<number | null>();
    const [emName, setEmName] = useState<number | null>();
    const [isActive, setIsActive] = useState(true);
    const [masterName, setMasterName] = useState<string>();
    const [masterExtra, setMasterExtra] = useState<ExtraValues>();
    const [readEnumDet, setreadEnumDet] = useState<enumDet>();   
    const [readObject, setreadObject] = useState<objectDet>();
    const [mailGroupTypeValue, setmailGroupTypeValue] = useState<number | null>();

    const [showRoles, setShowRoles] = useState(false);
    const [rolesName, setRolesName] = useState<any>([]);
    const [roleValue, setRoleValue] = useState<any>();

    const [showMailGroup, setShowMailGroup] = useState(false);
    const [mailGroupName, setMailGroupName] = useState([]);
    const [mailGroupValue, setmailGroupValue] = useState<any>();

    const [showUser, setShowUser] = useState(false);
    const [userName, setUserName] = useState([]);
    const [userValue, setUserValue] = useState<any>();
    const [subEntity, setSubEntity] = useState<any>([]);

    const [showMailID, setShowMailID] = useState(false);  
    const [mailIDValue, setmailIDValue] = useState<string>();


    const [showContact, setShowContact] = useState(false);
    const [contactName, setContactName] = useState([]);
    const [contactValue, setContactValue] = useState<any>();


   
    const [showText, setShowText] = useState<Boolean>(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState();
    const [readObjGrid, setreadObjGrid] = useState([]);
   
    const [viewMenu, setViewMenu] = useState<boolean>(false);
       const [mailEnumDet, setmailEnumDet] = useState<any>([]);
    const [editValue, setEditValue] = useState<boolean>(false);
    const [ObjectIdValue, setObjectIdValue] = useState<number>();   
    const [seLected, setSelected] = useState([]);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;

    useEffect(() => {
        readMasterData();
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            readEditData();
        }
    }, []);

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status:
                currentPage === MenuId.New
                    ? fullGridDataAction.InsertRow
                    : fullGridDataAction.UpdateRow,
        });
      //  onCloseDialog(true);
    };

    const readMasterData = async () => {
        const param = {
            Id: activeDetails[0]?.Master.MASTER_ID,
            CultureId: lang
        }
        const responseObjInfo = await readObjInfo(param);
        setMasterName(responseObjInfo.Info?.MasterName);
        setMasterExtra(responseObjInfo.Info?.Extras);
        const paramSubEntity = {
            UserId: userID,
            MailGroupId: activeAction.MenuId === MenuId.Edit ? rowData?.ID_ : activeAction.MenuId === MenuId.View ? rowData?.ID_ : -1,
            CultureId: lang
        }

        const onMark: any = [];
        const readSubEntities = await mailGroupSubEntities(paramSubEntity);
        readSubEntities?.Data.map((e: any) => { if (e?.IS_MARKED === 1) { onMark.push(e?.ID_) } });
        onMark && onMark?.length && setSelected(onMark); setValue('subEntity', onMark);
        setSubEntity(formatOptionsArray(readSubEntities.Data, 'SUB_ENTITY_NAME', 'ID_', 'IS_READONLY'))
        
        const mailEnum = {
            Id: 308,
            CultureId: lang
        }
        const responseEnum = await readEnums(mailEnum);
        const optionEnum: any = []
        responseEnum.Data.map((e: any) => optionEnum.push({ value: e.ENUM_ID, label: e.ENUM_NAME }))

        setmailEnumDet(responseEnum?.Data);       
        const paramRole = {
            UserId: userID,
            MailGroupId: null,
            CultureId: lang

        }
        const responseRole = await getRoles(paramRole);
        setRolesName(responseRole?.Data);

        const responseMailGroup = await getMailGroup(paramRole);
        setMailGroupName(responseMailGroup?.Data);

        const responseUser = await getUserMailGroup(paramRole);
        console.log(responseUser);
        setUserName(responseUser?.Data);

        const responseContact = await getContactMailGroup(paramRole);
        setContactName(responseContact?.Data);
    };

    const readEditData = async () => {
        setEditValue(true);
        if (activeAction.MenuId === MenuId.View) {
            setViewMenu(true);
        }

        const param = {
            MasterId: activeDetails[0]?.Master.MASTER_ID,
            ObjectId: rowData?.ID_,
            UserId: userID
        }
        const responseObject = await readObjectData(param);
        setObjectIdValue(responseObject.Data?.OBJECT_ID);
        setValue('objCode', responseObject.Data?.OBJECT_CODE);
        setValue('objName', responseObject.Data?.OBJECT_NAME);
        setValue('objNameArabic', responseObject.Data?.OBJECT_NAME_AR);
        setValue('shortName', responseObject.Data?.SHORT_NAME);
        setValue('remarks', responseObject.Data?.REMARKS);
        setValue('Active', responseObject.Data?.IS_ACTIVE === 1 ? true : false);
        const paramMailGroup = {
            UserId: userID,
            Id: rowData?.ID_,
            CultureId: lang
        }
        const responseMailGroup = await readMailGroup(paramMailGroup);
        const newData: any = []
        responseMailGroup?.Data.map((e: any, index: number) => {
            newData.push({
                ID: index + 1,
                ENTRY_TYPE: e?.ENTRY_TYPE,
                ENTRY_TYPE_NAME: e?.RECORD_TYPE,
                OBJECT_VALUE: e?.CONTENT_ID,
                OBJECT_NAME: e?.CONTACT_DET,
                MAIL_ID: e?.EMAIL_ID,
                TO_DELETE: e?.IS_READONLY === 0 ? " " : null
            })
        })
        setreadObjGrid(newData);
    };

    const renderGridCell = (data: any) => {
        if (data?.data?.TO_DELETE !== null) {
            return <>
                <IconButton className="p-0" aria-label="delete" onClick={() => deleteGrid(data)}>
                    <DeleteOutlineIcon className="p-0" style={{ fontSize: 20, transform: 'scale(0.8)' }} />
                </IconButton>
            </>;
        }
        else {
            return null;
        }
    };

    const deleteGrid = async (data: any) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to delete this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const tempGrid = readObjGrid.filter((e: any) => e.ID !== data.data?.ID)

            setreadObjGrid(tempGrid)
        }
    };

   
    const onSubmit = handleSubmit(async (data: FormValues) => {
        if (data?.subEntity?.length === 0) {
            toast.error(`${t("Select Sub Entities")}`);
            return
        }
        const GROUPS: any = [];
        readObjGrid.map((e: any) => {
            GROUPS.push(
                {
                    ENTRY_TYPE: e?.ENTRY_TYPE,
                    ROLE_ID: e?.ENTRY_TYPE === 30801 ? e?.OBJECT_VALUE : null,
                    USER_ID: e?.ENTRY_TYPE === 30803 ? e?.OBJECT_VALUE : null,
                    CONTACT_ID: e?.ENTRY_TYPE === 30805 ? e?.OBJECT_VALUE : null,
                    MAIL_GROUP_ID: e?.ENTRY_TYPE === 30802 ? e?.OBJECT_VALUE : null,
                    MAIL_ID: e?.MAIL_ID,
                    TO_DELETE: 0,

                }
            )
        })
        const param = {
            Data: {
                PARENT_ID: data?.objParentID === 0 ? null : data?.objParentID,
                OBJECT_TYPE: data?.objectEnum === 0 ? null : data?.objectEnum,
                OBJECT_ID: editValue ? ObjectIdValue : -1,
                OBJECT_CODE: data?.objCode,
                OBJECT_NAME: data?.objName,
                SHORT_NAME: data?.shortName,
                OBJECT_NAME_AR: data?.objNameArabic,
                SORT_ORDER: 0,
                REMARKS: data?.remarks,
                DATA_VALUE: 0,
                DECIMAL_01: 0,
                DECIMAL_02: 0,
                TEXT_01: "",
                TEXT_02: ""
            },
            IsActive: data?.Active ? 1 : 0,
            UserId: userID,
            SubEntities: data?.subEntity,
            Groups: GROUPS
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
                const response = await mailgroupsSave(param);
                if (response.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response.Message);
                    if (editValue) {
                        handleCloseDialog();
                    } 

                    reset();
                    readEnumDet ? setValue('objEnumBooolean', true) : setValue('objEnumBooolean', false)
                    readObject ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
                    setCompName(null);
                    setEmName(null);
                    setreadObjGrid([]);
                 //   setmailGroupTypeValue(null);
                  
                }
                else {
                    toast.error(response?.Message)
                }
            } catch (e: any) {
                toast.error(e?.message)
            }
        }
    });

    const mailGroupEntry = (e: any) => {
        setmailGroupTypeValue(e.target.value);
        switch (e.target.value) {
            case 30801:
                setRoleValue(null);
                setShowRoles(true);
                setShowMailGroup(false);
                setShowText(false);
                setShowUser(false);
                setShowMailID(false);
                setShowContact(false);
                break;

            case 30802:
                setmailGroupValue(null);
                setShowMailGroup(true);
                setShowRoles(false);
                setShowText(false);
                setShowUser(false);
                setShowMailID(false);
                setShowContact(false);
                break;

            case 30803:
                setShowMailGroup(false);
                setShowRoles(false);
                setShowText(false);
                setUserValue(null);
                setShowUser(true);
                setShowMailID(false);
                setShowContact(false);
                break;
            case 30804:
                setShowMailGroup(false);
                setShowRoles(false);
                setShowText(false);
                setShowUser(false);
                setmailIDValue('');
                setShowMailID(true);
                setShowContact(false);
                break;
            case 30805:
                setShowMailGroup(false);
                setShowRoles(false);
                setShowText(false);
                setShowUser(false);
                setShowMailID(false);
                setContactValue(null);
                setShowContact(true);
                break;
            default:
                setShowRoles(false);
                setShowText(false);
                setShowMailGroup(false);
                setShowUser(false);
                setShowMailID(false);
                setShowContact(false);
                break;
        }
    };
    const changeRole = (e: any) => {
        setRoleValue(e.target.value);
    }

    const changeMailGroup = (e: any) => {
        setmailGroupValue(e.target.value)
    }

    const changeUserMail = (e: any) => {
        setUserValue(e.target.value);
    }

    const onSelectionChange = ({ selectedRowsData }: any) => {
        setSelectedRowIndex(selectedRowsData[0]);
    }

    const isEmail: any = (val: any) => {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regEmail.test(val)) {
            return;
        } return val;
    }


    const AddtoDataGrid = () => {

        const findIDs = readObjGrid.map((e: any) => { return e?.ID })
        let IDValue;
        if (findIDs.length === 0) {
            IDValue = 1
        }
        else {
            IDValue = Math.max(...findIDs) + 1
        }

        switch (mailGroupTypeValue) {
            case 30801:
                if (roleValue === null || roleValue === undefined) {
                    toast.error(`${t("Select Role")}`)
                    break;
                }
                const findRole = readObjGrid.some((e: any) => (e.ENTRY_TYPE === mailGroupTypeValue && e?.OBJECT_VALUE === roleValue))
                if (findRole) {
                    toast.error(`${t("This Role Already Added")}`);
                    return;
                }                
                const newData: any = readObjGrid.filter((e: any) => e.ENTRY_TYPE !== null)
                const TypeEnumName: any = mailEnumDet.filter((e: any) => (e.ENUM_ID === mailGroupTypeValue))
                const RoleNameDet: any = rolesName.filter((e: any) => e?.ROLE_ID === roleValue)
                newData.push({
                    ID: IDValue,
                    ENTRY_TYPE: mailGroupTypeValue,
                    ENTRY_TYPE_NAME: TypeEnumName[0]?.ENUM_NAME,
                    OBJECT_VALUE: roleValue,
                    OBJECT_NAME: RoleNameDet[0]?.ROLE_NAME,
                    MAIL_ID: null,
                    TO_DELETE: " "

                })
                setreadObjGrid(newData);
                setRoleValue(null);
                break;

            case 30802:
                if (mailGroupValue === null || mailGroupValue === undefined) {
                    toast.error(`${t("Select Mail Group")}`)
                    break;
                }
                const findMailGroup = readObjGrid.some((e: any) => (e.ENTRY_TYPE === mailGroupTypeValue && e?.OBJECT_VALUE === mailGroupValue))
                if (findMailGroup) {
                    toast.error(`${t("This MailGroup is Already Added")}`);
                    return;
                }
                const newDataMailGroup: any = readObjGrid.filter((e: any) => e.ENTRY_TYPE !== null)
                const MailGroupID = mailEnumDet.filter((e: any) => (e.ENUM_ID === mailGroupTypeValue))
                const MailGroupNameDet: any = mailGroupName.filter((e: any) => e?.OBJECT_ID === mailGroupValue)
                newDataMailGroup.push({
                    ID: IDValue,
                    ENTRY_TYPE: mailGroupTypeValue,
                    ENTRY_TYPE_NAME: MailGroupID[0]?.ENUM_NAME,
                    OBJECT_VALUE: mailGroupValue,
                    OBJECT_NAME: MailGroupNameDet[0]?.OBJECT_NAME,
                    MAIL_ID: null,
                    TO_DELETE: " "
                })
                setreadObjGrid(newDataMailGroup);
                setmailGroupValue(null);
                break;

            case 30803:
                if (userValue === null || userValue === undefined) {
                    toast.error(`${t("Select User")}`)
                    break;
                }
                const findUser = readObjGrid.some((e: any) => (e?.ENTRY_TYPE === mailGroupTypeValue && e?.OBJECT_VALUE === userValue))
                if (findUser) {
                    toast.error(`${t("This User Already Added")}`);
                    return;
                }
                
                const newUserType: any = readObjGrid.filter((e: any) => e.ENTRY_TYPE !== null);
                const userNameID: any = mailEnumDet.filter((e: any) => (e.ENUM_ID === mailGroupTypeValue));
                const userNameDet: any = userName.filter((e: any) => e?.USER_ID === userValue);
                newUserType.push({
                    ID: IDValue,
                    ENTRY_TYPE: mailGroupTypeValue,
                    ENTRY_TYPE_NAME: userNameID[0]?.ENUM_NAME,

                    OBJECT_VALUE: userValue,
                    OBJECT_NAME: userNameDet[0]?.USER_FULL_NAME,


                    MAIL_ID: userNameDet[0]?.EMAIL_ID,
                    TO_DELETE: " "
                })
                setreadObjGrid(newUserType);
                setUserValue(null);
                break;

            case 30804:
                if (mailIDValue === null || mailIDValue === undefined) {
                    toast.error(`${t("Enter mail ID")}`)
                    break;
                }
                if (isEmail(mailIDValue) === undefined) {
                    console.log(mailIDValue);
                    toast.error(`${t("Enter Valid mail ID")}`);
                    break;
                }
                const findMail = readObjGrid.some((e: any) => (e.ENTRY_TYPE === mailGroupTypeValue && e?.MAIL_ID === mailIDValue))
                if (findMail) {
                    toast.error(`${t("This Mail Already Added")}`);
                    return;
                }

                const newDataMailID: any = readObjGrid.filter((e: any) => e.ENTRY_TYPE !== null)
                const mailIDExists: any = readObjGrid.some((e: any) => (e.ENTRY_TYPE === 30804))
                const MailIDData: any = mailEnumDet.filter((e: any) => (e.ENUM_ID === mailGroupTypeValue))
                newDataMailID.push({
                    ID: IDValue,
                    ENTRY_TYPE: mailGroupTypeValue,
                    ENTRY_TYPE_NAME: MailIDData[0]?.ENUM_NAME,

                    OBJECT_VALUE: null,
                    OBJECT_NAME: null,

                    MAIL_ID: mailIDValue,
                    TO_DELETE: " "
                })

                setreadObjGrid(newDataMailID);
                setmailIDValue('');
                break;
            case 30805:

                if (contactValue === null || contactValue === undefined) {
                    toast.error(`${t("Select Contact")}`)
                    break;
                }
                const findContact = readObjGrid.some((e: any) => (e?.ENTRY_TYPE === mailGroupTypeValue && e?.OBJECT_VALUE === contactValue))
                if (findContact) {
                    toast.error(`${t("This Contact exists")}`);
                    return;
                }
                const newContactType: any = readObjGrid.filter((e: any) => e.ENTRY_TYPE !== null)
                const contactNameID = mailEnumDet.filter((e: any) => (e.ENUM_ID === mailGroupTypeValue))
                const contactNameDet: any = contactName.filter((e: any) => e?.CONTACT_ID === contactValue)
                newContactType.push({
                    ID: IDValue,
                    ENTRY_TYPE: mailGroupTypeValue,
                    ENTRY_TYPE_NAME: contactNameID[0]?.ENUM_NAME,
                    OBJECT_VALUE: contactValue,
                    OBJECT_NAME: contactNameDet[0]?.CONTACT_NAME,

                    MAIL_ID: contactNameDet[0]?.EMAIL_ID,
                    TO_DELETE: " "
                })
                setreadObjGrid(newContactType);
                setContactValue(null);
                break;
            default:
                break;
        }
    };

    const handleCloseDialog = () => {
        onCloseDialog(true);
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
                    <div className="outlined-box mb-3">
                        <h5 className="outlined-box-head my-3">
                            {t("Email Group")}
                        </h5>
                        <Row>
                            {subEntity &&
                                <Col md={6} className="mb-3">
                                    <FormInputMultiSelect
                                        name="subEntity"
                                        control={control}
                                        label={t("Sub Entities")}
                                        errors={errors}
                                        options={subEntity}
                                        readOnly={viewMenu}
                                    />
                                </Col>
                            }
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="objCode"
                                    control={control}
                                    label={t("Code")}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="objNameArabic"
                                    control={control}
                                    label={t("Email Group name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}
                                    
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="objName"
                                    control={control}
                                    label={t("Email Group name in English")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="shortName"
                                    control={control}
                                    label={t("Short Name")}
                                    readOnly={viewMenu}
                                />
                            </Col>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="remarks"
                                    control={control}
                                    label={t("Remarks")}
                                    multiline={true}
                                    maxLength={250}
                                    readOnly={viewMenu}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className="outlined-box pb-3">
                        <h5 className="outlined-box-head my-3">
                            {" "}
                            {t("Mail Group Entry type")}{" "}
                        </h5>
                        <Row>
                            {!viewMenu && mailEnumDet &&
                                <Col md={5} className="mb-3" >
                                    <FormControl size={"small"} variant="outlined" fullWidth>
                                        <InputLabel id="MailEnum"> {t("Mail Group Entry type")} </InputLabel>
                                        <Select
                                            label={t("Mail Group Entry type")}
                                            variant='outlined'
                                            className="w-100"
                                            defaultValue={null}

                                            onChange={mailGroupEntry}
                                            value={mailGroupTypeValue}
                                            size="small"
                                            inputProps={{ readOnly: viewMenu }}
                                        >
                                            {
                                                mailEnumDet && mailEnumDet.map((item: any, index: any) => {
                                                    return (<MenuItem value={item?.ENUM_ID} key={index} > {item?.ENUM_NAME} </MenuItem>)
                                                })
                                            }
                                        </Select>
                                    </FormControl>

                                </Col>
                            }
                            {rolesName && showRoles &&

                                <Col md={5} className="mb-3" >
                                    <FormControl size={"small"} variant="outlined" fullWidth>
                                        <InputLabel id="Roles"> {t("Select Roles")} </InputLabel>
                                        <Select
                                            label={t("Select Roles")}
                                            variant='outlined'
                                            className="w-100"
                                            defaultValue={null}
                                            onChange={changeRole}
                                            value={roleValue}
                                            size="small"
                                        >
                                            {
                                                rolesName && rolesName.map((item: any, index: any) => {
                                                    return (<MenuItem value={item?.ROLE_ID} key={index} > {item?.ROLE_NAME} </MenuItem>)
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Col>
                            }

                            {mailGroupName && showMailGroup &&

                                <Col md={5} className="mb-3" >
                                    <FormControl size={"small"} variant="outlined" fullWidth>
                                        <InputLabel id="Roles"> {t("Select Mail Group")}</InputLabel>
                                        <Select
                                            label={t("Select Mail Group")}
                                            variant='outlined'
                                            className="w-100"
                                            defaultValue={null}
                                            onChange={changeMailGroup}
                                            value={mailGroupValue}
                                            size="small"
                                        >
                                            {
                                                mailGroupName && mailGroupName.map((item: any, index) => {
                                                    return (<MenuItem value={item?.OBJECT_ID} key={index} > {item?.OBJECT_NAME} </MenuItem>)
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Col>
                            }

                            {userName && showUser &&
                                <Col md={5} className="mb-3" >
                                    <FormControl size={"small"} variant="outlined" fullWidth>
                                        <InputLabel id="Roles"> {t("Select User")} </InputLabel>
                                        <Select
                                            label={t("Select User")}
                                            variant='outlined'
                                            className="w-100"
                                            defaultValue={null}
                                            onChange={changeUserMail}
                                            value={userValue}
                                            size="small"
                                        >
                                            {
                                                userName && userName.map((item: any, index) => {
                                                    return (<MenuItem value={item?.USER_ID} key={index} > {item?.USER_FULL_NAME} </MenuItem>)
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Col>
                            }


                            {contactName && showContact &&
                                <Col md={5} className="mb-3" >
                                    <FormControl size={"small"} variant="outlined" fullWidth>
                                        <InputLabel id="Roles"> {("Select Contact")} </InputLabel>
                                        <Select
                                            label={("Select Contact")}
                                            variant='outlined'
                                            className="w-100"
                                            defaultValue={null}
                                            onChange={(e: any) => setContactValue(e.target.value)}
                                            value={contactValue}
                                            size="small"
                                        >
                                            {
                                                contactName && contactName.map((item: any, index) => {
                                                    return (<MenuItem value={item?.CONTACT_ID} key={index} > {item?.CONTACT_NAME} </MenuItem>)
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Col>
                            }


                            {showMailID &&


                                <Col md={5} className="mb-3">

                                    <TextField
                                        type="text"
                                        label={t("Email ID")}
                                        variant='outlined'
                                        className="w-100"
                                        onChange={(e: any) => setmailIDValue(e.target.value)}
                                        value={mailIDValue}
                                        size="small"
                                        fullWidth
                                    />

                                </Col>
                            }

                            {!viewMenu && mailEnumDet &&

                                <Col md={2} className="mb-3" >
                                    <FormControl size={"small"} variant="outlined" fullWidth>
                                        <Button onClick={AddtoDataGrid} sx={{ mr: 1 }}>
                                            {t("Add")}
                                        </Button>
                                    </FormControl>
                                </Col>
                            }

                            <Col lg={12} md={12} sm={12} xs={12} className="mb-3" >
                                <DataGrid
                                    id="dataGrid"
                                    dataSource={readObjGrid}
                                    showBorders={true}
                                    keyExpr="ID"
                                    showRowLines={true}
                                    rowAlternationEnabled={true}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    columnAutoWidth={true}
                                    onSelectionChanged={onSelectionChange}
                                    rtlEnabled={i18n.dir() === "rtl"}
                                >
                                    <Editing
                                        mode="cell"
                                      //  allowUpdating={true}
                                      //  allowDeleting={true}
                                    />
                                    <Column dataField="ENTRY_TYPE_NAME" caption={t("Type")} width={150} allowEditing={false} />
                                    <Column dataField="OBJECT_NAME" caption={t("Name")} width={300} allowEditing={false} />
                                    <Column dataField="MAIL_ID" caption={t("Email ID")} width={325} allowEditing={false} />
                                    {/* <Column
                                    dataField="TO_DELETE"
                                    width={50}
                                    
                                    caption="Delete"
                                    dataType="boolean"
                                    />  */}
                                    {!viewMenu &&
                                        < Column
                                            // caption="Delete"
                                            dataField="TO_DELETE"
                                            cellRender={renderGridCell} width={60}
                                            caption={t("Delete")}

                                        />
                                    }
                                    <Selection mode='single' />
                                </DataGrid>
                            </Col>
                        </Row>
                    </div>
                </Row>

            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <Row className="w-100 justify-content-between no-gutters">
                    <Col md={6}>
                        <FormInputCheckbox
                            name="Active"
                            control={control}
                            label={t("Active")}
                            errors={errors}
                            disabled={viewMenu}
                        />
                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end">
                            <Button
                                autoFocus
                                onClick={() => handleCloseDialog()}
                                className="mx-3"
                            >
                                {t("Close")}
                            </Button>
                            {!viewMenu &&
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="colored-btn"
                                    onClick={onSubmit}
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

export default EmailGroup;
