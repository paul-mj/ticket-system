import { formatAutoCompleteOptionsArray } from "../../common/application/shared-function";
import { MailGroupId, MasterId, ServiceTypeId, UserType } from "../../common/database/enums";
import CommonUtils from "../../common/utils/common.utils";
import TreeUtils from "../../shared/components/form-components/TreeCheckList/tree.utils";

interface Tag {
    label: string;
    value: number;
    disabled: boolean;
    isMarked: boolean;
}

interface TagFormatted {
    ID: number | null;
    TAG_ID: number;
    SORT_ORDER: number;
    TAG_NAME: string;
}

export const FormattedTagList = (tags: Tag[], savedTags?: any): TagFormatted[] => {
    if (tags.length === 0) {
        return [];
    }

    return tags.map((row: Tag, index: number) => ({
        ID: savedTags && savedTags?.length ? formattedExistingTags(row, savedTags) : null, // From Edit(Already Saved Tags ID)
        TAG_ID: row.value, // Dropdown Selected ID
        SORT_ORDER: index,
        TAG_NAME: row.label // Dropdown Selected Name
    }));
};

const formattedExistingTags = (row: any, savedTags: any) => {
    const tag = savedTags.find((t: any) => t.TAG_ID === row.value);
    return tag ? tag.ID : null;
};


interface Relations {
    label: string;
    value: number;
    disabled: boolean;
    isMarked: boolean;
}

interface RelationFormatted {
    ID: Array<number> | any;
    RELATED_TRANS_ID: number;
    SORT_ORDER: number;
}

export const FormattedRelationList = (relations: Relations[], savedRelation?: any): RelationFormatted[] => {
    console.log(relations, 'row Data')
    console.log(savedRelation, 'saved Relation')
    if (relations.length === 0) {
        return [];
    }

    return relations.map((row: Relations, index: number) => ({
        //ID: savedRelation && savedRelation.length ? formattedExistingRelation(row, savedRelation) : -1,
        ID: -1,
        RELATED_TRANS_ID: row.value,
        SORT_ORDER: index,
    }));
}

const formattedExistingRelation = (row: any, savedRelation: any) => {

    const tag = savedRelation.find((t: any) => t.TRANS_ID === row.value);
    return tag ? tag.ID : null;
};


interface Recipients {
    ENTRY_TYPE: number,
    RECORD_TYPE: string,
    ID_: number,
    CONTACT_DET: string
}

interface RecipientsFormatted {
    ID: Array<number> | any;
    ENTRY_TYPE: number,
    MAIL_ID?: number | null,
    ROLE_ID?: number | null,
    USER_ID?: number | null,
    CONTACT_ID?: number | null,
    MAIL_GROUP_ID?: number | null,
    SORT_ORDER: number, //index + 1
    MAIL_TO_CC_BCC_FLAG: 31501	 //To enum
}

/* Formatted Recipients */

export const FormattedRecipientList = (recipients: Recipients[], savedRecipients?: any): RecipientsFormatted[] => {
    if (recipients.length === 0) {
        return [];
    }
    return recipients.map((row: Recipients, index: number) => ({
        ID: -1,
        ENTRY_TYPE: row.ENTRY_TYPE,
        MAIL_ID: MailGroupId.MailId === row.ENTRY_TYPE ? row.ID_ : null,
        ROLE_ID: MailGroupId.Roles === row.ENTRY_TYPE ? row.ID_ : null,
        USER_ID: MailGroupId.User === row.ENTRY_TYPE ? row.ID_ : null,
        CONTACT_ID: MailGroupId.Contact === row.ENTRY_TYPE ? row.ID_ : null,
        MAIL_GROUP_ID: MailGroupId.MailGroup === row.ENTRY_TYPE ? row.ID_ : null,
        SORT_ORDER: index + 1, //index + 1
        MAIL_TO_CC_BCC_FLAG: 31501	 //To = 0,  1cc
    }));
}

const formattedExistingRecipient = (row: any, savedRecipients: any) => {
    const Recipient = savedRecipients.find((t: any) => t.ID_ === row.ID_);
    return Recipient ? Recipient.ID_ : -1;
};


/* Formatted Recepient and To and Cc */
export const FormattedAttendeesAndOptionalList = (AttendeesOrTo: Recipients[], OptionalAttendeesOrCc?: Recipients[], SavedAttendeesOrTo?: any, SavedOptionalAttendeesOrCc?: any) => {
    const x = OptionalAttendeesOrCc && OptionalAttendeesOrCc.map((x) => ({ ...x, tocc: 31502 }));
    const y = AttendeesOrTo.map((x) => ({ ...x, tocc: 31501 }));
    const mergedAttendees = x ? x.concat(y) : y;
    if (mergedAttendees.length === 0) {
        return [];
    }

    return mergedAttendees.map((row: any, index: number) => ({
        ID: -1,
        ENTRY_TYPE: row.ENTRY_TYPE,
        MAIL_ID: MailGroupId.MailId === row.ENTRY_TYPE ? row.ID_ : null,
        ROLE_ID: MailGroupId.Roles === row.ENTRY_TYPE ? row.ID_ : null,
        USER_ID: MailGroupId.User === row.ENTRY_TYPE ? row.ID_ : null,
        CONTACT_ID: MailGroupId.Contact === row.ENTRY_TYPE ? row.ID_ : null,
        MAIL_GROUP_ID: MailGroupId.MailGroup === row.ENTRY_TYPE ? row.ID_ : null,
        SORT_ORDER: index + 1, //index + 1
        MAIL_TO_CC_BCC_FLAG: row?.tocc   //To = 0,  1cc
    }));
}


/* Attachment */
interface Attachment {
    ID: number,
    SORT_ORDER: number,
    TASK_ID: number,
    ATTACHMENT_NAME: string,
    ATTACHMENT_PATH: string,
    DISPLAY_NAME: string,
}

interface AttachmentsFormatted {
    ID: number | null,
    SORT_ORDER: number,
    TASK_ID: number | null,
    ATTACHMENT_NAME: string,
    ATTACHMENT_PATH: string,
    DISPLAY_NAME: string,
}

export const FormattedAttachmentList = (attachment: Attachment[]): AttachmentsFormatted[] => {
    if (attachment.length === 0) {
        return [];
    }
    return attachment.map((row: Attachment, index: number) => ({
        ID: row.ID ? row.ID : null,
        SORT_ORDER: row.SORT_ORDER,
        TASK_ID: row.TASK_ID ? row.TASK_ID : null,
        ATTACHMENT_NAME: row.ATTACHMENT_NAME,
        ATTACHMENT_PATH: row.ATTACHMENT_PATH,
        DISPLAY_NAME: row.DISPLAY_NAME
    }));
}


/* Formatted Docs */
interface Doc {
    ID: number,
    SORT_ORDER: number,
    TASK_ID: number,
    ATTACHMENT_NAME: string,
    ATTACHMENT_PATH: string,
    DISPLAY_NAME: string,
}

interface DocFormatted {
    ID: number | null,
    SORT_ORDER: number,
    TASK_ID: number | null,
    DOC_NAME: string,
    DOC_PATH: string,
    DISPLAY_NAME: string,
}
export const FormattedDocs = (docs: Doc[]): DocFormatted[] => {
    if (docs.length === 0) {
        return [];
    }
    console.log(docs);
    return docs.map((row: any, index: number) => ({
        ID: row.ID ? row.ID : null,
        SORT_ORDER: index + 1,
        TASK_ID: row.TASK_ID ? row.TASK_ID : null,
        DOC_NAME: row.ATTACHMENT_NAME || row.DOC_NAME,
        DOC_PATH: row.ATTACHMENT_PATH || row.DOC_PATH,
        DISPLAY_NAME: row.DISPLAY_NAME
    }));
}



/* Edit Formatter */
export const TagListDefaultValueFormatter = (tags: any, control: any) => {
    console.log(tags, 'tags');
    console.log(control, 'control');
    return []
}


interface MailEditValues {
    ReferenceNumber: string;
    Subject: string;
    DocumentDate: Date | string;
    TransContent: string;
    Keywords: any;
    AdditionalReferance: any;
    Operator: number[];
    editorLang: boolean;
    configureRole: boolean;
    Receipts: never[];
    Attendees: never[] | null;
    OptionalAttendees: never[] | null;
    Tags: any;
    Relateditems: any;
    Location: any;
    Attachments: any;
    Docs: any;
    Reminder: any;
    Department: any;
    StartDate: any;
    EndDate: any;
    ResolutionNumber: any;
    ResolutionDate: any;
    EffectiveDate: any;
    DueDate: any;
    ExpiryDate: any;
    CircularDate: any;
    TaskPriority: any;
    CircularNumber: any;
    RequestType: any;
    Application: any;
    tasklistLength: any;
    sequence: any;
    Schedule: any;
    ScheduleDate: any;
    to: any;
    cc: any;
    TaskSubType?: any;
}


export const TaskEditFormatter = (responses: any) => {
    const [editHeader, editTasks, editTags, editRelations, editAttachments, recipientsParam, editDocs, operator] = responses;
    const headerResponse = editHeader.Data[0];
    const taskResponse = editTasks.Data[0];
    console.log(headerResponse, 'Task Header Response');
    console.log(taskResponse, 'Task Response');
    const editValue: MailEditValues = {
        ReferenceNumber: taskResponse?.TASK_REF_NO,
        Subject: taskResponse.TASK_TITLE,
        configureRole: headerResponse?.SEND_TO_CONFIGURED_ROLES === 1 ? true : false,
        StartDate: taskResponse.START_DATE,
        DueDate: taskResponse.DUE_DATE,
        TaskPriority: taskResponse.PRIORITY_ID,
        Reminder: taskResponse?.TASK_REMINDER_ID,
        Schedule: headerResponse?.IS_SCHEDULE === 1 ? true : false,
        ScheduleDate: headerResponse?.SCHEDULED_DATE,
        TaskSubType: headerResponse.TRANS_SUB_TYPE,
        Operator: operator?.items?.length && getMarkedOperatorIds(operator?.items),
        TransContent: CommonUtils.parseMSO(taskResponse.TASK_CONTENT),
        Receipts: recipientsParam?.Data?.length ? formatReceiptData(recipientsParam?.Data) : [],
        Tags: editTags.Data?.length ? formatAutoCompleteOptionsArray(editTags.Data, 'TAG_NAME', 'TAG_ID') : [],
        Relateditems: editRelations.Data?.length ? formatAutoCompleteOptionsArray(editRelations.Data, 'TRANS_NO', 'RELATED_TRANS_ID') : [],
        Attachments: editAttachments?.Data?.length
            ? editAttachments?.Data.filter((x: any) => (!x.TASK_ID && !x.LOG_ID)).map((x: any) => ({
                ...x,
                ext: x.ATTACHMENT_NAME.split('.').pop()?.toLowerCase(),
                isExist: true,
                isAttachment: true
            }))
            : [],
        editorLang: taskResponse?.CONTENT_EDITOR_CULTURE_ID === 1 ? true : false,
        DocumentDate: "",
        Keywords: undefined,
        AdditionalReferance: undefined,
        Attendees: [],
        OptionalAttendees: [],
        Location: "",
        Docs: editDocs?.Data?.length
            ? editDocs?.Data.map((x: any) => ({
                ...x,
                ext: x.DOC_NAME.split('.').pop()?.toLowerCase(),
                isExist: true,
                isAttachment: false
            }))
            : [],
        Department: "",
        EndDate: "",
        ResolutionNumber: "",
        ResolutionDate: "",
        EffectiveDate: "",
        ExpiryDate: "",
        CircularDate: "",
        CircularNumber: "",
        RequestType: "",
        Application: "",
        sequence: "",
        tasklistLength: editTasks?.Data ? editTasks?.Data?.length : 0,
        to: [],
        cc: []
    };
    return editValue;
}


export const MailEditFormatter = (responses: any) => {
    const [editHeader, editTasks, editTags, editRelations, editAttachments, recipientsParam, editDocs, operator] = responses;
    /* const updatedData = editRelations?.Data.map((obj: any) => ({...obj, DESCR: "new description"}));
    console.log(editRelations.Data, 'related'); */

    /*  console.log(relatedFormattedResponse(recipientsParam?.Data), 'relatedFormattedResponse (recipientsParam?.Data)'); */
    console.log(operator?.items, 'operator?.items operator?.items operator?.items operator?.items operator?.items')
    const headerResponse = editHeader.Data[0];
    const editValue: MailEditValues = {
        ReferenceNumber: headerResponse.REF_NO,
        Subject: headerResponse.SUBJECT_TEXT,
        DocumentDate: headerResponse.DOC_DATE,
        TransContent: CommonUtils.parseMSO(headerResponse.TRANS_CONTENT),
        Keywords: undefined,
        AdditionalReferance: undefined,
        Operator: operator?.items?.length && getMarkedOperatorIds(operator?.items),
        editorLang: headerResponse?.CONTENT_EDITOR_CULTURE_ID === 1 ? true : false,
        configureRole: headerResponse?.SEND_TO_CONFIGURED_ROLES === 1 ? true : false,
        Receipts: recipientsParam?.Data?.length ? formatReceiptData(recipientsParam?.Data) : [],
        /* Receipts: recipientsParam?.Data?.length ? recipientsParam?.Data.map(({ CONTACT_DET, ENTRY_TYPE, ID_, RECORD_TYPE }: any) => ({ CONTACT_DET, ENTRY_TYPE, ID_, RECORD_TYPE })) : [], */
        Tags: editTags.Data?.length ? formatAutoCompleteOptionsArray(editTags.Data, 'TAG_NAME', 'TAG_ID') : [],
        Relateditems: editRelations.Data?.length ? formatAutoCompleteOptionsArray(editRelations.Data, 'TRANS_NO', 'RELATED_TRANS_ID') : [],
        Attendees: recipientsParam?.Data?.length ? relatedFormattedResponse(recipientsParam?.Data).filter((x: any) => x.MAIL_TO_CC_BCC_FLAG === 31501) : [],
        OptionalAttendees: recipientsParam?.Data?.length ? relatedFormattedResponse(recipientsParam?.Data).filter((x: any) => x.MAIL_TO_CC_BCC_FLAG === 31502) : [],
        Location: headerResponse.LOCATION_ID,
        Attachments: editAttachments?.Data?.length
            ? editAttachments?.Data.filter((x: any) => (!x.TASK_ID && !x.LOG_ID)).map((x: any) => ({
                ...x,
                ext: x.ATTACHMENT_NAME.split('.').pop()?.toLowerCase(),
                isExist: true,
                isAttachment: true
            }))
            : [],
        Docs: editDocs?.Data?.length
            ? editDocs?.Data.map((x: any) => ({
                ...x,
                ext: x.DOC_NAME.split('.').pop()?.toLowerCase(),
                isExist: true,
                isAttachment: false
            }))
            : [],
        Reminder: "",
        Department: headerResponse.DEPT_ID,
        StartDate: headerResponse.START_DATE,
        EndDate: headerResponse.END_DATE,
        ResolutionNumber: headerResponse.RESOLUTION_CIRCULAR_NO,
        ResolutionDate: headerResponse.RESOLUTION_CIRCULAR_DATE,
        EffectiveDate: headerResponse.EFFECTIVE_DATE,
        DueDate: headerResponse.DUE_DATE,
        ExpiryDate: headerResponse.EXPIRY_DATE,
        CircularDate: headerResponse.RESOLUTION_CIRCULAR_DATE,
        TaskPriority: headerResponse.PRIORITY_ID,
        CircularNumber: headerResponse.RESOLUTION_CIRCULAR_NO,
        RequestType: headerResponse?.REQUEST_TYPE_ID,
        Application: headerResponse?.ITC_APPLICATION_ID ?? '',
        sequence: headerResponse.TASK_SEQUENCE,
        tasklistLength: editTasks?.Data ? editTasks?.Data?.length : 0,
        Schedule: headerResponse?.IS_SCHEDULE === 1 ? true : false,
        ScheduleDate: headerResponse?.SCHEDULED_DATE,
        /* to: recipientsParam?.Data.filter((x: any) => x.MAIL_TO_CC_BCC_FLAG === 31501 ? x.ID : null),
        cc: recipientsParam?.Data.filter((x: any) => x.MAIL_TO_CC_BCC_FLAG === 31502 ? x.ID : null) */
        to: recipientsParam?.Data?.length ? relatedFormattedResponse(recipientsParam?.Data).filter((x: any) => x.MAIL_TO_CC_BCC_FLAG === 31501) : [],
        cc: recipientsParam?.Data?.length ? relatedFormattedResponse(recipientsParam?.Data).filter((x: any) => x.MAIL_TO_CC_BCC_FLAG === 31502) : [],
    };
    console.log(editValue.Operator, ' editValue.Operator editValue.Operator editValue.Operator editValue.Operator')
    return editValue;
}


export const GalleryEditFormatter = (responses: any) => {
    const { TransData, Attachment, OperatorForView, operatorDropdownParam, StatusLog } = responses;
    const trans = TransData.Data[0];
    const responseItem = {
        Subject: trans?.SUBJECT_TEXT,
        StartDate: trans?.START_DATE,
        EndDate: trans?.END_DATE,
        sendToOperator: trans?.SEND_TO_CONFIGURED_ROLES,
        Operator: operatorDropdownParam?.items && getMarkedOperatorIds(operatorDropdownParam?.items),
        OperatorView: OperatorForView.Data.filter((opr: any) => !opr.LOG_ID),
        remarks: trans?.REMARKS,
        Attachments: Attachment?.Data?.length
            ? Attachment?.Data.filter((x: any) => (!x.TASK_ID && !x.LOG_ID)).map((x: any) => ({
                ...x,
                ext: x.ATTACHMENT_NAME.split('.').pop()?.toLowerCase(),
                isExist: true,
                isAttachment: true
            }))
            : [],
        StatusLog: StatusLog.Data
    }
    return responseItem;
}


export const relatedFormattedResponse = (data: any) => {
    return data.filter((x: any) => !x.LOG_ID).map((row: any, index: any) => ({
        CONTACT_DET: row.CONTACT_DET,
        ENTRY_TYPE: row.ENTRY_TYPE,
        ID_: filteredContactDet(row),
        RECORD_TYPE: row.RECORD_TYPE,
        MAIL_TO_CC_BCC_FLAG: row.MAIL_TO_CC_BCC_FLAG,
    }));
}


export const formatReceiptData = (data: any) => {
    return data.filter((x: any) => !x.LOG_ID).map((row: any, index: any) => ({
        CONTACT_DET: row.CONTACT_DET,
        ENTRY_TYPE: row.ENTRY_TYPE,
        ID_: filteredContactDet(row),
        RECORD_TYPE: row.RECORD_TYPE,
        MAIL_TO_CC_BCC_FLAG: row.MAIL_TO_CC_BCC_FLAG,
    }));
}

const filteredContactDet = (row: any) => {
    switch (row.ENTRY_TYPE) {
        case MailGroupId.MailId:
            return row.MAIL_ID;
        case MailGroupId.Roles:
            return row.ROLE_ID;
        case MailGroupId.User:
            return row.USER_ID;
        case MailGroupId.Contact:
            return row.CONTACT_ID;
        case MailGroupId.MailGroup:
            return row.MAIL_GROUP_ID;
    }
}

const FilterIds = (array: any): number[] => {
    const result = [];
    for (const item of array) {
        if (item.isMarked === 1) {
            result.push(item.id);
        }
        if (item.items) {
            const filteredItems: number[] = FilterIds(item.items);
            result.push(...filteredItems);
        }
    }
    return result;
}

export const MailViewFormatter = (responses: any) => {
    const [editHeader, editTasks, editTags, editRelations, editAttachments, recipientsParam, operators, statusLog, getComments, getoperatorsnewapiresponse, getTransactionViewLog, listreceipents, requestButtons] = responses;
    /* const updatedData = editRelations?.Data.map((obj: any) => ({...obj, DESCR: "new description"}));
    console.log(editRelations.Data, 'related'); */
    const headerResponse = editHeader.Data[0];
    const editValue: any = {
        CreatedUser: headerResponse.CREATED_USER,
        EffectiveDate: headerResponse.EFFECTIVE_DATE,
        StartDate: headerResponse.START_DATE,
        EndDate: headerResponse.END_DATE,
        ResolutionNo: headerResponse.RESOLUTION_CIRCULAR_NO,
        RequestType: headerResponse.REQUEST_NAME,
        ITCApplication: headerResponse.APPLICATION_NAME,
        Location: headerResponse.LOCATION_DESCR,
        ResolutionDate: headerResponse.RESOLUTION_CIRCULAR_DATE,
        TransStatus: headerResponse.TRANS_STATUS,
        StatusID: headerResponse.STATUS_ID,
        ReferenceNumber: headerResponse.REF_NO,
        Subject: headerResponse.SUBJECT_TEXT,
        DocumentDate: headerResponse.DOC_DATE,
        TransContent: headerResponse.TRANS_CONTENT,
        SentToConfiguration: headerResponse.SEND_TO_CONFIGURED_ROLES,
        TransNo: headerResponse.TRANS_NO,
        ServiceType: headerResponse.SERVICE_TYPE,
        DepartmentName: headerResponse.DEPT_NAME,
        TransDate: headerResponse.TRANS_DATE,
        Keywords: undefined,
        AdditionalReferance: undefined,
        Operator: operators.Data.filter((opr: any) => !opr.LOG_ID),
        editorLang: headerResponse?.CONTENT_EDITOR_CULTURE_ID === 1,
        configureRole: headerResponse?.SEND_TO_CONFIGURED_ROLES === 1,
        Receipts: recipientsParam.Data,
        Tags: editTags.Data,
        Attachements: editAttachments,
        Receipents: listreceipents,
        StatusLog: statusLog.Data,
        Relations: editRelations.Data,
        GetComments: getComments.Data,
        Tasks: editTasks.Data,
        defReceipient: relatedFormattedResponse(DefReceipient(headerResponse)),
        ExpiryDate: headerResponse.EXPIRY_DATE,
        IS_PUBLISHED: headerResponse.IS_PUBLISHED,
        NewSetOperators: getoperatorsnewapiresponse.Data,
        TransactionViewLogs: getTransactionViewLog.Data,
        franchiseName: headerResponse.FRANCHISE_NAME
    };
    return editValue;
}


export const DefReceipient = (headerResponse: any) => {
    return [{
        ID_: -1,
        RECORD_TYPE: 'User',
        CONTACT_DET: headerResponse?.CREATED_USER,
        EMAIL_ID: '',
        ID: -1,
        TRANS_ID: headerResponse?.TRANS_ID,
        ENTRY_TYPE: 30803,
        ROLE_ID: null,
        USER_ID: headerResponse?.USER_ID,
        CONTACT_ID: null,
        MAIL_GROUP_ID: null,
        MAIL_ID: null,
        IS_DEFAULT: 0,
        SORT_ORDER: 1,
        MAIL_TO_CC_BCC_FLAG: 0,
        CR_USER_ID: headerResponse?.USER_ID,
        CR_DATE: null,
        UP_USER_ID: null,
        UP_DATE: null,
        LOG_ID: null
    }]
}



export const SaveMailServiceType = (USER_TYPE: any, masterId: any) => {
    switch (masterId) {
        case MasterId.Correspondence:
            switch (USER_TYPE) {
                case UserType.ITC:
                    return ServiceTypeId.CorrespondenceITC;
                case UserType.Franchise:
                    return ServiceTypeId.CorrespondenceFranchise;
                default:
                    throw new Error("Invalid masterId");
            }
        case MasterId.Announcements:
            return ServiceTypeId.Announcements;
        case MasterId.Circulars:
            return ServiceTypeId.Circulars;
        case MasterId.Resolutions:
            return ServiceTypeId.Resolutions;
        case MasterId.Communication:
            return ServiceTypeId.Communication;
        case MasterId.Tasks:
            return ServiceTypeId.Tasks;
        case MasterId.Events:
            return ServiceTypeId.Events;
        case MasterId.Requests:
            return ServiceTypeId.Requests;
        case MasterId.Meetings:
            return ServiceTypeId.Meetings;
        case MasterId.NoticeBoardDesign:
            return ServiceTypeId.NoticeBoardDesign;
        case MasterId.Gallery:
            return ServiceTypeId.Gallery;
        case MasterId.RecurringTask:
            return -99;
        default:
            throw new Error("Invalid masterId");
    }
}

export const SaveCommentLogType = (masterId: any) => {
    switch (masterId) {
        case MasterId.Requests:
            return 32802;
        case MasterId.Tasks:
            return 32802;
        case MasterId.Correspondence:
            return 32801;
        default:
            return 32802;
    }
}


export const FormattedTaskList = (tasks: any[], savedTask?: any) => {
    if (tasks.length === 0) {
        return [];
    }
    /* tasks.map((row: any, index: number) =>  console.log(row, 'row task content ') ); */
    return tasks.map((row: any, index: number) => ({
        TASK_ID: row.TASK_ID ? row.TASK_ID : null,
        PRIORITY_ID: row.PRIORITY_ID,
        TASK_ORDER: index + 1,
        TASK_TITLE: row.TASK_TITLE,
        TASK_REF_NO: row.TASK_REF_NO,
        TASK_CONTENT: row?.TASK_CONTENT ? row?.TASK_CONTENT : row.TransContent,
        START_DATE: row.START_DATE ? new Date(row.START_DATE).toDateString() : null,
        DUE_DATE: row.DUE_DATE ? new Date(row.DUE_DATE).toDateString() : null,
        TASK_REMINDER_ID: row.TASK_REMINDER_ID,
        CONTENT_EDITOR_CULTURE_ID: row.CONTENT_EDITOR_CULTURE_ID ? 1 : 0
    }));
}

/* {
    "TASK_TITLE": "Task 1 ",
    "TASK_REF_NO": "1245",
    "TASK_ID": "",
    "PRIORITY_ID": 30502,
    "TASK_REMINDER_ID": 32403,
    "START_DATE": "2023-05-06T17:44:26.683Z",
    "DUE_DATE": "2023-05-06T17:44:26.683Z",
    "TASK_CONTENT": "",
    "CONTENT_EDITOR_CULTURE_ID": true,
    "TransContent": "<!DOCTYPE html>\n        <html>\n          <head> \n          </head>\n          <body style='margin: 0px !important;'>\n            <p>dsadsad</p>\n          </body>\n        </html>",
    "TaskFiles": [
        {
            "ID": null,
            "SORT_ORDER": 1,
            "ATTACHMENT_NAME": "2023\\05\\01a060db-dca5-4e1b-9820-6b278ae68c89.jpg",
            "ATTACHMENT_PATH": "2023\\05",
            "DISPLAY_NAME": "ocean-3605547__480.jpg",
            "TASK_ID": 0
        },
        {
            "ID": null,
            "SORT_ORDER": 2,
            "ATTACHMENT_NAME": "2023\\05\\2f564da1-ee95-4988-87cd-77c854e756af.jpg",
            "ATTACHMENT_PATH": "2023\\05",
            "DISPLAY_NAME": "fantasy-3077928_960_720.jpg",
            "TASK_ID": 0
        }
    ]
} */


export const getMarkedOperatorIds = (nodes: any) => {
    return TreeUtils.getMarkedNode(nodes).map(x => x.id);
}



