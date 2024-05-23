import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, CircularProgress } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Login } from "../../../common/api/auth.api";
import localStore from "../../../common/browserstore/localstore";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import ApiService from "../../../core/services/axios/api";
import { CultureId } from "../../../common/application/i18n";
import OTPScreen from "../OTPScreen";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


/* const domainList = [
    {
        Id: 23201,
        ParentId: null,
        Code: "doti",
        Description: "DOT",
    },
    {
        Id: 23202,
        ParentId: null,
        Code: "dmt",
        Description: "DMT",
    },
    {
        Id: 23203,
        ParentId: null,
        Code: "OTHERS",
        Description: "OTHERS",
    },
]; */

const validationSchema = yup.object().shape({
    Domain: yup.string().required(),
    UserName: yup.string().required(),
    UserPwd: yup.string().required(),
});
const LoginScreen = ({ onOTPTrigger }: any) => {
    const navigate = useNavigate();
    const lang = CultureId();
    const [domain, setDomainList] = useState<{ label: string, value: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOperatorLogin, setIsOperatorLogin] = useState(false);
    const location = useLocation();
    useEffect(() => {
        getDomainList();
        setIsOperatorLogin(location.pathname === '/auth/login' ? true : false);
    }, []);

    const { t, i18n } = useTranslation();


    const {
        control,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            Domain: 23201,
            UserName: "",
            UserPwd: "",
        },
    });

    const getDomainList = async () => {
        const domains = await ApiService.httpGet(`user/getDomainList?cultureId=${lang}`);
        console.log(domains);
        if (domains.Valid > 0) {
            const data = domains.Data.map((x: any) => ({ label: x.Description, value: x.Id }));
            setDomainList(data)
        }
    }

    const handleEnterKeyPress = (event: any) => {
        if (event.code === "Enter") {
            trigger().then((isValid) => {
                if (isValid) {
                    handleSubmit(onClickToLogin)();
                }
            });
        }
    }

    const onClickToLogin = async (formValues: any, e: any) => {
        const loginParam = {
            CultureId: lang,
            AppId: 2,
            Domain: isOperatorLogin ? 23203 : Number(formValues.Domain),
            UserName: formValues.UserName,
            UserPwd: formValues.UserPwd,
        }
        setIsLoading(true);
        const loginResponse = await Login(loginParam);
        if (loginResponse?.Valid > 0) {
            const { Data } = loginResponse;
            if (Data.TwoFactorAuthentication) {
                onOTPTrigger(loginResponse);
            } else {
                localStore.addItem('helpdeskAccessToken', loginResponse.Tokens.AccessToken);
                localStore.addItem('helpdeskRefreshToken', loginResponse.Tokens.RefreshToken);
                localStore.addItem('helpdeskLoginData', JSON.stringify(loginResponse.Data));
                navigate(`/dashboard`);
            }
            setIsLoading(false);
        } else {
            toast.error(loginResponse?.Message);
            setIsLoading(false);
        }
    };


    return (
        <>
            <div className="login-form">
                <Row>
                    <Col md={12}>
                        <h4 className="auth-title text-center mt-4">{t("Sign In")}</h4>
                        <div className="d-flex align-items-center justify-content-center">
                            <p className="sign-in mb-5">Please Enter Your Details</p>
                        </div>
                    </Col>
                    {/* {isOperatorLogin ? null : (
                        <Col md={12} className="mb-3">
                            <FormInputSelect
                                name="Domain"
                                control={control}
                                label={t("Domain")}
                                errors={errors}
                                options={domain}
                                startAdornment={true}
                                startAdornmentPosition="start"
                                muiIcon="Business"
                                isSlectItem="Select Domain"
                                hideError={true}
                            />
                        </Col>
                    )} */}
                    <Col md={12} className="mb-3">
                        <FormInputText
                            name="UserName"
                            control={control}
                            label={t("User Name")}
                            startAdornment={true}
                            startAdornmentPosition="start"
                            muiIcon="PersonOutline"
                            hideError={true}
                            autoCompleteName={'username'}
                            onKeyDown={handleEnterKeyPress}
                        />
                    </Col>
                    <Col md={12} className="mb-3">
                        <FormInputText
                            name="UserPwd"
                            control={control}
                            label={t("Password")}
                            startAdornment={true}
                            startAdornmentPosition="start"
                            muiIcon="LockOpen"
                            hideError={true}
                            autoCompleteName={'current-password'}
                            type="password"
                            endAdornment={true}
                            onKeyDown={handleEnterKeyPress}
                        />
                    </Col>
                    {/* {isOperatorLogin &&  */}
                    <Col md={12}>
                        <p className="forgot-para cursor-pointer" onClick={() => { navigate('/auth/forgot-password') }}>{t("Forgot Password?")}</p>
                    </Col>
                    {/*  } */}
                    <Col md={12}>
                        <Button
                            className="login-bttn py-2 mt-4"
                            size="small"
                            variant="outlined"
                            fullWidth={true}
                            onClick={handleSubmit(onClickToLogin)}
                            disabled={isLoading || isSubmitting}
                        >
                            {isLoading ? <CircularProgress className="login-loader" size={24} /> : `${t("Login")}`}
                        </Button>
                    </Col>

                    <Col md={12}>
                        <div className="d-flex align-items-center justify-content-center">
                            <p className="my-4 copy-right">&#169; <a href="https://www.accingeapps.com/" target="_blank">Accinge</a> All Rights Reserved</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};
export const LoginForm = () => {
    const [loginOTP, setLoginOTP] = useState(null);
    const [otpProps, setotpProps] = useState({
        isPage: 'login',
        sendOtp: 'user/sendOtp',
        otpurl: 'user/verifyOtp'
    })
    return loginOTP ? <OTPScreen onBack={() => { setLoginOTP(null) }} loginInfo={loginOTP} otpProps={otpProps} /> : <LoginScreen onOTPTrigger={setLoginOTP} />
}