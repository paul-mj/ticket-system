import { Button, Dialog, DialogActions, DialogContent } from "@mui/material"
import "./preview.scss";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const PreviewCreation = (props: any) => {
    const { t, i18n } = useTranslation();
    const { previewParentProps, onClose } = props;

    const onDialogClose = () => {
        onClose(true)
    }

    return (
        <>
            <Dialog open={previewParentProps.popupOpenState} fullWidth={true}
                maxWidth={'md'} onClose={previewParentProps.popupOpenState}>
                <DialogContent>
                    <div className="img-section-preview">
                        <div className="imagePreview" style={{ backgroundImage: `url(${previewParentProps.previewPath})` }}></div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={onDialogClose}>
                        {t("Close")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}