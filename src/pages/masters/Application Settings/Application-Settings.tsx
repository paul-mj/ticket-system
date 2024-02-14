import { useEffect } from "react";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,

} from "@material-ui/core";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { readSetting, saveSetting } from "../../../common/api/masters.api";
import localStore from "../../../common/browserstore/localstore";
import { toast } from "react-toastify";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const def = {
    MinPwdLength: "",
    MinPwdDigit: "",
    MinSpecialChars: "",
    PwdIsUpperLowerCase: false,
    GraphMailId: "",
    GraphClientId: "",
    GraphTenantId: "",
    GraphClientSecret: ""

}
const ApplicationSchema = yup.object().shape({

    GraphMailId: yup.string().email("Enter Valid Email").optional(),

})



const ApplicationSettings = (props: any) => {
    const {
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: def,
        resolver: yupResolver(ApplicationSchema)
    })
    const userData = localStore.getLoggedInfo();
    const { t, i18n } = useTranslation();
    const userID = userData && JSON.parse(userData).USER_ID;
    const { onCloseDialog, popupConfiguration } = props;
    const confirm = useConfirm();
    const handleCloseDialog = () => {
        onCloseDialog(true);
    };
    useEffect(() => {
        readEdit();
    }, [])
    const readEdit = async () => {

        const readSet = await readSetting();       
        const dataSet = {
            MinPwdLength: readSet?.Data.MIN_PWD_LENGTH,
            MinPwdDigit: readSet?.Data.MIN_PWD_DIGITS,            
            MinSpecialChars: readSet?.Data.MIN_SPECIAL_CHARS,
            PwdIsUpperLowerCase: readSet?.Data.PWD_IS_UPPER_LOWER_CASE === 1 ? true : false,
            GraphMailId: readSet?.Data.GRAPH_MAIL_ID,
            GraphClientId: readSet?.Data.GRAPH_CLIENT_ID,
            GraphTenantId: readSet?.Data.GRAPH_TENANT_ID,
            GraphClientSecret: readSet?.Data.GRAPH_CLIENT_SECRET
        }
        reset(dataSet);
    }
    const onSubmit = handleSubmit(async (data: any) => {
        const param = {
            UserId: userID,
            MinPwdLength: data?.MinPwdLength,
            MinPwdDigits: data?.MinPwdDigit,
            MinSpecialChars: data?.MinSpecialChars,
            PwdIsUpperLowerCase: data?.PwdIsUpperLowerCase ? 1 : 0,
            GraphMailId: data?.GraphMailId,
            GraphClientId: data?.GraphClientId,
            GraphTenantId: data?.GraphTenantId,
            GraphClientSecret: data?.GraphClientSecret
        }
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Save')}`,
            description: `${t('Are you sure you want to Save this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice)
        {
        try {
            const response = await saveSetting(param);
            if (response.Id > 0) {
                toast.success(response.Message)
                handleCloseDialog();
            }
            else {
                toast.error(response.Message)
            }
        }
        catch (err: any) {
            toast.error(err?.message);
        }
        }
    });
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
            <DialogContent dividers className="dialog-content-wrapp ">
                <Row>
                    <div className="outlined-box mb-3 ">
                        <h5 className="outlined-box-head my-3">
                            {t("Password Settings")}
                        </h5>
                        <Row>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="MinPwdLength"
                                    control={control}
                                    label={t("Mimimum Length")}
                                    type="number"
                                    errors={errors}
                                    minLength={0}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="MinPwdDigit"
                                    control={control}
                                    label={t("Mimimum Digits")}
                                    errors={errors}
                                    type="number"
                                    minLength={0}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputText
                                    name="MinSpecialChars"
                                    control={control}
                                    label={t("Mimimum Special Characters")}
                                    errors={errors}
                                    type="number"
                                    minLength={0}
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormInputCheckbox
                                    name="PwdIsUpperLowerCase"
                                    control={control}
                                    label={t("Validate upper case")}
                                    errors={errors}
                                    fontSize={12}
                                />
                            </Col>
                        </Row>
                    </div>

                    <div className="outlined-box mb-3 ">
                        <h5 className="outlined-box-head my-3">
                            {t("Mail Settings")}
                        </h5>
                        <Row>
                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="GraphMailId"
                                    control={control}
                                    label={t("Email ID")}
                                    errors={errors}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="GraphClientId"
                                    control={control}
                                    label={t("Client Id")}
                                    errors={errors}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="GraphTenantId"
                                    control={control}
                                    label={t("Tenent Id")}
                                    errors={errors}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="GraphClientSecret"
                                    control={control}
                                    label={t("Client Secret Key")}
                                    errors={errors}
                                />
                            </Col>
                        </Row>
                    </div>
                </Row>
            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <div className="d-flex justify-content-end">
                    <Button autoFocus onClick={() => handleCloseDialog()} className="mx-3">{t("Close")}</Button>
                    <Button type="submit" variant="contained" className="colored-btn" onClick={onSubmit} >
                        {t("Save")}
                    </Button>
                </div>
            </DialogActions>
        </>
    )

};
export default ApplicationSettings;