

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { t } from "i18next";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useCallback, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommonUtils from "../../../common/utils/common.utils";
import ApiService from "../../../core/services/axios/api";
import APIFetchService from "../../../core/services/fetch";
import PasswordPolicyUtils from "../../../shared/components/UI/PasswordPolicy/passwordPolicy.utils";
import * as yup from "yup";
import { Row, Col } from "react-bootstrap";
import PasswordPolicyControl from "../../../shared/components/UI/PasswordPolicy/PasswordPolicyControl";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import PrimaryButton from "../../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import CloseIcon from "@mui/icons-material/Close";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";


export interface DialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}

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


const UserResetPassword = (props: DialogProps) => {
    const { onCloseDialog, popupConfiguration } = props;
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { rowData, activeAction } = useContext(fullViewRowDataContext);

    const handleCloseDialog = () => {
        onCloseDialog(true);
    };


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
                    UserPwd: data.UserPwd,
                    UserId: rowData.ID_
                }
                const { Id, Message } = await ApiService.httpPost('User/resetPassword', payLoad);
                setIsLoading(false);
                if (Id < 0) {
                    toast.error(Message)
                } else { 
                    handleCloseDialog();
                    toast.success(Message) 
                }
            } catch (error) {
                setIsLoading(false);
            }
        })();
    }, [UserId, handleSubmit, navigate])
    useEffect(() => {
        const { UserPwd } = getValues();
        handleOnInput({ target: { value: UserPwd ?? '' } })
    }, [getValues, handleOnInput, passwordPolicy])
    useEffect(() => {
        getPasswordPolicy();
    }, [getPasswordPolicy])


    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                <p className="dialog_title">
                    <PixOutlinedIcon className="head-icon" />
                    <span className="mx-2">
                        {popupConfiguration && popupConfiguration.DialogHeading}
                    </span>
                </p>
                <IconButton
                    aria-label="close"
                    className="head-close-bttn"
                    onClick={() => handleCloseDialog()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                     <CloseIcon />
                </IconButton>

            </DialogTitle>
            <DialogContent>
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
                </Row>
            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <Button
                    autoFocus
                    onClick={handleCloseDialog}
                >
                    {t("Close")}
                </Button>

                <PrimaryButton onClick={handleResetPassword} text={t('Reset Password')} isLoading={isLoading} styleType='btnLoader' />


            </DialogActions>
        </>
    )
}
export default UserResetPassword;