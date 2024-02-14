import React, { useContext, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TreeView from 'devextreme-react/tree-view';
import { enumDet, ExtraValues, FormValues, menuGroupTyp, objectDet } from "../../../common/typeof/MasterTypeof";
import { MasterId, MenuId, fullGridDataAction } from "../../../common/database/enums";
import { readEnums, readObjectData, readObjectValue, readObjInfo, readUserRights, saveUserGroup, usrGroupread } from "../../../common/api/masters.api";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { useTranslation } from "react-i18next";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { useSelector } from "react-redux";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import './../User/User-right.scss'

export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}

const UserGroup = (props: FranchiseRequestDialogProps) => {
    const [enumName, setEnumName] = useState<string>()
    const validationSchema = yup.object().shape({
        objEnumBooolean: yup.boolean(),
        objObjectBoolean: yup.boolean(),
        objName: yup.string().required('User Group Name in English required'),
        objNameArabic: yup.string().required('User Group Name in Arabic required'),
        objectEnum: yup.string().nullable().required('Select User Group type'),
    });

    const { reset, control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            objParentID: null,
            objectEnum: null,
            objEnumBooolean: false,
            objObjectBoolean: false,
            objCode: '',
            objName: '',
            objNameArabic: '',
            shortName: '',
            remarks: '',
            Active: true
        }
    });
    const [compName, setCompName] = useState<number | null>();
    const [emName, setEmName] = useState<number | null>();
    const [isActive, setIsActive] = useState(true);
    const [masterName, setMasterName] = useState<string>();
    const [masterExtra, setMasterExtra] = useState<ExtraValues>();
    const [readEnumDet, setreadEnumDet] = useState<enumDet>();
    const [objectName, setObjectName] = useState<string>();
    const [readObject, setreadObject] = useState<objectDet>();
    const [menuGroup, setMenuGroup] = useState<menuGroupTyp>();
    const [editValue, setEditValue] = useState<boolean>(false);
    const [ObjectIdValue, setObjectIdValue] = useState<number>();
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const DataVal: any = [];
    const transArray: any = [];
    const rightArr: any = [];
    const { t, i18n } = useTranslation();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const handleCloseDialog = () => {
        onCloseDialog(true);
    };
    const confirm = useConfirm();
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    useEffect(() => {
        readMasterData();
        userGroupread()
    }, []);

    useEffect(() => {
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            readEditValue();
        }

    }, []);

    const readEditValue = async () => {

        setEditValue(true);
        if (activeAction.MenuId === MenuId.View) {
            setViewMenu(true);
        }
        const param = {
            MasterId: activeDetails[0]?.Master.MASTER_ID,
            ObjectId: rowData?.ID_,
            UserId: userID,
        };
        const responseObject = await readObjectData(param);
        setObjectIdValue(responseObject?.Data.OBJECT_ID);
        setValue(
            "objParentID",
            responseObject.Data?.PARENT_ID
                ? responseObject.Data?.PARENT_ID
                : 0
        );
        setCompName(
            responseObject.Data?.PARENT_ID
                ? responseObject.Data?.PARENT_ID
                : 0
        );

        setValue(
            "objectEnum",
            responseObject.Data?.OBJECT_TYPE
                ? responseObject.Data?.OBJECT_TYPE
                : 0
        );
        setEmName(
            responseObject.Data?.OBJECT_TYPE
                ? responseObject.Data?.OBJECT_TYPE
                : 0
        );
        setValue("objCode", responseObject.Data?.OBJECT_CODE);
        setValue("objName", responseObject.Data?.OBJECT_NAME);
        setValue("objNameArabic", responseObject.Data?.OBJECT_NAME_AR);
        setValue("shortName", responseObject.Data?.SHORT_NAME);
        setValue("remarks", responseObject.Data?.REMARKS);
        setValue(
            "Active",
            responseObject.Data?.IS_ACTIVE === 1 ? true : false
        );

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

    const readMasterData = async () => {
        const param = {
            Id: MasterId.UserGroup,
            CultureId: lang
        }
        const responseObjInfo = await readObjInfo(param);
        setMasterName(responseObjInfo.Info?.MasterName);
        setMasterExtra(responseObjInfo.Info?.Extras);
        /* For Enum Data from Extras */
        if (responseObjInfo.Info?.RefEnumId > 0) {
            const paramEnum = {
                Id: responseObjInfo.Info?.RefEnumId,
                CultureId: lang
            }
            const responseEnum = await readEnums(paramEnum);
            const optionValue: any = [];
            responseEnum.Data.map((e: any) =>
                optionValue.push({ value: e.ENUM_ID, label: e.ENUM_NAME })
            );

            setreadEnumDet(optionValue);
            const FieldName = responseObjInfo.Info?.Extras.filter((e: any) => e.FieldName === 'OBJECT_TYPE')
            setEnumName(FieldName[0].FieldCaption)
            FieldName[0]?.IsRequired ? setValue('objEnumBooolean', true) : setValue('objEnumBooolean', false)
        }
        /* For Parent Data from Extras */
        if (responseObjInfo.Info?.RefMasterId > 0) {
            const paramParent = {
                Id: responseObjInfo.Info?.RefMasterId,
                CultureId: lang
            }
            const responseObject = await readObjectValue(paramParent);
            setreadObject(responseObject.Data)
            const FieldName = responseObjInfo.Info?.Extras.filter((e: any) => e.FieldName === 'PARENT_ID')
            setObjectName(FieldName[0].FieldCaption)
            FieldName[0]?.IsRequired ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
        }
    };

    const userGroupread = async () => {
        const param = {
            Id: activeAction.MenuId == MenuId.Edit ? rowData?.ID_ : activeAction.MenuId == MenuId.View ? rowData?.ID_ : -1,
            CultureId: lang
        }
        const response = await readUserRights(param);
        setMenuGroup(response?.Rights);
    }

    function hasNodeChildren(item: any) {
        return (item.children.length > 0);
    };

    function findNumberofNodes(NodeValue: any) {
        if (hasNodeChildren(NodeValue)) {
            for (let i = 0; i < NodeValue.children.length; i++) {
                findNumberofNodes(NodeValue.children[i]);
            }
        }
        else {
            DataVal.push(NodeValue.itemData);
        }
        return DataVal;
    };

    const handleSelectTreeView = (Value: any) => {
        const findChild = Value.node;
        rightArr.splice(0);
        const result = findNumberofNodes(findChild)
        const filteredDup = result.filter((thing: any, index: any, self: any) =>
            index === self.findIndex((t: any) => (
                t.Id === thing.Id && thing.selected === true)
            ));
        filteredDup.map((val: any) => rightArr.push({ "IsChecked": 1, "IsMaster": val.IsMaster, "MasterId": val.MasterId, "MasterMenuId": val.MasterMenuId, "Id": val.Id }));

    };


    const onSubmit = handleSubmit(async (data: FormValues) => {
        {
            masterExtra && masterExtra.map((value) => {
                if (value.IsRequired == 1) {
                    setError(value?.FieldName, { type: "custom", message: 'Required' });
                }
            })
        }

        menuGroup?.map(function (Main: any) {
            var result = rightArr.filter((Sub: any) => Main.Id === Sub.Id);
            if (result.length > 0) { Main.IsChecked = 1; };
            return Main
        });

        transArray.slice(0);
        menuGroup?.map((elemnt, index) => {
            if (elemnt.IsChecked === undefined) {
                transArray.push({ "IsChecked": 1, "IsMaster": elemnt.IsMaster, "MasterId": elemnt.MasterId, "MasterMenuId": elemnt.MasterMenuId, "Id": elemnt.Id })
            }
            else if (elemnt.IsChecked === true) {
                transArray.push({ "IsChecked": 1, "IsMaster": elemnt.IsMaster, "MasterId": elemnt.MasterId, "MasterMenuId": elemnt.MasterMenuId, "Id": elemnt.Id })
            }
            else if (elemnt.IsChecked === false) {
                transArray.push({ "IsChecked": 0, "IsMaster": elemnt.IsMaster, "MasterId": elemnt.MasterId, "MasterMenuId": elemnt.MasterMenuId, "Id": elemnt.Id })

            }
            else {
                transArray.push({ "IsChecked": elemnt.IsChecked, "IsMaster": elemnt.IsMaster, "MasterId": elemnt.MasterId, "MasterMenuId": elemnt.MasterMenuId, "Id": elemnt.Id })
            }
        })

        const param = {
            Data: {
                PARENT_ID: data?.objParentID === 0 ? null : data?.objParentID,
                OBJECT_TYPE: data?.objectEnum === 0 ? null : Number(data?.objectEnum),
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
            MasterId: MasterId.UserGroup,
            Rights: transArray
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
                const response = await saveUserGroup(param);
                if (response.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(`${t("Saved Sucessfully")}`);
                    if (editValue) {
                        handleCloseDialog();
                    }
                    reset();

                    readEnumDet ? setValue('objEnumBooolean', true) : setValue('objEnumBooolean', false)
                    readObject ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
                    setCompName(null);
                    setEmName(null);
                    userGroupread();
                }
                else {
                    toast.error(response?.Message)
                }
            } catch (e: any) {
                toast.error(e?.message)
            }
        }
    });

    const handleChange = () => { };

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
                <Row className="no-gutters">
                    <Col md={6} className="bg_white" style={{ backgroundColor: '#fff', borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <div className="outlined-box mb-3 " style={{ border: 'none' }}>
                            <h5 className="outlined-box-head my-3">
                                {t("User Group Details")}
                            </h5>
                            {readEnumDet &&
                                <Col md={12} className="mb-3">
                                    <FormInputSelect
                                        name="objectEnum"
                                        control={control}
                                        label={enumName ? enumName : "label"}
                                        errors={errors}
                                        disabled={editValue}
                                        options={readEnumDet}
                                        onChange={handleChange}
                                        readOnly={viewMenu}
                                    />
                                </Col>
                            }

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="objCode"
                                    control={control}
                                    label={t("Code")}
                                    readOnly={viewMenu}
                                />
                            </Col>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="objNameArabic"
                                    control={control}
                                    label={t("User Group name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}
                                    readOnly={viewMenu}
                                />
                            </Col>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="objName"
                                    control={control}
                                    label={t("User Group name in English")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                />
                            </Col>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="shortName"
                                    control={control}
                                    label={t("Short Name")}
                                    readOnly={viewMenu}
                                />
                            </Col>

                            <Col md={12} className="mb-5 pb-5 bb-5">
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

                    <Col md={6} className="res-ueser-group">
                        <div className="outlined-box px-3">
                            <h5 className="outlined-box-head my-3">
                                {" "}
                                {t("Set Rights")} {" "}
                            </h5>
                            <TreeView
                                id='Menu-Treeviw'
                                items={menuGroup}
                                dataStructure="plain"
                                keyExpr="Id"
                                displayExpr="TaskName"
                                parentIdExpr="ParentId"
                                selectByClick={true}
                                showCheckBoxesMode="normal"
                                selectionMode="multiple"
                                width={400}
                                height={450}
                                expandedExpr="isExpanded"
                                onItemSelectionChanged={handleSelectTreeView}
                                selectedExpr="IsChecked"
                                rtlEnabled={i18n.dir() === "rtl"}
                            >
                            </TreeView>
                        </div>
                    </Col>

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
                                < Button
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
            </DialogActions >
        </>
    );
};

export default UserGroup;
