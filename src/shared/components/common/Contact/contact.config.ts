import * as yup from "yup";
import { MasterId } from "../../../../common/database/enums";

export class ContactConfig {
    static formInitialValues() {
        return {
            CONTACT_NAME_EN: '',
            CONTACT_NAME_AR: '',
            DESG_ID: '',
            EMPL_CODE: '',
            GENDER_ID: '',
            DEPT_NAME: '',
            OFFICE_NO: '',
            OFFICE_EXT: '',
            MAIL_ID: '',
            MOBILE_NO: '',
            ALT_MOBILE_NO: '',
            IS_ACTIVE: true,
        }
    }
    static formFieldConfigInitialState() {
        const fields = this.formInitialValues();
        const disabledFields = {};
        Object.keys(fields).forEach(fl => {
            disabledFields[fl] = { disabled: false }
        })
        return disabledFields;
    }
    static validationSchema() {
        return yup.object().shape({
            CONTACT_NAME_EN: yup.string().required(""),
            CONTACT_NAME_AR: yup.string().required(""),
            GENDER_ID: yup.string().required(""),
            MAIL_ID: yup.string().email("Invalid email address").required(""),
            DESG_ID: yup.string().required(""),
            MOBILE_NO: yup.string().required("")
        });
    }
    static dropDownPayload({ CultureId }: { CultureId: number }) {
        return {
            designation: {
                Id: MasterId.Designations,
                CultureId,
            },
            gender: {
                Id: 309,
                CultureId
            }
        }
    }
    static subEntryPayload({ CultureId, Id }: { CultureId: number, Id: number }) {
        return {
            Id,
            CultureId
        }
    }
    static contactDetailsPayload({ CultureId, Id }: { CultureId: number, Id: number }) {
        return this.subEntryPayload({ CultureId, Id })
    }
    static markedDesignationPayload({ CultureId, Id }: { CultureId: number, Id: number }) {
        return this.subEntryPayload({ CultureId, Id })
    }
}