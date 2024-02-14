import { Col, Container, Row } from "react-bootstrap";
import AuthHeader from "../auth-layout/auth-header";
import "../login/login.scss";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useState } from "react";
import OTPScreen from "../OTPScreen";
import ResetPassword from "../../../shared/components/common/ResetPassword";
import PrimaryButton from "../../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import ApiService from "../../../core/services/axios/api";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
const uuid = uuidv4();
const validationSchema = yup.object().shape({
    UserName: yup.string().required()
});
const ForgotPwdFrm = ({ onOTPTrigger, uuid }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            UserName: ""
        },
    });
    const handleEnterKeyPress = (event: any) => {
        if (event.code === "Enter") {
            forgotPasswordAPI();
        }
    }
    const forgotPasswordAPI = useCallback(() => {
        handleSubmit(async (data) => {
            try {
                const payload = {
                    ...data,
                    Guid: uuid,
                    MobileNo: '',
                    MailId: '',
                }
                const { Message, Id } = await ApiService.httpPost('User/forgotPassword', payload);
                const loginInfo = {
                    SESSION: uuid,
                    ...data,
                }
                if (Id < 0) {
                    toast.error(Message)
                } else {
                    onOTPTrigger({ Data: loginInfo, Tokens: {} })
                    toast.success(Message)
                }
            } catch (error) {

            }
        })();
    }, [handleSubmit, onOTPTrigger, uuid])
    return (
        <div className="login-form">
            <Row>
                <Col md={12}>
                    <h4 className="auth-title text-center mb-5">{t("Forgot Password?")}</h4>
                </Col>
                <Col md={12} className="mb-3">
                    <FormInputText
                        name="UserName"
                        control={control}
                        label={t("User Name")}
                        startAdornment={true}
                        startAdornmentPosition="start"
                        muiIcon="PersonOutline"
                        errors={errors}
                        onKeyDown={handleEnterKeyPress}
                    />
                </Col>
                <Col md={12} className="text-right mt-4">
                    <PrimaryButton onClick={forgotPasswordAPI} text={t('Send Otp')} isLoading={isLoading} styleType='btnLoader' />
                </Col>
            </Row>
        </div>
    )
}
const ResetPasswordScreen = ({ Guid }: any) => {
    return (
        <div className="login-form">
            <Row>
                <Col md={12}>
                    <h4 className="auth-title text-center mb-4">{t("Reset Password")}</h4>
                </Col>
                <Col md={12}>
                    <ResetPassword Guid={Guid} />
                </Col>
            </Row>
        </div>
    )
}
const ForgotPassword = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [otpUserInfo, setOtpUserInfo] = useState(null);
    return (
        <>
            <div className="login-wrapper h-100">
                <Container className="h-100">
                    <div className="auth-header">
                        <AuthHeader />
                    </div>
                    <div className="auth-form-body h-100">
                        {userInfo ?
                            (
                                otpUserInfo ?
                                    <ResetPasswordScreen Guid={uuid} /> :
                                    <OTPScreen onBack={() => { setUserInfo(null) }} loginInfo={userInfo} onSubmit={setOtpUserInfo} otpProps={{ isPage: 'forgotPassword' }} />

                            ) :
                            <ForgotPwdFrm onOTPTrigger={setUserInfo} uuid={uuid} />}
                    </div>
                </Container>
            </div>
        </>
    )
}
export default ForgotPassword;