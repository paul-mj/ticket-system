import { Col, Row } from "react-bootstrap"
import FormInputPhone from "../../shared/components/form-components/FormInputPhone"
import { FormInputText } from "../../shared/components/form-components/FormInputText"
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";


export const AddressAndContact = ({ disableFields }: any) => {
    const methods = useFormContext();
    const { t, i18n } = useTranslation();

    return (
        <>
            <div className="block__wrap">
                <Row>
                    <Col md={12}>
                        <h4 className="block__heading">{t("Address")}</h4>
                    </Col>
                    <Col md={3}>
                        <FormInputText
                            name="ADDRESS_01"
                            control={methods.control}
                            label={t("Address Line 1")}
                            errors={methods.formState.errors}
                            hideError={true}
                            disabled={disableFields?.ADDRESS_01}
                        />
                    </Col>
                    <Col md={3}>
                        <FormInputText
                            name="ADDRESS_02"
                            control={methods.control}
                            label={t("Address Line 2")}
                            errors={methods.formState.errors}
                            hideError={true}
                            disabled={disableFields?.ADDRESS_02}
                        />
                    </Col>
                    <Col md={3}>
                        <FormInputText
                            name="ADDRESS_03"
                            control={methods.control}
                            label={t("Address Line 3")}
                            errors={methods.formState.errors}
                            hideError={true}
                            disabled={disableFields?.ADDRESS_03}
                        />
                    </Col>
                    <Col md={3}>
                        <FormInputText
                            name="ADDRESS_04"
                            control={methods.control}
                            label={t("Address Line 4")}
                            errors={methods.formState.errors}
                            hideError={true}
                            disabled={disableFields?.ADDRESS_04}
                        />
                    </Col>
                </Row>
            </div>
            <div className="block__wrap">
                <Row>
                    <Col md={12}>
                        <h4 className="block__heading">{t("Contact")}</h4>
                    </Col>
                    <Col md={3}>
                        <FormInputText
                            name="CONTACT_PERSON"
                            control={methods.control}
                            label={t("Contact Person")}
                            errors={methods.formState.errors}
                            hideError={true}
                            disabled={disableFields?.CONTACT_PERSON}
                        />
                    </Col>
                    <Col md={3}>
                        <FormInputPhone
                            name="MOBILE_NO"
                            control={methods.control}
                            label={t("Mobile No.")}
                            errors={methods.formState.errors}
                            disabled={disableFields?.MOBILE_NO}
                            mask="(999) 999-9999"
                            hideError={true}
                        />
                    </Col>
                    <Col md={3}>
                        <FormInputPhone
                            name="OFFICE_NO"
                            control={methods.control}
                            label={t("Office No.")}
                            errors={methods.formState.errors}
                            disabled={disableFields?.OFFICE_NO}
                            mask="99-999-9999"
                            hideError={true}
                        />
                    </Col>
                    <Col md={3}>
                        {/* <FormInputText
                            name="FAX_NO"
                            control={methods.control}
                            label={t("Fax No.")}
                            errors={methods.formState.errors}
                            hideError={true}
                            disabled={disableFields?.FAX_NO}
                        /> */}
                        <FormInputText
                            name="EMAIL_ID"
                            control={methods.control}
                            label={t("Email ID")}
                            errors={methods.formState.errors}
                            hideError={true}
                        />
                    </Col>
                </Row>
            </div>

        </>
    )
}