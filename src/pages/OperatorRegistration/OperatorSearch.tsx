import { Col, Container, Row } from "react-bootstrap";
import AuthHeader from "../auth/auth-layout/auth-header";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import './OperatorRegistration.scss';
import FormInputPhone from "../../shared/components/form-components/FormInputPhone";
import { FormInputDate } from "../../shared/components/form-components/FormInputDate";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import OTPScreen from "../auth/OTPScreen";
import ApiService from "../../core/services/axios/api";
import localStore from "../../common/browserstore/localstore";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../common/application/shared-function";


const validationSchema = yup.object().shape({
    TradeLicenseNo: yup.string().required(),
    MobileNo: yup.string().required(),
});


const OperatorSearch = ({ onOTPTrigger }: any) => {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            TradeLicenseNo: "",
            MobileNo: "",
            expiryDate: ""
        },
    });

    useEffect(() => {
        localStore.clearAll();
    }, [])

    const onClickToOperator = async (formValues: any, e: any) => {
        const sendOtpParam = {
            GuidV4: v4(),
            MobileNo: formValues.MobileNo,
            TradeLicenseNo: formValues.TradeLicenseNo,
        };
        try {
            setIsLoading(true);
            const response = await ApiService.httpGet(`operator/getToken`); 
            if (response) { 
                const x = {
                    Data: { ...sendOtpParam, searchExpiryDate: new Date(formValues.expiryDate)},
                    Token: response.Tokens?.AccessToken,
                    loggedUserId: response.Data?.USER_ID,
                } 
                onOTPTrigger(x);
                setIsLoading(false);
            }
        } catch (error) { 
            setIsLoading(false);
        }  
    }

    return (
        <>
            <div className="login-wrapper h-100">
                <Container className="h-100">
                    <div className="auth-header">
                        <AuthHeader />
                    </div>
                    <div className="auth-form-body h-100">
                        <div className="operator-search-form">
                            <Row>
                                <Col md={12}>
                                    <h4 className="auth-title text-center mb-4">{t("Operator Search")}</h4>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <FormInputText
                                        name="TradeLicenseNo"
                                        control={methods.control}
                                        label={t("Trade License No")}
                                        errors={methods.formState.errors}
                                        hideError={true}
                                    />
                                </Col>
                                <Col md={12} className="mb-3">
                                    <FormInputPhone
                                        name="MobileNo"
                                        control={methods.control}
                                        label={t("Mobile No.")}
                                        errors={methods.formState.errors}
                                        disabled={false}
                                        mask="(999) 999-9999"
                                        hideError={true}
                                    />
                                </Col>
                                <Col md={12} className="mb-3">
                                    <FormInputDate
                                        name="expiryDate"
                                        control={methods.control}
                                        label={t("Expiry Date")}
                                        errors={methods.formState.errors}
                                        inputFormat="DD/MM/YYYY"
                                        hideError={true}
                                        minDate={new Date()}
                                    />
                                </Col>
                                <Col md={12}>
                                    <Button
                                        className="login-bttn py-2"
                                        size="small"
                                        variant="outlined"
                                        fullWidth={true}
                                        onClick={methods.handleSubmit(onClickToOperator)}
                                        disabled={isLoading || methods.formState.isSubmitting}
                                    > 
                                        {isLoading ? <CircularProgress className="login-loader" size={24} /> : 'Search'}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export const OperatorRegistrationSearch = () => {
    const [operatorOTP, setOperatorOTP] = useState(null);
    const [otpProps, setotpProps] = useState({
        isPage: 'operator',
        sendOtp: 'trans/sendOtp',
        otpurl: 'trans/verifyOtp'
    })
    return operatorOTP ? <OTPScreen onBack={() => { setOperatorOTP(null) }} loginInfo={operatorOTP} otpProps={otpProps} /> : <OperatorSearch onOTPTrigger={setOperatorOTP} />
}
