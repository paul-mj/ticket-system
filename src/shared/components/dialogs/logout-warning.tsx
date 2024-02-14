import { useState } from "react";
import ReactDOM from "react-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { MdCheck } from "react-icons/md";
import { FcAbout } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface AuthorizationDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
}

export const AuthorizationDialog: React.FC<AuthorizationDialogProps> = ({
    onConfirm,
    onCancel,
    onClose,
}) => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const handleClose = async (confirmed: boolean) => {
        navigate("/");
        setOpen(false);

        if (confirmed) {
            onConfirm();
        } else {
            onCancel();
        }

        onClose();
    };

    return (
        <Dialog open={open} className={`confirm__dialog red_box`} onClose={handleClose}>
            <Paper style={{ maxWidth: "430px", minWidth: "300px" }}>
                <DialogTitle>
                    <Row className="confirm-heading text-center">
                        <Col md={12}>
                            <div className="action-icon">
                                <FcAbout />
                            </div>
                        </Col>
                        <Col md={12}>
                            <h4 className="mt-3 pb-1">{t("Authorization Error")}</h4>
                        </Col>
                    </Row>
                </DialogTitle>
                <DialogContent className="confirm-body">
                    <p className="text-center m-0 pt-4 pb-2">
                       {t(" You are not authorized to perform this action. Please logout this current session and try again.")}
                    </p>
                </DialogContent>
                <DialogActions className="confirm-footer-buttons">
                    <Row className="no-gutters w-100">
                        <Col md={6}>
                            <Button
                                className="no mx-1 w-100"
                                color="primary"
                                onClick={() => handleClose(false)}
                            >
                               {t("No")}
                            </Button>
                        </Col>
                        <Col md={6}>
                            <Button
                                className="yes mx-1 w-100"
                                color="primary"
                                autoFocus
                                onClick={() => handleClose(true)}
                            >
                                <MdCheck />
                                <p className="mx-2 my-0">{t("Logout")}</p>
                            </Button>
                        </Col>
                    </Row>
                </DialogActions>
            </Paper>
        </Dialog>
    );
};
