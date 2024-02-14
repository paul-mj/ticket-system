import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInputText } from "../../../form-components/FormInputText";
import { FormInputCheckbox } from "../../../form-components/FormInputCheckbox";
import PrimaryButton from "../../../Buttons/TextButtons/Curved/PrimaryButton";

const ReportSaveAsLayoutDialog = ({ open, onCloseDialog }: any) => {
    const {
        control,
        setValue,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(yup.object().shape({
            ReportName: yup.string().required(""),
            IsPublished: yup.boolean()
        })),
        defaultValues: {
            ReportName: '',
            IsPublished: false
        },
    });
    const { t } = useTranslation();
    const saveLayout = (data:any) => {
        onCloseDialog(data)
    }
    return (
        <Dialog open={open} onClose={() => onCloseDialog(false)}>
            <DialogTitle><h4>{t("Save Layout")}</h4></DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div className="pt-2 d-grid gap-2" style={{minWidth:'20rem'}}>
                        <div>
                            <FormInputText
                                name="ReportName"
                                control={control}
                                label={t("Report Name")}
                                errors={errors}
                            />
                        </div>
                        <div>
                            <FormInputCheckbox
                                name="IsPublished"
                                control={control}
                                label={t('Publish')}
                                errors={errors}
                            />
                        </div>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onCloseDialog(false)} >{t("Close")}</Button>
                <PrimaryButton onClick={handleSubmit(saveLayout)} text={t("Save Layout")} />
            </DialogActions>
        </Dialog>
    )
}
export default ReportSaveAsLayoutDialog;