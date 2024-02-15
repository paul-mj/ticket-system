import  { useContext, useEffect, useState } from "react";
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
import { readEnums, readObjectData, readObjectValue, readObjInfo, readSubEntityValue, saveSubEntities } from "../../../common/api/masters.api";
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
import { MenuId, fullGridDataAction } from "../../../common/database/enums";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import "./SubEntity.scss";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";

export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}


const SubEntities = (props: FranchiseRequestDialogProps) => {
    const [enumName, setEnumName] = useState<string>()
    const validationSchema = yup.object().shape({
        objEnumBooolean: yup.boolean(),
        objObjectBoolean: yup.boolean(),
        objName: yup.string().required(""),
        list: yup.array().of(
            yup.object().shape({
                firstName: yup.string().nullable().required(""),
                DedDesc: yup.string().nullable().required(""),
            })
        ),
        objNameArabic: yup.string().required(""),
        objParentID: yup.string().nullable().required(""),
    });

    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
   
    const { t } = useTranslation();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const { reset, handleSubmit, setValue, control, trigger, formState: { errors } } = useForm<any>({
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
            list: [{ firstName: "", DedDesc: "" }],
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
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const confirm = useConfirm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "list",
    });

    const addNewRowItem = async () => {
        const lastRowIndex = fields.length - 1;
        const isValid = await trigger(`list.${lastRowIndex}`);

        if (isValid) {
            append({ firstName: "", DedDesc: "" });
        }
    };

    const removeRowItem = (index: number) => {
        remove(index);
    };

    useEffect(() => { readMasterData() }, []);

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
            status:
                currentPage === MenuId.New
                    ? fullGridDataAction.InsertRow
                    : fullGridDataAction.UpdateRow,
        });
      //  onCloseDialog(true);
    };

    const readEditValue = async () => {
        setEditValue(true);
        if (activeAction.MenuId === MenuId.View) {
            setViewMenu(true);
        }
        const response = await readSubEntityValue(rowData?.ID_)
        const addToData: any = [];
        response.Data?.map((e: any, index: number) => addToData.push({ firstName: e?.DED_CODE, DedDesc: e?.DED_NAME }));
        setValue('list', addToData)
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

    ////////
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

    const onSubmit = handleSubmit(async (data: any) => {
        const dedCode: any = [];
        data.list?.map((e: any) => { if (e?.firstName !== " ") { dedCode.push({ "DED_CODE": e?.firstName, "DED_NAME": e?.DedDesc }) } })
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
            Codes: dedCode
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
                const response = await saveSubEntities(param);

                if (response.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response.Message);
                    reset();
                    if (editValue) { handleCloseDialog() }
                    readEnumDet ? setValue('objEnumBooolean', true) : setValue('objEnumBooolean', false)
                    readObject ? setValue('objObjectBoolean', true) : setValue('objObjectBoolean', false)
                    setCompName(null);
                    setEmName(null);
                    // setDedCodeList([{ ID: 1, DedName: " " }]);
                    setRowsData([]);
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
            <DialogContent dividers className="dialog-content-wrapp">
                <Row>
                    <div className="outlined-box mb-3">
                        <h5 className="outlined-box-head my-3">
                            {t("SubEntities Details")}
                        </h5>

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

                    <div className="outlined-box pb-3">
                        <div className="d-flex justify-content-between align-items-center w-100 mt-2 mb-3">
                            <h5 className="outlined-box-head">
                               {t("Ded Activity Code")}
                            </h5>
                            {!viewMenu &&
                                <Button className="user-btn-section" onClick={() => addNewRowItem()}>
                                   {t("Add")}
                                </Button>
                            }
                        </div>

                        <div className="dedtable-wrapper">
                            <div className="dedtable-outer">
                                <div className="dedtable-header">
                                    <div className="dedelement">{t("Activity Code")}</div>
                                    {/* <div className="dedelement">{t("Activity Description")}</div> */}
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
                                        {/* <div className="dedelement">
                                            <FormInputText
                                                name={`list.${index}.DedDesc`}
                                                control={control}
                                                label=""
                                                errors={errors}
                                                readOnly={viewMenu}
                                            />
                                        </div> */}
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
                                )
                                )
                                }
                            </div>
                        </div>

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

export default SubEntities;
