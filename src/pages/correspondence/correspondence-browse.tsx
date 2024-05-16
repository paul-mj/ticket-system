import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./correspondence.scss";
import CorrespondenceForm from "./correspondance-form";
import { CorrespondanceEditorContext, fullViewRowDataContext } from "../../common/providers/viewProvider";
import { Col, Row } from "react-bootstrap";
import { CultureId } from "../../common/application/i18n";
import localStore from "../../common/browserstore/localstore";
import ApiService, { Url } from "../../core/services/axios/api";
import axios from "axios";
import { SwitchField } from "../../shared/components/form-components/FormSwitch";
import { FormattedAttachmentList, FormattedAttendeesAndOptionalList, FormattedDocs, FormattedRecipientList, FormattedRelationList, FormattedTagList, FormattedTaskList, MailEditFormatter, SaveMailServiceType, TaskEditFormatter, getMarkedOperatorIds } from "./correspondence-param-formatter";
import { LinearProgress } from '@material-ui/core';
import { Done, FileUpload, UploadSvg } from "../../assets/images/svgicons/svgicons";
import { toast } from "react-toastify";
import DataGridActionContext from "../../common/providers/datagridActionProvider";
import { MasterId, MenuId, UserType, fullGridDataAction } from "../../common/database/enums";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { validateFile } from "../../core/validators/fileValidator";
import { API } from "../../common/application/api.config";
import { formatAutoCompleteOptionsArray, formatDateTime } from "../../common/application/shared-function";
import { CorrespondanceTask } from "./correspondance-task";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import { FormInputSelect } from "../../shared/components/form-components/FormInputSelect";
import TextCurvedCloseButton from "../../shared/components/Buttons/TextButtons/Curved/TextCloseButton";
import CloseIconButton from "../../shared/components/Buttons/IconButtons/CloseIconButton";
import PrimaryButton from "../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import { useTranslation } from "react-i18next";
import AppHeaderUser from "../../layouts/header-components/user";
import CommonUtils from "../../common/utils/common.utils";
import "../../scss/attchmentshow.scss";
import AttachmentUpload from "../../shared/file-controler/attachment-upload/attachment-upload";
import ImageShowCard from "../../shared/components/UI/ImageCard/ImageCard";
import DocsUpload from "../../shared/file-controler/docs-upload/docs-upload";
import { CorrespondanceDefaultValue, CorrespondanceSchema } from "./correspondence-browse-schema";
import SaveLoader from "./browse-components/save-loader";
import SuccessBox from "./browse-components/success-box";
import DocumentPercentageLoader from "./browse-components/doc-percentage-loader";

type Image = {
    id: any;
    src: string;
    fileName: string;
    file: any;
    ext: any;
    isExist: boolean;
    taskID: number | null
};


const CorrespondenceBrowse = (props: any) => {
    const { onCloseDialog, popupConfiguration } = props;
    const { userType } = CommonUtils.userInfo;
    const confirm = useConfirm();
    const { t, i18n } = useTranslation();
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const Franchise_id = userData && JSON.parse(userData).FRANCHISE_ID;
    const USER_TYPE = userData && JSON.parse(userData).USER_TYPE;
    const EmailId = userData && JSON.parse(userData).EMAIL_ID;
    const lang = CultureId();
    const [isTinyExpanded, setIsTinyExpanded] = useState(false);
    const [tinyLanguage, setIsTinyLanguage] = useState(true); // change this based on current lang
    const [progress, setProgress] = useState(0);
    const [resetChildItems, setResetChildItems] = useState<any>(false);
    const [mailSuccess, setMailSuccess] = useState<any>();
    const [editFormattedresponse, setEditFormattedresponse] = useState<any>();
    const [addNewTask, setAddNewTask] = useState(false);
    const [taskList, setTaskList] = useState<any[]>([]);
    const [editResponse, setEditResponse] = useState<any>({
        tags: '',
        relations: '',
        recipients: '',
        tasks: '',
        attachment: '',
        docs: '',
        Operator: '',
    });

    const [imageLoader, setImageLoader] = useState(false);
    const [saveResponse, setSaveResponse] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);
    const [buttonList, setButtonList] = useState<any>();
    const [emailBoxStatus, setEmailBoxStatus] = useState<any>(false);
    const [testMailSaveData, setTestMailSaveData] = useState<any>(false);
    const [initialApiDropdownResponse, setInitialApiDropdownResponse] = useState<any>({
        operator: [],
        tags: [],
        relatedItems: [],
        recipients: [],
        priority: [],
        reminder: [],
        department: [],
        requestOriginal: [],
        request: [],
        application: [],
        sequence: [],
        transSubType: [],
        Customers: [],
        Users: []
    });
    const [dialogLoader, setDialogLoader] = useState<any>(false);
    const handleSwitchChange = (checked: any) => {
        console.log(checked);
    };
    let templateSchema: any;
    console.log(USER_TYPE, 'USER_TYPE USER_TYPE USER_TYPE USER_TYPE USER_TYPE USER_TYPE USER_TYPE USER_TYPE')
    if (USER_TYPE === UserType.ITC) {
        templateSchema = {
            ...CorrespondanceSchema.TemplateSchema(initialApiDropdownResponse),
            ...CorrespondanceSchema.ItcSchema(initialApiDropdownResponse),
        };
    } else {
        templateSchema = {
            ...CorrespondanceSchema.TemplateSchema(initialApiDropdownResponse),
            ...CorrespondanceSchema.FranchiseSchema(initialApiDropdownResponse),
        };
    }
    const emailSchema = yup.object().shape({
        email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, '')
            .required('')
    });
    const emailMethods = useForm({
        resolver: yupResolver(emailSchema),
        defaultValues: {
            email: EmailId
        },
        context: {
            emailBoxStatus: emailBoxStatus
        }
    });

    const resetTinyExpansion = () => {
        setIsTinyExpanded(false);
    };

    const handleToggleTiny = () => {
        setIsTinyExpanded(prevState => !prevState);
    };

    const handleOnEditorChange = (event: any) => {
        setIsTinyLanguage(event);
    }

    const onImagesChange = (event: any) => {
        setResetChildItems(false);
    }


    /* Fetch Initial Data */
    useEffect(() => {
        fetchInitailData();
        setDialogLoader(true)
    }, []);

    const fetchInitailData = async () => {
        const operatorDropdownParam = {
            UserId: userID,
            ServiceType: 0,
            CultureId: lang
        };
        const tagsParam = {
            UserId: userID,
            ServiceType: 0,
            SearchText: ''
        };
        const relatedParams = {
            UserId: userID,
            ServiceType: 0,
            SearchText: ''
        };
        const recipientsParam = {
            UserId: userID,
            CultureId: lang,
            ServiceType: null,
            TransId: rowData ? rowData?.ID_ : null,
        }
        const priorityParams = {
            Id: 305,
            CultureId: lang
        }
        const reminderParams = {
            Id: 324,
            CultureId: lang
        }
        const deptParams = {
            Procedure: "FRM_TRANS.DEPARTMENT_LOOKUP_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: []
        }
        const locationParams = {
            Id: MasterId.MeetingLocations,
            CultureId: lang,
        }
        const buttonParam = {
            UserId: userID,
            CultureId: lang,
            TransId: rowData ? rowData?.ID_ : -1,
            FranchiseId: Franchise_id,
            ServiceType: SaveMailServiceType(USER_TYPE, popupConfiguration.MasterId),
            IsValidation: 0,
            IsStatusChange: 0
        }
        const requestTypeParams = {
            Id: MasterId.FranchiseRequestType,
            CultureId: lang,
        }
        /* const applicationParams = {
            Id: MasterId.ITCApplications,
            CultureId: lang,
        } */
        const applicationParams = {
            Procedure: "FRM_MASTER.ITC_APP_LOOKUP_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: [{
                Name: "@FRANCHISE_ID ",
                Value: Franchise_id,
                IsArray: false
            }]
        }

        const sequenceParams = {
            Id: 303,
            CultureId: lang
        }
        const transSubType = {
            Procedure: "FRM_TRANS.TRANS_SUB_TYPE_LOOKUP_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: []
        }

        const operators = {
            Procedure:"FRM_TRANS.FRANCHISE_LOOKUP_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria:[]
        }
        const CustomersParam = {
            Procedure:"APP_MASTER.FRANCHISE_LOOKUP_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria:[]
        } 

        axios.all([
            /* ApiService.httpPost(API.transaction.getOperators, operatorDropdownParam), */
            ApiService.httpPost(API.transaction.lookupTags, tagsParam),
            ApiService.httpPost(API.transaction.lookupRelatedItems, relatedParams),
            ApiService.httpPost(API.transaction.getRecipients, recipientsParam),
            ApiService.httpPost(API.getEnums, priorityParams),
            ApiService.httpPost(API.getEnums, reminderParams),
            ApiService.httpPost(API.getTable, deptParams),
            ApiService.httpPost(API.getObjects, locationParams),
            ApiService.httpPost(API.transaction.readUserActions, buttonParam),
            ApiService.httpPost(API.getObjects, requestTypeParams),
            ApiService.httpPost(API.getTable, applicationParams),
            ApiService.httpPost(API.getEnums, sequenceParams),
            ApiService.httpPost(API.getTable, transSubType),
            ApiService.httpPost(API.getTable, operators),
            ApiService.httpPost(API.getTable, CustomersParam),
        ])
            .then((responses: any) => {
                console.log(responses, 'api responses');
                const [tags, relatedItems, recipients, priority, reminder, department, location, buttons, requests, application, sequences, transSubType, operators, Customers] = responses;
                setInitialApiDropdownResponse({
                    /* operator: operators.items?.length ? operators.items : [], */
                    operator: operators.Data?.length ? formatAutoCompleteOptionsArray(operators.Data, 'FRANCHISE_NAME', 'FRANCHISE_ID') : [],
                    tags: tags.Data?.length ? formatAutoCompleteOptionsArray(tags.Data, 'TAG_NAME', 'TAG_ID') : [],
                    relatedItems: relatedItems?.Data?.length ? formatAutoCompleteOptionsArray(relatedItems.Data, 'DESCR', 'TRANS_ID') : [],
                    recipients: recipients?.Data?.length ? recipients.Data : [],
                    priority: priority.Data?.length ? formatAutoCompleteOptionsArray(priority.Data, 'ENUM_NAME', 'ENUM_ID') : [],
                    reminder: reminder.Data?.length ? formatAutoCompleteOptionsArray(reminder.Data, 'ENUM_NAME', 'ENUM_ID') : [],
                    department: department.Data?.length ? formatAutoCompleteOptionsArray(department.Data, 'DEPT_NAME', 'DEPT_ID') : [],
                    location: location.Data?.length ? formatAutoCompleteOptionsArray(location.Data, 'OBJECT_NAME', 'OBJECT_ID') : [],
                    request: requests.Data?.length ? formatAutoCompleteOptionsArray(requests.Data, 'OBJECT_NAME', 'OBJECT_ID') : [],
                    requestOriginal: requests.Data?.length ? requests.Data : [],
                    application: application.Data?.length ? formatAutoCompleteOptionsArray(application.Data, 'OBJECT_NAME', 'OBJECT_ID') : [],
                    sequence: sequences.Data?.length ? formatAutoCompleteOptionsArray(sequences.Data, 'ENUM_NAME', 'ENUM_ID') : [],
                    transSubType: transSubType.Data?.length ? formatAutoCompleteOptionsArray(transSubType.Data, 'ENUM_NAME', 'ENUM_ID') : [],
                    Customers: transSubType.Data?.length ? formatAutoCompleteOptionsArray(Customers.Data, 'FRANCHISE_NAME', 'FRANCHISE_ID') : [], 
                });
                console.log(buttons);
                setButtonList(buttons.Data);
                /* After Success Of all DropDown Response. */
                if (currentPage !== MenuId.New) {
                    fetchInitailEditData();
                } else {
                    setDialogLoader(false)
                }
            })
            .catch((error: Error) => {
                setDialogLoader(false)
            });
    }

    const onchnageCustomerSelect = async (event: any) => { 
        const CustomersParam = {
            Procedure:"FRM_TRANS.CUSTOMER_USERS_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: [{
                Name: "@CUSTOMER_ID",
                Value: event,
                IsArray: false
            }]
        };
        const userList = await ApiService.httpPost(API.getTable, CustomersParam);   
        setInitialApiDropdownResponse((prevValue: any) => ({
            ...prevValue,
            Users: userList.Data?.length ? formatAutoCompleteOptionsArray(userList.Data, 'USER_NAME', 'USER_ID') : [],
        }));
    }


    const fetchInitailEditData = async () => {
        const Fork: any = [];
        const Procedures = [
            'FRM_TRANS.TRANS_SPR',
            'FRM_TRANS.TRANS_TASKS_SPR',
            'FRM_TRANS.TRANS_TAGS_SPR',
            'FRM_TRANS.TRANS_RELATIONS_SPR',
            'FRM_TRANS.TRANS_ATTACHMENTS_SPR',
            'FRM_TRANS.TRANS_RECIPIENTS_SPR',
            'FRM_TRANS.TRANS_DOCS_SPR'
        ];

        if (currentPage !== MenuId.New) {
            Procedures.forEach((procedure) => {
                Fork.push(
                    ApiService.httpPost(API.transaction.read, {
                        UserId: userID,
                        CultureId: lang,
                        TransId: rowData ? rowData?.ID_ : -1,
                        Procedure: procedure,
                    })
                );
            });
            const operatorDropdownParam = {
                UserId: userID,
                ServiceType: 0,
                CultureId: lang,
                TransId: rowData ? rowData?.ID_ : -1,
            };
            Fork.push(ApiService.httpPost(API.transaction.getOperators, operatorDropdownParam),)
        }
        try {
            const responses: any = await axios.all(Fork);
            const [editHeader, editTasks, editTags, editRelations, editAttachments, recipientsParam, editDocs, operator] = responses; 

            onchnageCustomerSelect(editHeader.Data[0].FRANCHISE_ID);

            setEditResponse({
                tags: editTags?.Data,
                relations: editRelations?.Data,
                recipients: recipientsParam?.Data,
                tasks: editTasks?.Data,
                attachment: editAttachments?.Data?.length ? editAttachments?.Data.filter((z: any) => !z.LOG_ID) : [],
                docs: editDocs?.Data,
                Operator: getMarkedOperatorIds(operator?.items),
            });
            taskWithAttachmentsFormatter(editTasks?.Data, editAttachments?.Data)
            const formattedResponse: any =  MailEditFormatter(responses, userType);
            setEditFormattedresponse(formattedResponse);
            methods.reset(formattedResponse);
            setDialogLoader(false);
        } catch (error) {
            setDialogLoader(false);
        }
    };


    const methods = useForm({
        resolver: yupResolver(templateSchema[popupConfiguration.MasterId]),
        defaultValues: { ...CorrespondanceDefaultValue.DefaultValue(taskList), ...CorrespondanceDefaultValue.SwitchDefaultValue(popupConfiguration.MasterId) },
    });


    const taskWithAttachmentsFormatter = (tasks: any, allAttachments: any) => {
        const formatterTasks = tasks && tasks.map((task: any) => {
            const matchingAttachments = allAttachments && allAttachments.filter((attachment: any) => attachment.TASK_ID === task.TASK_ID);
            if (matchingAttachments.length > 0) {
                const attachmentsWithExt = matchingAttachments.map((attachment: any) => ({
                    ...attachment,
                    ext: attachment.ATTACHMENT_NAME.split('.').pop()?.toLowerCase(),
                    isExist: true
                }));
                return { ...task, Attachments: attachmentsWithExt };
            }
            return { ...task, Attachments: [] };
        });
        setTaskList(formatterTasks);
    }



    /* Task Response */
    const handleTaskResponse = (taskResponse: any) => {
        setAddNewTask(false);
        setTaskList(taskResponse);
        /* methods.trigger(); */
    };

    useEffect(() => {
        /* if (taskList && taskList.length > 1) {
            methods.register('sequence', {
                required: 'Sequence is required',
            });
        } else {
            methods.unregister('sequence');
        } */
        /* methods.setValue('sequence', editFormattedresponse.TASK_SEQUENCE); */
        methods.setValue('tasklistLength', taskList.length);
    }, [taskList, methods]);


    const isDrawerClose = (status: any) => {
        if (status) {
            setAddNewTask(false);
        }
    };

    const onSubmitEmail = () => async (emailData: any) => {
        if (emailData.email) {
            continueSave(testMailSaveData.id, { ...testMailSaveData.data, ...emailData });
            setEmailBoxStatus(false)
        }
    }

    /* On Submit Correspondance */
    const onSubmit = (id: number) => async (data: any) => { 
        const triggerAPi = () => {
            if (id === 18) {
                setTestMailSaveData({ id: id, data: data })
                setEmailBoxStatus(true)
                return;
            } else {
                continueSave(id, data)
            }
        }
        let message = t('Do you wish to continue');
        const len = data.Operator?.length;
        const isOperatorField =  templateSchema[popupConfiguration.MasterId].fields.hasOwnProperty('Operator')
        if (len && isOperatorField) {
            message = `${t('You have selected')} <b>${len}</b> ${t('Operators')}. ${t('Do you wish to continue')}`;
        }
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('Confirmation')}`,
            description: message,
            confirmBtnLabel: `${t('Okay')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            triggerAPi();
        }
    };

    const continueSave = async (id: any, data: any) => {
        let images = [...data.Attachments, ...data.Docs];
        console.log(images, 'images');
        if (images && images?.length) {
            try {
                setImageLoader(true);
                let totalProgress: number = 0;
                for (let i = 0; i < images.length; i++) {
                    if (images[i].file) {
                        const formData = new FormData();
                        formData.append(`file`, images[i].file);

                        const onUploadProgress = (progressEvent: any) => {
                            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                            totalProgress += progress;
                            setProgress(Math.min(Math.round(totalProgress / images.length), 100));
                        }

                        const response = await axios.post(Url(API.writeDoc), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            onUploadProgress,
                        });
                        if (response && response.data.Id > 0) {
                            images[i].ATTACHMENT_NAME = response && response.data.Message;
                            images[i].ATTACHMENT_PATH = response && response.data.Message.substring(0, response.data.Message.lastIndexOf("\\"));
                            images[i].SORT_ORDER = i + 1;
                            images[i].TASK_ID = images[i]?.isAttachment ? null : -1;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                setImageLoader(false);
                saveMail(id, data);
            } catch (error: any) {
                setImageLoader(false);
                toast.error(error.message, { autoClose: 3000 });
            } finally {
            }

        } else {
            saveMail(id, data);
        }
    }

    const onError = (errors: any, e: any) => console.log(errors, e);


    const saveMail = async (id: number, data: any) => {
        console.log(data, 'data inside')
  

        data.TransContent = await CommonUtils.convertMSO(data.TransContent)
        const attachmentsArray: any = [];
        taskList.forEach(obj => {
            obj.Attachments.forEach((attachment: any) => {
                attachmentsArray.push(attachment);
            });
        });
        const mergedAttachments = [...attachmentsArray, ...data.Attachments];
        setSaveLoader(true); 

        const usrId = ((userType === UserType.ITC) && data.Users) ?  data.Users : userID; 
        const franshiseId = (data?.Customers) ? data?.Customers : (Franchise_id) ? Franchise_id : null;

        const json = {
            UserId: usrId,
            ActCrUserId: userID,
            StatusId: id,
            CultureId: lang,
            TestMailId: data?.email ? data?.email : null,
            Data: {
                TRANS_ID: rowData ? rowData?.ID_ : -1,
                SERVICE_TYPE: SaveMailServiceType(USER_TYPE, popupConfiguration.MasterId),
                FRANCHISE_ID: franshiseId,
                REF_TRANS_ID: null,
                REF_NO: data.ReferenceNumber ? data.ReferenceNumber : "",
                SUBJECT_TEXT: data?.Subject ? data?.Subject : "",
                RESOLUTION_CIRCULAR_NO: data?.ResolutionNumber ? data?.ResolutionNumber : data?.CircularNumber ? data?.CircularNumber : null,
                DOC_DATE: data.DocumentDate ? new Date(data.DocumentDate).toDateString() : null,
                RESOLUTION_CIRCULAR_DATE: data?.ResolutionDate ? new Date(data.ResolutionDate).toDateString() : data?.CircularDate ? new Date(data.CircularDate).toDateString() : null,
                EFFECTIVE_DATE: data.EffectiveDate ? new Date(data.EffectiveDate).toDateString() : null,
                DEPT_ID: data?.Department ? data.Department : null,
                IS_SCHEDULE: data?.Schedule ? 1 : 0,
                SCHEDULED_DATE: data?.ScheduleDate ? formatDateTime(data.ScheduleDate) : null,
                START_DATE: (popupConfiguration?.MasterId === MasterId.Events || popupConfiguration?.MasterId === MasterId.Meetings) ? formatDateTime(data.StartDate) : (data.StartDate ? new Date(data.StartDate).toDateString() : null),
                EXPIRY_DATE: data?.ExpiryDate ? new Date(data.ExpiryDate).toDateString() : null,
                DUE_DATE: data?.DueDate ? new Date(data.DueDate).toDateString() : null,
                END_DATE: (popupConfiguration?.MasterId === MasterId.Events || popupConfiguration?.MasterId === MasterId.Meetings) ? formatDateTime(data.EndDate) : (data.EndDate ? new Date(data.EndDate).toDateString() : null),
                NO_VEHICLES: null,
                PRIORITY_ID: data?.TaskPriority ? data?.TaskPriority : null,
                /* TASK_SEQUENCE: (data?.sequence && Number(data?.sequence) > 0 && taskList?.length > 1) ? Number(data?.sequence) : null, */
                TASK_SEQUENCE: 30301,
                LOCATION_ID: data?.Location ? data?.Location : null,
                SEND_TO_CONFIGURED_ROLES: Number(data?.configureRole),
                CONTENT_EDITOR_CULTURE_ID: 0, //data?.editorLang ? 1 : 0,
                LOCATION_DESCR: data?.LocationDECR ? data?.LocationDECR : "",
                TRANS_CONTENT: (popupConfiguration?.MasterId !== MasterId.Tasks && data.TransContent) ? data.TransContent : "",
                REQUEST_TYPE_ID: data.RequestType ? data.RequestType : null,
                ITC_APPLICATION_ID: data.Application ? data.Application : null,
                REMINDER_ID: data.Reminder || "",
                TRANS_SUB_TYPE: (popupConfiguration?.MasterId === MasterId.Tasks) ? data.TaskSubType : "",
            },
            Franchisee: data.Operator ? data.Operator : [],
            Tasks: generateTaskList(data, taskList),
            Tags: FormattedTagList(data.Tags, editResponse.tags),
            Relations: FormattedRelationList(data.Relateditems, editResponse.relations),
            Recipients: generateRecipients(data),
            Attachments: FormattedAttachmentList(mergedAttachments),
            Docs: FormattedDocs(data?.Docs)
        } 
        console.log(json)

        const response = await ApiService.httpPost(API.transaction.save, json);

        if (response.Id > 0) {
            setMailSuccess(response?.Message);
            methods.reset(CorrespondanceDefaultValue.DefaultValue());
            setResetChildItems(true);
            setSaveResponse(true)
            setSaveLoader(false);
            setTimeout(() => {
                setSaveResponse(false)
                onCloseDialog(true)
            }, 2500);
            fullviewRowAddUpdate(response.Id);

        } else {
            toast.error(response?.Message, { autoClose: 3000 });
            setSaveLoader(false);
            setSaveResponse(false)
        }
    }

    /* Full View Update And Insert */
    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status:
                currentPage === MenuId.New
                    ? fullGridDataAction.InsertRow
                    : fullGridDataAction.UpdateRow,
        });
    };


    /* Receipts Preparation */
    const generateRecipients = (data: any) => {
        if (popupConfiguration.MasterId === MasterId.Meetings) {
            return FormattedAttendeesAndOptionalList(data.Attendees, data.OptionalAttendees)
        } else if (popupConfiguration.MasterId === MasterId.Communication) {
            return FormattedAttendeesAndOptionalList(data.to, data.cc)
        } else {
            return FormattedRecipientList(data.Receipts, editResponse.recipients)
        }
    }

    /* If Task Mail Save */
    const generateTaskList = (data: any, taskList: any) => {
        if (popupConfiguration?.MasterId === MasterId.Tasks) {
            return [{
                TASK_ID: taskList?.length ? taskList[0]?.TASK_ID : -1, /* TASK_ID */
                PRIORITY_ID: data?.TaskPriority ? Number(data?.TaskPriority) : "",
                TASK_ORDER: 0,
                TASK_TITLE: data?.Subject ? data?.Subject : "",
                TASK_REF_NO: data.ReferenceNumber ? data.ReferenceNumber : "",
                TASK_CONTENT: data.TransContent ? data.TransContent : '',
                START_DATE: data.StartDate ? new Date(data.StartDate).toDateString() : "",
                DUE_DATE: data?.DueDate ? new Date(data.DueDate).toDateString() : '',
                TASK_REMINDER_ID: data?.Reminder ? Number(data?.Reminder) : "",
                CONTENT_EDITOR_CULTURE_ID: data?.editorLang ? 1 : 0,
            }]
        } else {
            return taskList ? FormattedTaskList(taskList) : [];
        }
    }

    /* Hide Loader Boc On Button Click */
    const hideLoaderBox = () => {
        setSaveResponse(false);
        onCloseDialog(true)
    }

    const onClickAddNewTask = () => {
        setAddNewTask(true)
    }

    const [showPanel, setShowPanel] = useState(true);
    const handlePanelShow = () => {
        setShowPanel(prev => !prev);
    }


    return (
        <>
            <DialogTitle sx={{ m: 0 }} className="dialog_title_wrapper bg-col-edit px-2 py-1">
                <Row className="no-gutters justify-content-between align-items-center crr-edit-heading">
                    <Col md={6} className="edit-dialog-heading">
                        <p className="dialog_title color-edit">
                            <span className="mx-2">
                                {popupConfiguration && popupConfiguration.DialogHeading}
                            </span>

                            {popupConfiguration?.action.MenuId === MenuId.Edit &&
                                <span className="trans_no">
                                    (
                                    {rowData['Trans No'] || rowData['Origin Trans No']}
                                    )
                                </span>
                            }
                        </p>
                    </Col>
                    <Col md={6} className="edit-dialog-heading">
                        <Row className="no-gutters justify-content-end align-items-center">
                            <Col md={5} className="user__in__dialog">
                                {/* <AppHeaderUser /> */}
                            </Col>

                            <Col md={3} className="edit-control">
                                {/* <div className="d-flex justify-content-center align-items-center corr_lang_bttn">
                                    <Col md={4}><p className="m-0">{t("English")}</p></Col>
                                    <Col md={4}>
                                        <SwitchField name="editorLang" control={methods.control} label="" onChange={handleOnEditorChange} />
                                    </Col>
                                    <Col md={4}><p className="m-0">{t("Arabic")}</p></Col>
                                </div> */}
                            </Col>


                            <Col md={1} className="edit-close">
                                <CloseIconButton onClick={() => onCloseDialog(true)} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DialogTitle>
            <DialogContent dividers className={`dialog-content-wrapp ${currentPage !== MenuId.View && 'form-page'}`}>
                {!dialogLoader ?
                    <FormProvider {...methods}>
                        <form className="w-100 position-relative">
                            <CorrespondanceEditorContext.Provider value={{ width: 800, height: 600 }}>
                                <CorrespondenceForm
                                    isTinyExpanded={isTinyExpanded}
                                    tinyLanguage={tinyLanguage}
                                    resetChildItems={resetChildItems}
                                    onImagesChange={onImagesChange}
                                    resetTinyExpansion={resetTinyExpansion}
                                    currentPage={currentPage}
                                    editFormattedresponse={editFormattedresponse}
                                    popupConfiguration={popupConfiguration}
                                    schema={templateSchema[popupConfiguration.MasterId]}
                                    initialApiDropdownResponse={initialApiDropdownResponse}
                                    USER_TYPE={USER_TYPE}
                                    MasterIdProp={popupConfiguration.MasterId}
                                    onchnageCustomer={onchnageCustomerSelect}
                                />
                            </CorrespondanceEditorContext.Provider>
                        </form>
                        <Row className={`no-gutters outlined-box pb-3`}>
                            {/* {
                                (popupConfiguration?.MasterId === MasterId.NoticeBoardDesign) &&
                                <Col md={6}>
                                    <CorrespondanceEditorContext.Provider value={{ width: 800, height: 600 }}>
                                        <DocsUpload
                                            popupConfiguration={popupConfiguration}
                                            showPanel={showPanel} />
                                    </CorrespondanceEditorContext.Provider>
                                </Col>
                            } */}

                            <Col md={12}>
                                <CorrespondanceEditorContext.Provider value={{ width: 800, height: 600 }}>
                                    <AttachmentUpload
                                        popupConfiguration={popupConfiguration}
                                        showPanel={showPanel} 
                                        cardSize={4}/>
                                </CorrespondanceEditorContext.Provider>
                            </Col>
                            {/* {
                                ((popupConfiguration?.MasterId === MasterId.Correspondence && USER_TYPE !== UserType.Franchise) ||
                                    popupConfiguration?.MasterId === MasterId.Announcements ||
                                    popupConfiguration?.MasterId === MasterId.Circulars ||
                                    popupConfiguration?.MasterId === MasterId.Resolutions) &&
                                <Col md={6}>
                                    <>
                                        <Row className="align-items-center jsutify-content-end ">
                                            <Col md={12}>
                                                <Row className="align-items-center jsutify-content-end align-padd">
                                                    <Col md={5}>
                                                        <div className="task-heading">
                                                            {t("Tasks")}
                                                        </div>
                                                    </Col>
                                                    <Col md={7}>
                                                        <div className="d-flex justify-content-end align-items-center">
                                                            <Col md={7} className="mx-3">
                                                                
                                                            </Col>
                                                            <div className="add-tsk">
                                                                <PrimaryButton text={`${t("Add New Task")}`} onClick={() => onClickAddNewTask()} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={12}>
                                                <CorrespondanceTask
                                                    initialApiDropdownResponse={initialApiDropdownResponse}
                                                    taskCardDatas={handleTaskResponse}
                                                    isDrawerClose={isDrawerClose}
                                                    formattedTaskList={taskList}
                                                    addTask={addNewTask}
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                </Col>
                            } */}
                        </Row>

                    </FormProvider>
                    :
                    <div className="corr-loader-wrapper">
                        <div className="corr-loader"></div>
                    </div>
                }
            </DialogContent>
            <DialogActions className="dialog-action-buttons px-3 w-100">
                <div className="d-flex align-items-center justify-content-between w-100 close">
                    <div className="user__in__dialog">
                        <AppHeaderUser />
                    </div>
                    <div className="crr-btn-section-wrap">
                        <TextCurvedCloseButton onClick={() => onCloseDialog(true)} />
                        {/* {
                            buttonList?.length ? (
                                buttonList.map((x: any) => (
                                    <Button
                                        key={x.STATUS_ID}
                                        type="submit"
                                        variant="contained"
                                        className={`colored-btn mx-2 ${x.ACTION_NAME.replace(/\s/g, '')}`}
                                        onClick={methods.handleSubmit(onSubmit(x.STATUS_ID), onError)}
                                    >
                                        {x.ACTION_NAME}
                                    </Button>
                                ))
                            ) : (
                                <p> </p>
                            )
                        } */}
                        <Button
                                        key={1}
                                        type="submit"
                                        variant="contained"
                                        className={`colored-btn mx-2 `}
                                        onClick={methods.handleSubmit(onSubmit(12), onError)}
                                    >
                                        test bttn
                                    </Button>
                    </div>
                </div>
            </DialogActions>

            {/* Document & Attchment Percentage Loader */}
            {imageLoader && <DocumentPercentageLoader progress={progress} />}
            {/* Save Success */}
            {saveResponse && <SuccessBox mailSuccess={mailSuccess} hideLoaderBox={hideLoaderBox} />}
            {/* Save Loader */}
            {saveLoader && <SaveLoader />}
            {
                emailBoxStatus &&
                <>
                    <div className="email-box-wrapper">
                        <div className="email-box">
                            <div className="d-flex align-items-center justidy-content-between">
                                <h4 className="mb-4">{t("Enter Your Test Email")}</h4>
                            </div>
                            <div>
                                <FormInputText
                                    name="email"
                                    control={emailMethods.control}
                                    label={t("Email")}
                                    errors={emailMethods.formState.errors}
                                    hideError={true}
                                />
                            </div>
                            <div className="d-flex justify-content-end mt-4">
                                <div className="close">
                                    <Button className="mx-1" color="primary" autoFocus onClick={() => setEmailBoxStatus(false)}> {t("Cancel")} </Button>
                                </div>
                                <div>
                                    <Button className="rgt-bttn mx-1" color="primary" autoFocus onClick={emailMethods.handleSubmit(onSubmitEmail())}> {t("Submit")} </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mailBox-overlay" onClick={() => setEmailBoxStatus(false)}></div>
                </>
            }

        </>
    );
};


export default CorrespondenceBrowse;


