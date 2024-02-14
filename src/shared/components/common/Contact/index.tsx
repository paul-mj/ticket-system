import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Chip, Stack } from "@material-ui/core";
import { t } from "i18next";
import React, { useCallback, useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CultureId } from "../../../../common/application/i18n";
import { formatOptionsArray } from "../../../../common/application/shared-function";
import ApiService from "../../../../core/services/axios/api";
import FormInputPhone from "../../form-components/FormInputPhone";
import { FormInputSelect } from "../../form-components/FormInputSelect";
import { FormInputText } from "../../form-components/FormInputText";
import { ContactConfig } from "./contact.config";
import * as yup from "yup";
import './Contract.scss';
import localStore from "../../../../common/browserstore/localstore";
import { useConfirm } from "../../dialogs/confirmation";
import { SwitchField } from "../../form-components/FormSwitch";
import { toast } from "react-toastify";
import SkeletonLoader from "../../UI/Loader/SkeletonLoader";
import { useTranslation } from "react-i18next";
import AutocompleteField from "../../form-components/FormAutoCompleteSelect";
interface ContractProps {
    isView: boolean;
    rowID?: number,
    patchData?: any,
    actions: any,
    resetActions: any,
    forceClose: any;
    fieldConfig?: any,
    isLoading?: any
}
const Contact = React.memo(({ isView, rowID, patchData, actions, resetActions, forceClose, fieldConfig, isLoading }: ContractProps) => {
    const userData = localStore.getLoggedInfo();
    const { t, i18n } = useTranslation();
    const userID = userData && JSON.parse(userData).USER_ID;
    const Franchise_ID = userData && JSON.parse(userData).FRANCHISE_ID;
    const lang = CultureId();
    const confirm = useConfirm();
    const {
        control,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(ContactConfig.validationSchema()),
        defaultValues: ContactConfig.formInitialValues(),
    });
    const [contType, setContType] = useState<any>();
    const [fieldsConfig, setFieldsConfig] = useState(ContactConfig.formFieldConfigInitialState())
    const [dropdownList, setDropdownList] = useState<any>({ designationList: [], genderList: [] })
    const [adnlDesignation, setAdnlDesignation] = useState<any[]>([]);
    const [subEntityList, setSubEntityList] = useState([]);
    const [addedDesignation, setAddedDesignation] = useState([]);
    const [FRANCHISE_ID, setFRANCHISE_ID] = useState(Franchise_ID);
    const [pageLoading, setPageLoading] = useState(true);
    const [savedList, setSavedList] = useState({ designationList: [], subEntityList: [] })
    const submitForm = useCallback(() => {
        resetActions({ submit: false })
        handleSubmit(async (data) => {
            const designationList = savedList.designationList.map((x: any) => x.value);
            const subEntityList = savedList.subEntityList
                .filter((x: any) => x.IS_MARKED)
                .map((x: any) => x.ID_);
            if (contType === 31001 && !subEntityList.length) {
                toast.error(`${t("Select Sub Entities")}`);
                return
            }
            const param = {
                Data: {
                    ...data,
                    CONTACT_ID: rowID ?? -1,
                    CONTACT_TYPE: contType,
                    FRANCHISE_ID: FRANCHISE_ID === -1 ? null : FRANCHISE_ID,
                    IS_ACTIVE: Number(data.IS_ACTIVE),
                },
                CultureId: lang,
                UserId: userID,
                SubEntities: subEntityList,
                Designations: designationList,
            }
            try {
                const choice = await confirm({
                    ui: "confirmation",
                    title: `${t("You Are About To Save")}`,
                    description: `${t("Are you sure you want to Save this?")}`,
                    confirmBtnLabel: `${t("Continue")}`,
                    cancelBtnLabel: `${t("Cancel")}`,
                });
                if (choice) {
                    isLoading(true)
                    const response = await ApiService.httpPost('contacts/save', param);
                    isLoading(false)
                    forceClose(response);
                }
            } catch (error) {
                isLoading(false)
            }
        })()
    }, [FRANCHISE_ID, confirm, contType, forceClose, handleSubmit, isLoading, lang, resetActions, rowID, savedList.designationList, savedList.subEntityList, t, userID])
    const getMarkedDesignation = useCallback(async () => {
        try {
            const payload = ContactConfig.markedDesignationPayload({ CultureId: lang, Id: rowID as number });
            const { Data = [] } = await ApiService.httpPost('contacts/readDesignations', payload);
            setAddedDesignation(Data);
        } catch (error) {

        }
    }, [lang, rowID])
    const getSubEntityList = useCallback(async () => {
        try {
            const payload = ContactConfig.subEntryPayload({ CultureId: lang, Id: rowID ?? -1 });
            const { Data = [] } = await ApiService.httpPost('contacts/readRights', payload);
            setSubEntityList(Data);
        } catch (error) {

        }
    }, [lang, rowID])
    const stopPageLoader = useCallback(() => {
        setTimeout(() => {
            setPageLoading(false);
        }, !!rowID ? 1000 : 200);
    }, [rowID])
    const getDropdownList = useCallback(async () => {
        const { designation, gender } = ContactConfig.dropDownPayload({ CultureId: lang });
        const fork = [{
            url: 'lookup/getObjects',
            method: 'post',
            data: designation
        }, {
            url: 'lookup/getEnums',
            method: 'post',
            data: gender
        }]
        try {
            const [{ Data: designationList = [] }, { Data: genderList = [] }] = await ApiService.httpForkJoin(fork);
            const formatedDesig: any[] = formatOptionsArray(designationList, "OBJECT_NAME", "OBJECT_ID");
            const formatedGender: any[] = formatOptionsArray(genderList, "ENUM_NAME", "ENUM_ID");
            setDropdownList({
                designationList: formatedDesig,
                genderList: formatedGender
            })
            setAdnlDesignation(formatedDesig);
            stopPageLoader();
        } catch (error) {
            stopPageLoader();
        }
    }, [lang])
    const addedDesignationList = useCallback((designationList: any[]) => {
        setSavedList((prev: any) => {
            return {
                ...prev,
                designationList
            }
        })
    }, [])
    const addedSubEntity = useCallback((subEntityList: any[]) => {
        setSavedList((prev: any) => {
            return {
                ...prev,
                subEntityList
            }
        })
    }, [])
    const filterAddnlDesig = useCallback((e: number) => {
        const filtered = dropdownList.designationList.filter((item: any) => item.value !== e);
        setAdnlDesignation(filtered);
    }, [dropdownList.designationList])
    const onDesignationChangeHandler = (e: number) => {
        filterAddnlDesig(e);
    }
    const patchFormData = useCallback((patchData: any) => {
        const fields = ContactConfig.formInitialValues();
        for (const key in patchData) {
            if (Object.prototype.hasOwnProperty.call(patchData, key) && Object.prototype.hasOwnProperty.call(fields, key)) {
                const value = patchData[key];
                setValue(key, value);
            }
        }
        filterAddnlDesig(patchData.DESG_ID);
    }, [filterAddnlDesig, setValue]);
    const fetchContactDetailsById = useCallback(async () => {
        const payload = ContactConfig.contactDetailsPayload({ CultureId: lang, Id: rowID ?? -1 })
        const { Data } = await ApiService.httpPost('contacts/read', payload);
        setFRANCHISE_ID(Data.FRANCHISE_ID);
        patchFormData({ ...Data, IS_ACTIVE: Boolean(Data.IS_ACTIVE) });
        stopPageLoader();
    }, [lang, patchFormData, rowID, stopPageLoader])
    const patchUpdateFormValues = useCallback(() => {
        if (patchData) {
            patchFormData(patchData);
        } else if (rowID) {
            fetchContactDetailsById();
            getMarkedDesignation();
        }
    }, [fetchContactDetailsById, getMarkedDesignation, patchData, patchFormData, rowID])
    useEffect(() => {
        if (actions.submit) {
            submitForm();
        }
    }, [actions, submitForm])
    useEffect(() => {
        if (FRANCHISE_ID === -1 || FRANCHISE_ID === null) {
            setContType(31001);
            getSubEntityList();
        } else {
            setContType(31002);
        }
    }, [FRANCHISE_ID, getSubEntityList])
    useEffect(() => {
        getDropdownList();
    }, [getDropdownList])
    useEffect(() => {
        if (fieldConfig) {
            setFieldsConfig((prev => {
                return {
                    ...prev,
                    ...fieldConfig
                }
            }))
        }
    }, [fieldConfig])
    useEffect(() => {
        const { designationList, genderList } = dropdownList;
        if (designationList.length && genderList.length) {
            patchUpdateFormValues();
        }
    }, [dropdownList, patchUpdateFormValues])
    useEffect(() => {
        setTimeout(() => {
            reset();
        });
    }, [reset])
    return (
        pageLoading ?
            <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 412, sx: { my: 1 } }} /> :
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="outlined-box-head m-0 subTitle-contract">{t("Contact Details")}</h5>
                    <SwitchField
                        name="IS_ACTIVE"
                        control={control}
                        label={t("Active")}
                        disabled={fieldsConfig['IS_ACTIVE'].disabled || isView}
                    />
                </div>
                <div>
                    <Row>
                        <Col md={4} className="mb-3">
                            <FormInputText
                                name="CONTACT_NAME_AR"
                                control={control}
                                label={t("Name in Arabic")}
                                errors={errors}
                                align={{ textAlign: "right" }}
                                disabled={fieldsConfig['CONTACT_NAME_AR'].disabled || isView}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            <FormInputText
                                name="CONTACT_NAME_EN"
                                control={control}
                                label={t("Name in English")}
                                errors={errors}
                                disabled={fieldsConfig['CONTACT_NAME_EN'].disabled || isView}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            {/* <FormInputSelect
                                name="DESG_ID"
                                control={control}
                                label={t("Designation")}
                                options={dropdownList.designationList}
                                errors={errors}
                                onChange={onDesignationChangeHandler}
                                disabled={fieldsConfig['DESG_ID'].disabled || isView}
                            /> */}
                            <AutocompleteField
                                control={control}
                                name="DESG_ID"
                                label={t("Designation")}
                                errors={errors}
                                options={dropdownList.designationList}
                                onChange={onDesignationChangeHandler}
                                disabled={fieldsConfig['DESG_ID'].disabled || isView}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            <FormInputText
                                name="DEPT_NAME"
                                control={control}
                                label={t("Department Name")}
                                errors={errors}
                                disabled={fieldsConfig['DEPT_NAME'].disabled || isView}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            <FormInputText
                                name="EMPL_CODE"
                                control={control}
                                label={t("Employee Code")}
                                errors={errors}
                                disabled={fieldsConfig['EMPL_CODE'].disabled || isView}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            <FormInputSelect
                                name="GENDER_ID"
                                control={control}
                                label={t("Gender")}
                                errors={errors}
                                options={dropdownList.genderList}
                                onChange={() => { }}
                                disabled={fieldsConfig['GENDER_ID'].disabled || isView}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            <FormInputPhone
                                name="MOBILE_NO"
                                control={control}
                                label={t("Mobile No.")}
                                errors={errors}
                                mask="(999) 999-9999"
                                disabled={fieldsConfig['MOBILE_NO'].disabled || isView}
                                hideError={false}
                            />
                        </Col>
                        <Col md={8} className="mb-3">
                            <FormInputText
                                name="MAIL_ID"
                                control={control}
                                label={t("Email ID")}
                                errors={errors}
                                disabled={fieldsConfig['MAIL_ID'].disabled || isView}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            <FormInputPhone
                                name="OFFICE_NO"
                                control={control}
                                label={t("Office No.")}
                                errors={errors}
                                mask="(99) 999-9999"
                                disabled={fieldsConfig['OFFICE_NO'].disabled || isView}
                                hideError={false}
                            />
                        </Col>
                        <Col md={4} className="mb-3">
                            <FormInputText
                                name="OFFICE_EXT"
                                control={control}
                                label={t("Phone Extention")}
                                disabled={fieldsConfig['OFFICE_EXT'].disabled || isView}
                            />
                        </Col>


                        <Col md={4} className="mb-3">
                            <FormInputPhone
                                name="ALT_MOBILE_NO"
                                control={control}
                                label={t("Alt Mobile No")}
                                errors={errors}
                                mask="(999) 999-9999"
                                disabled={fieldsConfig['ALT_MOBILE_NO'].disabled || isView}
                                hideError={false}
                            />
                        </Col>

                    </Row>
                </div>
                <div>
                    {contType === 31001 ?
                        <SubEntities subEntity={subEntityList} addedSubEntity={addedSubEntity} isDisabled={isView} />
                        :
                        <Designation designations={adnlDesignation} onDesignationAdd={addedDesignationList} isDisabled={isView} addedDesignation={addedDesignation} />
                    }
                </div>
            </div>
    )
})
const SubEntities = React.memo(({ subEntity, addedSubEntity, isDisabled }: any) => {
    const [subEntityList, setSubEntityList] = useState([])
    const onChangeHandler = (event: any, item: any) => {
        const temp = [...subEntityList];
        const found: any = temp.find((f: any) => f.ID_ === item.ID_);
        if (found) {
            found.IS_MARKED = Number(!found.IS_MARKED)
            setSubEntityList(temp);
            addedSubEntity(temp)
        }
    }
    useEffect(() => {
        setSubEntityList(subEntity);
        addedSubEntity(subEntity);
    }, [addedSubEntity, subEntity])
    return (
        <div>
            <h5 className="outlined-box-head mt-0 mb-3 subTitle-contract">{t("Sub Entities")}</h5>
            <Row>
                {
                    subEntityList.map((x: any, i: number) =>
                        <Col md={4} key={`${x.ID_}${x.IS_MARKED}`}>
                            <div className="d-flex align-items-center justify-content-start">
                                <Checkbox
                                    onChange={(event: any) =>
                                        onChangeHandler(event, x)
                                    }
                                    checked={!!x?.IS_MARKED}
                                    disabled={isDisabled}
                                />
                                {x?.SUB_ENTITY_NAME}
                            </div>
                        </Col>
                    )
                }
            </Row>
        </div>
    )
})
const Designation = React.memo(({ designations, onDesignationAdd, isDisabled, addedDesignation }: any) => {
    const [designationList, setDesignationList] = useState([])
    const [addedList, setAddedList] = useState([])
    const {
        control,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(yup.object().shape({
            designation: yup.string().required("")
        })),
        defaultValues: { designation: '' },
    });
    const filterDesignations = (list: any) => {
        return list.filter((item: any) => !item.IS_MARKED)
    }
    const onSelectHandler = (e: any) => {
    }
    const addToDataGrid = handleSubmit((data: any) => {
        const list = [...designationList];
        const found: any = list.find((f: any) => f.value === Number(data.designation));
        if (found) {
            setAddedList((prev: any) => {
                const temp: any = [...prev];
                temp.push(found);
                return temp;
            })

        }
    })
    const handleDelete = (item: any) => {
        setAddedList((prev) => {
            const tempAddedList = [...prev];
            const foundIndex: number = tempAddedList.findIndex((f: any) => f.value === Number(item.value));
            if (foundIndex !== -1) {
                tempAddedList.splice(foundIndex, 1);
            }
            return tempAddedList
        })
    }
    const applyFilter = useCallback((designations: any[]) => {
        const list = filterDesignations(designations)
        setDesignationList(list);
        if (list?.length) {
            const [{ value: firstID }] = list;
            setValue('designation', firstID);
        }
    }, [setValue])
    useEffect(() => {
        applyFilter(designations)
    }, [applyFilter, designations, setValue])
    useEffect(() => {
        const temp: any = [...designations]
        temp.forEach((des: any) => {
            const isIncluded = addedList.some((al: any) => al.value === des.value);
            des.IS_MARKED = isIncluded;
        })
        applyFilter(temp);
        onDesignationAdd(addedList)
    }, [addedList, applyFilter, designations, onDesignationAdd])
    useEffect(() => {
        const addedList = designations.filter((item: any) => {
            return addedDesignation.some((desig: any) => desig.ID_ === item.value)
        })
            .map((item: any) => {
                return {
                    ...item,
                    IS_MARKED: true
                }
            });
        setAddedList(addedList);
    }, [addedDesignation, designations])
    return (
        <div>
            <h5 className="outlined-box-head mt-0 mb-3 subTitle-contract">{t("Designation")}</h5>
            <Row className="align-items-center">
                {!!designationList?.length && <>
                    <Col md={4} className="mb-3 px-3 mt-3">
                        {/* <FormInputSelect
                            name="designation"
                            control={control}
                            label={t("Additional Designation")}
                            options={designationList}
                            errors={errors}
                            onChange={onSelectHandler}
                            disabled={isDisabled}
                        /> */}
                        <AutocompleteField
                            control={control}
                            name="designation"
                            label={t("Additional Designation")}
                            errors={errors}
                            options={designationList}
                            onChange={onSelectHandler}
                            disabled={isDisabled}
                        />
                    </Col>
                    <Col md={2} className="mb-3 mt-3">
                        <div>
                            <Button size="small" variant="contained" onClick={addToDataGrid} disabled={isDisabled}>{t("Add")}</Button>
                        </div>
                    </Col>
                </>}
                <Stack
                    direction="row"
                    lineHeight={3}
                    flexWrap="wrap"
                >
                    {addedList.map((e: any) => (
                        <div key={e?.value} className="px-1">
                            <Chip
                                label={e?.label}
                                disabled={isDisabled}
                                key={e?.value}
                                onDelete={() => handleDelete(e)}
                                variant="outlined"
                            />
                        </div>
                    ))}
                </Stack>
            </Row>
        </div>
    )
})
export default Contact