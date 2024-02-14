/* Sajin 19-03-2023 */
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import "./workflow-table.scss";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


export const WorkFlowForm = (props:any) => {
    const {modeView} = props;
    const { t, i18n } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <>
            <div>
                <Row className="justify-content-between">
                    <Col md={4} className="mb-3">
                        <FormInputText
                            name="workFlowForm.code"
                            control={control}
                            label={t("Code")}
                            errors={errors}
                            readOnly={modeView}
                        />
                    </Col>

                    <Col md={4} className="mb-3">
                        <div className="arabic-text">
                            <FormInputText
                                name="workFlowForm.workFlowNameinArabic"
                                control={control}
                                label={t("WorkFlow Name in Arabic")}
                                errors={errors}
                                readOnly={modeView}
                            />
                        </div>
                    </Col>

                    <Col md={4} className="mb-3">
                        <FormInputText
                            name="workFlowForm.workFlowNameinEnglish"
                            control={control}
                            label={t("WorkFlow Name in English")}
                            errors={errors}
                            readOnly={modeView}
                        />
                    </Col>
                </Row>

                <Col md={12} className="mb-3">
                    <FormInputText
                        name="workFlowForm.Remarks"
                        control={control}
                        label={t("Remarks")}
                        errors={errors}
                        readOnly={modeView}
                    />
                </Col>
            </div>
        </>
    );
}
