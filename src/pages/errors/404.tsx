import React from "react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import './404.scss';
import { Button } from "@mui/material";
import { Col, Container, Row } from "react-bootstrap";
import { ItcLogo } from "../../assets/images/png/pngimages";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="notfound-wrapper">
            <div className="404-header">
                <Container>
                    <Row className="py-4 no-gutters">
                        <Col md={6} className="logo-sec-res">
                            <div className="app-logo">
                                <img src={ItcLogo} alt="" />
                            </div>
                        </Col>
                        <Col md={6} className="lang-sec-res"> </Col>
                    </Row>
                </Container>
            </div>
            <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center not-found-center">
                    <h2>Oops !</h2>
                    <h5>404 Page Not Found</h5>
                    <p>The page you are looking for might have been removed had its name changed or it's temporarily Unavailable</p>
                    <Button
                        autoFocus
                        className="mx-3"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default NotFoundPage
