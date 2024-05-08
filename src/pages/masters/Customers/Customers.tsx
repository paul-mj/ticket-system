import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form';

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
import { dedGrdList, enumDet, ExtraValues, objectDet } from "../../../common/typeof/MasterTypeof";
import { readEnums, readObjectData, readObjectValue, readObjInfo, readSubEntityValue, saveObject, saveSubEntities } from "../../../common/api/masters.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { useTranslation } from "react-i18next";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { MasterId, MenuId, fullGridDataAction } from "../../../common/database/enums";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import "./Customers.scss";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { formatAutoCompleteOptionsArray } from "../../../common/application/shared-function";
import ApiService from "../../../core/services/axios/api";
import { API } from "../../../common/application/api.config";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import DataGrid, { Scrolling, Editing, Column } from "devextreme-react/data-grid";
import { Checkbox } from "@mui/material";

export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}


const Customers = (props: FranchiseRequestDialogProps) => {
    const { i18n } = useTranslation();
    const [enumName, setEnumName] = useState<string>()
    const validationSchema = yup.object().shape({

        objName: yup.string().required(""),
        list: yup.array().of(
            yup.object().shape({
                APPLICATION_NAME: yup.string().nullable().required("")
            })
        ),
        objNameArabic: yup.string().required(""),

    });

    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );

    const { t } = useTranslation();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const Franchise_ID = userData && JSON.parse(userData).FRANCHISE_ID;

    const { getValues, reset, handleSubmit, setValue, control, trigger, formState: { errors } } = useForm<any>({
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
            subEntity: [],
            Active: true,
            applicationSearch: '',
            list: [],
        }
    });

    const [compName, setCompName] = useState<number | null>();
    const [emName, setEmName] = useState<number | null>();
    const [masterName, setMasterName] = useState<string>();
    const [masterExtra, setMasterExtra] = useState<ExtraValues>();
    const [readEnumDet, setreadEnumDet] = useState<enumDet>();
    const [objectName, setObjectName] = useState<string>();
    const [readObject, setreadObject] = useState<objectDet>();
    const [masterID, setMasterID] = useState<number>();
    const [dedCodeList, setDedCodeList] = useState<dedGrdList>([{ ID: 1, DedName: " " }]);
    const [editValue, setEditValue] = useState<boolean>(false);
    const [ObjectIdValue, setObjectIdValue] = useState<number>();
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [locationOptions, setLocationDropdowns] = useState<any>([]);
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const confirm = useConfirm();
 

    useEffect(() => {
        readMasterData();
        readApplicationOptions();
    }, []);

    const readApplicationOptions = async () => { 
        const readAppParams = {
            Procedure: "FRM_MASTER.CUSTOMER_APPLICATIONS_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: [{
                Name: "@CUSTOMER_ID",
                Value: rowData?.ID_ || -1,
                IsArray: false
            }]
        };
        const response = await ApiService.httpPost(API.getTable, readAppParams);
        setLocationDropdowns(response.Data);
    }


    useEffect(() => {
        if (activeDetails?.length) {
            setMasterID(activeDetails[0]?.Master.MASTER_ID);
        }
    }, [activeDetails]);

    useEffect(() => {
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            readEditValue();
        }
    }, []);


    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status: currentPage === MenuId.New ? fullGridDataAction.InsertRow : fullGridDataAction.UpdateRow,
        });
    };

    const readEditValue = async () => {
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
        setObjectIdValue(responseObject.Data?.OBJECT_ID)
        setValue('objParentID', responseObject.Data?.PARENT_ID ? responseObject.Data?.PARENT_ID : 0);
        setCompName(responseObject.Data?.PARENT_ID ? responseObject.Data?.PARENT_ID : 0);
        setValue('objectEnum', responseObject.Data?.OBJECT_TYPE ? responseObject.Data?.OBJECT_TYPE : 0);
        setEmName(responseObject.Data?.OBJECT_TYPE ? responseObject.Data?.OBJECT_TYPE : 0);
        setValue('objCode', responseObject.Data?.OBJECT_CODE);
        setValue('objName', responseObject.Data?.OBJECT_NAME);
        setValue('objNameArabic', responseObject.Data?.OBJECT_NAME_AR);
        setValue('shortName', responseObject.Data?.SHORT_NAME);
        setValue('remarks', responseObject.Data?.REMARKS);
        setValue('Active', responseObject.Data?.IS_ACTIVE === 1 ? true : false)

    }

    const [rowsData, setRowsData] = useState<any>([]);

    const readMasterData = async () => {
        dedCodeList.splice(0);
        const param = {
            Id: activeDetails[0]?.Master.MASTER_ID,
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
            const optionValue: any = []
            responseEnum.Data.map((e: any) => optionValue.push({ id: e.ENUM_ID, name: e.ENUM_NAME, readonly: true }))
            setreadEnumDet(optionValue)
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
            const optionValue: any = []
            responseObject.Data.map((e: any) => optionValue.push({ value: e.OBJECT_ID, label: e.OBJECT_NAME }))
            setreadObject(optionValue);
            const FieldName = responseObjInfo.Info?.Extras.filter((e: any) => e.FieldName === 'PARENT_ID')
            setObjectName(FieldName[0].FieldCaption)
            FieldName[0]?.IsRequired ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
        }
    };


    const handleCloseDialog = () => {
        onCloseDialog(true);
    };


    const renderTitleHeader = () => {

    }

    const handleCheckboxChange = (rowData: any, newValue: any) => {
        const updatedData = locationOptions.map((item: any) =>
            item.ID_ === rowData.ID_ ? { ...item, IS_MARKED: newValue } : item
        );
        setLocationDropdowns(updatedData);
    };

    const onSubmit = handleSubmit(async (data: any) => { 
        const applicationIds = locationOptions.filter((item: any) => item.IS_MARKED === 1).map((item: any) => item.ID_); 
        if (!applicationIds) {
            toast.error('Must need to select one applciation');
            return;
        }
        try {
            const param = {
                Data: {
                    PARENT_ID: data?.objParentID === 0 ? null : Number(data?.objParentID),
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
                MasterId: masterID,
                SubEntities: [],
                UserRights: [],
                CusApplications: applicationIds
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
                    console.log(param);
                    const response = await saveObject(param);
                    if (response.Id > 0) {
                        fullviewRowAddUpdate(response.Id);
                        toast.success(response.Message);
                        reset();
                        if (editValue) { handleCloseDialog() }
                        readEnumDet ? setValue('objEnumBooolean', true) : setValue('objEnumBooolean', false)
                        readObject ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
                        setCompName(null);
                        setEmName(null);
                        setRowsData([]);
                    }
                    else {
                        toast.error(response?.Message)
                    }
                } catch (e: any) {
                    toast.error(e?.message)
                }
            }
        } catch (error) {
            console.log(error);
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
            <DialogContent dividers className="dialog-content-wrapp">
                <Row>
                    <div className="outlined-box mb-3">
                        {/* <h5 className="outlined-box-head my-3">
                            {t("SubEntities Details")}
                        </h5> */}

                        <Row >

                            {readObject &&
                                <Col md={6} className="mb-3">
                                    <FormInputSelect
                                        name="objParentID"
                                        control={control}
                                        label={objectName ? objectName : 'label'}
                                        errors={errors}
                                        options={readObject}
                                        readOnly={viewMenu}
                                        onChange={handleChange}
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
                                    label={t("Sub Entity Name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}
                                    readOnly={viewMenu}
                                />
                            </Col>

                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="objName"
                                    control={control}
                                    label={t("Sub Entity Name in English")}
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

                    <div className="outlined-box py-4">
                        {/* <div className="d-flex justify-content-between align-items-center w-100 mt-2 mb-3">
                            <h5 className="outlined-box-head"> {t("Application")} </h5> 
                        </div> */}

                        <Row >
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <div className="dx-grid-inner-wrapper">
                                    <DataGrid
                                        dataSource={locationOptions}
                                        showBorders={true}
                                        width="100%"
                                        key="ID_"
                                        height="100%"
                                        showColumnLines={true}
                                        showRowLines={true}
                                        rowAlternationEnabled={true}
                                        rtlEnabled={i18n.dir() === "rtl"}
                                    >
                                        <Scrolling mode="virtual" rowRenderingMode="virtual" />

                                        <Editing mode="cell" allowUpdating={true} />

                                        <Column
                                            dataField="APPLICATION_NAME"
                                            width="60%"
                                            caption={t("Application Name")}
                                        />


                                        <Column
                                            dataField="IS_MARKED"
                                            caption="Select"
                                            width="100px"
                                            dataType="boolean" 
                                            cellRender={(cellData) => (
                                                <Checkbox
                                                    checked={cellData.data.IS_MARKED === 1}
                                                    disabled={viewMenu}
                                                    onChange={(e) => handleCheckboxChange(cellData.data, e.target.checked ? 1 : 0)}
                                                />
                                            )}
                                        />
                                    </DataGrid>
                                </div>
                            </Col>
                        </Row>



                        {/*  <Row>
                            <Col md={6}>
                                <FormInputSelect
                                    name="applicationSearch"
                                    control={control}
                                    label={'Application'}
                                    errors={errors}
                                    options={locationOptions}
                                    readOnly={viewMenu} 
                                />
                            </Col>
                            <Col md={6}>
                                {!viewMenu && <Button className="user-btn-section" onClick={addNewRowItem}> {t("Add")} </Button>}
                            </Col>
                        </Row>

                        <Stack direction="row" spacing={1} className="mt-3">
                            {fields && fields.map((field: any, index: any) => (
                                <Chip label={field.APPLICATION_NAME} variant="outlined" key={field.id} onDelete={() => handleDeleteItem(index)} />
                            ))}
                        </Stack> */}




                        {/*  <div className="dedtable-wrapper mt-4">
                            <div className="dedtable-outer">
                                <div className="dedtable-header">
                                    <div className="dedelement">{t("Activity Code")}</div>
                                     {!viewMenu &&
                                    <div className="dedelement"></div>
                                }
                                </div>

                                {fields && fields.map((field: any, index: any) => (
                                    <div className="dedtable-body" key={field.id}>
                                        <div className="dedelement">
                                            <FormInputText
                                                name={`list.${index}.firstName`}
                                                control={control}
                                                label=""
                                                errors={errors}
                                                readOnly={viewMenu}

                                            />
                                        </div>
                                        
                                        {!viewMenu &&
                                            <div className="dedelement">
                                                <div className="d-flex align-items-center justify-content-between row-action-btns h-100">
                                                    {fields.length !== 1 && (
                                                        <IconButton
                                                            aria-label="delete"
                                                            size="large"
                                                            onClick={() => removeRowItem(index)}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    )}
                                                    {fields.length - 1 === index && (
                                                        <IconButton
                                                            aria-label="delete"
                                                            size="large"
                                                            onClick={() => addNewRowItem()}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    )}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                ))
                                }
                            </div>
                        </div> */}
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
                            disabled={viewMenu}
                            errors={errors}
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
                                    onClick={() => onSubmit()}
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

export default Customers;
