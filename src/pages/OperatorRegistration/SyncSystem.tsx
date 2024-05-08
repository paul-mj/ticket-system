import { Col, Row } from "react-bootstrap"
import { FormInputText } from "../../shared/components/form-components/FormInputText"
import { FormInputRadio } from "../../shared/components/form-components/FormInputRadio";
import { useFormContext } from "react-hook-form";
import { DbVars } from "../../common/database/app.dbVars";
import ApiService from "../../core/services/axios/api";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FormInputSelect } from "../../shared/components/form-components/FormInputSelect";
import PrimaryButton from "../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import CloseIconButton from "../../shared/components/Buttons/IconButtons/CloseIconButton";
import { useCallback, useEffect, useState } from "react";
import { OperatorValidationSchema } from "./OperatorParamFormatter";
import { useTranslation } from "react-i18next";

const confirmOptions = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' }
];

export const SyncSystem = (props: any) => {
    const { sourceSystemList, TradeLicenseNo, lang, isValidateStatus } = props;
    const methods = useFormContext();
    const [isValidateButtons, setIsValidateButtons] = useState<any>({
        validateSystem: false,
        validateUser: false
    });
    const [isValidateLoader, setIsValidateLoader] = useState<any>({
        validateSystemLoader: false,
        validateUserLoader: false
    });

    const { t, i18n } = useTranslation();


    useEffect(() => {
        isValidateStatus(isValidateButtons)
    }, [isValidateButtons, isValidateStatus])


    /* Validate Source System */
    const onClickValidateSourceSystem = async () => {
        if (!methods.watch('SourceSystem')) {
            methods.setError('SourceSystem', { message: `` });
        }
        const param = {
            systemId: methods.watch('SourceSystem'),
            Data: {
                TradeLicenseNo: TradeLicenseNo,
                [DbVars.CultureId]: lang
            }
        }
        try {
            setIsValidateLoader((prevState: any) => ({
                ...prevState,
                validateSystemLoader: true
            }));
            const response = await ApiService.httpPost(`sourceSystem/verifyOperator`, param);
            if (response.Valid > 0) {
                if (response.Data[0]?.IsActive > 0) {
                    setIsValidateButtons((prevState: any) => ({
                        ...prevState,
                        validateSystem: true
                    }));

                    toast.success(response?.ResponseMessage);
                } else {
                    toast.error(`${t('User Not Active')}`)
                }
                methods.clearErrors('SourceSystem')
            } else {
                toast.error(response?.ResponseMessage);
            }
        } catch (error) {

        } finally {
            setIsValidateLoader((prevState: any) => ({
                ...prevState,
                validateSystemLoader: false
            }));
        }
    }


    /* Validate User */
    const onClickValidateUserSystem = async () => {
        if (!methods.watch('SourceSystemUserName')) {
            methods.setError('SourceSystemUserName', { message: `` });
        }
        const param = {
            systemId: methods.watch('SourceSystem'),
            Data: {
                TradeLicenseNo: TradeLicenseNo,
                [DbVars.CultureId]: lang,
                UserName: methods.watch('SourceSystemUserName')
            }
        }
        try {
            setIsValidateLoader((prevState: any) => ({
                ...prevState,
                validateUserLoader: true
            }));
            const response = await ApiService.httpPost(`sourceSystem/getUserInfo`, param);
            if (response.Valid > 0) {
                setIsValidateButtons((prevState: any) => ({
                    ...prevState,
                    validateUser: true
                }));
                toast.success(response?.ResponseMessage);
                methods.clearErrors('SourceSystemUserName')
            } else {
                onClickClearUser();
                toast.error(response?.ResponseMessage)
            }
        } catch (error) {

        } finally {
            setIsValidateLoader((prevState: any) => ({
                ...prevState,
                validateUserLoader: false
            }));
        }
    }

    const onChangeSourceSystem = (event: any) => {
        methods.setValue('syncUserToSourceSystem', '');
        setIsValidateButtons((prevState: any) => ({
            ...prevState,
            validateUser: false,
            validateSystem: false
        }));
    }

    const syncUserSystemChange = (event: any) => {
        if (event) {
            resetCredentialsAndSource()
        }
    }
    const syncUserSourceChange = (event: any) => {
        console.log(typeof event)
        /* if (event === '0') {
            resetCredentialsAndSource();
            methods.setValue('syncUserToItcSystem', '0');
        } */
        const credFields = ['CRED_EMAIL_ID', 'CONFIRM_EMAIL_ID', 'PASSWORD', 'CONFIRM_PASSWORD'];
        for (const field of credFields) {
            methods.setValue(field, '');
        }
        if (event && event === '0') {
            methods.setValue('SourceSystemUserName', '');
            setIsValidateButtons((prevState: any) => ({ ...prevState, validateUser: false }));
            //resetCredentialsAndSource();
        }
    }


    /* Reset Credentials */
    const resetCredentialsAndSource = () => {
        const x = ['CRED_EMAIL_ID', 'CONFIRM_EMAIL_ID', 'PASSWORD', 'CONFIRM_PASSWORD', 'SourceSystem', 'syncUserToSourceSystem', 'SourceSystemUserName'];
        for (const field of x) {
            methods.setValue(field, '');
        }
        setIsValidateButtons((prevState: any) => ({
            ...prevState,
            validateUser: false,
            validateSystem: false
        }));
    }

    const onClickClearUser = () => {
        methods.setValue('SourceSystemUserName', '');
        setIsValidateButtons((prevState: any) => ({ ...prevState, validateUser: false }));
    }

    return (
        <div className={`block__wrap ${methods.formState.errors.syncUserToItcSystem ? 'box-error' : ''}`}>

            <div className="mb-3">
                <FormInputRadio
                    name="syncUserToItcSystem"
                    control={methods.control}
                    label={t("Do you wish to sync User from another ITC System?")}
                    options={confirmOptions}
                    onChange={syncUserSystemChange}
                />
            </div>


            {methods.watch('syncUserToItcSystem') === '1' &&
                <Row className="justify-content-between align-items-start mx-2">
                    <Col md={3} col={12} className={`${isValidateButtons.validateSystem ? 'col-box' : ''}`}>
                        <Row className={`step-card-box ${(!isValidateButtons.validateSystem && methods.watch('SourceSystem')) ? 'card-box-error' : ''}`}>
                            <span className="arrow"></span>
                            <Col md={12} className="step-title">
                                <h4>{t("Step 1")}</h4>
                                <p>{t("Select your Source System and Press Validate to Continue")}</p>
                            </Col>
                            <Col md={12} className="mb-3">
                                <FormInputSelect
                                    name="SourceSystem"
                                    control={methods.control}
                                    label={t("Source System")}
                                    options={sourceSystemList}
                                    errors={methods.formState.errors}
                                    hideError={true}
                                    onChange={onChangeSourceSystem}
                                />
                            </Col>
                            {
                                !isValidateButtons.validateSystem &&
                                <Col md={12}>
                                    <Row className="justify-content-end no-gutters">
                                        <Col md={8} className="p-0">
                                            <PrimaryButton text={t("Validate System")} onClick={onClickValidateSourceSystem} isLoading={isValidateLoader.validateSystemLoader} styleType='btnLoader w-100' />
                                        </Col>
                                    </Row>
                                </Col>
                            }
                        </Row>
                    </Col>
                    {isValidateButtons.validateSystem &&
                        <>
                            <Col md={3} col={12} className={`${methods.watch('syncUserToSourceSystem') === '1' ? 'col-box' : ''}`}>
                                <span className="arrow"></span>
                                <Row className={`step-card-box ${(isValidateButtons.validateSystem && !methods.watch('syncUserToSourceSystem')) ? 'card-box-error' : ''}`}>
                                    <Col md={12} className="step-title">
                                        <h4>{t("Step 2")}</h4>
                                        <p>{t("Select Yes to integrate user from Selected source system")}</p>
                                    </Col>
                                    <Col md={12} className="radio-flex">
                                        <FormInputRadio
                                            name="syncUserToSourceSystem"
                                            control={methods.control}
                                            label={t("Do you wish to sync User from Source System?")}
                                            options={confirmOptions}
                                            onChange={syncUserSourceChange}
                                        />
                                    </Col>
                                </Row>
                            </Col>


                            <Col md={3} col={12}>
                                {
                                    methods.watch('syncUserToSourceSystem') === '1' && 
                                    <Row className={`step-card-box ${(!isValidateButtons.validateUser && methods.watch('SourceSystemUserName')) ? 'card-box-error' : ''}`}>
                                        <Col md={12} className="step-title">
                                            <h4>{t("Step 3")}</h4>
                                            <p>{t("Enter your username to validate from source system")}</p>
                                        </Col>
                                        <Col md={12} className="mb-3 position-relative">
                                            <FormInputText
                                                name="SourceSystemUserName"
                                                control={methods.control}
                                                label={t("User Name")}
                                                errors={methods.formState.errors}
                                                hideError={true}
                                                disabled={isValidateButtons.validateUser}
                                            />
                                            {
                                                isValidateButtons.validateUser &&
                                                <div className="clear-user">
                                                    <CloseIconButton onClick={onClickClearUser} />
                                                </div>
                                            }
                                        </Col>
                                        {
                                            !isValidateButtons.validateUser ?
                                                <Col md={12} className="step-title">
                                                    <PrimaryButton text={t("Validate User")} onClick={onClickValidateUserSystem} isLoading={isValidateLoader.validateUserLoader} styleType='btnLoader' />
                                                </Col>
                                                :
                                                <div className="validate_success">
                                                    <p>{t("User has been successfully Validated with Source System.")}</p>
                                                </div>
                                        }

                                    </Row>
                                }
                            </Col>
                        </>
                    }

                </Row>
            }

        </div>
    )
}