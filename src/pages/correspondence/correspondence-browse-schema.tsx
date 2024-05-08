import { MasterId } from "../../common/database/enums";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export class CorrespondanceDefaultValue {
    static DefaultValue(taskList?: any) {
        return {
            ReferenceNumber: "",
            Subject: "",
            DocumentDate: new Date(),
            TransContent: "",
            Keywords: "",
            AdditionalReferance: "",
            Operator: [],
            editorLang: true,
            configureRole: false,
            Receipts: [],
            to: [],
            cc: [],
            Attendees: [],
            OptionalAttendees: [],
            Tags: [],
            Relateditems: [],
            Schedule: false,
            ScheduleDate: null,
            Location: "",
            Reminder: "",
            Department: "",
            StartDate: null,
            EndDate: null,
            ResolutionNumber: "",
            ResolutionDate: null,
            EffectiveDate: null,
            DueDate: null,
            ExpiryDate: null,
            CircularDate: null,
            SendTo: "",
            CircularNumber: "",
            TaskPriority: "",
            TaskSubType: "",
            Attachments: [],
            Docs: [],
            RequestType: "",
            Application: "",
            sequence: "",
            tasklistLength: (taskList || []).length
        }
    }
    static SwitchDefaultValue(masterId: number) {
        let defValues = {};
        switch (masterId) {
            case MasterId.Correspondence:
            case MasterId.Announcements:
            case MasterId.Circulars:
            case MasterId.Tasks:
            case MasterId.Resolutions:
            case MasterId.Events:
            case MasterId.Requests:
            case MasterId.Meetings:
                defValues = { configureRole: true }
                break;
        }
        return defValues;
    }
}


export class CorrespondanceSchema {
    static ItcSchema() {
        return {
            [MasterId.Correspondence]: yup.object().shape({
                ReferenceNumber: yup.string(),
                Subject: yup.string().required(),
                DocumentDate: yup.string().required().default(() => new Date().toLocaleDateString()),
                TransContent: yup.string().required(),
                Keywords: yup.string(),
                configureRole: yup.boolean().default(true),
                Operator: yup.array().when('configureRole', {
                    is: true,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                editorLang: yup.boolean(),
                /* Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }), */
                Tags: yup.array(),
                /* Relateditems: yup.array(), */
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
                tasklistLength: yup.string(),
                /* sequence: yup.string().when('tasklistLength', {
                    is: (length: any) => length > 1,
                    then: yup.string().required('Sequence is required'),
                    otherwise: yup.string().nullable(),
                }), */
            }),
        }
    }

    static FranchiseSchema() {
        return {
            [MasterId.Correspondence]: yup.object().shape({
                ReferenceNumber: yup.string(),
                Subject: yup.string().required(),
                DocumentDate: yup.string().required().default(() => new Date().toLocaleDateString()),
                TransContent: yup.string().required(),
                Keywords: yup.string(),
                editorLang: yup.boolean(),
                configureRole: yup.boolean().default(true),
                /* Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }), */
                Tags: yup.array(),
                /* Relateditems: yup.array(), */
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
                tasklistLength: yup.string(),
                /* sequence: yup.string().when('tasklistLength', {
                    is: (length: any) => length > 1,
                    then: yup.string().required('Sequence is required'),
                    otherwise: yup.string().nullable(),
                }), */
            }),
        }
    }


    static TemplateSchema(initialApiDropdownResponse: any) {
        return {
            [MasterId.Announcements]: yup.object().shape({
                Subject: yup.string().required(),
                StartDate: yup.date(),
                ExpiryDate: yup.date().required(),
                configureRole: yup.boolean().default(true),
                Operator: yup.array().when('configureRole', {
                    is: true,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                TransContent: yup.string().required(),
                editorLang: yup.boolean(),
                Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Tags: yup.array(),
                Relateditems: yup.array(),
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
                tasklistLength: yup.string(),
                /* sequence: yup.string().when('tasklistLength', {
                    is: (length: any) => length > 1,
                    then: yup.string().required('Sequence is required'),
                    otherwise: yup.string().nullable(),
                }), */
            }),
            [MasterId.Circulars]: yup.object().shape({
                CircularNumber: yup.string().required(),
                Department: yup.string().required(),
                CircularDate: yup.date().required(),
                EffectiveDate: yup.date().required(),
                Operator: yup.array().when('configureRole', {
                    is: true,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Subject: yup.string().required(),
                TransContent: yup.string().required(),
                editorLang: yup.boolean(),
                configureRole: yup.boolean().default(true),
                Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Tags: yup.array(),
                Relateditems: yup.array(),
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
                tasklistLength: yup.string(),
                /* sequence: yup.string().when('tasklistLength', {
                    is: (length: any) => length > 1,
                    then: yup.string().required('Sequence is required'),
                    otherwise: yup.string().nullable(),
                }), */
            }),
            [MasterId.Tasks]: yup.object().shape({
                Subject: yup.string().required(),
                ReferenceNumber: yup.string().required(),
                TaskPriority: yup.string().required(), // Declare field With Dropdown  
                StartDate: yup.date().required(),
                DueDate: yup.date().required(),
                Reminder: yup.string().required(),
                configureRole: yup.boolean().default(true),
                editorLang: yup.boolean(),
                TransContent: yup.string().required(),
                Operator: yup.array().when('configureRole', {
                    is: true,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Tags: yup.array(),
                Relateditems: yup.array(),
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
            }),
            [MasterId.Resolutions]: yup.object().shape({
                ResolutionNumber: yup.string().required(),
                Department: yup.string().required(),
                ResolutionDate: yup.date().required(),
                EffectiveDate: yup.date().required(),
                Operator: yup.array().when('configureRole', {
                    is: true,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Subject: yup.string().required(),
                TransContent: yup.string().required(),
                editorLang: yup.boolean(),
                configureRole: yup.boolean().default(true),
                Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Tags: yup.array(),
                Relateditems: yup.array(),
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
                tasklistLength: yup.string(),
                /* sequence: yup.string().when('tasklistLength', {
                    is: (length: any) => length > 1,
                    then: yup.string().required('Sequence is required'),
                    otherwise: yup.string().nullable(),
                }), */
            }),
            [MasterId.Events]: yup.object().shape({
                Subject: yup.string().required(),
                StartDate: yup.date().required(),
                EndDate: yup.date().required().test('minDate', '', (value, context) => {
                    const startDate = context.parent.StartDate;
                    if (value && startDate) {
                        const st = new Date(startDate).toLocaleString('en-US', { hour12: false });
                        const ed = new Date(value).toLocaleString('en-US', { hour12: false });
                        return st < ed;
                    }
                    return true;
                }),
                LocationDECR: yup.string(),
                configureRole: yup.boolean().default(true),
                editorLang: yup.boolean(),
                Operator: yup.array().when('configureRole', {
                    is: true,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                TransContent: yup.string().required(),
                Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Tags: yup.array(),
                Relateditems: yup.array(),
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
            }),
            /* Incident -> Request */
            [MasterId.Requests]: yup.object().shape({
                Subject: yup.string().required(),
                ReferenceNumber: yup.string(),
                DocumentDate: yup.date().required(),
                RequestType: yup.string().required(),
                configureRole: yup.boolean().default(true),
                /* Application: yup.string(), */
                Application: yup.string().nullable().when('RequestType', {
                    is: (requestType: any) => {
                        const foundObject = initialApiDropdownResponse.requestOriginal.find(
                            (item: any) => Number(item.OBJECT_ID) === Number(requestType)
                        );
                        console.log(foundObject, 'foundObject')
                        console.log(foundObject?.OBJECT_TYPE, 'foundObject.OBJECT_TYPE')
                        console.log(33102, 'condition')
                        return foundObject ? foundObject?.OBJECT_TYPE === 33102 : false;
                    },
                    then: yup.string().required('Application is required'),
                    otherwise: yup.string()
                }),
                Tags: yup.array(),
                editorLang: yup.boolean(),
                TransContent: yup.string().required(),
               /*  Receipts: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                Relateditems: yup.array(), */

            }),
            [MasterId.Meetings]: yup.object().shape({
                Subject: yup.string().required(),
                Operator: yup.array().min(1).required(),
                Location: yup.string(), // Need to Decalre
                Reminder: yup.string(), // Need to Decalre
                configureRole: yup.boolean().default(true),
                Attendees: yup.array().when('configureRole', {
                    is: false,
                    then: yup.array().min(1).required(),
                    otherwise: yup.array().notRequired(),
                }),
                OptionalAttendees: yup.array(),
                TransContent: yup.string().required(),
                Relateditems: yup.array(),
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
                StartDate: yup.date().required(),
                EndDate: yup.date().required().test('minDate', '', (value, context) => {
                    const startDate = context.parent.StartDate;
                    if (value && startDate) {
                        const st = new Date(startDate).toLocaleString('en-US', { hour12: false });
                        const ed = new Date(value).toLocaleString('en-US', { hour12: false });
                        return st < ed;
                    }
                    return true;
                }),
            }),
            [MasterId.Communication]: yup.object().shape({
                Subject: yup.string().required(),
                DocumentDate: yup.string().required(),
                TransContent: yup.string().required(),
                editorLang: yup.boolean(),
                Schedule: yup.boolean(),
                ScheduleDate: yup.string().when('Schedule', {
                    is: true,
                    then: yup.string().required(),
                    otherwise: yup.string().nullable(),
                }),
                to: yup.array().min(1).required(),
                cc: yup.array(),
            }),
            [MasterId.NoticeBoardDesign]: yup.object().shape({
                Subject: yup.string().required(),
                DocumentDate: yup.date().required(),
                Operator: yup.array().when("Receipts", {
                    is: (value: any) => !(value && value.length),
                    then: yup.array().min(1),
                    otherwise: yup.array(),
                }),
                ReferenceNumber: yup.string(),
                editorLang: yup.boolean(),
                StartDate: yup.date().required(),
                EndDate: yup.date().required(),
                TransContent: yup.string().required(),
                Receipts: yup.array().when("Operator", {
                    is: (value: any) => !(value && value.length),
                    then: yup.array().min(1),
                    otherwise: yup.array(),
                }),
            }, [['Receipts', 'Operator']]),
        };
    }


}
