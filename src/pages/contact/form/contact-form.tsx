import  { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    DialogTitle,
    IconButton,
    DialogContent,
    DialogActions,
} from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import FormInputPhone from "../../../shared/components/form-components/FormInputPhone";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { Button, Checkbox, FormControl } from "@mui/material";
import localStore from "../../../common/browserstore/localstore";
import { CultureId } from "../../../common/application/i18n";
import {
    readContact,
    readContactDesignation,
    readContactSubEntity,
    readEnums,
    readObjectValue,
    saveContact,
} from "../../../common/api/masters.api";
import {
    MasterId,
    MenuId,
    fullGridDataAction,
} from "../../../common/database/enums";
import { formatOptionsArray } from "../../../common/application/shared-function";
import { toast } from "react-toastify";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const ContactForm = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
useEffect(() => {console.log(props)},[props])
    const [tabValue, setTabValue] = useState<any>("1");
    const validationSchema = yup.object().shape({
        NameEn: yup.string().required(""),
        Designation: yup.string().required(""),
        NameAr: yup.string().required(""),
        Gender: yup.string().required(""),
        EmailId: yup.string().email("Invalid email address").required(""),
    });
    const { t, i18n } = useTranslation();
    const [accessEntity, setAccessEntity] = useState<boolean>(true);
    const [franchID, setFranchID] = useState<any>(null);
    const [contType, setContType] = useState<any>();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const Franchise_ID = userData && JSON.parse(userData).FRANCHISE_ID;
    const [subEntity, setSubEntity] = useState<any>([]);
    const [contDesignation, setContDesignation] = useState<any>([]);
    const [selectedDesi, setSelectedDesi] = useState<any>([]);
    const [grdDesignation, setGrdDesignation] = useState<any>([]);
    const [gender, setGender] = useState<any>([]);
    const [viewMenu, setViewMenu] = useState<boolean>(false);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [contactID, setContactID] = useState<any>();
    const lang = CultureId();
    const confirm = useConfirm();
    const {
        control,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            FranchiseID: "",
            NameEn: "",
            Designation: "",
            DesignationAddl: "",
            NameAr: "",
            EmplCode: "",
            Gender: "",
            DepartmentName: "",
            OfficeNo: "",
            OfficeExt: "",
            EmailId: "",
            MobileNo: "",
            AltMobileNo: "",
            Active: true,
            dateValue: new Date(),
        },
    });

    const readEdit = async () => {
        if (activeAction.MenuId === MenuId.View) {
            setViewMenu(true);
        }
        const param = {
            Id: rowData?.ID_,
            CultureId: lang,
        };
        const responseContract = await readContact(param);
        const responseDesignation = await readContactDesignation(param);
        console.log(responseDesignation,'responseDesignation')
        setGrdDesignation(
            formatOptionsArray(responseDesignation?.Data, "DESG_NAME", "ID_")
        );

        const loadEdit = {
            FranchiseID: responseContract?.Data.FRANCHISE_ID,
            NameEn: responseContract?.Data.CONTACT_NAME_EN,
            Designation: responseContract?.Data.DESG_ID,
            NameAr: responseContract?.Data.CONTACT_NAME_AR,
            EmplCode: responseContract?.Data.EMPL_CODE,
            Gender: responseContract?.Data.GENDER_ID,
            DepartmentName: responseContract?.Data.DEPT_NAME,
            OfficeNo: responseContract?.Data.OFFICE_NO,
            OfficeExt: responseContract?.Data.OFFICE_EXT,
            EmailId: responseContract?.Data.MAIL_ID,
            MobileNo: responseContract?.Data.MOBILE_NO,
            AltMobileNo: responseContract?.Data.ALT_MOBILE_NO,
            Active: responseContract?.Data.IS_ACTIVE,
        };
        setContactID(responseContract?.Data.CONTACT_ID);
        setFranchID(responseContract?.Data.FRANCHISE_ID);
        reset(loadEdit);
    };

    useEffect(() => {
        readData();
        if (Franchise_ID === -1 || Franchise_ID === null) {
            setContType(31001);
            setAccessEntity(true);
        } else {
            setContType(31002);
            setAccessEntity(false);
        }
        if (
            activeAction.MenuId === MenuId.Edit ||
            activeAction.MenuId === MenuId.View
        ) {
            readEdit();
        }
    }, []);

    const handleCloseDialog = () => {
        onCloseDialog(true);
    };

    const onSubmit = handleSubmit(async (data: any) => {
        const subEntityArray = subEntity
            ?.filter((e: any) => e?.IS_MARKED === 1)
            .map((e: any) => e?.ID_);
        if (Franchise_ID > -1) {
            subEntityArray.splice(0);
        }
        if (Franchise_ID === -1 && subEntityArray?.length === 0) {
            toast.error(`${t("Select Sub Entities")}`);
            return;
        }
        const designationArray: any = [];
        grdDesignation.map((e: any) => designationArray.push(e?.value));
        const param = {
            Data: {
                CONTACT_ID: contactID ? contactID : -1,
                CONTACT_TYPE: contType,
                FRANCHISE_ID: Franchise_ID === -1 ? null : Franchise_ID,
                DESG_ID: data?.Designation,
                EMPL_CODE: data?.EmplCode,
                CONTACT_NAME_EN: data?.NameEn,
                CONTACT_NAME_AR: data?.NameAr,
                DEPT_NAME: data?.DepartmentName,
                GENDER_ID: data?.Gender,
                OFFICE_NO: data?.OfficeNo,
                OFFICE_EXT: data?.OfficeExt,
                MOBILE_NO: data?.MobileNo,
                ALT_MOBILE_NO: data?.AltMobileNo,
                MAIL_ID: data?.EmailId,
                IS_ACTIVE: data?.Active ? 1 : 0,
            },
            CultureId: lang,
            UserId: userID,
            SubEntities: subEntityArray,
            Designations: designationArray,
        };

        const choice = await confirm({
            ui: "confirmation",
            title: `${t("You Are About To Save")}`,
            description: `${t("Are you sure you want to Save this?")}`,
            confirmBtnLabel: `${t("Continue")}`,
            cancelBtnLabel: `${t("Cancel")}`,
        });
        if (choice) {
            try {
                const responseContactSave = await saveContact(param);
                if (responseContactSave?.Id > 0) {
                    fullviewRowAddUpdate(responseContactSave.Id);
                    toast.success(responseContactSave?.Message);
                    reset();
                    setGrdDesignation([]);
                    if (activeAction.MenuId === MenuId.Edit) {
                        onCloseDialog();
                    }
                    const paramSubEntity = {
                        Id: 0,
                        CultureId: lang,
                    };
                    const responseSubEntity = await readContactSubEntity(paramSubEntity);
                    setSubEntity(responseSubEntity?.Data);
                } else {
                    toast.error(responseContactSave?.Message);
                }
            } catch (err: any) {
                toast.error(err?.message);
            }
        }
    });

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

    const selectedGroupChange = (event: any) => {
        setSelectedDesi(event);
    };
    const readData = async () => {
        const paramSubEntity = {
            Id:
                activeAction.MenuId === MenuId.Edit
                    ? rowData.ID_
                    : activeAction.MenuId === MenuId.View
                        ? rowData.ID_
                        : -1,
            CultureId: lang,
        };
        const responseSubEntity = await readContactSubEntity(paramSubEntity);
        setSubEntity(responseSubEntity?.Data);
        const paramParent = {
            Id: MasterId.Designations,
            CultureId: lang,
        };
        const responseObject = await readObjectValue(paramParent);
        setContDesignation(
            formatOptionsArray(responseObject?.Data, "OBJECT_NAME", "OBJECT_ID")
        );
        const paramEnum = {
            Id: 309,
            CultureId: lang,
        };
        const responseEnum = await readEnums(paramEnum);

        setGender(formatOptionsArray(responseEnum?.Data, "ENUM_NAME", "ENUM_ID"));
    };

    const EntityCheckBoxChange = (event: any, item: any) => {
        const updatedTableData = subEntity.map((data: any) => {
            if (data.ID_ === item.ID_) {
                return {
                    ...data,
                    IS_MARKED: event.target.checked ? 1 : 0,
                };
            }
            return data;
        });

        setSubEntity(updatedTableData);
    };
    const onchnageDes = () => { };
    const handleDelete = (chipToDelete: any) => () => {
        if (!viewMenu) {
            setGrdDesignation(
                grdDesignation.filter((chip: any) => chip.value !== chipToDelete.value)
            );
        }
    };

    const AddtoDataGrid = () => {
        if (!selectedDesi) {
            return;
        }
        const isExistDetails =
            grdDesignation &&
            grdDesignation.some((item: any) => item.value === selectedDesi);

        if (isExistDetails) {
            toast.error(`${t(`${t("This Designation already added")}`)}`);
            return;
        }
        const addtoGrid: any = [...grdDesignation];
        contDesignation?.map((e: any) => {
            if (e?.value === selectedDesi)
                addtoGrid.push({ value: e?.value, label: e?.label, delete: 0 });
        });

        setGrdDesignation(addtoGrid);
        setSelectedDesi(null);
        setValue("DesignationAddl", null);
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
                    <div className="outlined-box  px-3 ">
                        <h5 className="outlined-box-head my-3">Contact Details</h5>
                        <Row>
                            <Col md={4} className="mb-3">
                                <FormInputText
                                    name="NameAr"
                                    control={control}
                                    label={t("Name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: "right" }}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputText
                                    name="NameEn"
                                    control={control}
                                    label={t("Name in English")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputSelect
                                    name="Designation"
                                    control={control}
                                    label={t("Designation")}
                                    options={contDesignation}
                                    errors={errors}
                                    onChange={onchnageDes}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputText
                                    name="DepartmentName"
                                    control={control}
                                    label={t("Department Name")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputText
                                    name="EmplCode"
                                    control={control}
                                    label={t("Employee Code")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputSelect
                                    name="Gender"
                                    control={control}
                                    label={t("Gender")}
                                    errors={errors}
                                    options={gender}
                                    onChange={onchnageDes}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputPhone
                                    name="OfficeNo"
                                    control={control}
                                    label="Phone No"
                                    errors={errors}
                                    disabled={false}
                                    mask="(999) 999-999"
                                    readOnly={viewMenu}
                                    hideError={false}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputText
                                    name="OfficeExt"
                                    control={control}
                                    label={t("Phone Extention")}
                                    readOnly={viewMenu}
                                />
                            </Col>
                            <Col md={4} className="mb-3">
                                <FormInputPhone
                                    name="MobileNo"
                                    control={control}
                                    label={t("Mobile No.")}
                                    errors={errors}
                                    disabled={false}
                                    mask="(999) 999-9999"
                                    readOnly={viewMenu}
                                    hideError={false}
                                />
                            </Col>

                            <Col md={4} className="mb-3">
                                <FormInputPhone
                                    name="AltMobileNo"
                                    control={control}
                                    label={t("Alt Mobile No")}
                                    errors={errors}
                                    disabled={false}
                                    mask="(999) 999-9999"
                                    readOnly={viewMenu}
                                    hideError={false}
                                />
                            </Col>

                            <Col md={8} className="mb-3">
                                <FormInputText
                                    name="EmailId"
                                    control={control}
                                    label={t("Email ID")}
                                    errors={errors}
                                    readOnly={viewMenu}
                                /> 
                            </Col>
                            {accessEntity && (
                                <h5 className="outlined-box-head mt-0 mb-3">{t("Sub Entities")}</h5>
                            )}
                            {accessEntity && (
                                <Col md={12}>
                                    <div className="outlined-box my-3 mt-0">
                                        <Row>
                                            {subEntity &&
                                                subEntity.map((x: any, i: number) => {
                                                    return (
                                                        <Col md={4} key={i}>
                                                            <div className="d-flex align-items-center justify-content-start">
                                                                <Checkbox
                                                                    onChange={(event: any) =>
                                                                        EntityCheckBoxChange(event, x)
                                                                    }
                                                                    checked={x?.IS_MARKED}
                                                                    disabled={viewMenu}
                                                                />
                                                                {x?.SUB_ENTITY_NAME}
                                                            </div>
                                                        </Col>
                                                    );
                                                })}
                                        </Row>
                                    </div>
                                </Col>
                            )}
                            {!accessEntity && (
                                <h5 className="outlined-box-head mt-0 mb-3">Designation</h5>
                            )}
                            {!accessEntity && (
                                <Col md={12}>
                                    <div className="outlined-box my-3 mt-0">
                                        <Row>
                                            <Col md={4} className="mb-3 px-3 mt-3">
                                                <FormInputSelect
                                                    name="DesignationAddl"
                                                    control={control}
                                                    label={t("Additional Designation")}
                                                    options={contDesignation}
                                                    errors={errors}
                                                    onChange={selectedGroupChange}
                                                    readOnly={viewMenu}
                                                />
                                            </Col>
                                            <Col md={2} className="mb-3 ps-0 mt-3">
                                                <div className="d-flex justify-content-center">
                                                    <FormControl size={"small"} variant="outlined">
                                                        <Button onClick={AddtoDataGrid}>{t("Add")}</Button>
                                                    </FormControl>
                                                </div>
                                            </Col>
                                            <Stack
                                                direction="row"
                                                //  spacing={{ xs: 1, sm: 2 }}
                                                //  maxWidth={800}
                                                lineHeight={3}
                                                // sx={{ width: 800, '& > *': { flexGrow: 1 } }}
                                                flexWrap="wrap"
                                            >
                                                {grdDesignation.map((e: any) => (
                                                    <div key={e?.value} className="px-1">
                                                        <Chip
                                                            label={e?.label}
                                                            key={e?.value}
                                                            onDelete={handleDelete(e)}
                                                            variant="outlined"
                                                        />
                                                    </div>
                                                ))}
                                            </Stack>
                                        </Row>
                                    </div>
                                </Col>
                            )}
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
                            {!viewMenu && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="colored-btn"
                                    onClick={onSubmit}
                                >
                                    {t("Save")}
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>
            </DialogActions>
        </>
    );
};

export default ContactForm;
