import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { FormProvider,  useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import ApiService from "../../../core/services/axios/api";
import axios from "axios";
import { UserForm } from "./Users-form";
import { UserRights } from "./User-rights";
import {  userGetUserRoles, userSave, userSubEntity } from "../../../common/api/masters.api";
import { toast } from "react-toastify";
import { MasterId, MenuId, fullGridDataAction } from "../../../common/database/enums";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { UserFormUser } from "../../../common/typeof/MasterTypeof";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import moment from "moment";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { t } from "i18next";
import { useTranslation } from "react-i18next";



const defValues = {
    UserForm: {
        code: "",
        EntityAccessType: null,
        UserName: "",
        FullNameAr: "",
        FullName: "",
        Password: "",
        ConfirmPassword: "",
        IsPwdExpires: false,
        PwdExpireDays: 0,
        PwdExprireDate: "",
        ChangePwd: false,
        MobileNo: '',
        MailID: '',
        Remarks: '',
        PublishLayout: false,
        UserType: 31401,
        FranchiseID: null,
        RoleType: '',
    }

};

const UserSchema = yup.object().shape({
    UserForm: yup.object().shape({
        UserName: yup.string().required(""),
        EntityAccessType: yup.string().required(""),
        FullName: yup.string().required(""),
        MailID: yup.string().email("Enter Valid Email").optional(),
        FullNameAr: yup.string().required(""),
    }),

});

export const UserFormCreation = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;  
    const { t, i18n } = useTranslation(); 
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const handleCloseDialog = () => {
        onCloseDialog(true);
    };

    const [subEntity, setSubEntity] = useState([]);
    const [role, setRole] = useState([]);
    const [roleChange, setRoleChange] = useState<number>(31401)
    const [entitySelected, setEntitySelected] = useState([]);
    const [rolesSelected, setRolesSelected] = useState([]);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [editValue, setEditValue] = useState(false);
    const [ExpiryPWD, setExpiryPWD] = useState<any>(false);
    const [entityVisible, setEntityVisible] = useState<any>(true);
    const [saveValue, setSaveValue] = useState<string>('New');
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    const userID = userData && JSON.parse(userData).USER_ID;
    const confirm = useConfirm();
    const [selectedRoleRowKeys, setSelectedRoleRowKeys] = useState<any>([]);
    const [selectedEntityRowKeys, setSelectedEntityRowKeys] = useState<any>([]);
    const SubEntityRet = (e: any) => {
        setEntitySelected(e)
    }

    const RoleRet = (e: any) => {
        setRolesSelected(e)
        setSaveValue('New');
    }
    const methods = useForm<UserFormUser>({
        resolver: yupResolver(UserSchema),
        defaultValues: defValues,

    });


    useEffect(() => {
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            readEditValue();
        }
        else {
            userRolesOnType(roleChange);
            subEntityValue();
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

    const readEditValue = async () => {
        if (activeAction.MenuId === MenuId.View) {
            setViewMenu(true);           
        }
        const Param = {
            MasterId: activeDetails[0]?.Master.MASTER_ID,
            ObjectId: rowData.ID_,
            UserId: userID
        }
        const RoleParam = {
            CultureId: lang,
            UserId: rowData.ID_
        }
        const EntityParam = {
            Id: rowData.ID_,
            CultureId: lang
        }

        try {

            const [responseUser, responseRole, responseEntity] = await axios.all([
                ApiService.httpPost('user/read', Param),
                ApiService.httpPost(`user/getUserRoles`, RoleParam),
                ApiService.httpPost(`user/getSubEntities`, EntityParam)
            ]);
            setRole(responseRole?.Data)
            setSelectedRoleRowKeys(responseRole?.Data.filter((e: any) => e.IS_MARKED === 1).map((e: any) => e.ID_))

            setSubEntity(responseEntity?.Data)
            setSelectedEntityRowKeys(responseEntity?.Data.filter((e: any) => e.IS_MARKED === 1).map((e: any) => e.ID_))
            methods.reset(FillEditData(responseUser?.Data));
            setExpiryPWD(responseUser?.Data?.IS_PWD_EXPIRES)
            setEditValue(true);
        }
        catch (err: any) {
            toast.error(err?.Message);
        }
    };

    const FillEditData = (UserFormResponse: any) => {
        if (UserFormResponse?.ITC_USR_SUB_ENTITY_ACCESS_TYPE === 31301) {
            setEntityVisible(false);
        }
        return {
            UserForm: {
                code: UserFormResponse?.USER_CODE,
                EntityAccessType: Number(UserFormResponse?.ITC_USR_SUB_ENTITY_ACCESS_TYPE),
                FullNameAr: UserFormResponse?.USER_FULL_NAME_AR,
                UserName: UserFormResponse?.USER_NAME,
                FullName: UserFormResponse?.USER_FULL_NAME,
                Password: UserFormResponse?.USER_PWD,
                ConfirmPassword: UserFormResponse?.CONFIRM_USER_PWD,
                IsPwdExpires: UserFormResponse?.IS_PWD_EXPIRES === 1 ? true : false,
                PwdExpireDays: UserFormResponse?.PWD_EXPIRY_DAYS,
                PwdExprireDate: UserFormResponse?.PWD_EXPIRY_DATE,
                ChangePwd: UserFormResponse?.ALLOW_TO_CHANGE_PWD === 1 ? true : false,
                MobileNo: UserFormResponse?.MOBILE_NO,
                MailID: UserFormResponse?.MAIL_ID,
                Remarks: UserFormResponse?.REMARKS,
                PublishLayout: UserFormResponse?.CAN_PUBLISH_LAYOUT === 1 ? true : false,
                UserType: UserFormResponse?.USER_TYPE,
                FranchiseID: UserFormResponse?.FRANCHISE_ID
            }
        }
    };

    const subEntityValue = async () => {
        const param = {
            Id: 0,
            CultureId: lang
        }
        try {
            const entityResponse = await userSubEntity(param);
            setSubEntity(entityResponse.Valid > 0 ? entityResponse.Data : null)

        }
        catch (error: any) {
            toast.error(error?.message);
        }
    };

    const userRolesOnType = async (e: any) => {
        const param = {
            CultureId: lang,
            TypeId: e,
            UserId: -1
        }
        console.log(param);
        try {
            const rolesResponse = await userGetUserRoles(param);
            console.log(rolesResponse);
            setRole(rolesResponse.Valid > 0 ? rolesResponse.Data : null)

        }
        catch (error: any) {
            toast.error(error?.message);
        }
    };


    const entityAccssType = (e: any) => {
        if (e === 31301) {
            setEntityVisible(false);
        }
        else { setEntityVisible(true); }
    }

    const userRoleChangeApi = (e: any) => {
        userRolesOnType(e)
    }


    /* On Submit */
    const onSubmit = async (data: any, e: any) => {
        if (data?.UserForm?.Password !== data?.UserForm?.ConfirmPassword) {
            toast.error(`${t("Password and confirm password not matching")}`);
            return
        }
        console.log(rolesSelected.length);
        if (rolesSelected.length === 0) {
            toast.error(`${t("Please select roles")}`);
            return
        }
        const SubEntityArray: any = [];
        const RolesArray: any = [];
        if (data?.UserForm?.EntityAccessType === '31302') {
            entitySelected?.map((e: any) => SubEntityArray.push(e?.ID_));
        }
        rolesSelected?.map((e: any) => RolesArray.push(e?.ID_));
        
        const PWD_EXPIRY_DATE = data?.UserForm?.PwdExprireDate? new Date(data?.UserForm?.PwdExprireDate).toDateString() : null
      
        const param = {
            MasterId: MasterId.UserID,
            UserId: userID,
            SubEntities: SubEntityArray,
            Roles: RolesArray,
           
            Data: {

                USER_ID: editValue ? rowData.ID_ : -1,
                USER_CODE: data?.UserForm?.code,
                ITC_USR_SUB_ENTITY_ACCESS_TYPE: data?.UserForm?.EntityAccessType,
                USER_NAME: data?.UserForm?.UserName,
                USER_FULL_NAME_AR: data?.UserForm?.FullNameAr,
                USER_FULL_NAME: data?.UserForm?.FullName,
                USER_PWD: editValue ? data?.UserForm?.Password : '',
                CONFIRM_USER_PWD: editValue ? data?.UserForm?.ConfirmPassword : '',
                IS_PWD_EXPIRES: data?.UserForm?.IsPwdExpires ? 1 : 0,
                PWD_EXPIRY_DAYS: data?.UserForm?.IsPwdExpires ? Number(data?.UserForm?.PwdExpireDays) : 0,
                PWD_EXPIRY_DATE: data?.UserForm?.IsPwdExpires ? PWD_EXPIRY_DATE : null,
                ALLOW_TO_CHANGE_PWD: data?.UserForm?.ChangePwd ? 1 : 0,
                MOBILE_NO: data?.UserForm?.MobileNo,
                MAIL_ID: data?.UserForm?.MailID,
                REMARKS: data?.UserForm?.Remarks,
                CAN_PUBLISH_LAYOUT: data?.UserForm?.PublishLayout ? 1 : 0,
                USER_TYPE: data?.UserForm?.UserType,
                FRANCHISE_ID: data?.UserForm?.FranchiseID
            }
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
                const response = await userSave(param)
                if (response?.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response.Message)
                    if (editValue) {
                        handleCloseDialog();
                    }
                    methods.reset(defValues);
                    subEntityValue();
                    userRolesOnType(roleChange);
                    setEntityVisible(true);
                    setSaveValue('Saved');
                }
                else {
                    toast.error(response.Message);
                }


            } catch (error: any) {
                toast.error(error.message)
            }

        }
    }
    /* Test Log */
    const onError = (errors: any, e: any) => console.log(errors, e);
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
            <DialogContent dividers className="dialog-content-wrapp p-3">
                <Row>
                    <FormProvider {...methods}>
                        <Col md={6} >
                            <div className="outlined-box mb-3 px-3 h-100">
                                <h5 className="outlined-box-head my-3">
                                    {t("User Details")}
                                </h5>
                                <Row>
                                    <UserForm userRoleChange={userRoleChangeApi} 
                                    EntityAccess={entityAccssType}  
                                    modeViewAccess={viewMenu} />
                                </Row>
                            </div>
                        </Col>
                        <Col md={6} > 
                            <div className="outlined-box pb-3 px-3 h-100">
                                <h5 className="outlined-box-head my-3">
                                    {t("User Rights")}
                                </h5>
                                <Row>
                                    <UserRights
                                        roles={role}
                                        subentities={subEntity}                                        
                                        RoleRet={RoleRet}
                                        SubEntityRet={SubEntityRet}
                                        accessEntity={entityVisible}                                        
                                        modeView={viewMenu}
                                    />
                                </Row>
                            </div>
                        </Col>
                    </FormProvider>
                </Row>
            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <Row className="w-100 justify-content-between no-gutters">
                    <div className="d-flex justify-content-end">
                        <Button autoFocus className="mx-3" onClick={() => handleCloseDialog()}>
                            {t("Close")}
                        </Button>
                        {!viewMenu &&
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                onClick={methods.handleSubmit(onSubmit, onError)}
                            >
                               {t("Save")}
                            </Button>
                        }
                    </div>

                </Row>
            </DialogActions>
        </>
    )

}



