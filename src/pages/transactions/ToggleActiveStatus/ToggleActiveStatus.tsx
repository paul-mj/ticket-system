import { Button, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ApiService from "../../../core/services/axios/api";
import { toast } from "react-toastify";
import { MenuId, fullGridDataAction } from "../../../common/database/enums";
import { useContext } from "react";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import CommonUtils from "../../../common/utils/common.utils";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";


export const ToggleActiveStatus = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;
    const { UserId } = CommonUtils.userInfo;
    const { t } = useTranslation();
    const handleCloseDialog = () => {
        onCloseDialog(true);
    };
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const schema = yup.object().shape({
        Remarks: yup.string().notRequired()
    });
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            Remarks: "",
        },
    });
    const submitToggleStatus = async (data: any) => {

        try {
            if (UserId) {
                const param = {
                    UserId: rowData.ID_,
                    UpdatedUserId: UserId,
                    Remarks: data.Remarks,
                }
                const response = await ApiService.httpPost('user/toggleStatus', param);
                if (response?.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    toast.success(response?.Message);
                    handleCloseDialog();
                } else {
                    toast.error(response?.Message);
                    handleCloseDialog();
                }
            }
        } catch (error) { }
    }
    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status: fullGridDataAction.FullReload,
        });
    };


    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }} className={`dialog_title_wrapper`}>
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
            <DialogContent dividers className="dialog-content-wrapp p-3">
                <FormInputText
                    name="Remarks"
                    control={control}
                    label={t("Remarks")}
                    multiline={true}
                    minRows={5}
                    errors={errors}
                />
            </DialogContent>
            <DialogActions className="dialog-action-buttons justify-content-end px-3">
                <Button className="colored-btn mx-1" color="primary" autoFocus onClick={handleSubmit(submitToggleStatus)}> {t("Submit")}</Button>
            </DialogActions>
        </>
    )
}