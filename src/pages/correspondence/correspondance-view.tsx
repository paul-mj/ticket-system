import { Box, Button, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, Tab } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import { Doc } from "../../assets/images/file/fileicon";
import { AddComment, ContactCard, CorrespondenceIcon, Done, DownArrow, DueDate, Eye, OpenInNewTab, Person, Reminder, Review, SelectCheck } from "../../assets/images/svgicons/svgicons";
/* import { DownArrow, Eye, OpenInNewTab } from "../../assets/images/svgicons/svgicons"; */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { MasterId, MenuId, UserType, fullGridDataAction } from "../../common/database/enums";
import ApiService, { Url } from "../../core/services/axios/api";
import { fullViewRowDataContext } from "../../common/providers/viewProvider";
import axios from "axios";
import { MailViewFormatter, SaveMailServiceType } from "./correspondence-param-formatter";
import { toast } from "react-toastify";
import { ViewConfiguredRole } from "./viewConfiguredrole";
import { ViewMailBody } from "./viewMailBody";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import DataGridActionContext from "../../common/providers/datagridActionProvider";
import { useForm, Controller } from "react-hook-form";
import TabContext from "@mui/lab/TabContext/TabContext";
import TabList from "@mui/lab/TabList/TabList";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import { FcLibrary } from "react-icons/fc";
import { AddCommentsDialog } from "./addComments";
import DataGrid, { Column, SearchPanel } from "devextreme-react/data-grid";
import { ViewReceipent } from "./viewReceipent";
import { ReceipentTable } from "./recipientsTable";
import { useParams } from "react-router-dom";
import { AddedTask } from "../../assets/images/png/pngimages";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import { CorrespondanceViewTask } from "./viewTask";
import { ReactFileViewer } from "../../shared/components/dialogs/Preview/react-file-viewer";
import { HiEye } from "react-icons/hi2";
import { AssignToUser } from "./assign-to-user";
import { useDispatch, useSelector } from "react-redux";
import CorrespondanceViewSkelton from "./correspondance-skeltons/view-skelton";
import DownloadIconButton from "../../shared/components/Buttons/IconButtons/DownloadIconButton";
import { DownloadBlob } from "../../common/application/shared-function";
import { setUpdateRow, updateMyActionBadge } from "../../redux/reducers/gridupdate.reducer";
import PrintPage from "../../shared/components/PrintPage";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { switchCorrespondenceHeader } from "../../shared/components/pageviewer/popup-component";
import { API } from "../../common/application/api.config";
import CommonUtils from "../../common/utils/common.utils";
import ImageShowCard from "../../shared/components/UI/ImageCard/ImageCard";
import TaskBoxCard from "../../shared/components/UI/TaskBoxCard/TaskBoxCard";
import "../../scss/attchmentshow.scss";
import "../../scss/taskcard.scss";
import PageViewer from "../../shared/components/pageviewer/pageviewer";
import { isObjectEmpty } from "../../core/services/utility/utils";
import ViewHeader from "./view/view-header";
import ViewMail from "./view/view-mail";
import ViewAttachments from "./view/view-attachments";
import ViewTaskList from "./view/view-task-list";
import ViewCommentRecipients from "./view/view-comment-recipients";
import ViewRecipientGrid from "./view/view-recipient-grid";
import ViewOperator from "./view/view-operator";
import ViewRelations from "./view/view-relations";
import ViewTags from "./view/view-tags";
import ViewLogs from "./view/view-logs";
import ViewRequestButtons from "./view/view-request-buttons";
import ViewActionQueueEditButton from "./view/view-actionqueue-edit-button";
import ViewActionButtons from "./view/view-action-buttons";
import SuccessBox from "./browse-components/success-box";
import SaveLoader from "./browse-components/save-loader";
import FormatField from "../../shared/components/UI/FormatField";
import ViewCommentList from "./view/view-comment-list";
import MeetingsGridList from "./view/meeting-grid-list";
import MeetingStatusUpdate from "./view/meetings-status-buttons";
import NotificationLogs from "./NotificationLogs";
import TitleBox from "../../shared/components/TitleBox";
import ViewTransactionViewLog from "./view/view-transaction-view-log";

type Anchor = "right" | "left";

type Image = {
    id: number;
    src: string;
    fileName: string;
    file: any
};

const schema = yup.object().shape({
    Remarks: yup.string().when("status", {
        is: 4,
        then: yup.string().required("Remarks is required when rejecting"),
        otherwise: yup.string().notRequired(),
    }),
});



export const CorrespondenceView = (props: any) => {
    const printWrapRef: any = useRef();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const { onCloseDialog, popupConfiguration } = props;
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const Franchise_id = userData && JSON.parse(userData).FRANCHISE_ID;
    const lang = CultureId();
    const [arrowtoggle, setarrowtogle] = useState<any>(false);
    const [arrowreceipttoggle, setarrowreceipttogle] = useState<any>(false);
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [browseLoader, setBrowseLoader] = useState(false);
    const [editFormattedresponse, setEditFormattedresponse] = useState<any>();
    const [downloadedAttachments, setDownloadedAttachments] = useState<any>();
    const [editAttachments, setAttachments] = useState<any>();

    const [commentArray, setCommentsArray] = useState<any>();
    const [recipiantsList, setRecipiantsList] = useState<any>();
    const [duplicateRecipiantsList, setDuplicateRecipiantsList] = useState<any>();
    const [taskAttachments, setTaskAttachments] = useState<any>();
    const [taskView, setTaskView] = useState<any>();
    const [requestButtons, setRequestButtons] = useState<any>();
    const [meetingButtons, setMeetingButtons] = useState<any>();
    const [actionButtons, setActionButtons] = useState<any>();
    const [recipientsResponse, setrecipientsResponse] = useState<any>();
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const [tabValue, setTabValue] = useState('1');
    const [showMore, setShowMore] = useState(true);
    const [showMoreRecipients, setShowMoreRecipients] = useState(true);
    const [showOrgin, setShowOrigin] = useState(false);
    const [showComment, setCommentMore] = useState(false);
    const [searchKey, setSearchKey] = useState<any>();
    const [recipientsSearchKey, setRecipientsSearchKey] = useState<any>();
    const [editOperators, setEditOperators] = useState<any>();
    const { transid } = useParams();
    const { t, i18n } = useTranslation();
    const currLang = i18n.dir();
    const USER_TYPE = userData && JSON.parse(userData).USER_TYPE;
    const currentDrawerState = currLang === "ltr" ? "right" : "left";
    const [drawerState, setDrawerState] = useState({
        [currentDrawerState]: false,
    });
    const [masterId, setMasterId] = useState<any>(popupConfiguration && popupConfiguration.MasterId);
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    const [saveResponse, setSaveResponse] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);
    const { control, handleSubmit, formState: { errors }, watch, trigger, setError, clearErrors } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            Remarks: "",
            status: 3, // or 4
        },
    });
    const [mailSuccess, setMailSuccess] = useState<any>();
    const [headerName, setHeader] = useState<any>(switchCorrespondenceHeader(popupConfiguration && popupConfiguration.MasterId));
    const [fullViewContext, setFullViewContext] = useState<any>();
    const [pageViewerOpen, setPageViewerOpen] = useState(false);
    const [popupEditConfiguration, setPopupEditConfiguration] = useState<any>(null);

    const closePageViewerDialog = async (e: any) => {
        setPageViewerOpen(false);
        fetchInitailData();
    };

    useEffect(() => {
        fetchViewCount();
        if (rowData.ACTION_TYPE_ID_ === 32601 || rowData.ACTION_TYPE_ID_ === 32602) {
            loadActionQueueActionButtons()
        }
    }, []);

    const loadActionQueueActionButtons = async () => {
        const buttonParam = {
            UserId: userID,
            CultureId: lang,
            TransId: rowData ? rowData?.ID_ : -1,
            FranchiseId: Franchise_id,
            ServiceType: rowData?.SERVICE_TYPE,
            IsValidation: 0,
            IsStatusChange: 1
        }
        const buttonlist = await ApiService.httpPost(API.transaction.readUserActions, buttonParam);
        setActionButtons(buttonlist.Data);
    }



    const fetchViewCount = async () => {
        const ViewCountParam = {
            TransId: rowData ? rowData?.ID_ : -1,
            TaskId: null,
            UserId: userID
        };
        const Recipientsresponse = await ApiService.httpPost("trans/updateTaskViewStatus", ViewCountParam);
    }

    const status = watch("status");

    useEffect(() => {
        if (currentPage !== MenuId.New) {
            fetchInitailData();
            setDialogLoader(true)
        }
    }, []);

    useEffect(() => {
        if (editFormattedresponse?.Receipts) {
            getActualRecipients();
        }
    }, [editFormattedresponse?.Receipts]);


    const fetchInitailData = async () => {
        const Fork: any = [];
        const Procedures = [
            'FRM_TRANS.TRANS_SPR',
            'FRM_TRANS.TRANS_TASKS_SPR',
            'FRM_TRANS.TRANS_TAGS_SPR',
            'FRM_TRANS.TRANS_RELATIONS_SPR',
            'FRM_TRANS.TRANS_ATTACHMENTS_SPR',
            'FRM_TRANS.TRANS_RECIPIENTS_SPR',
            'FRM_TRANS.TRANS_OPERATOR_SPR',
            'FRM_TRANS.TRANS_STATUS_LOG_SPR',
            'FRM_TRANS.TRANS_COMMUNICATION_SPR',
            'FRM_TRANS.TRANS_OPERATOR_FOR_VIEW_SPR',
            'FRM_TRANS.TRANS_USER_VIEWED_SPR'
        ];

        let ForkResponse = [...Procedures]

        if (currentPage !== MenuId.New) {
            Procedures.forEach((procedure) => {
                Fork.push(
                    ApiService.httpPost('trans/read', {
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
            ForkResponse.push('operatorDropdownParam');
            Fork.push(ApiService.httpPost('trans/getOperators', operatorDropdownParam))
        }
        if (masterId === MasterId.Requests) {
            const requestStatusParam = {
                UserId: userID,
                CultureId: lang,
                TransId: rowData ? rowData?.ID_ : -1,
            }
            ForkResponse.push('requestStatusParam');
            Fork.push(ApiService.httpPost('trans/readRequestStatus', requestStatusParam))
        }
        if (masterId === MasterId.Meetings) {
            const meetingStatusParam = {
                Procedure: "FRM_TRANS.MEETING_USER_ACTIONS_SPR",
                UserId: userID, // pass the user id
                CultureId: lang,
                Criteria: [
                    {
                        Name: "@TRANS_ID",
                        Value: rowData?.ID_, // pass the task Id
                        IsArray: false
                    }
                ]
            }
            ForkResponse.push('meetingStatusParam');
            Fork.push(ApiService.httpPost('data/getTable', meetingStatusParam));
        }

        setBrowseLoader(true)
        try {
            const responses: any = await axios.all(Fork);
            const formattedResponse = MailViewFormatter(responses);
            setEditFormattedresponse(formattedResponse);
            console.log(formattedResponse)
            console.log(formattedResponse.TransactionViewLogs, 'Please be it')
            setEditOperators(formattedResponse.NewSetOperators ?? [])
            const imagePromises = [];
            let parmResponse: any = {}
            ForkResponse.map((item, index) => {
                parmResponse[item] = responses[index];
            });
            // console.log(parmResponse, 'parmResponse');

            for (const doc of parmResponse['FRM_TRANS.TRANS_ATTACHMENTS_SPR'].Data) {
                const image = {
                    id: doc.ID,
                    src: doc.ATTACHMENT_NAME,
                    fileName: doc.DISPLAY_NAME,
                    file: null,
                    ext: doc.ATTACHMENT_NAME.split('.')[doc.ATTACHMENT_NAME.split('.').length - 1],
                    isExist: true
                };
                imagePromises.push(image);
            }

            const FilteredRecipientsSet = parmResponse['FRM_TRANS.TRANS_RECIPIENTS_SPR']?.Data.filter((item: any) => item.LOG_ID === null);

            setRecipiantsList(FilteredRecipientsSet)
            setDuplicateRecipiantsList(FilteredRecipientsSet)

            const filteredImages = imagePromises.filter(Boolean) as Image[];
            setDownloadedAttachments(filteredImages);
            const filteredAttachments = formattedResponse?.Attachements?.Data
                .map((attach: any, index: number) => ({
                    ...attach,
                    isExist: true,
                    ext: attach.ATTACHMENT_NAME.split('.').pop()?.toLowerCase()
                }))
                .filter((attachment: any) => {
                    return attachment.TASK_ID === null && attachment.LOG_ID === null;
                });

            if (parmResponse['requestStatusParam']?.Data.length) {
                setRequestButtons(parmResponse['requestStatusParam']?.Data);
            }
            if (parmResponse['meetingStatusParam']?.Data.length) {
                setMeetingButtons(parmResponse['meetingStatusParam']?.Data)
            }
            setAttachments(filteredAttachments);
            setBrowseLoader(false)
            const filteredtaskArray = formattedResponse?.Tasks && formattedResponse?.Tasks.map((task: any) => {
                const attachments = formattedResponse?.Attachements?.Data.filter(
                    (attachment: any) => attachment.TASK_ID === task.TASK_ID
                );
                return attachments;
            });
            const attachmentTaskArray = filteredtaskArray.flat();
            setTaskAttachments(attachmentTaskArray)
        } catch (error) {
            console.error(error);
            setBrowseLoader(false)
        }
    };


    const getActualRecipients = async () => {
        const objectIds = editFormattedresponse?.Operator?.map((item: any) => item.OBJECT_ID);
        const filteredRecipients = editFormattedresponse?.Receipts.map((item: any) => ({
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
            ServiceType: editFormattedresponse?.ServiceType,
            FranchiseId: -1,
            SendToConfiguredRoles: editFormattedresponse?.SentToConfiguration,
            Recipients: editFormattedresponse?.Receipts?.length ? filteredRecipients : [],
            Franchisee: editFormattedresponse?.Operator?.length ? objectIds : []
        };
        const Recipientsresponse = await ApiService.httpPost("trans/getActualRecipients", RecipientsParam);
        const receipts = Recipientsresponse.Data.filter((x: any) => !x.COMMUNICATION_LOG_ID)
        setrecipientsResponse(receipts);

        // Set the comments array

        const filteredcommentarray = editFormattedresponse?.GetComments && editFormattedresponse?.GetComments.map((c: any) => {
            const x = editFormattedresponse?.Attachements?.Data.filter((a: any) => a.LOG_ID === c.LOG_ID).map((y: any) => ({
                ...y,
                ext: y.ATTACHMENT_NAME.split('.').pop()?.toLowerCase(),
                isExist: true
            }));
            //const y = Recipientsresponse?.Data.filter((r: any) => r.COMMUNICATION_LOG_ID === c.LOG_ID);
            const y = recipiantsList?.length ? recipiantsList.filter((r: any) => r.LOG_ID === c.LOG_ID) : [];
            return { ...c, attachment: x, recipients: y, active: true }
        })
        console.log(filteredcommentarray, 'filteredcommentarray filteredcommentarray filteredcommentarray filteredcommentarray')
        setCommentsArray(filteredcommentarray)
    }

    const showCommentToggle = (logID: any) => {
        setCommentsArray((commentArray: any) => commentArray.map((item: any) => item.LOG_ID === logID.LOG_ID ? { ...item, active: !item.active } : item));

    }

    /*  const onClickRequestChangeStatus = async (button: any) => {
         console.log(button);
     } */


    const onClickOpenEditMode = () => {
        const popupConfig = {
            DialogName: "CorrespondenceDialog",
            FullWidth: false,
            MaxWidth: "xl",
            DialogHeading: 'Request',
            IsFullPage: true,
            action: '',
            MasterId: masterId
        };
        if (!isObjectEmpty(popupConfig)) {
            setPageViewerOpen(true);
            setPopupEditConfiguration(popupConfig);
            const fullViewContext = {
                rowData: { ID_: rowData.ID_ },
                activeAction: "",
            }
            setFullViewContext(fullViewContext)
        }
    }

    interface ParamType {
        TransId: any;
        UserId: any;
        StatusId: number;
        Remarks: string;
        CultureId?: any;
    }

    const onClickChangeStatus = async (button: any) => {
        clearErrors('Remarks')
        trigger("Remarks");
        const isValid = await handleSubmit(async (data) => {
            const { Remarks } = data;
            const param: ParamType = {
                TransId: rowData ? rowData.ID_ : -1,
                UserId: userID,
                StatusId: button.STATUS_ID,
                Remarks: Remarks,
                CultureId: lang
            };

            /* if (masterId === MasterId.Requests) {
                param.CultureId = lang;
            } */
            const condition = [4, 33, 15, 16].includes(button?.STATUS_ID) || ((masterId === MasterId.Requests));
            if (condition) { // Check if Reject button is clicked

                if (button?.IS_REMARKS_REQUIRED && !Remarks) {
                    setError('Remarks', { message: 'Remark mandatory for current status change' });
                    toast.error(`${t("Remark required for current status change")}`, { autoClose: 3000 });
                    return;
                }

                const choice = await confirm({
                    ui: "confirmation",
                    title: `${t("Status Change")}`,
                    description: `${t("Do you want to change the Status?")}`,
                    confirmBtnLabel: `${t("Yes")}`,
                    cancelBtnLabel: `${t("No")}`,
                });

                if (!choice) {
                    return;
                }
            }
            setSaveLoader(true);
            const response = await ApiService.httpPost(changeStatusApiUrls(button), param);
            if (response.Id > 0) {
                toast.success(response?.Message, { autoClose: 3000 });
                setMailSuccess(response?.Message)
                setSaveResponse(true)
                dispatch(setUpdateRow({ action: 'actionQueue', payload: { response, type: 'update' } }));
                dispatch(updateMyActionBadge({ action: 'badgeCount', payload: {} }))
                setSaveLoader(false);
                setTimeout(() => {
                    setSaveResponse(false)
                    onCloseDialog(true);
                }, 2500);
                fullviewRowAddUpdate(response.Id);
            } else {
                toast.error(response?.Message, { autoClose: 3000 });
                setSaveLoader(false);
                setSaveResponse(false)
            }
        })();
    };



    const changeStatusApiUrls = (button?: any) => {
        let url;
        if ((masterId === MasterId.Requests) && !((button.STATUS_ID === 4) || (button.STATUS_ID === 32))) {
            url = "trans/updateRequestStatus"
        } else if ((masterId === MasterId.Meetings) && popupConfiguration?.isActionQueue) {
            url = "trans/changeStatus"
        } else if (masterId === MasterId.Meetings) {
            url = "trans/saveMeetingStatus"
        } else {
            url = "trans/changeStatus"
        }
        return url;
    }


    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };


    const [manageDialog, setManageDialog] = useState<any>({
        open: '',
        onclose: null
    })

    const [manageMailDialog, setMailManageDialog] = useState<any>({
        open: '',
        onclose: null

    })

    const [addCommentsDialog, setAddCommentsDialog] = useState<any>({
        open: '',
        onclose: null

    })

    const [assignTouser, setAssignToUser] = useState<any>({
        open: '',
        onclose: null

    })

    const [MailCommentText, setMailCommentText] = useState<any>({
        open: '',
        onclose: null

    })

    const viewConfigClick = () => {
        setManageDialog({ open: "View" })
    }

    const viewMailBody = () => {
        setMailCommentText(editFormattedresponse?.TransContent)
        setMailManageDialog({ open: "View" })
    }

    const addComments = () => {
        setAddCommentsDialog({ open: "View" })
    }

    const assignToUsers = () => {
        setAssignToUser({ open: "View" })
    }

    const closeCommentsDialog = async (e: any) => {
        if (e) {
            fetchInitailData();
        }
        setAddCommentsDialog({ open: null });
    };

    const closeAssignUsers = async () => {
        setAssignToUser({ open: null });
    };

    const closeMailDialog = async () => {
        setMailManageDialog({ open: null });
    };

    const closeDialog = async () => {
        setManageDialog({ open: null });
    };

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status: fullGridDataAction.UpdateRow,
        });
    };

    const showMoreToggle = () => {
        setShowMore(!showMore);
    }
    const showMoreRecipientsToggle = () => {
        setShowMoreRecipients(!showMoreRecipients);
    }



    const handleSearch = (event: any) => {
        const searchOprValue = event.target.value;
        if (searchOprValue) {
            setSearchKey(event.target.value)
            const results = (editFormattedresponse?.NewSetOperators ?? []).filter((item: any) =>
                item?.OBJECT_NAME?.toLowerCase().includes(searchOprValue.toLowerCase()))
            setEditOperators(results)
        } else {
            setEditOperators(editFormattedresponse?.NewSetOperators)
        }
    }

    const handleRecipientsSearch = (event: any) => {
        const searchValue = event.target.value;
        if (searchValue) {
            setRecipientsSearchKey(searchValue);
            const results = recipiantsList?.filter((item: any) =>
                item?.CONTACT_DET?.toLowerCase().includes(searchValue.toLowerCase())
            );
            setRecipiantsList(results);
        } else {
            setRecipiantsList(duplicateRecipiantsList);
        }
    };


    console.log(recipiantsList)

    const toggleDrawer = (anchor: Anchor, open: boolean, cardData?: any) => {
        console.log('test function calling')
        setTaskView(cardData)
        setDrawerState({ ...drawerState, [anchor]: open });
        const ViewCountParam = {
            TransId: rowData ? rowData?.ID_ : -1,
            TaskId: cardData?.TASK_ID,
            UserId: userID
        }

        const taskViewCount = async () => {
            const Recipientsresponse = await ApiService.httpPost("trans/updateTaskViewStatus", ViewCountParam);
        }
        taskViewCount();
    };

    const onCloseDrawer = () => {
        toggleDrawer(currentDrawerState, false)
    }

    const [previewParam, setPreviewParam] = useState<any>({
        popupOpenState: false,
        image: null
    });


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

    const [dialogLoader, setDialogLoader] = useState<any>(false);

    const hideLoaderBox = () => {
        setSaveResponse(false);
        onCloseDialog(true)
    }

    const downloadAttachment = (image: any) => {
        DownloadBlob({ path: image.ATTACHMENT_NAME ? image.ATTACHMENT_NAME : image.DOC_NAME, name: image.DISPLAY_NAME });
    }
    const onRemarkChange = (e: any) => {
        if (!!e) {
            clearErrors('Remarks')
        }
    }
    const onPrintBtnClick = () => {
        return new Promise((resolve) => {
            setShowMore(true)
            setShowOrigin(true)
            resolve(true);
        })
    }
    const getActionButtons = useCallback(async (MENU_ID: number) => {
        const payLoad = {
            Procedure: "FRM_TRANS.TRANS_ADDL_BUTTON_STATUS_SPR",
            "UserId": userID,
            "CultureId": lang,
            "Criteria": [
                {
                    "Name": "@MENU_ID",
                    "Value": MENU_ID,
                    "IsArray": false
                }
            ]
        }
        const { Data } = await ApiService.httpPost('data/getTable', payLoad);
        setActionButtons(Data);
    }, [lang, userID])

    useEffect(() => {

        if (currentPage) {
            getActionButtons(currentPage);
        }
    }, [currentPage, getActionButtons]);


    const handleOpenTaskDialog = (task: any) => {
        console.log(task)
    }



    return (
        <>
            <DialogTitle sx={{ m: 0 }} className="dialog_title_wrapper bg-col px-2 py-1">
                <Row className="no-gutters justify-content-between align-items-center">
                    <Col md={6} className="name-sec-title">
                        <p className="dialog_title">
                            <div className="transNo">
                                <img src={CorrespondenceIcon} alt="" className="px-2 correspondence-icon" />
                                {popupConfiguration && popupConfiguration.DialogHeading} {">"}
                                <span className="transdata"> {editFormattedresponse?.TransNo}</span>
                                {
                                    ([MasterId.Correspondence, MasterId.Requests].includes(masterId) && editFormattedresponse?.franchiseName) &&
                                    <span className="transdata mx-4">  {">"} {editFormattedresponse?.franchiseName}</span>
                                }
                            </div>
                        </p>
                    </Col>
                    <Col md={6} className="close-sec-crr">
                        <Row className="no-gutters justify-content-end align-items-center">
                            {/* <Col md={3}>

                            </Col>
                            <Col md={1}>

                            </Col> */}
                            <Col md={1} className="text-right pe-0 print-btn-wrapper">
                                <PrintPage printWrapper={printWrapRef.current} onClickFn={onPrintBtnClick} onAfterPrint={setShowOrigin} />
                            </Col>
                            <Col md={1} className="crr-head-close-bttn-sec">
                                <IconButton
                                    aria-label="close"
                                    className="crr-head-close-bttn"
                                    onClick={() => onCloseDialog(true)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DialogTitle>
            {!browseLoader ?

                <DialogContent dividers className="dialog-content-wrapp py-1 px-4">
                    <div ref={printWrapRef}>
                        <div className="p-2 outlined-box my-2">
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="outlined-box-head mb-4">{t("Header")}</h5>

                                <div className="send-view-config print-disable">
                                    {/* <div className="send-config-sec">
                                        <div className="send-config">
                                            {t("Send to default Roles")}
                                        </div>
                                        <div className="send-action" style={{ justifyContent: editFormattedresponse?.SentToConfiguration === 0 ? "flex-start" : "flex-end", alignItems: editFormattedresponse?.SentToConfiguration === 0 ? "flex-start" : "flex-end" }} >
                                            <div className="send-dot">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="view-config" onClick={viewConfigClick}>
                                        <IconButton> <img src={Eye} alt="" /> </IconButton> 
                                    </div> */}
                                </div>

                            </div>
                            <div className="details-section-view ">
                                {/* {JSON.stringify(editFormattedresponse)} */}
                                <ViewHeader
                                    editFormattedData={editFormattedresponse}
                                    showOrgin={showOrgin}
                                    headerName={headerName}
                                    masterId={masterId}
                                />

                            </div>
                        </div>
                        <div className="outlined-box p-2 correspondence-view">
                            <div className="correspondence-heading-section">
                                {/* <div className="correspondence-view-ref">{editFormattedresponse?.ReferenceNumber}</div>
                        <div className="correspondence-view-heading"> - {editFormattedresponse?.Subject}.</div> */}

                                <TabContext value={tabValue}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                                        <TabList onChange={handleChangeTab} className="add" aria-label="lab API tabs example">
                                            <Tab label={t("Details")} value="1" />
                                            <Tab label={t("Information")} value="2" />
                                            <Tab label={t("Logs")} value="3" />
                                            <Tab label={t("Notification Logs")} value="4" />
                                        </TabList>
                                        {masterId === 2031 && <div className="assign-user">
                                            <button className="assign-user-btn" onClick={assignToUsers}>{t("Assign to User")}</button>
                                        </div>}
                                    </Box>
                                    <TabPanel value="1" className="pt-1 p-2">
                                        <div className="correspondence-wrapper">
                                            <div className="mail-left">
                                                <div className="crr-wrapper">
                                                    <ViewMail
                                                        showMore={showMore}
                                                        editFormattedresponse={editFormattedresponse}
                                                        viewMailBody={viewMailBody}
                                                        showMoreToggle={showMoreToggle} />
                                                </div>

                                                <Row className="mt-4">
                                                    <Col md={masterId !== MasterId?.Requests ? 6 : 12}>
                                                        <ViewAttachments
                                                            editAttachments={editAttachments}
                                                            handleImageView={handleImageView}
                                                            colsize={masterId !== MasterId?.Requests ? 12 : 4} />

                                                    </Col>
                                                    {
                                                        !(masterId === MasterId?.Requests || masterId === MasterId?.Meetings) &&
                                                        <Col md={6}>
                                                            <ViewTaskList
                                                                editFormattedresponse={editFormattedresponse}
                                                                currentDrawerState={currentDrawerState}
                                                                toggleDrawer={toggleDrawer}
                                                                handleOpenTaskDialog={handleOpenTaskDialog} />
                                                        </Col>
                                                    }
                                                </Row>
                                                {
                                                    ((popupConfiguration?.MasterId === MasterId?.Meetings) && (USER_TYPE === UserType.ITC) && (currentPage === MenuId.View)) ?
                                                        <div className="my-3">
                                                            <MeetingsGridList rowData={rowData} />
                                                        </div>
                                                        : null
                                                }

                                                <div className="mail-roles mt-3">
                                                   {/*  <ViewOperator
                                                        editFormattedresponse={editFormattedresponse}
                                                        showMore={showMore}
                                                        editOperators={editOperators}
                                                        handleSearch={handleSearch} 
                                                    /> */}
                                                </div>
                                                {duplicateRecipiantsList?.length > 0 ?
                                                    <div className="mail-roles my-3">
                                                        <TitleBox header={<div className="oper-top-sec">
                                                            <div> {t('Recipients')}</div>
                                                            <div className="search-sec">
                                                                <div className="search-wrapper">
                                                                    <div className="search-ip-wrap position-relative">
                                                                        <input type="text" placeholder={t("Search") ?? 'Search'} className="w-100" style={{ backgroundColor: "white" }} onChange={(event) => handleRecipientsSearch(event)} />
                                                                        <div className="search-icon">
                                                                            <SearchOutlinedIcon fontSize="inherit" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="search-result-wrap">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                            content={<div className="aditional-role" style={{ minHeight: "auto" }}>
                                                                <div className="additional-role-sec">
                                                                    {(recipiantsList?.length) ? recipiantsList.map((item: any, index: any) => (

                                                                        <Col md={4} className="d-flex reciept-item mb-3" key={index}>
                                                                            <img src={Person} alt="" />
                                                                            <div className="recipient-name mx-2">
                                                                                {item.CONTACT_DET}
                                                                                ({item.EMAIL_ID ?? item.EMAIL_ID})</div>
                                                                        </Col>

                                                                    )) : <div className="nodata py-3">{("No Data")}</div>}
                                                                </div>
                                                            </div>

                                                            }
                                                        />
                                                    </div>
                                                    : null
                                                }


                                                {([32601, 32602, 32603].includes(rowData.ACTION_TYPE_ID_) || [MenuId.CloseTransaction, MenuId.Unpublish, MenuId.UnpublishModification].includes(currentPage)) && <Row className="mt-4">
                                                    <Col md={12}>
                                                        <FormInputText
                                                            name="Remarks"
                                                            multiline={true}
                                                            minRows={5}
                                                            control={control}
                                                            label={t("Remarks")}
                                                            errors={errors}
                                                            onChange={onRemarkChange}
                                                        />
                                                    </Col>
                                                </Row>}

                                                {
                                                    (editFormattedresponse?.IS_PUBLISHED !== 0) &&
                                                    <ViewCommentList commentArray={commentArray} addComments={addComments} handleImageView={handleImageView} />
                                                }
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="2" className="pt-1 p-2">
                                        <div className="mail-roles">
                                            <ViewRecipientGrid recipientsResponse={recipientsResponse} />
                                            {UserType.ITC && <ViewTransactionViewLog editFormattedresponse={editFormattedresponse} />}
                                            <ViewRelations editFormattedresponse={editFormattedresponse} />
                                            <ViewTags editFormattedresponse={editFormattedresponse} />
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="3" className="pt-1 p-2">
                                        <ViewLogs editFormattedresponse={editFormattedresponse} />
                                    </TabPanel>
                                    <TabPanel value="4" className="pt-1 p-2">
                                        <NotificationLogs rowID={rowData.ID_} />
                                    </TabPanel>
                                </TabContext>
                            </div>
                        </div>
                    </div>
                </DialogContent > :
                <CorrespondanceViewSkelton />
            }

            <DialogActions className="dialog-action-buttons justify-content-between px-3">
                <div>
                    <Button autoFocus onClick={() => onCloseDialog(true)}>
                        {t("Close")}
                    </Button>
                </div>
                <div className="d-flex">
                    <ViewActionQueueEditButton
                        popupConfiguration={popupConfiguration}
                        masterId={masterId}
                        requestButtons={requestButtons}
                        onClickOpenEditMode={onClickOpenEditMode} />

                    <ViewRequestButtons
                        requestButtons={requestButtons}
                        onClickChangeStatus={onClickChangeStatus} />

                    <ViewActionButtons
                        actionButtons={actionButtons}
                        onClickChangeStatus={onClickChangeStatus} />
                    {
                        (!popupConfiguration?.isActionQueue && (popupConfiguration?.MasterId === MasterId?.Meetings)) ?
                            <MeetingStatusUpdate
                                rowData={rowData}
                                onClickChangeStatus={onClickChangeStatus} />
                            : null
                    }
                </div>
            </DialogActions>


            {saveResponse && <SuccessBox mailSuccess={mailSuccess} hideLoaderBox={hideLoaderBox} />}
            {saveLoader && <SaveLoader />}
            {/* Configured Role Dialog */}
            <ViewConfiguredRole
                open={manageDialog.open === "View"}
                onClose={closeDialog}
                serviceType={SaveMailServiceType(USER_TYPE, masterId)} />
            {/* View Mailbody Dialog */}
            <ViewMailBody
                open={manageMailDialog.open === "View"}
                onClose={closeMailDialog}
                mailcontent={MailCommentText} />
            {/* Add Comment Dialog */}
            {
                (editFormattedresponse && addCommentsDialog.open === "View") &&
                <AddCommentsDialog
                    open={addCommentsDialog.open === "View"}
                    onClose={closeCommentsDialog}
                    popupConfigurationView={popupConfiguration}
                    formattedResponse={editFormattedresponse} />
            }
            {/* React File Viewer */}
            <ReactFileViewer
                previewParentProps={previewParam}
                onClose={handleclosePreview} >
            </ReactFileViewer>
            {/* Task Drawer */}
            <Drawer
                anchor={currentDrawerState}
                open={drawerState[currentDrawerState]}
                onClose={() => toggleDrawer(currentDrawerState, false)}
                className="task-drawer"
                ModalProps={{
                    BackdropProps: {
                        onClick: (event: any) => {
                            event.stopPropagation();
                        },
                    },
                }}
            >
                <CorrespondanceViewTask
                    fromDrawer
                    TaskDetails={taskView}
                    TaskAttachmentArray={taskAttachments}
                    onClose={() => toggleDrawer(currentDrawerState, false)}
                    popupConfiguration={popupConfiguration}
                />
            </Drawer>

            {/* Full View Pageviewer Dialog */}
            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupEditConfiguration &&
                    <PageViewer
                        open={pageViewerOpen}
                        onClose={closePageViewerDialog}
                        popupConfiguration={popupEditConfiguration}
                    />}
            </fullViewRowDataContext.Provider>

            {/* Correspondance Dialog */}
           {/*  <CorrespondanceViewTask
                    fromDrawer
                    TaskDetails={taskView}
                    TaskAttachmentArray={taskAttachments}
                    onClose={() => toggleDrawer(currentDrawerState, false)}
                    popupConfiguration={popupConfiguration}
                /> */}

        </>
    )
}