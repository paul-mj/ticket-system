 import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material"; 
import { Col, Row } from "react-bootstrap"; 
import { useTranslation } from "react-i18next"; 
import CloseIconButton from "../../shared/components/Buttons/IconButtons/CloseIconButton"; 
import "./correspondence.scss";  


const CorrespondenceBrowse = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;
  
    const { t } = useTranslation();
     


    return (
        <>
            <DialogTitle sx={{ m: 0 }} className="dialog_title_wrapper bg-col-edit px-2 py-1">
                <Row className="no-gutters justify-content-between align-items-center crr-edit-heading">
                    <Col md={6} className="edit-dialog-heading">
                        <p className="dialog_title color-edit">
                            <span className="mx-2">
                               Correspondance Heading
                            </span>

                            <span className="trans_no">TRANS - 1356 - 542</span>
                        </p>
                    </Col>
                    <Col md={6} className="edit-dialog-heading">
                        <Row className="no-gutters justify-content-end align-items-center">
                            <Col md={5} className="user__in__dialog"> 
                            </Col>

                            <Col md={3} className="edit-control">
                                <div className="d-flex justify-content-center align-items-center corr_lang_bttn">
                                    <Col md={4}><p className="m-0">{t("English")}</p></Col>
                                    <Col md={4}>
                                     </Col>
                                    <Col md={4}><p className="m-0">{t("Arabic")}</p></Col>
                                </div>
                            </Col>


                            <Col md={1} className="edit-close">
                                <CloseIconButton onClick={() => onCloseDialog(true)} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DialogTitle>
            <DialogContent dividers className={`dialog-content-wrapp form-page'}`}>

            </DialogContent>
            <DialogActions className="dialog-action-buttons px-3 w-100">
                <div className="d-flex align-items-center justify-content-between w-100 close">

                    <div className="crr-btn-section-wrap">
                        <Button
                            type="submit"
                            variant="contained"
                            className={`colored-btn mx-2 `}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>


        </>
    );
};


export default CorrespondenceBrowse;


