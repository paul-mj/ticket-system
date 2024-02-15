import React, { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import { enumDet, RoleForm, UserGroupLoad } from "../../../common/typeof/MasterTypeof";
import { getApplicableGroupinRoles, readEnums, readGroupLookup, readRole, saveUserRole, userGetRoles } from "../../../common/api/masters.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { FormControl } from "@mui/material";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { useTranslation } from "react-i18next";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import { MenuId, fullGridDataAction } from "../../../common/database/enums";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import AutocompleteField from "../../../shared/components/form-components/FormAutoCompleteSelect";

export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}

const UserRoles = (props: FranchiseRequestDialogProps) => {
    const validationSchema = yup.object().shape({
        objName: yup.string().required('Role Name in English required'),
        objNameArabic: yup.string().required('Role Name in Arabic required'),
        objRoleType: yup.string().nullable().required('Select Role Type'),
    });
    const [enmRoles, setEnumRoles] = useState<enumDet>();
    const [resetEnum, setresetEnum] = useState<number | null>();
    const [isActive, setIsActive] = useState(true);
    const [usrGroupLoad, setUsrGroupLoad] = useState<UserGroupLoad>();
    const [selectedGroupGrd, setSelectedGroupGrd] = useState<any>([]);
    const [FilteredUserGroup, setFilteredUsrGroup] = useState<any>();
    const [userChecked, setUserChecked] = useState<UserGroupLoad | null>();
    const [editValue, setEditValue] = useState<boolean>(false);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [selectedGrp, setSelectedGrp] = useState<any>();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const { t, i18n } = useTranslation();
    const confirm = useConfirm();
    const lang = CultureId();
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [roleIDValue, setRoleIDValue] = useState<number>();
    const { reset, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm<RoleForm>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            objRoleType: null,
            objFullGroup: '',
            objName: '',
            objNameArabic: '',
            Active: true,
            remarks: ''

        }
    });

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const isSmallScreen = windowWidth < 550;

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Set the width and height based on the screen size
    const gridWidth = windowWidth >= 444 ? 300 : 174;
    const gridColWidth = windowWidth >= 444 ? 205 : 105;
    const gridHeight = isSmallScreen ? 200 : 400;

    const renderGridCell = (data: any) => {
        return <>
            <IconButton className="p-0" aria-label="delete" onClick={() => deleteGrid(data)}>
                <DeleteOutlineIcon style={{ fontSize: 20, transform: 'scale(0.8)' }} />
            </IconButton>
        </>

    }

    const deleteGrid = async (data: any) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to delete this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const tempGrid = selectedGroupGrd.filter((e: any) => e.ID_ !== data.data?.ID_)
            setSelectedGroupGrd(tempGrid)
        }
    }
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);

    const handleCloseDialog = () => {
        onCloseDialog(true);
    };

    useEffect(() => {
        readInformation();
    }, []);

    useEffect(() => {
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) { readEditValue(); }
    }, []);

    const readEditValue = async () => {
        const responseRoles = await readRole(rowData?.ID_);
        setRoleIDValue(responseRoles?.Data.ROLE_ID);
        if (activeAction.MenuId === MenuId.View) {
            setViewMenu(true);
        }
        const response = await readGroupLookup(0);
        const responseApplicableRoles = await getApplicableGroupinRoles(rowData?.ID_);
        const filteredArray = response?.Data.filter((obj1: any) => responseApplicableRoles?.Data.some((obj2: any) => obj2.ID_ === obj1.ID_)).map((x: any) => ({ ...x, DELETE: 0 }))
        setSelectedGroupGrd(filteredArray);
        setEditValue(true);
        setValue('objName', responseRoles?.Data.ROLE_NAME);
        setValue('objNameArabic', responseRoles?.Data.ROLE_NAME_AR);
        setValue('objRoleType', responseRoles?.Data.ROLE_TYPE);
        setresetEnum(responseRoles?.Data.ROLE_TYPE);
        setValue('remarks', responseRoles?.Data.REMARKS);
        setValue('Active', responseRoles?.Data.IS_ACTIVE ? true : false);
        setFilteredUsrGroup(formatProcessResponse(response?.Data?.filter((e: any) => e?.ROLE_TYPE === responseRoles?.Data.ROLE_TYPE)))
    }

    const formatProcessResponse = (processList: any) => {
        return processList.map((row: any) => ({
            value: row.ID_,
            label: row.OBJECT_NAME
        }));
    };

    const roleChange = (event: any) => {
        setresetEnum(event);
        setSelectedGroupGrd([]);
        setSelectedGrp(0);
        setFilteredUsrGroup(formatProcessResponse(usrGroupLoad?.filter((e: any) => e?.ROLE_TYPE === event)));

    };

    const AddtoDataGrid = () => { 
        const { objFullGroup, objRoleType } = getValues()
        console.log(selectedGroupGrd)
        console.log(selectedGrp, objRoleType)

        if (!objFullGroup) {
            return
        }
        if (!objRoleType) {
            return
        }
        const isExistDetails =
            selectedGroupGrd &&
            selectedGroupGrd.some(
                (item: any) => item.ID_ === objFullGroup
            );

        if (isExistDetails) {
            toast.error(`${t("This Group already added")}`);
            return
        }
        const addtoGrid: any = [...selectedGroupGrd]
        usrGroupLoad?.forEach((e: any) => { if (e?.ID_ === objFullGroup) addtoGrid.push({ ID_: e?.ID_, OBJECT_CODE: e?.OBJECT_CODE, OBJECT_NAME: e?.OBJECT_NAME, ROLE_TYPE: e?.ROLE_TYPE, DELETE: 0 }) })
        setSelectedGroupGrd(addtoGrid);
        setSelectedGrp(null);
        setValue('objFullGroup', null);
        console.log(addtoGrid)
    };


    const selectedGroupChange = (event: any) => {
        setSelectedGrp(event);
    };

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

    const readInformation = async () => {
        const roleEnum = 302;
        const response = await readGroupLookup(0);
        const paramEnum = {
            Id: roleEnum,
            CultureId: lang
        }
        const responseEnum = await readEnums(paramEnum);

        const optionValue: any = [];
        responseEnum.Data.map((e: any) =>
            optionValue.push({ value: e.ENUM_ID, label: e.ENUM_NAME })
        );
        setEnumRoles(optionValue);
        setUsrGroupLoad(response?.Data);
    };

    /*  const onSelectionChange = ({ selectedRowsData }: any) => {
         //checkedProj.splice(0);
         setUserChecked(selectedRowsData);
 
     }
  */
    /* 
        const handleRoleChange = (e: any) => {
            console.log(e);
        } */


    const onSubmit = handleSubmit(async (data: RoleForm) => {
        const GrpArray: any = [];
        selectedGroupGrd?.map((e: any) => { if (!e?.DELETE) { GrpArray.push(e?.ID_) } });
        if (GrpArray.length === 0) {
            toast.error(`${t("Please Select Group")}`);
            return
        }
        const param = {
            MasterId: activeDetails[0]?.Master.MASTER_ID,
            UserId: userID,
            Data: {
                ROLE_ID: editValue ? roleIDValue : -1,
                ROLE_TYPE: Number(data?.objRoleType),
                IS_ACTIVE: data?.Active ? 1 : 0,
                ROLE_NAME: data?.objName,
                ROLE_NAME_AR: data?.objNameArabic,
                REMARKS: data?.remarks
            },
            Groups: GrpArray
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
                const response = await saveUserRole(param);
                if (response.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response.Message)
                    if (editValue) {
                        handleCloseDialog();
                    }
                    reset();
                    setresetEnum(null);
                    setUserChecked(null);
                    setFilteredUsrGroup(null)
                    setSelectedGrp([]);
                }
                else {
                    toast.error(response?.Message)
                }
            } catch (e: any) {
                toast.error(e?.message)
            }
        }
    })


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
                <Row >
                    <Col md={6} >
                        <div className="outlined-box mb-3 px-3 h-100">
                            <h5 className="outlined-box-head my-3">
                                {t("User Role Details")}
                            </h5>

                            {enmRoles &&
                                <Col md={12} className="mb-3">
                                    <FormInputSelect
                                        name="objRoleType"
                                        control={control}
                                        label={t("Role Type")}
                                        errors={errors}
                                        options={enmRoles}
                                        disabled={editValue}
                                        onChange={roleChange}
                                        readOnly={viewMenu}
                                    />
                                </Col>
                            }

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="objNameArabic"
                                    control={control}
                                    label={t("User role name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}

                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="objName"
                                    control={control}
                                    label={t("User role name in English")}
                                    errors={errors}
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

                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="outlined-box mb-3 px-3 h-100">
                            <h5 className="outlined-box-head my-3">
                                {" "}
                                {t("User Groups")}{" "}
                            </h5>
                            <Row>
                                {!viewMenu &&
                                    <Col className="m-0">
                                        {/* <FormInputSelect
                                            name="objFullGroup"
                                            control={control}
                                            label={t("User Group")}
                                            errors={errors}
                                            options={FilteredUserGroup}
                                            onChange={selectedGroupChange}
                                            readOnly={viewMenu}
                                        /> */}
                                        <AutocompleteField
                                            control={control}
                                            name="objFullGroup"
                                            label={t("User Group")}
                                            errors={errors}
                                            options={FilteredUserGroup ?? []}
                                            onChange={selectedGroupChange}
                                            readOnly={viewMenu}
                                        />
                                    </Col>
                                }
                                {!viewMenu &&
                                    <Col md={2} className="mb-3 ps-0" >
                                        <div className="d-flex justify-content-center">
                                            <FormControl size={"small"} variant="outlined"  >
                                                <Button 
                                                className="user-btn-section"
                                                 onClick={AddtoDataGrid}  >
                                                    {t("Add")}
                                                </Button>
                                            </FormControl>
                                        </div>

                                    </Col>
                                }
                                <Col md={12} className="mb-3">
                                    <DataGrid
                                        dataSource={selectedGroupGrd}
                                        showBorders={true}
                                        keyExpr="ID_"
                                        //  onSelectionChanged={onSelectionChange}
                                        width={gridWidth}
                                        height={gridHeight}
                                        showColumnLines={true}
                                        showRowLines={true}
                                        rowAlternationEnabled={true}
                                        rtlEnabled={i18n.dir() === "rtl"}
                                    >
                                        <Paging defaultPageSize={10} />
                                        <Column dataField="OBJECT_NAME" caption={t("Selected Group")} width={gridColWidth} />
                                        {!viewMenu &&
                                            <Column
                                                dataField="DELETE"
                                                cellRender={renderGridCell} width={10}
                                                caption={t("Delete")}
                                                alignment="center" />
                                        }
                                    </DataGrid>
                                </Col>
                            </Row>
                        </div>
                    </Col >

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
        //</form>
        // </React.Fragment>
    );
};

export default UserRoles;
