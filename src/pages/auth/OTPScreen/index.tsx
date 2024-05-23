import { Col, Row } from "react-bootstrap";
import FormOTP from "../../../shared/components/form-components/FormOTP";
import TimerInput from "../../../shared/components/UI/TimerInput";
import HomeIconButton from "../../../shared/components/Buttons/IconButtons/HomeIconButton";
import { useCallback, useEffect, useState } from "react";
import { getExpTimeByMinute, getExpTimeBySecond } from "../../../core/services/utility/utils";
import ApiService from "../../../core/services/axios/api";
import { toast } from "react-toastify";
import localStore from "../../../common/browserstore/localstore";
import { useLocation, useNavigate } from "react-router-dom";
import "../login/login.scss";
import { useTranslation } from "react-i18next";
import axios, { AxiosError } from "axios";

const OTPScreen = ({ loginInfo, onBack, onSubmit, otpProps }: any) => {
    const expTimeInitial = getExpTimeByMinute(5);
    const expResentTimeInitial = getExpTimeBySecond(30);
    const { Data, Tokens, Token, loggedUserId } = loginInfo ?? {};
    const { USER_ID: UserId, SESSION: Guid, EMAIL_ID, MobileNo, TradeLicenseNo, GuidV4, UserName } = Data ?? {};
    const [disableResend, setDisableResend] = useState(true);
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [expTime, setExpTime] = useState(expTimeInitial);
    const [expResentTime, setExpResentTime] = useState(expResentTimeInitial);
    const [otpTxtValue, setOtpTxtValue] = useState({ value: '' });
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation()

    /* LOGIN */
    const onOTPSubmit = useCallback(async (Otp: string) => {
        try {
            const apiObj = {
                Guid,
                UserId,
                Otp
            }
            const otpResponse = await ApiService.httpPost('user/verifyOtp', apiObj);
            if (otpResponse.Id > 0) {
                localStore.addItem('helpdeskAccessToken', Tokens.AccessToken);
                localStore.addItem('helpdeskRefreshToken', Tokens.RefreshToken);
                localStore.addItem('helpdeskLoginData', JSON.stringify(Data));
                const searchParams = new URLSearchParams(location.search);
                const redirectUrl = searchParams.get('redirect') || `/dashboard`;
                navigate(redirectUrl);
                toast.success(otpResponse?.Message);
            } else {
                setOtpTxtValue({ value: '' });
                backToLoginScreen()
                toast.error(otpResponse?.Message);
            }
            /* IF Getting Any API Fail error like 404 or etc */
            if (otpResponse instanceof AxiosError) {
                backToLoginScreen()
            }
        } catch (error) {
        }
    }, [Data, Guid, Tokens?.AccessToken, Tokens?.RefreshToken, UserId, navigate]);

    const onOTPSubmitForgotPassword = useCallback(async (Otp: string) => {
        try {
            const apiObj = {
                Guid,
                UserId: -1,
                Otp
            }
            const otpResponse = await ApiService.httpPost('user/verifyOtp', apiObj);
            if (otpResponse.Id > 0) {
                onSubmit && onSubmit({ data: { Guid } })
                toast.success(otpResponse?.Message);
            } else {
                setOtpTxtValue({ value: '' });
                backToLoginScreen()
                toast.error(otpResponse?.Message);
            }
            /* IF Getting Any API Fail error like 404 or etc */
            if (otpResponse instanceof AxiosError) {
                backToLoginScreen()
            }
        } catch (error) {
        }
    }, [Guid]);

    const onOTPSend = useCallback(async (canTriggerMsg?: boolean) => {
        try {
            const apiObj = {
                Guid,
                UserId
            }
            const otpSendResponse = await ApiService.httpPost('user/sendOtp', apiObj);
            if (otpSendResponse?.Id > 0) {
                setShowOtpScreen(true);
            }
            if (canTriggerMsg) {
                if (otpSendResponse?.Id < 0) {
                    backToLoginScreen()
                    toast.error(otpSendResponse?.Message);
                } else {
                    toast.success(otpSendResponse?.Message);
                }
            }
            /* IF Getting Any API Fail error like 404 or etc */
            if (otpSendResponse instanceof AxiosError) {
                backToLoginScreen()
            }
        } catch (error) {
           
        }
    }, [Guid, UserId])


    /* OPERATOR */


    const redirectToOperatorForm = useCallback(() => {
        localStore.addItem('frmOperatorToken', Token);
        localStore.addItem('frmOperatorData', JSON.stringify({ ...Data, userId: loggedUserId }));
        navigate(`/operator/form`);
    }, [Data, Token, loggedUserId, navigate])

    const onOperatorOTPSubmit = useCallback(async (Otp: string) => {
        try {
            const apiObj = {
                Guid: GuidV4,
                Otp
            };
            const otpResponse = await ApiService.httpPost('trans/verifyOtp', apiObj);
            if (otpResponse.Id > 0) {
                redirectToOperatorForm();
            } else {
                setOtpTxtValue({ value: '' });
                backToLoginScreen();
                toast.error(otpResponse?.Message);
            }
            /* IF Getting Any API Fail error like 404 or etc */
            if (otpResponse instanceof AxiosError) {
                backToLoginScreen()
            }
        } catch (error) {
        }
    }, [GuidV4, redirectToOperatorForm]);

    const onOperatorOTPSend = useCallback(async (canTriggerMsg?: boolean) => {
        try {
            const apiObj = { Guid: GuidV4, MobileNo, TradeLicenseNo }
            const otpSendResponse = await ApiService.httpPost('trans/sendOtp', apiObj);
            localStore.addItem('otpdet', JSON.stringify({ sendOtpId: Number(otpSendResponse.Id), sendOtpMessage: otpSendResponse?.Message }));
            if (otpSendResponse.Id === -99) {
                toast.success(otpSendResponse?.Message);
                backToLoginScreen()
                redirectToOperatorForm();
            } else if (otpSendResponse.Id > 0) {
                setShowOtpScreen(true);
            } else {
                setShowOtpScreen(true);
                toast.error(otpSendResponse?.Message);
            }

            /* IF Getting Any API Fail error like 404 or etc */
            if (otpSendResponse instanceof AxiosError) {
                backToLoginScreen()
            }

            if (canTriggerMsg) {
                toast.success(otpSendResponse?.Message);
            }
        } catch (error) {

        }
    }, [GuidV4, MobileNo, TradeLicenseNo, redirectToOperatorForm]);


    const sendOTP = useCallback(() => {
        if (otpProps?.isPage === 'login') {
            onOTPSend(true)
        } else if (otpProps?.isPage === 'forgotPassword') {
            setShowOtpScreen(true);
        } else {
            onOperatorOTPSend(false);
        }
    }, [onOTPSend, onOperatorOTPSend, otpProps?.isPage])

    /* OTP Complete */
    const onComplete = (otp: string) => {
        if (otpProps?.isPage === 'login') {
            onOTPSubmit(otp);
        }
        else if (otpProps?.isPage === 'forgotPassword') {
            onOTPSubmitForgotPassword(otp);
        } else {
            onOperatorOTPSubmit(otp);
        }
    }
    const validateChar = (value: any, index: any) => {
        return !(/\D/.test(value))
    }
    const onResendTimerExpired = () => {
        setDisableResend(false);
    };
    const onOTPTimerExpired = () => {

    };

    /* Forgot Password */
    const sendOTPForgotPassword = useCallback(async () => {
        try {
            const payload = {
                UserName,
                Guid,
                MobileNo: '',
                MailId: '',
            }
            const { Message, Id } = await ApiService.httpPost('User/forgotPassword', payload);
            if (Id < 0) {
                toast.error(Message)
            } else {
                toast.success(Message)
            }
        } catch (error) {

        }
    }, [Guid, UserName]);

    const backToLoginScreen = () => {
        onBack(); 
    }

    const redirectLogin = () => {
        navigate(`/auth/login`)
    }

    const resendOTPHandler = () => {
        if (otpProps?.isPage === 'forgotPassword') {
            sendOTPForgotPassword()
        } else {
            sendOTP()
        }
        setDisableResend(true);
        setExpTime(getExpTimeByMinute(5));
        setExpResentTime(getExpTimeBySecond(30));
    }
    useEffect(() => {
        sendOTP()
    }, [sendOTP])
    return (
        <>
            {
                showOtpScreen &&
                <div className="login-form">
                    <Row> 
                        <Col md={12}>
                            <div className="d-flex align-items-center  mb-4">
                                <HomeIconButton onClick={redirectLogin} />
                                <h4 className="auth-title text-center  mb-0">{t("Verification")}</h4>
                            </div>
                        </Col>
                        <Col md={12}>
                            <p className="otp-text">
                                {
                                    (otpProps?.isPage === 'login' || otpProps?.isPage === 'forgotPassword') ?
                                        `${t("A One-Time Passcode has been sent to your Email")}  ` :
                                        `${t("A One-Time Passcode has been sent to your Mobile")}`
                                }
                            </p>
                        </Col>
                        <Col md={12}>
                            <p className="otp-text">
                                {t("OTP Expires In")} - <TimerInput countDownDate={expTime} expired={onOTPTimerExpired} />
                            </p>
                        </Col>
                        <Col md={12} className="my-3">
                            <FormOTP config={otpTxtValue} inputProps={{ length: 6, onComplete, validateChar, className: 'otpInput' }} />
                        </Col>
                        <Col md={12}>
                            <p className="otp-text m-0">
                                {t("Resend One-Time Passcode")} <span className={`otp-resent ${disableResend ? 'otp-disableText' : ''}`} onClick={resendOTPHandler}>{t("Click Here")}</span> <TimerInput countDownDate={expResentTime} expired={onResendTimerExpired} expiredText='' />
                            </p>
                        </Col>
                    </Row>
                </div>
            }
        </>
    )
}
export default OTPScreen;