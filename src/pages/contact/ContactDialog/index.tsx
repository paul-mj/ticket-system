import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import Contact from "../../../shared/components/common/Contact";
import DialogHeader from "../../../shared/components/dialogs/components/DialogHeader";
import { ContactCard } from "../../../assets/images/svgicons/svgicons";
import { Row } from "react-bootstrap";
import PrimaryButton from "../../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface ContactProps {
    showContactPopup: any;
    rowID?: any;
    onclose: any;
    patchData?: any,
    isView?: boolean,
    fieldConfig?: any
}

const headerConfig = {
    history: [{
        icon: ContactCard,
        title: 'Contact',
    }],
    hasClose: true
}

const ContactDialog = ({ showContactPopup, rowID, onclose, patchData, isView, fieldConfig }: ContactProps) => {
    const [showContact, setShowContact,] = useState(false);
    const [isLoading, setIsloading,] = useState(false);
    const [actions, setActions] = useState({});
    const { t, i18n } = useTranslation();

    const onClosePopup = useCallback((res?: any) => {
        onclose(res);
        setShowContact(false)
        setActions({})
    }, [onclose])
    useEffect(() => {
        setShowContact(!!showContactPopup?.mode)
    }, [showContactPopup])
    return (
        <Dialog maxWidth={'md'} fullWidth={true} open={showContact} onClose={() => onClosePopup(false)}>
            <DialogTitle sx={{ m: 0, px: 2, py: 1 }} className="dialog_title_wrapper">
                <DialogHeader config={headerConfig} onCloseDialog={() => onClosePopup(false)} />
            </DialogTitle>
            <DialogContent dividers className="dialog-content-wrapp">
                <Row>
                    <div className="outlined-box  px-3">
                        <Contact
                            isView={!!isView}
                            rowID={rowID}
                            fieldConfig={fieldConfig}
                            patchData={patchData}
                            actions={actions}
                            resetActions={() => setActions({ submit: false })}
                            forceClose={onClosePopup}
                            isLoading={setIsloading}
                        />
                    </div>
                </Row>
            </DialogContent> 
            <DialogActions className="dialog-action-buttons">
                <Button onClick={() => onClosePopup(false)} >{t("Close")}</Button>
                {!isView &&
                    <PrimaryButton onClick={() => setActions({ submit: true })} text={rowID ? `${t('Update')}` : `${t('Save')}`} isLoading={isLoading} styleType='btnLoader' />}
            </DialogActions>
        </Dialog>
    )
}
export default ContactDialog;