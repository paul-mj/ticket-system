import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ResetPassword from "../../../shared/components/common/ResetPassword";
import { Button } from "react-bootstrap";
import PrimaryButton from "../../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import { t } from "i18next";
import { useState } from "react";

const ChangePassword = ({ show, onClose }: any) => {
    const [action, setAction] = useState<any>();
    const handleResetPassword = () => {
        setAction({ type: 'submit' })
    }
    return (
        <Dialog onClose={onClose} open={show} fullWidth={true} maxWidth={'xs'}>
            <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                <p className="dialog_title">
                    <span className="mx-2">
                        {t("Change Password")}
                    </span>
                </p>
                <IconButton
                    aria-label="close"
                    className="head-close-bttn"
                    onClick={onClose}
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
                <ResetPassword buttonFromOutside={true} action={action} onAfterSubmit={onClose} resetAction = {() => setAction(null)}/>
            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <Button
                    autoFocus
                    onClick={onClose}
                >
                    {t("Close")}
                </Button>

                <PrimaryButton onClick={handleResetPassword} text={t('Reset Password')} isLoading={false} styleType='btnLoader' />

            </DialogActions>
        </Dialog>
    )
}
export default ChangePassword;