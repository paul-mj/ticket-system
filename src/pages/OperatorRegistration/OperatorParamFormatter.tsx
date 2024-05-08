
import * as yup from "yup";

export class OperatorValidationSchema {
    static validationSchema(passwordConfig: any, isAuthDisable: boolean) {
        const syncUserToItcSystemCondition = isAuthDisable ? yup.string().notRequired() : yup.string().required();
        return yup.object().shape({
            LICENCE_NO: yup.string().required(),
            TRADE_NAME_AR: yup.string().required(),
            TRADE_NAME: yup.string().required(),
            LEGAL_FORM: yup.string().required(),
            LEGAL_FORM_AR: yup.string().required(),
            ADDRESS_01: yup.string().required(),
            ADDRESS_02: yup.string().required(),
            CONTACT_PERSON: yup.string().required(),
            MOBILE_NO: yup.string().required(),
            OFFICE_NO: yup.string().required(),
            COMPANY_LOGO: yup.string().required(),
            /* TRAFFIC_CODE: yup.string().required(), */
            syncUserToItcSystem: syncUserToItcSystemCondition,
            SourceSystem: yup.string().when('syncUserToItcSystem', {
                is: '1',
                then: yup.string().required(),
                otherwise: yup.string().notRequired(),
            }),
            syncUserToSourceSystem: yup.string().when('SourceSystem', {
                is: (SourceSystem: any) => SourceSystem,
                then: yup.string().required(),
                otherwise: yup.string().notRequired(),
            }),
            SourceSystemUserName: yup.string().when(['syncUserToItcSystem', 'syncUserToSourceSystem'], {
                is: (syncUserToItcSystem: string, syncUserToSourceSystem: string) =>
                    syncUserToItcSystem === "1" && syncUserToSourceSystem === "1",
                then: yup.string().required(),
                otherwise: yup.string().notRequired(),
            }), 
            EMAIL_ID: yup.string().email("").required(""),
            CRED_EMAIL_ID: yup.string().when(["syncUserToItcSystem", "syncUserToSourceSystem"], {
                is: (syncUserToItcSystem: string, syncUserToSourceSystem: string) =>
                    syncUserToItcSystem === "0" || syncUserToSourceSystem === "0",
                then: yup.string().email('Value Must be a Email').required('Email Is Required'),
                otherwise: yup.string().email(),
            }),
            CONFIRM_EMAIL_ID: yup.string().when(["syncUserToItcSystem", "syncUserToSourceSystem"], {
                is: (syncUserToItcSystem: string, syncUserToSourceSystem: string) =>
                    syncUserToItcSystem === "0" || syncUserToSourceSystem === "0",
                then: yup.string().required('Confirm Email Is Required').oneOf([yup.ref('CRED_EMAIL_ID')], 'Emails must match'),
                otherwise: yup.string().notRequired(),
            }),
            PASSWORD: yup.string().when(["syncUserToItcSystem", "syncUserToSourceSystem"], {
                is: (syncUserToItcSystem: string, syncUserToSourceSystem: string) =>
                    syncUserToItcSystem === "0" || syncUserToSourceSystem === "0",
                then: yup
                    .string()
                    .required('Password Is Required')
                    .min(passwordConfig?.MIN_PWD_LENGTH, `Password must be at least ${passwordConfig?.MIN_PWD_LENGTH} characters`)
                    .matches(
                        new RegExp(`^(?=.*\\d.*\\d).+$`),
                        `Password must contain at least ${passwordConfig?.MIN_PWD_DIGITS} digits spread across the password`
                    ),
                otherwise: yup.string().notRequired(),
            }),
            CONFIRM_PASSWORD: yup.string().when(["syncUserToItcSystem", "syncUserToSourceSystem"], {
                is: (syncUserToItcSystem: string, syncUserToSourceSystem: string) =>
                    syncUserToItcSystem === "0" || syncUserToSourceSystem === "0",
                then: yup.string().required('Confirm Password Is Required').oneOf([yup.ref('PASSWORD')], 'Passwords must match'),
                otherwise: yup.string().notRequired(),
            }),
        });
    }

}


export class defaultValues {
    static defValue() {
        return {
            LICENCE_NO: "",
            TRADE_NAME_AR: "",
            TRADE_NAME: "",
            LEGAL_FORM: "",
            LEGAL_FORM_AR: "",
            LICENSE_ISSUE_DATE: "",
            LICENSE_EXPIRY_DATE: "",
            ADDRESS_01: "",
            ADDRESS_02: "",
            ADDRESS_03: "",
            ADDRESS_04: "",
            CONTACT_PERSON: "",
            MOBILE_NO: "",
            OFFICE_NO: "",
            FAX_NO: "",
            EMAIL_ID: "",
            CRED_EMAIL_ID: "",
            CONFIRM_EMAIL_ID: "",
            PASSWORD: "",
            CONFIRM_PASSWORD: "",
            syncUserToItcSystem: "",
            SourceSystem: "",
            syncUserToSourceSystem: "",
            SourceSystemUserName: "",
            Docs: [],
            COMPANY_LOGO: "",
            /* TRAFFIC_CODE: "", */
            Partners: [],
            Activities: []
        }
    }
}


export class OperatorParamFormatter {
    static formattedDedResponse(licenceInfo: any) {
        return {
            LICENCE_NO: licenceInfo?.LicenseCode,
            TRADE_NAME: licenceInfo?.BusinessName?.DescriptionEN,
            TRADE_NAME_AR: licenceInfo?.BusinessName?.DescriptionAR,
            LEGAL_FORM: licenceInfo?.LegalForm?.DescriptionEN,
            LEGAL_FORM_AR: licenceInfo?.LegalForm?.DescriptionAR,
            LICENSE_ISSUE_DATE: licenceInfo?.IssueDate,
            LICENSE_EXPIRY_DATE: licenceInfo?.ExpiryDate,
            ADDRESS_01: licenceInfo?.Address?.PrimaryAreaAR,
            ADDRESS_02: licenceInfo?.Address?.SecondaryAreaAR,
            ADDRESS_03: licenceInfo?.Address?.BuildingNameAR,
            ADDRESS_04: licenceInfo?.Address?.FullAddressAR,
            CONTACT_PERSON: licenceInfo?.PROnameAR,
            MOBILE_NO: licenceInfo?.Address?.MobileNumber,
            OFFICE_NO: licenceInfo?.Address?.Phone,
            FAX_NO: licenceInfo?.Address?.Fax,
            EMAIL_ID: licenceInfo?.Address?.Email
        };
    }

    static findMatchingACTVCode = (tradeLicenseActivities: any, subEnityList: any) => {
        const matchingACTVCode = subEnityList.find((entity: any) =>
            tradeLicenseActivities.some((activity: any) => entity.DED_CODE === activity.ACTV_CODE)
        );
        if (matchingACTVCode) {
            return matchingACTVCode.SUB_ENTITY_ID;
        }
        return null;
    };

    static makePartnersFromDed(owners: any) {
        return owners.map((x: any) => ({
            ID: -1,
            PR_NAME: x?.NameEN, //parner Name
            PR_NAME_AR: x?.NameAR,  //
            PARTNER_TYPE: x?.RepresentativeType
                ? x.RepresentativeType?.DescriptionEN
                : x?.OwnerType && x?.OwnerType.DescriptionEN, //Partner Type
            EMIRATES_ID: x?.EIDAnumber, // Emid 
            EM_DOC_NAME: '',
            EM_DOC_EXTENSION: '',
            EM_EXPIRY_DATE: x?.EIDAexpiryDate, // Exp Date
        }));
    }

    static makeLicenceActivities(activities: any) {
        return activities.map((x: any) => ({
            ACTV_CODE: x.Code,
            ACTV_DESC: x.DescriptionEN,
            ID: x.ID,
            TRANS_ID: x.ID,
        }));
    }

    static prepareHeaderDataFromItcResponse(headerData: any, tradeLicenceJson: any) {
        for (const key1 in headerData) {
            for (const key2 in tradeLicenceJson) {
                if (key1 === key2) {
                    headerData[key1] = tradeLicenceJson[key2];
                }
            }
        }
        return headerData;
    }


    static saveParam(data: any, userId: any, phcHeaderData: any, dedResponse: any) {
        /* console.log(data, 'data');
        console.log(userId, 'user Id');
        console.log(phcHeaderData, 'Phc Header Data'); */ 
        return {
            UserId: userId,
            TransId: data?.TRANS_ID ? data?.TRANS_ID : -1,
            Json: data?.TRANS_ID < 0 ? JSON.stringify(dedResponse) : '',
            Header: {
                LICENCE_NO: data.LICENCE_NO,
                LICENSE_ISSUE_DATE: data.LICENSE_ISSUE_DATE,
                LICENSE_EXPIRY_DATE: data.LICENSE_EXPIRY_DATE,
                TRADE_NAME: data.TRADE_NAME,
                LEGAL_FORM: data.LEGAL_FORM,
                TRADE_NAME_AR: data.TRADE_NAME_AR,
                LEGAL_FORM_AR: data.LEGAL_FORM_AR,
                ISSUE_REGION_ID: data.ISSUE_REGION_ID,
                ADDRESS_01: data.ADDRESS_01,
                ADDRESS_02: data.ADDRESS_02,
                ADDRESS_03: data.ADDRESS_03,
                ADDRESS_04: data.ADDRESS_04,
                CONTACT_PERSON: data.CONTACT_PERSON,
                OFFICE_NO: data.OFFICE_NO,
                FAX_NO: data.FAX_NO || "",
                MOBILE_NO: data.MOBILE_NO,
                EMAIL_ID: data.EMAIL_ID,// new eamil field from contact
                REMARKS: data.REMARKS,
                SUB_ENTITY_ID: data.SUB_ENTITY_ID || phcHeaderData?.SUB_ENTITY_ID,
                PREFERRED_PWD: data.PASSWORD,
                COMPANY_LOGO: "",
                PREFERRED_USER_NAME: data?.SourceSystemUserName ? data?.SourceSystemUserName : data.CRED_EMAIL_ID,
                SOURCE_SYSTEM_ID: data?.SourceSystem ? data?.SourceSystem : null,
                IS_USER_INTEGRATED: data?.SourceSystemUserName ? 1 : 0,
                /* TRAFFIC_CODE: data.TRAFFIC_CODE ? data.TRAFFIC_CODE : phcHeaderData?.TRAFFIC_CODE, */
            },
            Activities: OperatorParamFormatter.transActivities(data.Activities),
            Partners: OperatorParamFormatter.transPartners(data.Partners),
            Docs: OperatorParamFormatter.transformedDocs(data.Docs)
        }
    }


    static transformedDocs(docs: any) {
        return docs.map((item: any, index: number) => ({
            DOC_ID: item?.DOC_ID?.toString(),
            DOC_NAME: item?.DOC_NAME,
            DOC_EXTENSION: item?.DOC_EXTENSION,
            SORT_ORDER: item?.SORT_ORDER?.toString(),
            REMARKS: item?.STATUSREMARKS,
        }));
    }

    static transPartners(partners: any) {
        return partners.map((x: any, index: number) => ({
            ID: x.ID ? x.ID : -1,
            PR_NAME: x.PR_NAME,
            PR_NAME_AR: x.PR_NAME_AR,
            NATIONALITY_ID: x.NATIONALITY_ID,
            PARTNER_TYPE: x.PARTNER_TYPE,
            EMIRATES_ID: x.EMIRATES_ID,
            EM_DOC_NAME: x.EM_DOC_NAME,
            EM_DOC_EXTENSION: x.EM_DOC_EXTENSION,
            EM_EXPIRY_DATE: x.EM_EXPIRY_DATE
        }));
    }
    static transActivities(Activities: any) {
        return Activities.map((x: any) => ({
            ACTV_CODE: x.ACTV_CODE,
            ACTV_DESC: x.ACTV_DESC,
        }));
    }

}
