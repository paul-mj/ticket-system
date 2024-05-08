import { Button, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import DialogHeader from "../../../shared/components/dialogs/components/DialogHeader";
import { ContactCard } from "../../../assets/images/svgicons/svgicons";
import { useCallback, useContext, useEffect, useState } from "react";
import Contact from "../../../shared/components/common/Contact";
import { MenuId, fullGridDataAction } from "../../../common/database/enums";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { toast } from "react-toastify";
import { Row } from "react-bootstrap";
import PrimaryButton from "../../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const headerConfig = {
    history: [{
        icon: ContactCard,
        title: 'Contact',
    }],
}

const ContactFullviewDialog = ({ onCloseDialog, popupConfiguration }: any) => {
    const { rowData } = useContext(fullViewRowDataContext);
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const [actions, setActions] = useState({});
    const [isView, setIsView] = useState(false);
    const { t, i18n } = useTranslation();

    const [isLoading, setIsloading,] = useState(false);
    const onClosePopup = useCallback((res?: any) => {
        if (res) {
            gridActionChangeEvent({
                id: res.Id,
                status:
                    rowData
                        ? fullGridDataAction.UpdateRow :
                        fullGridDataAction.InsertRow
            });
            toast.success(res.Message);
        }
        onCloseDialog();
        setActions({})
    }, [gridActionChangeEvent, onCloseDialog, rowData])
    useEffect(() => {
        setIsView(MenuId.View === popupConfiguration.action.MenuId)
        console.log(popupConfiguration);

    }, [popupConfiguration])

    
    return (
        <>
            <DialogTitle sx={{ m: 0, px: 2, py: 1 }} className="dialog_title_wrapper">
                <DialogHeader config={headerConfig} onCloseDialog={() => onClosePopup(false)} />
            </DialogTitle>
            <DialogContent dividers className="dialog-content-wrapp">
                <Row>
                    <div className="outlined-box  px-3">
                        <Contact
                            isView={!!isView}
                            rowID={rowData?.ID_}
                            actions={actions}
                            resetActions={() => setActions({ submit: false })}
                            forceClose={onClosePopup}
                            isLoading={setIsloading} />
                    </div>
                </Row> 
            </DialogContent>
            <DialogActions className="dialog-action-buttons">
                <Button onClick={() => onClosePopup(false)} >{t("Close")}</Button>
                {!isView && <PrimaryButton onClick={() => setActions({ submit: true })} text={rowData?.ID_ ? `${t('Update')}` : `${t('Save')}`} isLoading = {isLoading} styleType = 'btnLoader'/>}
            </DialogActions>
        </>
    )
}
export default ContactFullviewDialog;
