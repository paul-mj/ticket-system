import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./viewTask.scss"
import TabContext from "@mui/lab/TabContext/TabContext";
import { Box, IconButton, Tooltip } from "@mui/material";
import TabList from "@mui/lab/TabList/TabList";
import { DialogActions, Tab } from "@material-ui/core";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import { Button, Col, Row } from "react-bootstrap";
import { Doc } from "../../assets/images/file/fileicon";
import { AddComment, ContactCard, DownArrow, DueDate, Eye, OpenInNewTab, Person, Reminder, Review, TaskIcon } from "../../assets/images/svgicons/svgicons";
import CloseIcon from "@mui/icons-material/Close";
import { HiOutlineEye } from "react-icons/hi2";
import { ReactFileViewer } from "../../shared/components/dialogs/Preview/react-file-viewer";
import { fullViewRowDataContext, taskRefreshContext } from "../../common/providers/viewProvider";
import { useSelector } from "react-redux";
import { AssignToUser } from "./assign-to-user";
import ApiService from "../../core/services/axios/api";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import { MasterId, TaskType, UserType, fullGridDataAction } from "../../common/database/enums";
import { UpdateTask } from "./updateTask";
import axios from "axios";
import { AddCommentsDialog } from "./addComments";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TextIconWhiteCloseButton from "../../shared/components/Buttons/TextIconButtons/Curved/TextIconWhiteButton";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PrimaryButton from "../../shared/components/Buttons/TextButtons/Curved/PrimaryButton";
import { ViewMailBody } from "./viewMailBody";
import { ImageComponent } from "../../shared/components/DocsView/docs";
import TaskSkelton from "./correspondance-skeltons/task-skeleton";
 import Status from "../../shared/components/UI/Status";
import FormatField from "../../shared/components/UI/FormatField";
import FormatFieldUtils from "../../shared/components/UI/FormatField/formatField.utils";
import { ViewConfirmedList } from "./viewConfirmedList";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import { toast } from "react-toastify";
import TimeLineLogs from "./TimeLineLogs";
import { relatedFormattedResponse, DefReceipient } from "./correspondence-param-formatter";
import PrintPage from "../../shared/components/PrintPage";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import ProgressStatus from "../../shared/components/UI/ProgressStatus";
import DataGridActionContext from "../../common/providers/datagridActionProvider";
import { useDispatch } from "react-redux";
import { setUpdateRow, updateMyActionBadge } from "../../redux/reducers/gridupdate.reducer";
import DownloadIconButton from "../../shared/components/Buttons/IconButtons/DownloadIconButton";
import CommonUtils from "../../common/utils/common.utils";
import { useLocation } from "react-router-dom";
import { decrypt } from "../../layouts/menu-utils";
import ImageShowCard from "../../shared/components/UI/ImageCard/ImageCard";
import ViewAttachments from "./view/view-attachments";
import TitleBox from "../../shared/components/TitleBox";
import ViewCommentRecipients from "./view/view-comment-recipients";
import ViewMail from "./view/view-mail";
import TitleBoxHtml from "../../shared/components/TitleBox/titleBoxHtml";
import ViewTaskMail from "./view/viewTaskMail";
import ViewCommentList from "./view/view-comment-list";
import SendReminderDialog from "./SendReminderDialog";
import NotificationLogs from "./NotificationLogs";

const schema = yup.object().shape({
    Remarks: yup.string().notRequired()
});


const MailBodyShow = ({ taskData }: any) => {
    return (
        <div className="greetings" dangerouslySetInnerHTML={{ __html: taskData?.TASK_CONTENT }}> </div>
    )
}

const TaskSummary = ({ taskData, statusInfo, userType, popupConfiguration, fromDrawer }: any) => {
    return (<div className="sub-heading mb-2">
        <div className="first-sub-section">
            <div className="sub-item">{t("Orgin")}: <span className="ms-1"> {taskData?.ORIGIN}</span></div>
            <div className="sub-item">{t("Orgin Trans No")}: <span className="ms-1"> {taskData?.OrginTransNo}</span></div>
            <div className="sub-item">{t("By")}: <span className="ms-1">{taskData?.CREATED_USER}</span></div>

            <div className="sub-item">{t("Start Date")}: <span className="ms-1">
                <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={taskData?.START_DATE} />
            </span></div>
            <div className="sub-item" title={`${t("Reminder")}`}>
                {t("Reminder")}:
                <span className="ms-1">
                    {taskData?.REMINDER}
                </span>
            </div>
            <div className="sub-item d-flex align-items-center">
                {t("Priority")}:
                <span className="ms-1">
                    <Status label={taskData?.PRIORITY} status={taskData?.PRIORITY_ID} cssClass={`status-${taskData?.PRIORITY_ID}`} styleDisable />
                </span>
            </div>
            <div className="sub-item">{t("Due Date")}: <span className="ms-1"><FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={taskData?.DUE_DATE} /></span></div>
            <div className="sub-item">{t("Trans Sub Type")}: <span className="ms-1">{taskData?.TRANS_SUB_TYPE}</span></div>
        </div>
        {(userType === UserType.Franchise && !fromDrawer) && <div className="ms-auto me-2 mb-2 first-sub-section">
            <div className="sub-item d-flex align-items-center gap-2">{t("Status")}:
                <ProgressStatus operatorDetails={{ STS: statusInfo.STATUS_NAME, ...statusInfo }} />
            </div>
        </div>}

    </div>)
}
const TitleControlBar = ({ operatorsName, operatorDetails, confirmBtn, onClickChangeStatus, showPriority, showTitlebar }: any) => {
    return (
        <div className="operator-heading-sec gap-3">
            {showTitlebar && <div className="head-wrap-sec">
                {operatorsName && <img src={TaskIcon} alt="" />}
                <div className="head-sec">
                    {operatorsName}
                </div>
            </div>}
            {showPriority && <div className="d-flex align-items-center ms-auto task-stat">
                <ul className="status-progress">
                    <li>
                        <ProgressStatus operatorDetails={operatorDetails} />
                    </li>
                </ul>
            </div>}
            {confirmBtn !== 0 && <>
                <PrimaryButton
                    text={t("Reject Completion")}
                    cssClass="btn-reject"
                    onClick={() => onClickChangeStatus(34)}
                />
                <PrimaryButton
                    text={t("Approve Completion")}
                    onClick={() => onClickChangeStatus(24)}
                />
            </>}
        </div>
    )
}
export const CorrespondanceViewTask = React.memo((props: any) => {
    const dispatch = useDispatch();
    const printWrapRef: any = useRef();
    const { t, i18n } = useTranslation();
    const { TaskDetails, TaskAttachmentArray, onClose, onCloseDialog, popupConfiguration, fromDrawer } = props;
    const [logs, setLogs] = useState<any[]>([]);
    const userData = localStore.getLoggedInfo();
    const lang = CultureId();
    const userID = userData && JSON.parse(userData).USER_ID;
    const franchiseID = userData && JSON.parse(userData).FRANCHISE_ID;
    const userType = userData && JSON.parse(userData).USER_TYPE;
    const [tabValue, setTabValue] = useState('1');
    const [tabDetails, setTabDetails] = useState('1');
    const [showReminderPopup, setShowReminderPopup] = useState(false);
    const remarkWrapRef: any = useRef();
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        console.log(newValue, 'newValue');

        setTabValue(newValue);
    };
    const [statusList, setStatusList] = useState<any[]>([])
    const [tabFirstValue, setFirstTabValue] = useState('1');
    const handleFirstChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setFirstTabValue(newValue);
        if (newValue === '3') {
            getLogs(franchiseID);
        }
    };

    const [responseData, setResponseData] = useState<any>();
    const [statusInfo, setStatusInfo] = useState<any>({});
    const [asgnBtnAccess, setAsgnBtnAccess] = useState<boolean>(false);
    const confirm = useConfirm();
    const [showMore, setShowMore] = useState(true);
    const [showButtonVisibility, setShowButtonVisibility] = useState({
        completion: false,
        reminder: false
    });
    const [taskData, setTaskData] = useState<any>();
    const [operatorDetails, setOperatorDetails] = useState<any>();
    const [taskAttachments, setTaskAttachments] = useState<any>();
    const [attachments, setAttachments] = useState<any>();
    const [taskComments, setTaskComments] = useState<any>();
    const [operatorTaskComments, setOperatorTaskComments] = useState<any>();
    const [recipients, setRecipients] = useState<any>();
    const [operators, setOperators] = useState<any>();
    const [reminderList, setReminderList] = useState<any[]>([]);
    const [details, setDetails] = useState<any>();
    const [operatorsList, setOperatorsList] = useState<any>();
    const [confirmCompletionList, setConfirmList] = useState<any>();
    const [operatorsName, setOperatorsName] = useState<any>();
    const [operatorsListDuplicate, setOperatorsListDuplicate] = useState<any>();
    const [recipientsResponse, setrecipientsResponse] = useState<any>();
    const [searchKey, setSearchKey] = useState<any>();
    const [operatorId, setOperatorId] = useState<any>();
    const [confirmBtn, setConfirmButton] = useState<any>();
    const [browseLoader, setBrowseLoader] = useState(false);
    const [extraCommentsProps, setExtraCommentsProps] = useState({});
    const { configs } = useSelector((state: any) => state.commonReducer);


    const showMoreToggle = () => {
        setShowMore(showMore ? false : true);
    }
    const { control, handleSubmit, formState: { errors }, watch, trigger, setError, clearErrors, getValues, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            Remarks: "",
        },
    });

    const [previewParam, setPreviewParam] = useState<any>({
        popupOpenState: false,
        image: null
    });

    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const [masterId, setMasterId] = useState<any>();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );

    const [assignTouser, setAssignToUser] = useState<any>({
        open: '',
        onclose: null

    })

    const assignToUsers = () => {
        setAssignToUser({ open: "View" })
    }

    const closeAssignUsers = async () => {
        setAssignToUser({ open: null });
    };

    const [updateTask, setUpdateTask] = useState<any>({
        open: '',
        onclose: null

    })

    const updateTaskToUsers = () => {
        setUpdateTask({ open: "View" })
    }
    const closeTaskToUsers = async (e: any) => {
        if (e) {
            initalAPI();
            fetchInitailData();
            gridActionChangeEvent({
                id: e?.Id ? e.Id : rowData?.TASK_ID_,
                status: fullGridDataAction.FullReload
            });
            dispatch(setUpdateRow({ action: 'actionQueue', payload: { response: rowData, type: 'update' } }))
            dispatch(updateMyActionBadge({ action: 'badgeCount', payload: {} }))
        }
        setUpdateTask({ open: null });
    };

    const [addCommentsDialog, setAddCommentsDialog] = useState<any>({
        open: '',
        onclose: null

    });


    useEffect(() => {
        /* console.log('bef if', configs.reloadTask) */
        /* if(configs.reloadTask) {
            console.log(' if', configs.reloadTask)
            closeCommentsDialog({ close: true });
        } */
    }, [configs.reloadTask])

    const closeCommentsDialog = async (e: any) => { 
        if (e) {
            fetchInitailData();
            if (operatorDetails?.FRANCHISE_ID) {
                getOpertorsCommunicationDetails(operatorDetails?.FRANCHISE_ID, attachments)
            }

        }
        setAddCommentsDialog({ open: null });
    };


    const getStatusCompletion = useCallback(async () => {
        if (userType === UserType.Franchise && rowData?.TASK_ID_) {
            const data = {
                Procedure: "FRM_TRANS.TRANS_TASKS_FRANCHISE_STATUS_SPR",
                UserId: userID, // pass the user id
                CultureId: lang,
                Criteria: [
                    {
                        Name: "@FRANCHISE_ID",
                        Value: franchiseID, // pass the User Franchise ID from login log
                        IsArray: false
                    },
                    {
                        Name: "@TASK_ID",
                        Value: rowData?.TASK_ID_, // pass the task Id
                        IsArray: false
                    }
                ]
            }
            const { Data: [Status] } = await ApiService.httpPost('data/getTable', data);
            setStatusInfo(Status);
        }
    }, [franchiseID, lang, rowData?.TASK_ID_, userID, userType])
    const getActionButtonAccess = useCallback(async () => {
        if (userType === UserType.Franchise && rowData?.TASK_ID_) {
            const data = {
                Procedure: "FRM_TRANS.TASK_ACTION_LOOKUP_SPR",
                UserId: userID, // pass the user id
                CultureId: lang,
                Criteria: [
                    {
                        Name: "@FRANCHISE_ID",
                        Value: franchiseID, // pass the User Franchise ID from login log
                        IsArray: false
                    },
                    {
                        Name: "@TASK_ID",
                        Value: rowData?.TASK_ID_, // pass the task Id
                        IsArray: false
                    }
                ]
            }
            const { Data } = await ApiService.httpPost('data/getTable', data);
            setAsgnBtnAccess(!!Data.length);
        }
    }, [franchiseID, lang, rowData?.TASK_ID_, userID, userType])



    useEffect(() => {
        if (rowData?.TASK_ID_) {
            fetchInitailData();
        }
        else {
            setTaskData(TaskDetails)
            // const filteredtaskArray = (TaskDetails && TaskAttachmentArray) && TaskAttachmentArray.filter((task: any) => TaskDetails?.TASK_ID === task.TASK_ID)
            const filteredtaskArray = (TaskDetails && TaskAttachmentArray) && TaskAttachmentArray
                .filter((task: any) => TaskDetails?.TASK_ID === task.TASK_ID && task.LOG_ID === null && task.TASK_STATUS_LOG_ID === null).map((image: any) => ({
                    ...image,
                    ext: image.ATTACHMENT_NAME.split('.').pop(),
                    isExist: true
                }));
            console.log(TaskAttachmentArray, 'filteredtaskArray')
            setTaskAttachments(filteredtaskArray)
        }
    }, []);

    // useEffect(() => {
    //     if (recipients) {
    //         getActualRecipients();
    //     }
    // }, [recipients]);


    const handleImageView = (image: any) => {
        var imageStructure = {
            ext: image.ATTACHMENT_NAME.split('.').pop(),
            file: null,
            fileName: image.DISPLAY_NAME,
            id: image.ID,
            isExist: true,
            src: image.ATTACHMENT_NAME
        }
        setPreviewParam({
            popupOpenState: true,
            image: imageStructure
        })
    }

    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }


    const fetchInitailData = async () => {
        const ViewTableParam = {
            Procedure: "FRM_TRANS.TRANS_TASKS_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: "@TRANS_ID",
                    Value: rowData ? rowData?.ID_ : -1, // pass the TRANS_ID
                    IsArray: false
                },
                {
                    Name: "@TASK_ID",
                    Value: rowData?.TASK_ID_, // pass the task id
                    IsArray: false
                }
            ]
        }

        const getAttachmentsParam = {
            CultureId: lang,
            Procedure: "FRM_TRANS.TRANS_ATTACHMENTS_SPR",
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID
        }
        console.log("FetchInitalLog")

        const getCommentsParam = {
            Procedure: "FRM_TRANS.TASK_COMMUNICATION_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: "@FRANCHISE_ID",
                    Value: franchiseID ?? -1, // pass the User Franchise ID from login log
                    IsArray: false
                },
                {
                    Name: "@TASK_ID",
                    Value: rowData?.TASK_ID_, // pass the task Id
                    IsArray: false
                }
            ]
        }

        const getRecipientsParam = {
            CultureId: lang,
            Procedure: "FRM_TRANS.TRANS_RECIPIENTS_SPR",
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID
        }

        const getOperatorsParam = {
            CultureId: lang,
            Procedure: "FRM_TRANS.TRANS_OPERATOR_SPR",
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID
        }

        const getDetailsParam = {
            CultureId: lang,
            Procedure: "FRM_TRANS.TRANS_SPR",
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID
        }
        setBrowseLoader(true)


        try {
            const [taskViewDet, readAttachments, readComments, readRecipients, readOperators, readDetails] = await axios.all([
                ApiService.httpPost('data/getTable', ViewTableParam),
                ApiService.httpPost('trans/read', getAttachmentsParam),
                ApiService.httpPost('data/getTable', getCommentsParam),
                ApiService.httpPost('trans/read', getRecipientsParam),
                ApiService.httpPost('trans/read', getOperatorsParam),
                ApiService.httpPost('trans/read', getDetailsParam),
            ]);
            setBrowseLoader(false)
            const taskResponse = { ...taskViewDet.Data[0], defReceipient: relatedFormattedResponse(DefReceipient(taskViewDet.Data[0])) }
            setTaskData(taskResponse)
            setAttachments(readAttachments.Data)
            // const taskArray = readAttachments?.Data.filter((task: any) => task?.TASK_ID !== null)
            //const taskComments = readComments?.Data.filter((task: any) => task?.TASK_ID !== null)
            const taskArray = readAttachments?.Data.filter((task: any) => (task.TASK_STATUS_LOG_ID === null && task.LOG_ID === null && task?.TASK_ID === rowData?.TASK_ID_)).map((image: any) => ({
                ...image,
                ext: image.ATTACHMENT_NAME.split('.').pop(),
                isExist: true
            }));
            console.log(taskArray)
            setTaskAttachments(taskArray)
            setTaskComments(readComments.Data)
            setOperators(readOperators.Data)
            setRecipients(readRecipients.Data)
            setDetails(readDetails.Data[0])
            const objs = {

                operators: readOperators.Data,
                recipients: readRecipients.Data,
                taskComments: readComments.Data,
                attachments: readAttachments.Data
            }
            getActualRecipients(objs)

        } catch (error) {
            console.error(error);
            setBrowseLoader(false)
        }
    }
    const addComments = () => {
        setAddCommentsDialog({ open: "View" })
    }


    const handleChildComponentResponse = (data: any) => {
        if (data?.length) {
            setResponseData(data);
        }
    };

    const getActualRecipients = async ({ operators, recipients, taskComments, attachments }: any) => {
        console.log({ operators, recipients, taskComments, attachments })
        const objectIds = operators.map((item: any) => item.OBJECT_ID);
        const filteredRecipients = recipients.map((item: any) => ({
            ID: item.ID,
            ENTRY_TYPE: item.ENTRY_TYPE,
            MAIL_ID: item.MAIL_ID,
            ROLE_ID: item.ROLE_ID,
            USER_ID: item.USER_ID,
            CONTACT_ID: item.CONTACT_ID,
            MAIL_GROUP_ID: item.MAIL_GROUP_ID,
            SORT_ORDER: item.SORT_ORDER,
            MAIL_TO_CC_BCC_FLAG: item.MAIL_TO_CC_BCC_FLAG
        }));
        const RecipientsParam = {
            TransId: rowData ? rowData?.ID_ : -1,
            CultureId: lang,
            ServiceType: details?.ServiceType,
            FranchiseId: -1,
            SendToConfiguredRoles: details?.SentToConfiguration,
            Recipients: recipients?.length ? filteredRecipients : [],
            Franchisee: operators?.length ? objectIds : []
        };
        const Recipientsresponse = await ApiService.httpPost("trans/getActualRecipients", RecipientsParam);
        setrecipientsResponse(Recipientsresponse.Data)

        // Set the comments array
        const filteredcommentarray = taskComments && taskComments.map((c: any) => {
            // const x = attachments.filter((a: any) => a.LOG_ID === c.LOG_ID);
            const x = attachments.filter((a: any) => a.LOG_ID === c.LOG_ID).map((image: any) => ({
                ...image,
                isExist: true,
                ext: image.ATTACHMENT_NAME.split('.').pop()
            }));
            const y = recipients.filter((r: any) => (r.LOG_ID === c.LOG_ID) && (r.CONTACT_DET || c.EMAIL_ID));
            return { ...c, attachment: x, recipients: y, active: true }
        })
        setTaskComments(filteredcommentarray)
    }


    const getLogs = useCallback(async (Id: any) => {
        const logPayload = {
            Procedure: "FRM_TRANS.TASK_STATUS_LOG_SPR",
            UserId: userID, // pass the user id 
            CultureId: lang,
            Criteria: [
                {
                    Name: "@FRANCHISE_ID",
                    Value: Id, // pass the User Franchise ID from login log
                    IsArray: false
                },
                {
                    Name: "@TASK_ID",
                    Value: rowData?.TASK_ID_, // pass the task Id
                    IsArray: false
                }
            ]
        }
        const attachmentPayload = {
            CultureId: lang,
            Procedure: "FRM_TRANS.TRANS_ATTACHMENTS_SPR",
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID
        }
        try {
            const fork = [{
                method: 'post', url: 'trans/read', data: attachmentPayload
            }, { method: 'post', url: 'data/getTable', data: logPayload }]
            const [{ Data: AttachData }, { Data: LogData }] = await ApiService.httpForkJoin(fork);
            const formatedAttach = AttachData.map((image: any) => ({
                ...image,
                ext: image.ATTACHMENT_NAME.split('.').pop(),
                isExist: true
            }))
            const logWithAttchment = LogData.map((item: any) => {
                const attachList = formatedAttach.filter((attachment: any) => attachment.TASK_STATUS_LOG_ID === item.TASK_STATUS_LOG_ID);
                return {
                    ...item,
                    attachments: attachList ?? []
                }
            })
            console.log(logWithAttchment, 'logWithAttchment')
            setLogs(logWithAttchment);
        } catch (error) {

        }
    }, [userID, lang, rowData])

    const getOpertorsCommunicationDetails = useCallback(async (Id: any, attachments: any = []) => {
        console.log(attachments, 'attachmentsattachments')
        setOperatorId(Id)
        const getCommentsDetailsParam = {
            Procedure: "FRM_TRANS.TASK_COMMUNICATION_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: "@FRANCHISE_ID",
                    Value: Id, // pass the User Franchise ID from login log
                    IsArray: false
                },
                {
                    Name: "@TASK_ID",
                    Value: rowData?.TASK_ID_, // pass the task Id
                    IsArray: false
                }
            ]
        }

        const ViewTableParam = {
            Procedure: "FRM_TRANS.TASK_ASSIGN_USER_LIST_SPR",
            UserId: userID,
            CultureId: lang,
            Criteria: [
                {
                    Name: "@FRANCHISE_ID",
                    Value: Id, // pass the user franchise id
                    IsArray: false
                },
                {
                    Name: "@TASK_ID",
                    Value: rowData?.TASK_ID_, // pass the task Id
                    IsArray: false
                }
            ]
        }

        try {
            const [communicationDetails, assignedUsersList] = await axios.all([
                ApiService.httpPost('data/getTable', getCommentsDetailsParam),
                ApiService.httpPost('data/getTable', ViewTableParam)
            ]);
            setResponseData(assignedUsersList.Data);
            const filteredcommentarray = communicationDetails.Data && communicationDetails.Data.map((c: any) => {
                // const x = attachments.filter((a: any) => a.LOG_ID === c.LOG_ID);
                const x = attachments.filter((a: any) => a.LOG_ID === c.LOG_ID).map((image: any) => ({
                    ...image,
                    isExist: true,
                    ext: image.ATTACHMENT_NAME.split('.').pop()
                }));
                const y = recipientsResponse?.filter((r: any) => r.COMMUNICATION_LOG_ID === c.LOG_ID);
                return { ...c, attachment: x, recipients: y, active: true }
            })
            // console.log(filteredcommentarray,'filteredcommentarrayfilteredcommentarray')
            setOperatorTaskComments(filteredcommentarray)

            //setTaskComments(communicationDetails.Data)



        } catch (error) {
            console.error(error);
        }

    }, [lang, recipientsResponse, rowData?.TASK_ID_, userID])

    const handleOperatorView = useCallback((operator: any, oprList?: any[]) => {
        const getOprList = (list: any) => {
            return list?.map((item: any) => item.FRANCHISE_ID === operator.FRANCHISE_ID ? { ...item, active: operator.FRANCHISE_ID === item.FRANCHISE_ID } : { ...item, active: false })
        }
        setExtraCommentsProps({ franchiseId: operator?.FRANCHISE_ID })
        setOperatorDetails(operator)
        setOperatorsName(operator.FRANCHISE_NAME)
        setConfirmButton(operator.SHOW_COMPLETION_BUTTON)
        setOperatorsList((operatorsList: any) => getOprList(oprList ?? operatorsList));
        if (rowData?.TASK_ID_) {
            getOpertorsCommunicationDetails(operator.FRANCHISE_ID, attachments)
        }
        getLogs(operator.FRANCHISE_ID);
        clearErrors('Remarks');
    }, [attachments, clearErrors, getLogs, getOpertorsCommunicationDetails, rowData?.TASK_ID_])
    const getOpertorsDetails = useCallback(async () => {
        const getOperatorsListParam = {
            Procedure: "FRM_TRANS.TASK_FRANCHISE_PROGRESS_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: "@TASK_ID",
                    Value: rowData?.TASK_ID_,  // pass the task Id
                    IsArray: false
                }
            ]
        }
        const { Data = [] } = await ApiService.httpPost("data/getTable", getOperatorsListParam);
        const hasAnyShwCmplBtn = Data.some((item: any) => item.SHOW_COMPLETION_BUTTON);
        const hasAnyShwRmntBtn = Data.some((item: any) => item.SHOW_REMINDER_BUTTON);
        setShowButtonVisibility({
            completion: hasAnyShwCmplBtn,
            reminder: hasAnyShwRmntBtn
        });
        setOperatorsList(Data)
        const filteredData = Data.filter((item: any) => item.SHOW_COMPLETION_BUTTON === 1).map((clickeditem: any) => ({ ...clickeditem, isClicked: false }));
        const reminder = Data.filter((item: any) => item.SHOW_REMINDER_BUTTON);
        setReminderList(reminder)
        setConfirmList(filteredData)
        if (Data.length) {
            const [oprtr] = Data;
            handleOperatorView(oprtr, Data)
        }
        setOperatorsListDuplicate(Data)

        // Set the operators array

        const filteredOperatorsarray = Data && Data.map((c: any, index: any) => {
            return { ...c, active: index === 0 ? true : false }
        })
        setOperatorsList(filteredOperatorsarray)
        const [initalOpr] = filteredOperatorsarray;
        if (initalOpr) {
            setOperatorsName(initalOpr?.FRANCHISE_NAME)
            setConfirmButton(initalOpr?.SHOW_COMPLETION_BUTTON)
            getOpertorsCommunicationDetails(initalOpr?.FRANCHISE_ID, attachments)
        }
        console.log(attachments)
        console.log(handleOperatorView)
        console.log(lang)
        console.log(rowData?.TASK_ID_)
        console.log(userID)
    }, [attachments, getOpertorsCommunicationDetails, handleOperatorView, lang, rowData?.TASK_ID_, userID])
    const closeReminderHandler = useCallback((e: any) => {
        if (e) {
            getOpertorsDetails();
        }
        setShowReminderPopup(false)
    }, [getOpertorsDetails])
    const handleSearch = (event: any) => {
        if (event.target.value) {
            setSearchKey(event.target.value)
            const results = operatorsList?.filter((item: any) => item?.FRANCHISE_NAME?.toLowerCase().includes(searchKey.toLowerCase()))
            setOperatorsList(results)
        } else {
            setOperatorsList(operatorsListDuplicate)
        }

    }

    const showCommentToggle = (logID: any) => {
        setTaskComments((commentArray: any) => commentArray.map((item: any) => item.LOG_ID === logID.LOG_ID ? { ...item, active: !item.active } : item));
    }

    const showOperatorCommentToggle = (logID: any) => {
        setOperatorTaskComments((commentArray: any) => commentArray.map((item: any) => item.LOG_ID === logID.LOG_ID ? { ...item, active: !item.active } : item));
    }

    const [manageMailDialog, setMailManageDialog] = useState<any>({
        open: '',
        onclose: null

    })

    const [confirmListDialog, setConfirmListDialog] = useState<any>({
        open: '',
        onclose: null

    })

    const confirmList = () => {
        console.log(updateTask)
        setConfirmListDialog({ open: "View" })
    }

    const closeListDialog = async (e: any) => {
        if (e) {
            getOpertorsDetails();
        }
        setConfirmListDialog({ open: null });
    };

    const [MailCommentText, setMailCommentText] = useState<any>()

    const viewCommentBody = (data: any) => {
        setMailCommentText(data)
        setMailManageDialog({ open: "View" })
    }

    const closeMailDialog = async () => {
        setMailManageDialog({ open: null });
    };

    const onClickChangeStatus = useCallback(async (StatusId: number) => {
        const { Remarks } = getValues();
        if (StatusId === 34 && !Remarks) {
            setTabDetails('1');
            toast.error(`${t('Remark required')}`);
            setTimeout(() => {
                if (remarkWrapRef.current) {
                    remarkWrapRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "start"
                    });
                }
            });
            setError('Remarks', { message: `${t('Required Field')}`, type: "required" })
        } else {
            clearErrors('Remarks');
        }
        if (!Object.keys(errors).length) {
            handleSubmit(async (data) => {
                const { Remarks } = data;
                //const userIds = listoperators.filter((user: any) => user.isClicked === true).map((user: any) => user.FRANCHISE_ID);
                const param = {
                    CultureId: lang,
                    TaskId: rowData?.TASK_ID_,
                    UserId: userID,
                    Lines: [operatorId],
                    Remarks: Remarks,
                    StatusId
                }
                const choice = await confirm({
                    ui: "confirmation",
                    title: `${t("Confirm Completion")}`,
                    description: `${t("Do you wish to submit?")}`,
                    confirmBtnLabel: `${t("Yes")}`,
                    cancelBtnLabel: `${t("No")}`,
                });

                if (!choice) {
                    return;
                }

                const response = await ApiService.httpPost("trans/updateTaskITCStatus", param);
                if (response.Id > 0) {
                    toast.success(response?.Message, { autoClose: 3000 });
                    getOpertorsDetails();
                    reset();

                } else {
                    toast.error(response?.Message, { autoClose: 3000 });
                }
            })();
        }
    }, [clearErrors, confirm, errors, getOpertorsDetails, getValues, handleSubmit, lang, operatorId, reset, rowData?.TASK_ID_, setError, userID]);
    const getStatusList = useCallback(async () => {
        if (rowData?.TASK_ID_) {
            const ViewDropDownParam = {
                Procedure: "FRM_TRANS.TASK_STATUS_LOOKUP_SPR",
                UserId: userID, // pass the user id
                CultureId: lang,
                Criteria: [
                    {
                        Name: "@FRANCHISE_ID",
                        Value: franchiseID, // pass the User Franchise ID from login log
                        IsArray: false
                    },
                    {
                        Name: "@TASK_ID",
                        Value: rowData?.TASK_ID_, // pass the task Id
                        IsArray: false
                    }
                ]
            }
            try {
                const { Data = [] } = await ApiService.httpPost("data/getTable", ViewDropDownParam);
                setStatusList(Data)
            } catch (error) {

            }
        }
    }, [franchiseID, lang, rowData?.TASK_ID_, userID]);
    const updateTaskViewStatus = useCallback(async () => {
        if (rowData?.TASK_ID_) {
            const payload = {
                TransId: -1,
                TaskId: rowData?.TASK_ID_,
                UserId: userID
            }
            try {
                await ApiService.httpPost('trans/updateTaskViewStatus', payload)
            } catch (error) {

            }
        }
    }, [rowData?.TASK_ID_, userID])
    const initalAPI = useCallback(() => {
        getActionButtonAccess()
        getStatusCompletion();
        getStatusList();
    }, [getActionButtonAccess, getStatusCompletion, getStatusList])

    useEffect(() => {
        initalAPI();
        setMasterId(activeDetails[0]?.Master.MASTER_ID ?? rowData?.MASTER_ID_);
    }, [activeDetails, initalAPI, rowData?.MASTER_ID_]);
    useEffect(() => {
        updateTaskViewStatus()
    }, [updateTaskViewStatus])
    useEffect(() => {
        getStatusList();
    }, [getStatusList])
    useEffect(() => {
        if (!fromDrawer && (userType !== UserType.ITC)) {
            getLogs(franchiseID)
        }
    }, [franchiseID, fromDrawer, getLogs, userType])
    // const viewOperatorCommentBody = (data: any) => {
    //     setMailCommentText(data)
    //     setMailManageDialog({ open: "View" })
    // }

    // const closeMailDialog = async () => {
    //     setMailManageDialog({ open: null });
    // };

    const onPrintBtnClick = () => {
        return new Promise((resolve) => {
            //after all internal fn call
            resolve(true);
        })
    }
    useEffect(() => {
        if ((userType === UserType.ITC) && (rowData?.TASK_ID_)) {
            getOpertorsDetails();
        }
    }, [getOpertorsDetails, rowData?.TASK_ID_, userType]);
    return (
        <>


            <TabContext value={tabFirstValue}>

                <div className="corresponsdence-sec-wrap">
                    <div className="correspondance-task-view bg-color-crr" style={{ width: masterId === MasterId.Tasks ? '100%' : '55em' }}>
                        <div className="heading-section">
                            <div className="header-wrapp">
                                {taskData?.TASK_NO && <div className="head-wrap-sec">
                                    <img src={TaskIcon} alt="" />
                                    <div className="head-sec">
                                        {t("Task")}  <span>{">"} {taskData?.TASK_NO} </span>
                                    </div>
                                </div>}
                                {/* <div className="head-time" title="Due Date">
                                    <img src={DueDate} alt="" className="due-icon" />
                                    <div className="subitem">
                                        <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={taskData?.DUE_DATE} />
                                    </div>
                                </div> */}
                            </div>
                            <div className="print-btn-wrap">
                                <PrintPage printWrapper={printWrapRef.current} onClickFn={onPrintBtnClick} />
                            </div>
                            <div className="close-tsk">
                                <IconButton
                                    aria-label="close"
                                    className="head-close-bttn"
                                    onClick={() => onCloseDialog ? onCloseDialog(true) : onClose(true)}
                                    sx={{
                                        position: "absolute",
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
                {!browseLoader ? <div className="tab-section-wrapper">
                    <div className="tab-section">
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                            <TabList onChange={handleFirstChangeTab} className="tab-operator" aria-label="lab API tabs example">
                                <Tab label={t("Task Details")} value="1" />
                                {((userType !== UserType.ITC) && (rowData?.TASK_ID_)) && <Tab label={t("Status Log")} value="3" />}
                                {((userType === UserType.ITC && operatorsList?.length) && (rowData?.TASK_ID_)) && <Tab label={t("Operator Summary")} value="2" />}
                                {((userType === UserType.ITC) && (rowData?.TASK_ID_) && operatorsList?.length) && <span className="tab-list-count">
                                    {operatorsList?.length}
                                </span>}
                                {!fromDrawer ? <Tab label={t("Logs")} value="4" /> : null}
                            </TabList>
                        </Box>
                    </div>
                    <div className={`section-scroll ${!fromDrawer ? "scroll-class" : ""}`}>
                        <div ref={printWrapRef}>
                            <TabPanel value="1" className="pt-1 p-2">
                                <div className="corresponsdence-sec-wrap">
                                    <div className="correspondance-task-view" style={{ width: masterId === MasterId.Tasks ? '100%' : '55em' }}>
                                        <TaskSummary taskData={taskData} statusInfo={statusInfo} userType={userType} popupConfiguration={popupConfiguration} fromDrawer={fromDrawer} />
                                        <div className="task-body">
                                            <TabContext value={tabValue}>
                                                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                                        <Tab label={t("Details")} value="1" />
                                                    </TabList>
                                                    {(userType !== UserType.ITC && asgnBtnAccess) && <div className="assign-user">
                                                        <button className="assign-user-btn" onClick={assignToUsers}>{t("Assign To User")}</button>
                                                    </div>}
                                                </Box>
                                                <TabPanel value="1" className="pt-1 p-2">
                                                    <div className="crr-wrapper">
                                                        <ViewTaskMail
                                                            showMore={showMore}
                                                            masterID={masterId}
                                                            editFormattedresponse={taskData}
                                                            showMoreToggle={showMoreToggle} />
                                                    </div>

                                                    <Row className="mt-4 mx-0">

                                                        <ViewAttachments
                                                            editAttachments={taskAttachments}
                                                            handleImageView={handleImageView}
                                                            colsize={rowData.TASK_ID_ ? 4 : 12} />
                                                    </Row>

                                                    {rowData.TASK_ID_ && <div className="assigned-users-section">
                                                        {(responseData?.length > 0 && userType !== UserType.ITC) && <>
                                                            <div className="attachment-heading">{t("Assigned Users")}</div>
                                                            <div className="each-sec-wrap">
                                                                {responseData && responseData.map((item: any, index: any) => (
                                                                    <div className="each-user" key={item.USER_ID}>
                                                                        {item.USER_NAME}
                                                                    </div>))}
                                                            </div>
                                                        </>}

                                                    </div>}

                                                    {rowData.TASK_ID_ && details?.IS_PUBLISHED !== 0 ?
                                                        <ViewCommentList commentArray={taskComments} addComments={addComments} handleImageView={handleImageView} />
                                                        : <></>}
                                                </TabPanel>
                                                <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>
                                                {rowData?.TASK_ID_ && <AssignToUser open={assignTouser.open === "View"} onClose={closeAssignUsers} taskId={rowData?.TASK_ID_} response={handleChildComponentResponse}></AssignToUser>}
                                                <ViewMailBody open={manageMailDialog.open === "View"} onClose={closeMailDialog} mailcontent={MailCommentText} />
                                                {/* <ViewConfirmedList open={confirmListDialog.open === "View"} onClose={closeListDialog} listCompletion={confirmCompletionList} taskId={rowData?.TASK_ID_} /> */}
                                            </TabContext>
                                        </div>

                                    </div>
                                </div >
                            </TabPanel >
                            <TabPanel value="2" className="pt-1 p-2">
                                <div className="corresponsdence-sec-wrap">
                                    <div className="correspondance-task-view pb-0 mb-2">
                                        <TaskSummary taskData={taskData} statusInfo={statusInfo} userType={userType} fromDrawer={fromDrawer} />
                                    </div>
                                </div>
                                <div className="corresponsdence-sec-wrap">
                                    {userType === UserType.ITC &&
                                        <div className="operators-sec">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="heading">{t("Operators")}</div>
                                                <div className="d-flex gap-2">
                                                    {showButtonVisibility.reminder && <PrimaryButton text={t("Send Reminder")} onClick={() => setShowReminderPopup(true)} />}
                                                    {showButtonVisibility.completion && <PrimaryButton text={t("Update Status")} onClick={confirmList} />}
                                                </div>
                                            </div>
                                            <div className="search-section">
                                                <div className="search-sec">
                                                    <div className="search-wrapper">
                                                        <div className="search-ip-wrap position-relative">
                                                            <input type="text" placeholder={t("Search") ?? 'Search'} className="w-100" onChange={handleSearch} />
                                                            <div className="search-icon">
                                                                <SearchOutlinedIcon fontSize="inherit" />
                                                            </div>
                                                        </div>
                                                        <div className="search-result-wrap"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            {operatorsList && operatorsList.map((item: any, index: any) => (
                                                <div className="list-each-operator ripple" style={{ backgroundColor: item.active === true ? '#c4ddff' : 'transparent', border: item.active === true ? '2px solid rgb(196, 221, 255)' : '1px solid #7b98bf' }} key={index} onClick={() => handleOperatorView(item)}>
                                                    <div className="each-operator" title={item.FRANCHISE_NAME}>{item.FRANCHISE_NAME}</div>
                                                    <div className="count-progress">
                                                        <img src={Eye} alt="" />
                                                        <ProgressStatus operatorDetails={{ STS: item.STS, STATUS_ID: item.STATUS_ID, CMPL_PRNCT: item.CMPL_PRNCT }} />
                                                        <span className="count-no">{item.VIEWED_COUNT}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {operatorsList?.length === 0 && <div className="nodata">{t("No Data")}</div>}
                                        </div>}
                                    {rowData.TRANS_SUB_TYPE_ === TaskType.taskContactUpdate ? <div className="wrap-contact">
                                        <TitleControlBar operatorsName={operatorsName} showTitlebar showPriority operatorDetails={operatorDetails} confirmBtn={confirmBtn} onClickChangeStatus={onClickChangeStatus} />
                                         
                                        {confirmBtn !== 0 && <div className="completion-wrap-task-contact-wrap">
                                            <div ref={remarkWrapRef}>
                                                <FormInputText
                                                    name="Remarks"
                                                    control={control}
                                                    label={t("Remarks")}
                                                    errors={errors}
                                                    onChange={() => clearErrors('Remarks')}
                                                />
                                            </div>
                                            <div className="completion-wrap-task-contact-btn">
                                                <TitleControlBar operatorsName={operatorsName} operatorDetails={operatorDetails} confirmBtn={confirmBtn} onClickChangeStatus={onClickChangeStatus} />
                                            </div>
                                        </div>}

                                    </div> :
                                        <div className="correspondance-task-view" style={{ width: masterId === MasterId.Tasks ? '100%' : '55em' }}>
                                            <div className="task-body">
                                                <TitleControlBar operatorsName={operatorsName} showTitlebar showPriority operatorDetails={operatorDetails} confirmBtn={confirmBtn} onClickChangeStatus={onClickChangeStatus} />
                                                <TabContext value={tabDetails}>
                                                    <TabList className="tab-operator" aria-label="lab API tabs example" onChange={(e, value) => { setTabDetails(value) }}>
                                                        <Tab label="Details" value="1" />
                                                        <Tab label="Log" value="2" />
                                                    </TabList>
                                                    <TabPanel value="1" className="pt-1 p-2">
                                                        {(rowData.TASK_ID_ && responseData?.length > 0) && <div className="assigned-users-section">
                                                            <div className="attachment-heading">{t("Assigned Users")}</div>
                                                            <div className="each-sec-wrap">
                                                                {responseData && responseData.map((item: any, index: any) => (
                                                                    <div className="each-user" key={item.USER_ID}>
                                                                        {item.USER_NAME}
                                                                    </div>))}
                                                            </div>
                                                        </div>}
                                                        {rowData.TASK_ID_ && <div className="comment-section">
                                                            <div className="comment-heading">
                                                                <div className="comment-sec">
                                                                    <img src={Review} alt="" />
                                                                    <div className="comment">{t("Comments")}</div>
                                                                </div>
                                                                <button className="add-comment" onClick={addComments}>
                                                                    <img src={AddComment} alt="" />
                                                                    <div className="add-cmt">{t("Add Comments")}</div>
                                                                </button>
                                                            </div>

                                                            <div>
                                                                {operatorTaskComments && operatorTaskComments.map((item: any, index: any) => (
                                                                    <div className={`each-comment ${item.active ? "add" : "minus"}`} key={index}>
                                                                        <div className="each-header" style={{ borderBottom: !item.active ? "none" : "1px solid #D3D4DB", borderRadius: !item.active ? "10px" : "10px 10px 0px 0px" }}>
                                                                            <div className="each-header-wrap">
                                                                                <img src={ContactCard} alt="" />
                                                                                <div className="cmt-name">{item.USER_NAME}</div>
                                                                                <div className="cmt-date">
                                                                                    <FormatField type='dateTime' format="dd-mmm-yyyy" delimiter="-" value={item.TRANS_DATE} />
                                                                                </div>
                                                                            </div>
                                                                            <div className="open-comments"> <IconButton> <img src={OpenInNewTab} alt="" /> </IconButton>
                                                                                <IconButton><img className="arrow-Accordian" src={DownArrow} alt="" onClick={() => showOperatorCommentToggle(item)} style={{ transform: !item.active ? "rotate(180deg)" : "rotate(0deg)" }} /></IconButton></div>
                                                                        </div>
                                                                        <div className="cmt-body-wrapper" style={{ height: !item.active ? "0px" : "auto" }}>
                                                                            <div className={`cmt-body ${item.CONTENT_EDITOR_CULTURE_ID ? 'isRtl' : 'isLtr'}`} dangerouslySetInnerHTML={{ __html: item.TRANS_CONTENT }}>
                                                                            </div>
                                                                            <div className="cmt-attachments">
                                                                                {item.attachment?.length > 0 &&
                                                                                    <ViewAttachments
                                                                                        editAttachments={item?.attachment}
                                                                                        handleImageView={handleImageView}
                                                                                        colsize={6} />
                                                                                }
                                                                            </div>
                                                                            {item.recipients?.length > 0 &&
                                                                                <ViewCommentRecipients commentItem={item?.recipients} />
                                                                            }
                                                                        </div>
                                                                    </div>))}
                                                            </div>
                                                        </div>}
                                                        {confirmBtn !== 0 && <Col md={12} className="pt-3" ref={remarkWrapRef}>
                                                            <FormInputText
                                                                name="Remarks"
                                                                control={control}
                                                                label={t("Remarks")}
                                                                errors={errors}
                                                                onChange={() => clearErrors('Remarks')}
                                                            />
                                                        </Col>}
                                                    </TabPanel>
                                                    <TabPanel value="2" className="pt-2 p-2">
                                                        <div className="mt-4">
                                                            <TimeLineLogs list={logs} />
                                                        </div>
                                                    </TabPanel>
                                                </TabContext>
                                                <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>
                                                <AssignToUser open={assignTouser.open === "View"} onClose={closeAssignUsers} taskId={rowData?.TASK_ID_} response={handleChildComponentResponse}></AssignToUser>
                                            </div>

                                        </div>}
                                    <ViewConfirmedList open={confirmListDialog.open === "View"} onClose={closeListDialog} listCompletion={confirmCompletionList} taskId={rowData?.TASK_ID_} />

                                </div>
                            </TabPanel>
                            <TabPanel value="3" className="pt-1 p-2 min-vh-100">
                                <div className="mt-4 px-2">
                                    <TimeLineLogs list={logs} />
                                </div>
                            </TabPanel>

                            <TabPanel value="4" className="pt-4 px-3">
                                <NotificationLogs rowID={rowData?.TASK_ID_} isTask />
                            </TabPanel>
                        </div>
                    </div ></div> :
                    <TaskSkelton />
                }
            </TabContext >
            {masterId === 2031 && <div className={`update-btn ${fromDrawer ? 'px-2' : 'pb-0'}`}>
                <button
                    onClick={() => masterId === 2031 ? onCloseDialog(true) : onClose(true)}
                    className="mx-3 cancel-btn"
                >
                    {t("Cancel")}
                </button>

                {!!statusList.length && <PrimaryButton text={t("Update")} onClick={() => updateTaskToUsers()} />}
            </div>
            }
            <UpdateTask open={updateTask.open === "View"} popupConfigurationView={popupConfiguration} onClose={closeTaskToUsers} statusList={statusList} editFormattedresponse={taskData}></UpdateTask>

            {
                (taskData && addCommentsDialog.open === "View") &&
                <AddCommentsDialog extraData={tabFirstValue === '2' ? extraCommentsProps : undefined} open={addCommentsDialog.open === "View"} onClose={closeCommentsDialog} popupConfigurationView={popupConfiguration} formattedResponse={taskData} />
            }
            <SendReminderDialog TaskId={rowData?.TASK_ID_} open={showReminderPopup} operatorsList={reminderList} onClose={closeReminderHandler} />

        </>
    )
})