import { Col, Row } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import PasswordPolicyControl from "../../shared/components/UI/PasswordPolicy/PasswordPolicyControl";
import { useEffect, useState } from "react";
import PasswordPolicyUtils from "../../shared/components/UI/PasswordPolicy/passwordPolicy.utils";
import { useTranslation } from "react-i18next";



export const Credentials = () => {
    const methods = useFormContext();
    const { t, i18n } = useTranslation();
    const [pwdPolicy, setPwdPolicy] = useState<any[]>([]);
    const handleOnInput = (e: any) => {
        const { target: { value } } = e;
        const rules = {
            MIN_PWD_LENGTH: 8,
            MIN_PWD_DIGITS: 2,
            MIN_SPECIAL_CHARS: 2,
            PWD_IS_UPPER_LOWER_CASE: 2,
            PASSWORD_AUTO_EXPIRY: 0
        }
        const policy = PasswordPolicyUtils.getPasswordMutiValidate(rules)
        setPwdPolicy(PasswordPolicyUtils.buildValidator(policy,value))
    }
    useEffect(()=>{
        handleOnInput({target:{value:''}})
    },[])    
    return (
        <>
            {(methods.watch('syncUserToItcSystem') === '0') || (methods.watch('syncUserToSourceSystem') === '0') ?
                <div className="block__wrap">
                    <Row>
                        <Col md={12}>
                            <h4 className="block__heading">{t("Credentials")}</h4>
                            {/* <PasswordPolicyControl list={pwdPolicy} /> */}
                        </Col>
                        <Col md={3} className="mb-3">
                            <FormInputText
                                name="CRED_EMAIL_ID"
                                control={methods.control}
                                label={t("Email ID")}
                                errors={methods.formState.errors}
                            />
                        </Col>
                        <Col md={3} className="mb-3">
                            <FormInputText
                                name="CONFIRM_EMAIL_ID"
                                control={methods.control}
                                label={t("Confirm Email")}
                                errors={methods.formState.errors}
                            />
                        </Col>
                        <Col md={3}>
                            <FormInputText
                                name="PASSWORD"
                                control={methods.control}
                                label={t("Password")}
                                onInput={handleOnInput}
                                startAdornment={true}
                                startAdornmentPosition="start"
                                muiIcon="LockOpen"
                                errors={methods.formState.errors}
                                type="password"
                                endAdornment
                            />
                        </Col>
                        <Col md={3}>
                            <FormInputText
                                name="CONFIRM_PASSWORD"
                                control={methods.control}
                                label={t("Confirm Password")}
                                startAdornment={true}
                                startAdornmentPosition="start"
                                muiIcon="LockOpen"
                                errors={methods.formState.errors}
                                hideError={true}
                                type="password"
                                endAdornment
                            />
                        </Col>
                    </Row>
                </div>
                : <></>
            }
        </>

    )
}