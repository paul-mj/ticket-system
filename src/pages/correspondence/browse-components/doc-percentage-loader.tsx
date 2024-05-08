import { Col, Row } from "react-bootstrap";
import { UploadSvg } from "../../../assets/images/svgicons/svgicons";
import { LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";


const DocumentPercentageLoader = ({ progress }: any) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="mail-save-box-wrapper">
                <div className="mail-save-box-wrap">
                    <div className="loader-text">
                        <Row className="align-items-center no-gutters">
                            <Col md={2}>
                                <div className="img-wrpp">
                                    <img src={UploadSvg} alt="" />
                                </div>
                            </Col>
                            <Col md={10}>
                                <Row className="justify-content-start align-items-center no-gutters">
                                    <Col md={12}>
                                        <h4>{t("Uploading")}</h4>
                                        <p>{t("Just give us a moment to process your file")}</p>
                                    </Col>
                                    <Col md={12} className="mt-5">
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <div className="progress-bar">
                                                <LinearProgress variant="determinate" value={progress} />
                                            </div>
                                            <p className="m-0 perce">{`${Math.round(progress)}%`}</p>
                                        </div>

                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div className="mail-save-overlay"></div>
        </>
    )
}

export default DocumentPercentageLoader;
