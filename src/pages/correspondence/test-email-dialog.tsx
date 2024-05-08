
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInputText } from "../../shared/components/form-components/FormInputText"
import { useForm } from "react-hook-form";
import localStore from "../../common/browserstore/localstore";
import { useState } from "react";
import { Button } from "@mui/material";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


export const TestEmailDialog = (props: any) => {
    const { emailBoxStatus, changeEmailBoxStatus } = props; 
    const { t, i18n } = useTranslation();
    const userData = localStore.getLoggedInfo();
    const EmailId = userData && JSON.parse(userData).EMAIL_ID;

    const emailSchema = yup.object().shape({
        email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, '')
            .required('')
    });
    const emailMethods = useForm({
        resolver: yupResolver(emailSchema),
        defaultValues: {
            email: EmailId
        },
        context: {
            emailBoxStatus: emailBoxStatus
        }
    });

    const onSubmitEmail = () => async (emailData: any) => {
        if (emailData.email) {
            console.log(emailData.email, 'entered Email');
        }
    }


    return (
        <>
            <div className="email-box-wrapper">
                <div className="email-box">
                    <div className="d-flex align-items-center justidy-content-between">
                        <h4 className="mb-4">{t("Enter Your Test Email")}</h4>
                    </div>
                    <div>
                        {/* <input type="text" placeholder="Enter Your Email"/> */}
                        <FormInputText
                            name="email"
                            control={emailMethods.control}
                            label={t("Email")}
                            errors={emailMethods.formState.errors}
                            hideError={true}
                        />
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                        <div className="close">
                            <Button className="mx-1" color="primary" autoFocus onClick={() => changeEmailBoxStatus(false)}> {t("Cancel")} </Button>
                        </div>
                        <div>
                            <Button className="rgt-bttn mx-1" color="primary" autoFocus onClick={emailMethods.handleSubmit(onSubmitEmail())}> {t("Submit")} </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mailBox-overlay" onClick={() => changeEmailBoxStatus(false)}></div>
        </>
    )
}