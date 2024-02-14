import React from "react";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { ItcLogo, LogoIcon } from "../../assets/images/png/pngimages";


/* Sidebar Logo */
export const AppSidebarLogo: React.FC<any> = ({ toggleItem }) => {
    return (
        <>
            <Row className="no-gutters h-100 align-items-center">
                <Col md={12} className="text-center">
                    <Image
                        fluid
                        className="frm_logo"
                        src={!toggleItem ? LogoIcon : ItcLogo}
                    />
                </Col>
            </Row>
        </>
    );
};
