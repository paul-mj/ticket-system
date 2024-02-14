import { useContext, useEffect, useState } from "react";
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
import { enumDet, ExtraValues, FormValues, objectDet } from "../../../common/typeof/MasterTypeof";
import { mailGroupSubEntities, readEnums, readObjectData, readObjectValue, readObjInfo, saveObject } from "../../../common/api/masters.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { useTranslation } from "react-i18next";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { MasterId, MenuId, fullGridDataAction } from "../../../common/database/enums";
import DataGrid, { Column, Editing, Scrolling, Selection } from "devextreme-react/data-grid";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { Checkbox } from "@mui/material";


export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}


const MasterForm = (props: FranchiseRequestDialogProps) => {
    const { t, i18n } = useTranslation();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [enumName, setEnumName] = useState<string>()
    const confirm = useConfirm();
    const validationSchema = yup.object().shape({
        objEnumBooolean: yup.boolean(),
        objObjectBoolean: yup.boolean(),
        objName: yup.string().required(''),
        objNameArabic: yup.string().required(''),
        objectEnum: yup.number().when('objEnumBooolean', { is: true, then: yup.number().min(1, "") }),
        objParentID: yup.number().when('objObjectBoolean', { is: true, then: yup.number().min(1, "") })
    });

    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    // const masterContext = useContext(fullViewRowDataContext);
    const { reset, handleSubmit, control, setValue, formState: { errors } } = useForm<FormValues>({
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
            Active: true
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
    const [editValue, setEditValue] = useState<boolean>(false);
    const [ObjectIdValue, setObjectIdValue] = useState<number>();
    const [subEntityVisible, setSubEntityVisible] = useState<boolean>(false);
    const [entityGrid, setEntityGrid] = useState<any>([]);
    const [viewMenu, setViewMenu] = useState<boolean>(false);

    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    useEffect(() => {
        readMasterData();
        readSubEntity();
    }, []);

    useEffect(() => {
        if (activeDetails?.length) {
            setMasterID(activeDetails[0]?.Master.MASTER_ID)

        }
    }, [activeDetails])

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
    const readMasterData = async () => {
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
            //setreadEnumDet(responseEnum.Data)
            const FieldName = responseObjInfo.Info?.Extras.filter((e: any) => e.FieldName === 'OBJECT_TYPE')
            const optionValue: any = []
            responseEnum.Data.map((e: any) => optionValue.push({ value: e.ENUM_ID, label: e.ENUM_NAME }))

            setreadEnumDet(optionValue)
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
            // setreadObject(responseObject.Data)
            const optionValue: any = []
            responseObject.Data.map((e: any) => optionValue.push({ value: e.OBJECT_ID, label: e.OBJECT_NAME }))
            setreadObject(optionValue);
            const FieldName = responseObjInfo.Info?.Extras.filter((e: any) => e.FieldName === 'PARENT_ID')
            setObjectName(FieldName[0].FieldCaption)
            FieldName[0]?.IsRequired ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
        }
    };

    const readSubEntity = async () => {
        entityGrid.splice(0);
        const paramSubEntity = {
            UserId: userID,
            MailGroupId: activeAction.MenuId === MenuId.Edit ? rowData?.ID_ : activeAction.MenuId === MenuId.View ? rowData?.ID_ : -1,
            CultureId: lang
        }
        const responseSubEntity = await mailGroupSubEntities(paramSubEntity);

        setEntityGrid(responseSubEntity?.Data);

        if (activeDetails[0]?.Master.MASTER_ID === MasterId.FranchiseRequestType || activeDetails[0]?.Master.MASTER_ID === MasterId.ITCApplications ||
            activeDetails[0]?.Master.MASTER_ID === MasterId.Departments) {
            setSubEntityVisible(true);
        }

    }



    const handleCloseDialog = () => {
        onCloseDialog(true);
    };


    const onSubmit = handleSubmit(async (data: FormValues) => {
        var result = entityGrid?.filter((item: any) => {
            return ((item.IS_MARKED === true) || item.IS_MARKED === 1);
        }).map((item: any) => {
            return item.ID_;
        });

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
            MasterId: masterID,
            SubEntities: result
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
                const response = await saveObject(param);
                if (response.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response?.Message)
                    if (activeAction.MenuId === MenuId.Edit) {
                        handleCloseDialog();
                    }
                    reset();
                    readEnumDet ? setValue('objEnumBooolean', true) : setValue('objEnumBooolean', false)
                    readObject ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
                    setCompName(null);
                    setEmName(null);
                    readSubEntity();
                }
                else {
                    toast.error(response?.Message)
                }
            } catch (e: any) {
                toast.error(e?.message)
            }
        }
    });

    const [selectAllGrid, setSelectAll] = useState<any>({
        value: false,
        indeterminate: false
    });

    const handlerowUpdate = (e: any) => {
        setTimeout(() => {
            console.log(e)
            console.log(entityGrid)
            const hasAny = entityGrid.some((item: any) => !!item.IS_MARKED)
            const hasAll = entityGrid.every((item: any) => !!item.IS_MARKED)
            console.log(hasAny)
            console.log(hasAll)

            setSelectAll((prev: any) => {
                const indeterminate = hasAll ? false : hasAny;
                return {
                    value: hasAny,
                    indeterminate
                }
            })
        });
    }

    const renderTitleHeader = () => {

        const handleSelectAllClick = (e: any) => {
            console.log(e);
            console.log(entityGrid)
            setSelectAll((prev: any) => {
                return {
                    indeterminate: false,
                    value: e.target.checked
                }
            })
            setEntityGrid((prev: any) => {
                const newValue = prev.map((item: any) => {
                    return {
                        ...item,
                        IS_MARKED: e.target.checked
                    }
                })
                return newValue
            })

        }

        return (
            <>
                <div className="d-flex align-items-center">
                    <Checkbox className="select-all-itc" onChange={handleSelectAllClick} indeterminate={selectAllGrid.indeterminate} checked={selectAllGrid.value} />
                    <div className="header">{t("Applicable")}</div>
                </div>
            </>)
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

            <DialogContent dividers className="dialog-content-wrapp ">
                <Row>
                    <div className="outlined-box ">
                        <h5 className="outlined-box-head my-3">
                        </h5>
                        <Row  >
                            {readEnumDet &&
                                <Col md={6} >
                                    <FormInputSelect
                                        name="objectEnum"
                                        control={control}
                                        label={enumName ? enumName : ''}
                                        errors={errors}
                                        options={readEnumDet}
                                        readOnly={viewMenu}
                                    />
                                </Col>
                            }

                            {readObject &&
                                <Col md={6} >
                                    <FormInputSelect
                                        name="objParentID"
                                        control={control}
                                        label={objectName ? objectName : 'label'}
                                        errors={errors}
                                        options={readObject}
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
                                    label={t(masterName === "Departments" ? `${t("Department Name In Arabic")}` : masterName + `${t("In Arabic")}`)}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}
                                    readOnly={viewMenu}
                                />
                            </Col>

                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="objName"
                                    control={control}
                                    label={masterName === "Departments" ? `${t("Department Name In English")}` : masterName + `${t('In English')}`}
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
                    {subEntityVisible &&
                        <div className="outlined-box pb-3 mt-3">
                            <h5 className="outlined-box-head my-3">
                                {" "}
                                {t("Sub Entities")}{" "}
                            </h5>
                            <Row >
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <div className="dx-grid-inner-wrapper">
                                        <DataGrid
                                            dataSource={entityGrid}
                                            showBorders={true}
                                            width="100%"
                                            key="ID_"
                                            height="100%"
                                            showColumnLines={true}
                                            showRowLines={true}
                                            rowAlternationEnabled={true}
                                            rtlEnabled={i18n.dir() === "rtl"}
                                            onRowUpdating={handlerowUpdate}
                                        >
                                            <Scrolling
                                                mode="virtual"
                                                rowRenderingMode="virtual"
                                            />

                                            <Editing
                                                mode="cell"
                                                allowUpdating={true}
                                            />
                                            {/* <Selection mode="multiple"
                                                selectAllMode='allPages'
                                                showCheckBoxesMode='always'
                                                allowSelectAll={true} /> */}
                                            <Column
                                                dataField="SUB_ENTITY_NAME"
                                                width="60%"
                                                allowSorting={false}
                                                caption={t("Sub Entity Name")}
                                                allowEditing={false}
                                            ></Column>

                                            <Column
                                                dataField="IS_MARKED"
                                                width="40%"
                                                allowSorting={false}
                                                caption={t("Applicable")}
                                                dataType="boolean"
                                                allowEditing={!viewMenu}
                                                headerCellRender={renderTitleHeader}
                                            ></Column>


                                        </DataGrid>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    }
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
                            <Button autoFocus onClick={() => handleCloseDialog()} className="mx-3">{t("Close")}</Button>
                            {!viewMenu &&
                                <Button type="submit" variant="contained" className="colored-btn" onClick={onSubmit}>
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

export default MasterForm;
