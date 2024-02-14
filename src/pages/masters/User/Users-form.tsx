import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { readEnums } from "../../../common/api/masters.api";

import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";

import { useTranslation } from "react-i18next";
import FormInputPhone from "../../../shared/components/form-components/FormInputPhone";

import dayjs from "dayjs";
import { FormControl, TextField } from "@mui/material";
import { AndroidSwitchField } from "../../../shared/components/form-components/FormAndroidSwitch";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import moment from 'moment';

interface Props {
    userRoleChange: (optionValue: any) => void;
    EntityAccess: (optionValue: any) => void;

}


export const UserForm = (props: any) => {
    const { userRoleChange, EntityAccess, modeViewAccess } = props;
    const {
        control,
        formState: { errors }, register, watch, setValue
    } = useFormContext();
    const [passWdChange, setPassWdChange] = useState<any>(false);
    const [userType, setUserType] = useState([]);
    const { t, i18n } = useTranslation();
    const [changedDate, setChangedDate] = useState<any>();
    const [exptxtPWD, setexpTxtPWD] = useState<any>(0);
    const [entityAccessType, setEntityAccessType] = useState<any>();
    const [conditionLoad, setConditionLoad] = useState<boolean>(true)
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const readUserType = async () => {
        const roleEnum = 314;
        const paramEnum = {
            Id: roleEnum,
            CultureId: lang
        }
        const responseEnum = await readEnums(paramEnum);
        const EntityEnum = 313
        const paramEntity = {
            Id: EntityEnum,
            CultureId: lang
        }

        const responseEntity = await readEnums(paramEntity);
        const EntityValue: any = [];
        responseEntity.Data.map((e: any) =>
            EntityValue.push({ value: e.ENUM_ID, label: e.ENUM_NAME })
        );
        setEntityAccessType(EntityValue);
        const optionValue: any = [];
        responseEnum.Data.map((e: any) =>
            optionValue.push({ value: e.ENUM_ID, label: e.ENUM_NAME })
        );
        setUserType(optionValue);

    }

    useEffect(() => {
        readUserType();

    }, []);
    useEffect(() => {
        const showCommentsField = watch("UserForm.IsPwdExpires");
        if (showCommentsField && conditionLoad) {
            setPassWdChange(true);
            setexpTxtPWD(watch("UserForm.PwdExpireDays"));
            setChangedDate(watch("UserForm.PwdExprireDate"))
            setConditionLoad(false);
        }
    });

    const chgUserRole = (event: any) => {
        userRoleChange(event);
    };

    const chgAccessType = (event: any) => {
        EntityAccess(event);
    };

    const onChangePWDExp = (e: any) => {
        setexpTxtPWD(e.target.value);
        setChangedDate(new Date(new Date().setDate(new Date().getDate() + Number(e.target.value))));
        setValue("UserForm.PwdExprireDate", new Date(new Date().setDate(new Date().getDate() + Number(e.target.value))))
    };

    const onChangePWDDate = (e: Date) => {
        const newDate = dayjs(e);
        const firstDate = moment(e.toLocaleDateString());
        const secondDate = moment(new Date().toLocaleDateString());
        setChangedDate(newDate);
        setexpTxtPWD(firstDate.diff(secondDate, 'days'));
        setValue("UserForm.PwdExprireDate", newDate);
        setValue("UserForm.PwdExpireDays", firstDate.diff(secondDate, 'days'))
    };

    const changePwd = (event: any) => {
        setPassWdChange(event);
    };

    return (
        <>
            <div>
                <Row className="justify-content-between">
                    <Col md={6} className="mb-3">
                        <FormInputSelect
                            name="UserForm.UserType"
                            control={control}
                            label={t("User Type")}
                            errors={errors}
                            options={userType}
                            disabled={true}
                            onChange={chgUserRole}
                        />
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormInputSelect
                            name="UserForm.EntityAccessType"
                            control={control}
                            label={t("Entity Access Type")}
                            errors={errors}
                            options={entityAccessType}
                            onChange={chgAccessType}
                            hideError={false}
                            readOnly={modeViewAccess}
                        />
                    </Col>

                    <Col md={6} className="mb-3">
                        <FormInputText
                            name="UserForm.code"
                            control={control}
                            label={t("Code")}
                            readOnly={modeViewAccess}
                        />
                    </Col>

                    <Col md={6} className="mb-3">
                        <FormInputText
                            name="UserForm.UserName"
                            control={control}
                            label={t("User Name")}
                            errors={errors}
                            readOnly={modeViewAccess}
                        />
                    </Col>

                    <Col md={12} className="mb-3">
                        <FormInputText
                            name="UserForm.FullNameAr"
                            control={control}
                            label={t("User Full Name (Arabic)")}
                            errors={errors}
                            align={{ textAlign: 'right' }}

                            readOnly={modeViewAccess}
                        />
                    </Col>

                    <Col md={12} className="mb-3">
                        <FormInputText
                            name="UserForm.FullName"
                            control={control}
                            label={t("User Full Name (English)")}
                            errors={errors}
                            readOnly={modeViewAccess}
                        />
                    </Col>

                    <Col md={12} className="mb-3">
                        <FormInputText
                            name="UserForm.MailID"
                            control={control}
                            label={t("Email ID")}
                            readOnly={modeViewAccess}
                        />
                    </Col>

                    <Col md={6} className="mb-3">
                        <FormInputPhone
                            name="UserForm.MobileNo"
                            control={control}
                            label={t("Mobile No.")}
                            errors={errors}
                            mask="(999) 999-9999"
                            disabled={false}
                            readOnly={modeViewAccess}
                            hideError={false}
                        />
                    </Col>
                    <Col md={6} className="mb-3">
                        <AndroidSwitchField
                            name="UserForm.PublishLayout"
                            control={control}
                            label={t("Can Publish Layout")}
                            errors={errors}
                            fontSize={10}
                            disabled={modeViewAccess}
                        />
                    </Col>
                    <Col md={6} className="mb-3">
                        <AndroidSwitchField
                            name="UserForm.ChangePwd"
                            control={control}
                            label={t("Can Change Password")}
                            errors={errors}
                            fontSize={10}
                            disabled={modeViewAccess}

                        />
                    </Col>
                    <Col md={6}>
                        <AndroidSwitchField
                            name="UserForm.IsPwdExpires"
                            control={control}
                            label={t("Set Password Expiry")}
                            errors={errors}
                            onChange={(e: any) => changePwd(e)}
                            fontSize={10}
                            disabled={modeViewAccess}
                        />
                    </Col>
                    {passWdChange &&
                        <Col md={6} className="mb-3">
                            <FormControl fullWidth >
                                <TextField

                                    size="small"
                                    id="UserForm.PwdExpireDays"
                                    variant="outlined"
                                    type="number"
                                    disabled={modeViewAccess}
                                    value={exptxtPWD}
                                    {...register("UserForm.PwdExpireDays")}
                                    label={t("Set Expiry Days")}
                                    inputProps={{
                                        min: 0,
                                    }}
                                    onChange={(e: any) => { onChangePWDExp(e) }}
                                />
                            </FormControl>
                        </Col>
                    }
                    {passWdChange &&
                        <Col md={6} className="mb-3">
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                    <DatePicker

                                        label="Set Expiry Date"
                                        minDate={new Date()}
                                        {...register("UserForm.PwdExprireDate")}
                                        value={changedDate}
                                        readOnly={modeViewAccess}
                                        renderInput={(params) => <TextField {...params} size="small" />}
                                        onChange={(newValue: any) => {
                                            onChangePWDDate(newValue)
                                        }}

                                        inputFormat="dd/MM/yyyy"
                                    />

                                </LocalizationProvider>
                            </FormControl>
                        </Col>
                    }
                    <Col md={12} className="mb-3">
                        <FormInputText
                            name="UserForm.Remarks"
                            control={control}
                            label={t("Remarks")}
                            readOnly={modeViewAccess}
                        />
                    </Col>

                </Row>


            </div>

        </>
    )
};
