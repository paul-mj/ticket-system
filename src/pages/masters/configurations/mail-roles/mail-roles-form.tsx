
import { Box, DialogActions, DialogContent, DialogTitle, IconButton, Tab, Button } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInputSelect } from "../../../../shared/components/form-components/FormInputSelect";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { CultureId } from "../../../../common/application/i18n";
import { readEnums } from "../../../../common/api/masters.api";
import { formatOptionsArray } from "../../../../common/application/shared-function";
import axios from "axios";
import { API } from "../../../../common/application/api.config";
import ApiService from "../../../../core/services/axios/api";
import { TableNoData } from "../../../../shared/components/table/no-data";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import localStore from "../../../../common/browserstore/localstore";
import { useConfirm } from "../../../../shared/components/dialogs/confirmation";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import "../configuration.scss";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import AutocompleteField from "../../../../shared/components/form-components/FormAutoCompleteSelect";

interface IRole {
    ID_: number;
    ROLE_NAME: string;
    IS_MARKED: number;
}

interface IApiResponse {
    roleOptionList: any;
    roleList: IRole[];
    copyOfRoleList: IRole[];
    additionalRoleList: any;
}



export const MailRolesForm = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;
    const confirm = useConfirm();
    const { t, i18n } = useTranslation();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const lang = CultureId();
    const [serviceTypeList, setServiceTypeList] = useState<any>()
    const [tabValue, setTabValue] = useState('1');
    const [roleOptionList, setRoleOptionList] = useState<any>([])
    const [selectionChangeResponse, setSelectionChangeResponse] = useState<any>(
        {
            roleList: [],
            copyOfRoleList: [],
            additionalRoleList: null,
        }
    );
    const [serviceTypeSelected, setServiceTypeSelected] = useState(0);
    const [disableRoleType, setDisableRoleType] = useState(false);
    const userData = localStore.getLoggedInfo();
    const [isValidCheck, setIsValidCheck] = useState(0);
    const userID = userData && JSON.parse(userData).USER_ID;


    const mailRolesSchema = yup.object().shape({
        serviceType: yup.string().required(""),
        roleType: yup
            .string()
            .nullable()
            .when("serviceType", {
                is: (value: any) => value, // Add your condition here
                then: disableRoleType ? yup.string() : yup.string().required(""),
            }),
    });

    const defValues = {
        serviceType: "",
        roleType: "",
    };



    const { control, handleSubmit, formState: { errors }, watch, setValue, resetField, trigger, getValues } = useForm<any>({
        resolver: yupResolver(mailRolesSchema),
        defaultValues: defValues,
    });
    const currentValue = watch('serviceType'); //Current Value of Service type, It can be use for previous value

    /* Handlfe Change tab */
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };


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

    /* Call Other API's While Service Change */
    const readServiceChangeDatas = async (id: number) => {
        const roleParams = {
            UserId: userID,
            MailGroupId: null,
            CultureId: lang,
        };
        const mailRoleParam = {
            id: id,
            CultureId: lang
        }
        const additionalRoleParams = {
            UserId: userID,
            Id: id,
            CultureId: lang,
        }
        try {
            const [roleOptionList, roleList, additionalRoles] =
                await axios.all([
                    ApiService.httpPost(API.masters.getreadRoles, roleParams),
                    ApiService.httpPost('MailRoles/read', mailRoleParam),
                    ApiService.httpPost('ServiceTypeMails/read', additionalRoleParams),
                ]);

            setSelectionChangeResponse({
                /* roleList: sampleResponse,
                copyOfRoleList: sampleResponse, */
                roleList: (roleList.Valid > 0 && roleList.Data?.length) ? roleList.Data : null,
                copyOfRoleList: (roleList.Valid > 0 && roleList.Data?.length) ? roleList.Data : null,
                additionalRoleList: (additionalRoles.Valid > 0 && additionalRoles.Data?.length) ? additionalRoles.Data : null,
            });
            const roleOptions = (roleOptionList.Valid > 0 && roleOptionList.Data?.length) ? formatOptionsArray(roleOptionList.Data, 'ROLE_NAME', 'ROLE_ID') : null;
            setRoleOptionList(roleOptions)
        } catch (error) {
            console.error(error);
        }
    }

    /* Service Type Change */
    const selectedGroupChange = async (event: any) => {
        if (event) {
            if (isValidCheck === 1) {
                const choice = await confirm({
                    ui: 'confirmation',
                    title: `${t('Confirmation')}`,
                    description: `${t('Unsaved Roles in the List, Do you wish to change Service Type?')}`,
                    confirmBtnLabel: `${t('Yes')}`,
                    cancelBtnLabel: `${t('No')}`,
                });
                if (choice) {
                    setIsValidCheck(0);
                    changeAllow(event)
                } else {
                    setValue('serviceType', currentValue);
                    /*  toast.error('Unsaved Roles are added against current service type. Please Save or delete. Otherwise press the continue button. it will clear the added Roles'); */
                    return;
                }
            }
            else {
                changeAllow(event)
            }
        }
    }


    const changeAllow = (event: any) => {
        setDisableRoleType(false);
        setValue('serviceType', event); //Present Value Set to New Dropdown
        setValue('roleType', ""); // Null Role type -> Allowing New Service type
        setServiceTypeSelected(event); //Set Service Type ID For API CALL
        readServiceChangeDatas(event); //call event change API's 
    }


    /* On Submit For Adding Role to Grid*/
    const onSubmit = (data: any, e: any) => {
        addNewRole(data);
    };

    /* Test Log */
    const onError = (errors: any, e: any) => console.log(errors, e);

    /* Add New Role */
    const addNewRole = (formData: any) => {
        if(!formData.roleType) {
            toast.error(`Please add one new Role and continue.`)
            return
        }
        const newRoleId = Number(formData.roleType);
        const newRoleName = roleOptionList.find((item: any) => item.value === Number(formData.roleType)).label;
        const existingRole = selectionChangeResponse?.roleList && selectionChangeResponse?.roleList.find((role: any) => role.ID_ === newRoleId);
        if (existingRole) {
            toast.error(`${newRoleName} is already exists in the role list`)
            return;
        }
        const newRole: IRole = {
            ID_: newRoleId,
            ROLE_NAME: newRoleName,
            IS_MARKED: 0
        }
        const newRoleList: IRole[] = selectionChangeResponse.roleList ? [...selectionChangeResponse.roleList, newRole] : [newRole];
        setSelectionChangeResponse({
            ...selectionChangeResponse,
            roleList: newRoleList,
        });
        setIsValidCheck(1);
        setDisableRoleType(true);
        setValue('roleType', "");
    }

    /* Delete Role Form List */
    const deleteRoleFormList = async (index: any) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to Delete this?')}`,
            confirmBtnLabel: `${t('Delete')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const updatedRoleList = selectionChangeResponse.roleList.filter((data: any, i: any) => i !== index);
            setIsValidCheck(1);
            setSelectionChangeResponse({
                ...selectionChangeResponse,
                roleList: updatedRoleList,
            });
        }

    }

    const onClickSaveRoleData = async () => {
        if (isValidCheck === 1 && getValues('serviceType')) {
            const saveRoleParam = {
                UserId: userID,
                ServiceType: serviceTypeSelected,
                Lines: selectionChangeResponse.roleList.map((x: any) => x.ID_)
            }
            const cnfrmDialog = await confirm({
                ui: 'confirmation',
                title: `${t('You Are About To Save')}`,
                description: `${t('Are you sure you want to Save this?')}`,
                confirmBtnLabel: `${t('Continue')}`,
                cancelBtnLabel: `${t('Cancel')}`,
            });
            if (cnfrmDialog) {
                const response = await ApiService.httpPost('MailRoles/save', saveRoleParam);
                if (response.Id > 0) {
                    const cmpltDialog = await confirm({
                        complete: true,
                        ui: 'success',
                        title: `${t('Success')}`,
                        description: response.Message,
                        confirmBtnLabel: `${t('Close')}`,
                    });
                    if (cmpltDialog) {
                        setIsValidCheck(0);
                        setDisableRoleType(false);
                        callGridList();
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
            await confirm({
                complete: true,
                ui: 'error',
                title: `${t('Error')}`,
                description: `${t('No new Role in the list. Please add one new Role and continue.')}`,
                confirmBtnLabel: `${t('Close')}`,
            });
        }

    };

    const callGridList = async () => {
        const mailRoleParam = {
            id: serviceTypeSelected,
            CultureId: lang
        }
        const response = await ApiService.httpPost('MailRoles/read', mailRoleParam);
        if (response.Valid > 0) {
            setSelectionChangeResponse({
                roleList: (response.Valid > 0 && response.Data?.length) ? response.Data : null,
                copyOfRoleList: (response.Valid > 0 && response.Data?.length) ? response.Data : null,
            })
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
            <DialogContent dividers className="dialog-content-wrapp minheightset">
                <Row>
                    <div className="outlined-box mb-3 pb-3">
                        <h5 className="outlined-box-head my-3">
                            {t("Add Mail Role")}
                        </h5>
                        <Row>
                            <Col md={4}>
                                <FormInputSelect
                                    name="serviceType"
                                    control={control}
                                    label={t("Service Type")}
                                    errors={errors}
                                    onChange={selectedGroupChange}
                                    options={serviceTypeList}
                                />
                            </Col>
                            {
                                serviceTypeSelected !== 0 && <>
                                    <Col md={4}>
                                        {/* <FormInputSelect
                                            name="roleType"
                                            control={control}
                                            label={t("Roles")}
                                            errors={errors}
                                            options={roleOptionList}
                                            hideError={true}
                                        /> */}
                                        <AutocompleteField
                                            control={control}
                                            name="roleType"
                                            label="Roles"
                                            errors={errors}
                                            options={roleOptionList}
                                            onChange={(data) => console.log(data)}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            className="search-colored-btn"
                                            onClick={handleSubmit(
                                                onSubmit,
                                                onError
                                            )}
                                        >
                                            {t("Add Role")}
                                        </Button>
                                    </Col>
                                </>
                            }
                        </Row>
                    </div>
                    {
                        (serviceTypeSelected !== 0) &&
                        <div className="outlined-box mb-3 pb-3">
                            <Box sx={{ width: '100%' }} className="frm__tab__head">
                                <TabContext value={tabValue}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                            <Tab label={t("Role List")} value="1" />
                                            <Tab label={t("Additional Role List")} value="2" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1" className="pt-4 p-2">
                                        <Row className="no-gutters">
                                            <Col md={12} className="frm_htm_tble px-0">
                                                <table>
                                                    <tr className="htm__table__head">
                                                        <th>{t("Roles")}</th>
                                                        <th style={{ "width": "70px", "textAlign": "center" }}>{t("Action")}</th>
                                                    </tr>
                                                    {
                                                        selectionChangeResponse?.roleList?.length ? (
                                                            selectionChangeResponse?.roleList.map((role: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td>{role.ROLE_NAME}</td>
                                                                    <td style={{ "textAlign": "center" }}>
                                                                        <IconButton
                                                                            aria-label="spaceboard"
                                                                            size="small"
                                                                            className="chart delete-trash"
                                                                            onClick={() => deleteRoleFormList(index)}
                                                                        >
                                                                            <HiOutlineTrash />
                                                                        </IconButton>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <> <TableNoData colSpan={2} message={'No Data'} /> </>
                                                        )
                                                    }
                                                </table>
                                            </Col>
                                        </Row>
                                    </TabPanel>
                                    <TabPanel value="2" className="pt-4 p-2">
                                        <Row className="no-gutters">
                                            <Col md={12} className="frm_htm_tble px-0">
                                                <table>
                                                    <tr className="htm__table__head">
                                                        <th>{t("Type")}</th>
                                                        <th>{t("Name")}</th>
                                                        <th>{t("Email ID")}</th>
                                                        <th>{t("Sub Entity")}</th>
                                                    </tr>
                                                    {
                                                        selectionChangeResponse?.additionalRoleList ? (
                                                            selectionChangeResponse?.additionalRoleList.map((adRole: any, index: number) => (
                                                                <tr key={index}>
                                                                    <td>{adRole.RECORD_TYPE}</td>
                                                                    <td>{adRole.CONTACT_DET}</td>
                                                                    <td>{adRole.EMAIL_ID}</td>
                                                                    <td>{adRole.SUB_ENTITY_NAME}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <> <TableNoData colSpan={4} message={'No Data'} /> </>
                                                        )
                                                    }
                                                </table>
                                            </Col>
                                        </Row>
                                    </TabPanel>
                                </TabContext>
                            </Box>
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
                            <Button autoFocus className="mx-3" onClick={() => onCloseDialog(true)}>
                                {t("Close")}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                onClick={() =>
                                    onClickSaveRoleData()
                                }
                            >
                                {t("Save")}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </DialogActions>
        </>
    )
};