import { Button, IconButton } from "@mui/material";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { Done } from "../../../assets/images/svgicons/svgicons";
import { useTranslation } from "react-i18next";

interface MailSuccessInterface {
    mailSuccess: string;
    hideLoaderBox: () => void;
}

const SuccessBox = ({ mailSuccess, hideLoaderBox }: MailSuccessInterface) => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <div className="mail-save-box-wrapper">
                <div className="mail-save-box-wrap">
                    <div className="loader-text">
                        <Row className="justify-content-start align-items-center no-gutters success text-center">
                            <Col md={12} className="section-sucess">
                                <IconButton aria-label="language" size="large" className="btn-sucess">
                                    <img src={Done} alt="" />
                                </IconButton>
                            </Col>
                            <Col md={12} className="mt-3">
                                <h4>{t("Success")}</h4>
                                <p>{mailSuccess}</p>
                            </Col>
                            <Col md={12}>
                                <div className="d-flex align-items-center justify-content-end w-100 sucess-close mt-4">
                                    <Button className="yes-btn mx-1 w-100" color="primary" autoFocus onClick={hideLoaderBox}>
                                        {t("Close")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div className="mail-save-overlay"></div>
        </React.Fragment>
    )
}

export default SuccessBox;
