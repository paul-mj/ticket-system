import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { ItcLogo } from "../../../assets/images/png/pngimages";
import Language from "../../../shared/components/language/language";
import "./auth-layout.scss";

function AuthHeader() {
  return (
    <>
      <Row>
        <Col md={6} className="logo-sec-res">
          <div className="app-logo px-5 py-3">
            <img src={ItcLogo} alt="" />
          </div>
        </Col>
        <Col md={6} className="lang-sec-res">
          <Row className="justify-content-end">
            {/* <Language uiType={'switch'}/> */}
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default AuthHeader;
