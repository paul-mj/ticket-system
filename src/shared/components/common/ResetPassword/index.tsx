import { Col, Row } from "react-bootstrap";
import { FormInputText } from "../../form-components/FormInputText";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PrimaryButton from "../../Buttons/TextButtons/Curved/PrimaryButton";
import { useCallback, useEffect, useState } from "react";
import PasswordPolicyControl from "../../UI/PasswordPolicy/PasswordPolicyControl";
import PasswordPolicyUtils from "../../UI/PasswordPolicy/passwordPolicy.utils";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import ApiService from "../../../../core/services/axios/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CommonUtils from "../../../../common/utils/common.utils";
import APIFetchService from "../../../../core/services/fetch";

const validationSchema = yup.object().shape({
    isValid: yup.boolean(),
    UserPwd: yup.string().required('Password is a required field').test({
        name: 'passwordPolicy',
        exclusive: false,
        params: {},
        message: 'Not a valid password. Please check password policy',
        test: function (value) {
            return this.parent.isValid
        },
    }),
    UserConfrmPwd: yup.string()
        .oneOf([yup.ref('UserPwd')], 'Password and confirm password should be same')
});
const ResetPassword = ({ Guid, buttonFromOutside, action, onAfterSubmit, resetAction }: any) => {
    const [passwordPolicy, setPasswordPolicy] = useState<any>({});
    const { UserId, CultureId } = CommonUtils.userInfo;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [pwdPolicy, setPwdPolicy] = useState<any[]>([]);
    const {
        control,
        handleSubmit,
        trigger,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            isValid: false,
            UserPwd: "",
            UserConfrmPwd: "",
        },
    });
    const handleOnInput = useCallback((e: any) => {
        const { target: { value } } = e;
        const policy = PasswordPolicyUtils.getPasswordMutiValidate(passwordPolicy)
        setPwdPolicy(PasswordPolicyUtils.buildValidator(policy, value));
    }, [passwordPolicy])
    const getPasswordPolicy = useCallback(async () => {
        try {
            const { Tokens: { AccessToken } } = await ApiService.httpGet(`operator/getToken`);
            const payload = {
                Procedure: "APP_MASTER.APPLICATION_PASSWORD_SETTING_SPR",
                UserId,
                CultureId,
                Criteria: []
            }
            const { Data: [policy] } = await APIFetchService.post({ url: 'data/getTable', apiData: payload, token: AccessToken })
            setPasswordPolicy(policy)
        } catch (error) {

        }
    }, [CultureId, UserId])
    const handlePolicyValidation = useCallback((value: any) => {
        setValue('isValid', value);
        const { UserPwd } = getValues();
        if (UserPwd) {
            trigger('UserPwd')
        }
    }, [getValues, setValue, trigger])
    const handleResetPassword = useCallback(() => {
        handleSubmit(async (data) => {
            try {
                setIsLoading(true);
                const payLoad = {
                    Guid,
                    UserPwd: data.UserPwd,
                    UserId: UserId ?? -1
                }
                const { Id, Message } = await ApiService.httpPost('User/resetPassword', payLoad);
                setIsLoading(false);
                if (Id < 0) {
                    toast.error(Message)
                } else {
                    onAfterSubmit && onAfterSubmit(Id);
                    toast.success(Message)
                    if(!buttonFromOutside){
                        navigate('/')
                    }
                }
            } catch (error) {
                setIsLoading(false);
            }
        })();
    }, [Guid, UserId, buttonFromOutside, handleSubmit, navigate, onAfterSubmit])
    useEffect(() => {
        const { UserPwd } = getValues();
        handleOnInput({ target: { value: UserPwd ?? '' } })
    }, [getValues, handleOnInput, passwordPolicy])
    useEffect(() => {
        getPasswordPolicy();
    }, [getPasswordPolicy])
    useEffect(() => {
        if (action?.type === 'submit') {
            handleResetPassword();
            resetAction && resetAction()
        }
    }, [action, handleResetPassword, resetAction])
    return (
        <Row>
            <Col md={12}>
                <PasswordPolicyControl list={pwdPolicy} onValidate={handlePolicyValidation} />
            </Col>
            <Col md={12} className="mt-3">
                <FormInputText
                    name="UserPwd"
                    control={control}
                    label={t("Password")}
                    startAdornment={true}
                    startAdornmentPosition="start"
                    muiIcon="LockOpen"
                    errors={errors}
                    type="password"
                    onInput={handleOnInput}
                    endAdornment
                />
            </Col>
            <Col md={12} className="mt-3">
                <FormInputText
                    name="UserConfrmPwd"
                    control={control}
                    label={t("Confirm Password")}
                    startAdornment={true}
                    startAdornmentPosition="start"
                    muiIcon="LockOpen"
                    errors={errors}
                    type="password"
                    endAdornment
                />
            </Col>
            <Col md={12} className="mt-4 text-right">
                {!buttonFromOutside ? <PrimaryButton onClick={handleResetPassword} text={t('Reset Password')} isLoading={isLoading} styleType='btnLoader' /> : ''}
            </Col>
        </Row>
    )
}
export default ResetPassword;