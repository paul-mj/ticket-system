
import { Col, Row } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import FormatField from "../../shared/components/UI/FormatField";
import NumberFormat from "../../shared/components/UI/FormatField/emid";
import { useTranslation } from "react-i18next";

export const PartnersAndActivity = () => {
    const methods = useFormContext();
    const { t, i18n } = useTranslation();

    return (
        <Row>
            <Col md={4} col={12}>
                <div className="block__wrap min-height">
                    <Row>
                        <Col md={12}>
                            <h4 className="block__heading">{t("Activity")}</h4>
                        </Col>
                        <Col md={12}>
                            <div className="table-wrapper">
                                <div className="table-outer activity-table">
                                    <div className="table-header">
                                        <div className="element">{t("Code")}</div>
                                        <div className="element">{t("Description")}</div>
                                    </div>
                                    {methods.getValues().Activities?.length &&
                                        methods.getValues().Activities.map((activity: any, index: number) => (
                                            <ActivityTBody activity={activity} key={index} />
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col md={8} col={12}>
                <div className="block__wrap min-height">
                    <Row>
                        <Col md={12}>
                            <h4 className="block__heading">{t("Partners")}</h4>
                        </Col>
                        <Col md={12}>
                            <Row className="scoll-block-box">
                                {methods.getValues().Partners?.length &&
                                    methods.getValues().Partners.map((partner: any, index: number) => (
                                        <PartnerCard partner={partner} key={index} />
                                    ))
                                }
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    )
}


export const PartnerCard = (props: any) => {
    const { partner } = props;
    return (
        <Col md={6} >
            <Row className="no-gutters">
                <Col md={12} className="partner-card">
                    <span className="type">{partner.PARTNER_TYPE}</span>
                    <h5 className="mt-2">{partner?.PR_NAME}</h5>
                    <h5 className="text-right">{partner?.PR_NAME_AR}</h5>
                    <div className="d-flex align-items-center justify-content-between em-data">
                        <p className="m-0 eid">
                            <NumberFormat mask="000-0000-0000000-0" value={partner?.EMIRATES_ID} delimiter="-" />
                        </p>
                        <p className="m-0 date">
                            <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={partner?.EM_EXPIRY_DATE} />
                        </p>
                    </div>
                </Col>
            </Row>
        </Col>
    )
}


export const ActivityTBody = (props: any) => {
    const { activity } = props;
    return (
        <div className="table-body">
            <div className="element">
                {activity?.ACTV_CODE}
            </div>
            <div className="element">
                {activity?.ACTV_DESC}
            </div>
        </div>
    )
}