import { Box, Button, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, Tab } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
/* import { DownArrow, Eye, OpenInNewTab } from "../../assets/images/svgicons/svgicons"; */
import { useContext, useEffect, useRef, useState } from "react";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import axios from "axios";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import TabContext from "@mui/lab/TabContext/TabContext";
import TabList from "@mui/lab/TabList/TabList";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import { FcLibrary } from "react-icons/fc";
import DataGrid, { Column, SearchPanel } from "devextreme-react/data-grid";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import { HiEye } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import "./operatorReg.scss"
import ApiService from "../../../core/services/axios/api";
import localStore from "../../../common/browserstore/localstore";
import { CultureId } from "../../../common/application/i18n";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import FormatField from "../../../shared/components/UI/FormatField";
import { ReactFileViewer } from "../../../shared/components/dialogs/Preview/react-file-viewer";
import OperatorViewSkelton from "./operatorViewSkeleton";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { formatOptionsArray } from "../../../common/application/shared-function";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import { fullGridDataAction } from "../../../common/database/enums";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { setUpdateRow, updateMyActionBadge } from "../../../redux/reducers/gridupdate.reducer";
import NumberFormat from "../../../shared/components/UI/FormatField/emid";
import TitleBox from "../../../shared/components/TitleBox";
import AdjustIcon from '@mui/icons-material/Adjust';
import { PartnerCard } from "../../OperatorRegistration/PartnersAndActivity";

const DocumentTableRow = ({ item, onValueSubmit }: any) => {

    const fullViewRowData = useContext(fullViewRowDataContext);
    const { rowData } = fullViewRowData ? fullViewRowData : '';

    let validationSchema = yup.object().shape({
        Active: yup.number().required("Required"),
    });


    const {
        control,
        handleSubmit,
        setValue,
        trigger,
        setError,
        formState: { errors, isValid }
    } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            Active: 0,
            DocRemarks: ""
        },
    });

    const [dropdownUserData, setDropdownUserData] = useState([
        { ID: 3, Status: "Approve" },
        { ID: 4, Status: "Reject" }
    ]);
    const [dropdownFormat, setDropdownFormat] = useState<any>();

    useEffect(() => {
        const formattedOptions = formatOptionsArray(dropdownUserData, 'Status', 'ID');
        setDropdownFormat(formattedOptions);
    }, []);

    const handleUserDropdown = async (event: any) => {
        handleSubmit(async (data) => {
            if ((data?.Active === 4) && !data?.DocRemarks) {
                setError('DocRemarks', { message: '' })
            }
            onValueSubmit({ ...data, ...item })
        })()
    }

    const [previewParam, setPreviewParam] = useState<any>({
        popupOpenState: false,
        image: null
    });


    const handleImageView = (image: any) => {
        var imageStructure = {
            ext: image.DOC_NAME.split('.').pop(),
            file: null,
            fileName: image.DOC_TYPE_NAME,
            id: image.ID,
            isExist: true,
            src: image.DOC_NAME
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

    return (
        <div className="status-table-body">
            <div className="each-item">{item.DOC_TYPE_NAME}</div>
            <div className="each-item">{item.REMARKS}</div>
            <div className="each-item">
                <IconButton
                    aria-label="calendar"
                    size="small"
                    className="px-1 view-eye"
                    onClick={() => handleImageView(item)}
                >
                    <HiOutlineEye />
                </IconButton>
            </div>
            <div className="each-item">
                {((rowData?.ACTION_TYPE_ID_ === 32601) && (item.STATUS_ID !== -1)) && <div className="action-sec">
                    <FormInputSelect
                        name="Active"
                        control={control}
                        label=""
                        options={dropdownFormat}
                        errors={errors}
                        onChange={handleUserDropdown}
                    />
                </div>}
                {((rowData?.ACTION_TYPE_ID_ === 32601) && (item.STATUS_ID === -1)) && <div>No data </div>}
            </div>
            <div className="each-item">
                {((rowData?.ACTION_TYPE_ID_ === 32601) && (item.STATUS_ID !== -1)) && <div className="input-sec">
                    <FormInputText
                        name="DocRemarks"
                        control={control}
                        label=""
                        errors={errors}
                        onChange={handleUserDropdown}
                    />
                </div>}
                {((rowData?.ACTION_TYPE_ID_ === 32601) && (item.STATUS_ID === -1)) && <div>No data </div>}
            </div>
            <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>
        </div>
    )
}

export const OperatorRegistrationView = (props: any) => {
    const { transid } = useParams();
    const navigate = useNavigate();
    const { onCloseDialog, popupConfiguration } = props;
    const userData = localStore.getLoggedInfo();
    const lang = CultureId();
    const confirm = useConfirm();
    const dispatch = useDispatch();
    const [operatorView, setoperatorViewDet] = useState<any>();
    const [partnerInfo, setviewPartnerInfo] = useState<any>();
    const [activityInfo, setviewActivityInfo] = useState<any>();
    const [submitDoc, setSubmitDoc] = useState<any>();
    const [logoImg, setLogo] = useState<any>();
    const [headerList, setviewHeaderList] = useState<any>();
    const [viewDoc, setviewDoc] = useState<any>();
    const [viewButtons, setButtons] = useState<any>();
    const [browseLoader, setBrowseLoader] = useState(false);
    const [docBoxValidator, setDocBoxValidator] = useState(false);
    const userID = userData && JSON.parse(userData).USER_ID;
    const fullViewRowData = useContext(fullViewRowDataContext);
    const { rowData } = fullViewRowData ? fullViewRowData : '';



    useEffect(() => {
        fetchInitailData();
    }, []);


    const fetchInitailData = async () => {
        setBrowseLoader(true)
        const ViewStatusTableParam = {
            Procedure: "FRM_TRANS.OPR_REG_STATUS_LOG_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: "@TRANS_ID",
                    Value: transid ? transid : rowData ? rowData?.ID_ : -1, // pass the TRANS Id
                    IsArray: false
                }
            ]
        }

        const ViewPartnerInfo = {
            Procedure: "FRM_TRANS.OPR_REG_PARTNERS_SPR",
            UserId: userID, // pass the user id
            CultureId: 0,
            Criteria: [
                {
                    Name: "@TRANS_ID",
                    Value: transid ? transid : rowData ? rowData?.ID_ : -1, // pass the TRANS Id
                    IsArray: false
                }
            ]
        }

        const ViewActivityDetails = {
            Procedure: "FRM_TRANS.OPR_REG_COMP_ACTIVITIES_SPR",
            UserId: userID, // pass the user id
            CultureId: lang,
            Criteria: [
                {
                    Name: "@TRANS_ID",
                    Value: transid ? transid : rowData ? rowData?.ID_ : -1,  // pass the TRANS Id
                    IsArray: false
                }
            ]
        }

        const ViewHeader = {
            TransId: transid ? transid : rowData ? rowData?.ID_ : -1,
            CultureId: lang,
            TransNo: "",
            EmailId: "",
            SubEntityId: -1
        }

        const ViewDocuments = {
            TransId: transid ? transid : rowData ? rowData?.ID_ : -1,
            Mode: 0,
            CultureId: lang,
            SubEntityId: -1
        }

        const ViewButtons = {
            TransId: transid ? transid : rowData ? rowData?.ID_ : -1,
            UserId: userID,
            CultureId: lang
        }


        try {
            const [operatorStatusTable, viewPartnerInfo, viewActivityInfo, viewHeaderList, viewDoc, buttonList] = await axios.all([
                ApiService.httpPost('data/getTable', ViewStatusTableParam),
                ApiService.httpPost('data/getTable', ViewPartnerInfo),
                ApiService.httpPost('data/getTable', ViewActivityDetails),
                ApiService.httpPost('operator/readHeader', ViewHeader),
                ApiService.httpPost('operator/readDocuments', ViewDocuments),
                ApiService.httpPost('operator/readActionLookup', ViewButtons),
            ]);
            setoperatorViewDet(operatorStatusTable.Data)
            setviewPartnerInfo(viewPartnerInfo.Data)
            setviewActivityInfo(viewActivityInfo.Data)
            setviewHeaderList(viewHeaderList.Data[0])
            setLogo('data:image/png;base64,' + viewHeaderList.Data[0]?.COMPANY_LOGO)
            setviewDoc(viewDoc.Data)
            setButtons(buttonList.Data)
            setBrowseLoader(false)
            console.log(viewHeaderList.Data[0])
        } catch (error) {
            console.error(error);
        }
    }



    const dialogClose = (transId: any) => {
        transId ? navigate(`/operator/search`) : onCloseDialog(true)
    }

    const handleOnValueSubmit = (data: any) => {
        console.log(data)
        setSubmitDoc((prev: any) => {
            const temp = prev ?? []
            const find = temp.find((x: any) => x.ID === data.ID)
            if (find) {
                find.REMARKS = data.DocRemarks;
                find.STATUS_ID = data.Active
            } else {
                const { DocRemarks: REMARKS, Active: STATUS_ID, ID } = data
                temp?.push({ REMARKS, STATUS_ID, ID })
            }
            return [...temp]
        })

    }

    useEffect(() => {
    }, [submitDoc])

    const [inputValue, setInputValue] = useState("");
    const { gridActionChangeEvent } = useContext(DataGridActionContext);

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status: fullGridDataAction.UpdateRow,
        });
    };
 


    const onClickChangeStatus = async (statusId: number) => {

        if ((submitDoc && submitDoc?.length) !== (viewDoc && viewDoc?.length)) {
            setDocBoxValidator(true);
            toast.error(`${t("Must need to select one action from each Document")}`);
            return;
        } 
        if (statusId === 3) { 
            const existRejectedAndNoRemark = submitDoc && submitDoc.some((doc: any) => doc.STATUS_ID === 4);
            if (existRejectedAndNoRemark) {
                setDocBoxValidator(true);
                toast.error(`${t("All documents selected must be approved inorder to approve the operation registration request.")}`);
                return;
            }
        } else {
            const existRejectedAndNoRemark = submitDoc && submitDoc.some((doc: any) => doc.STATUS_ID === 4 && !doc.REMARKS);
            if (existRejectedAndNoRemark) {
                setDocBoxValidator(true);
                toast.error(`${t("Rejection Remarks are Mandatory")}`);
                return;
            } 
        }
        setDocBoxValidator(false);


        const changeStatusParams = {
            TransId: rowData ? rowData?.ID_ : -1,
            UserId: userID,
            StatusId: statusId,
            Remarks: inputValue,
            Docs: submitDoc,
            CultureId: lang
        }

        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('Operator registration requests')}`,
            description: `${t('Do you wish to save this Data?')}`,
            confirmBtnLabel: `${t('Save')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });

        if (choice) {

            let response;
            response = await ApiService.httpPost('operator/saveStatus', changeStatusParams);
            if (response && response.Id > 0) {
                dispatch(setUpdateRow({ action: 'actionQueue', payload: { response, type: 'update' } }))
                dispatch(updateMyActionBadge({ action: 'badgeCount', payload: {} }))
                fullviewRowAddUpdate(response.Id);
                toast.success(response.Message);
                onCloseDialog(true);
            } else {
                toast.error(response.Message);
            }
        }

    };



    return (
        <>
            <DialogTitle sx={{ m: 0 }} className={`dialog_title_wrapper bg-col px-2 py-1`}>
                <Row className="no-gutters justify-content-between align-items-center">
                    <Col md={6} className="name-sec-title">
                        <p className="dialog_title">
                            <div className="transNo">
                                {t("Operator registration requests")}
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

                            </Col>
                            <Col md={1} className="crr-head-close-bttn-sec">
                                <IconButton
                                    aria-label="close"
                                    className="crr-head-close-bttn"
                                    onClick={() => dialogClose(transid)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DialogTitle>


            <DialogContent dividers className={`dialog-content-wrapp pure-bg py-1 px-4 ${transid ? 'pageView' : 'dialog'}`}>
                {!browseLoader ? <div className="OperatorRegistrationView">
                    <div className="date-sec">
                        {t("Created Date")} : <span>
                            <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={headerList?.CREATED_TIME} /> </span>
                    </div>
                    {/* <div className="summary-details-sec"> */}
                    {/* <div className="summary-sec">
                            <div className="title-sec">{t("Status Summary")}</div>
                            
                        </div> */}


                    <Row>
                        <Col md={3}>
                            <TitleBox className={`h-100`} header={<>{t("Status Summary")}</>}
                                content={
                                    <>
                                        <Row className="my-3">
                                            <Col md={5}>
                                                <div className="stat"> {t("Current Status")} </div>
                                            </Col>
                                            <Col md={7}>
                                                <div className="stat-value">{headerList?.STATUS_NAME}</div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={5}>
                                                <div className="stat"> {t("Next Step")} </div>
                                            </Col>
                                            <Col md={7}>
                                                <div className="stat-value">{headerList?.NEXT_STATUS_NAME || '-----------'}</div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <div className="stat"> {t("Remarks")} </div>
                                            <Col md={12}>
                                                <div className="remark-scoller">
                                                    <div className="stat-value">{headerList?.STATUS_REMARKS}</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                }
                            />
                        </Col>
                        <Col md={9}>
                            <TitleBox header={<>{t("Company Details")}</>}
                                content={
                                    <>
                                        <Row className="my-3 mx-0">
                                            <Col md={6}>
                                                <Row>
                                                    <div className="stat"> {t("Company Name English")} </div>
                                                    <div className="stat-value">{headerList?.TRADE_NAME}</div>
                                                </Row>
                                            </Col>
                                            <Col md={6}>
                                                <Row>
                                                    <div className="stat"> {t("Company Name Arabic")} </div>
                                                    <div className="stat-value">{headerList?.TRADE_NAME_AR}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3 mx-0">
                                            <Col md={9}>
                                                <Row className="mb-3 ">
                                                    <Col md={4}>
                                                        <div className="stat">{t("License No")} </div>
                                                        <div className="stat-value">{headerList?.LICENCE_NO}</div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="stat">{t("License Issue Date")} </div>
                                                        <div className="stat-value">
                                                            <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={headerList?.LICENSE_ISSUE_DATE} />
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="stat">{t("License Expiry Date")} </div>
                                                        <div className="stat-value">
                                                            <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={headerList?.LICENSE_EXPIRY_DATE} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4} className="mb-3">
                                                        <div className="stat">{t("Legal Name Arabic")} </div>
                                                        <div className="stat-value">{headerList?.LEGAL_FORM_AR}</div>
                                                    </Col>
                                                    <Col md={4} className="mb-3">
                                                        <div className="stat">{t("Legal Name English")} </div>
                                                        <div className="stat-value">{headerList?.LEGAL_FORM}</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={8}>
                                                        <Row className="group-item d-flex">
                                                            <Col md={6}>
                                                                <div className="stat">{t("Entity")} </div>
                                                                <div className="stat-value">{headerList?.ENTITY_NAME}</div>
                                                            </Col>
                                                            <Col md={6}>
                                                                <div className="stat">{t("Sub Entity")} </div>
                                                                <div className="stat-value">{headerList?.SUB_ENTITY_NAME}</div>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col md={4}></Col>
                                                </Row>
                                            </Col>
                                            <Col md={3}>
                                                <div className="logo-rec-wrap">
                                                    <div className="logo-sec" style={{ backgroundImage: `url(${logoImg})` }}>  </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                }
                            />
                        </Col>
                    </Row>
                    <Row className="my-4">
                        <Col md={6} className="partner-info">
                            <TitleBox className={`h-100`} header={<>{t("Partner Information")}</>}
                                content={
                                    <Row className="no-gutters">
                                        <Col md={12} className="my-3">
                                            <Row className="scoll-block-box">
                                                {partnerInfo &&
                                                    partnerInfo.map((partner: any, index: number) => (
                                                        <PartnerCard partner={partner} key={index} />
                                                    ))
                                                }
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                        <Col md={6}>
                            <TitleBox className={`h-100`} header={<>{t("Activity Details")}</>}
                                content={
                                    <Row className="no-gutters">
                                        <Col md={12} className="my-3">
                                            <Row className="scoll-block-box">
                                                {activityInfo && activityInfo.map((item: any, index: any) => (
                                                    <Col md={6} key={index} className="activity-sec pt-1">
                                                        <div className="each-activity">
                                                            <div className="activity-status-sec">
                                                                <div className="stat-value">{item?.ACTV_CODE}</div>
                                                            </div>
                                                            <div className="activity-status-sec">
                                                                <div className="stat-value">{item?.ACTV_DESC}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="my-4">
                        <Col md={12} className={`partner-info ${docBoxValidator ? 'box-border-error' : ''}`}>
                            <TitleBox className={`h-100`} header={<>{t("Documents")}</>}
                                content={
                                    <Row className="no-gutters">
                                        <Col md={12} className="my-3 p-0">
                                            <div className="doc-details">
                                                <div className="table-wrapper">
                                                    <div className="status-table">
                                                        <div className="status-table-header">
                                                            <div className="each-item">{t("Document Name")}</div>
                                                            <div className="each-item">{t("Remarks")}</div>
                                                            <div className="each-item">{t("View")}</div>
                                                            {rowData?.ACTION_TYPE_ID_ === 32601 && <div className="each-item">{t("Action")}</div>}
                                                            {rowData?.ACTION_TYPE_ID_ === 32601 && <div className="each-item">{t("Status Remarks")}</div>}

                                                        </div>
                                                        {viewDoc?.length > 0 && viewDoc.map((item: any, index: any) => (
                                                            <DocumentTableRow item={item} key={index} onValueSubmit={handleOnValueSubmit} />
                                                        ))}
                                                        {viewDoc?.length === 0 &&
                                                            <div className="nodata pt-2">{t("No Data")}</div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                    </Row>


                    <Row className="my-4">
                        <Col md={12} className="status-log-sec">
                            <TitleBox className={`h-100`} header={<>{t("Status Log")}</>}
                                content={
                                    <Row className="no-gutters">
                                        <Col md={12} className="my-3 p-0">
                                            <div className="table-wrapper">
                                                <div className="status-table">
                                                    <div className="status-table-header">
                                                        <div className="each-item">{t("User Name")}</div>
                                                        <div className="each-item">{t("Status")}</div>
                                                        <div className="each-item">{t("Time")}</div>
                                                        <div className="each-item">{t("Status Remarks")}</div>
                                                    </div>
                                                    {operatorView?.length > 0 && operatorView.map((item: any, index: any) => (
                                                        <div className="status-table-body" key={index}>
                                                            <div className="each-item">{item?.USER_FULL_NAME}</div>
                                                            <div className="each-item">{item?.STATUS_NAME}</div>
                                                            <div className="each-item">
                                                                {new Date(item?.STATUS_TIME).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).split('/').join('-')}
                                                            </div>
                                                            <div className="each-item">{item?.STATUS_REMARKS}</div>
                                                        </div>
                                                    ))}
                                                    {operatorView?.length === 0 &&
                                                        <div className="nodata pt-2">{t("No Data")}</div>
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="my-4">
                        <Col md={12} className="stat-remarks">
                            <TitleBox className={`h-100`} header={<>{t("Status Remarks")}</>}
                                content={
                                    <Row className="no-gutters">
                                        <Col md={12} className="my-2 p-0">
                                            {rowData?.ACTION_TYPE_ID_ === 32601 && <textarea
                                                className="stat-remark w-100"
                                                minLength={5}
                                                placeholder={t("Status Remarks") ?? "Status Remarks"}
                                                // value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                            />}

                                            {rowData?.ACTION_TYPE_ID_ !== 32601 && <div className="stat-remarks-sec">{headerList?.STATUS_REMARKS}</div>}
                                        </Col>
                                    </Row>
                                }
                            />
                        </Col>
                    </Row>
                </div> : <OperatorViewSkelton />}
            </DialogContent >

            <DialogActions className="dialog-action-buttons justify-content-between px-3">

                <div className="opr-btn">
                    {rowData?.ACTION_TYPE_ID_ === 32601 &&
                        viewButtons &&
                        viewButtons.map((btn: any, index: any) => (
                            <Button
                                type="submit"
                                variant="contained"
                                className={`${btn.STATUS_TYPE === 30102 ? "rejct-red" : "approve-green"}`}
                                key={index}
                                onClick={() => onClickChangeStatus(btn.STATUS_ID)}
                            >
                                {btn.ACTION_NAME}
                            </Button>
                        ))
                    }
                    <Button autoFocus onClick={() => dialogClose(transid)}>
                        {t("Close")}
                    </Button>
                </div>
            </DialogActions>
        </>
    )
}