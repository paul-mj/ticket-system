import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Menu,

} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import { Col, Row } from "react-bootstrap";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import { v4 as uuidv4, v4 } from "uuid";
import { toast } from "react-toastify";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import ApiService from "../../../core/services/axios/api";
import { useConfirm } from "../../../shared/components/dialogs/confirmation";
import "./mail-template.scss"
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import { MenuId, fullGridDataAction } from "../../../common/database/enums";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import axios from "axios";
import { validateFile } from "../../../core/validators/fileValidator";
import { AiOutlineLoading } from "react-icons/ai";
import { ViewMailTemplate } from "./ViewMailTemplate";


export interface FranchiseRequestDialogProps {
    onCloseDialog: (value: boolean) => void;
    popupConfiguration: any;
}



export const MailTemplate = (props: FranchiseRequestDialogProps) => {
    const { t, i18n } = useTranslation();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const { onCloseDialog, popupConfiguration } = props;
    const confirm = useConfirm();
    const IdInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<any>();
    const { gridActionChangeEvent } = useContext(DataGridActionContext);
    const currentPage = popupConfiguration && popupConfiguration.action.MenuId;
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [editValue, setEditValue] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [downLoadVisible, setdownLoadVisible] = useState<boolean>(true);

    const validationSchema = yup.object().shape({

        tempNameEn: yup.string().required(''),
        tempNameAr: yup.string().required(''),
        subjText: yup.string().required(''),
        headText: yup.string().required(''),
    });

    const [manageDialog, setManageDialog] = useState<any>({
        open: '',
        onclose: null
    })

    const viewTemplateClick = () => {
        setManageDialog({ open: "View" })
    }

    const closeDialog = async () => {
        setManageDialog({ open: null });
    };
    const divRef = useRef(null);
    const { reset, handleSubmit, control, setValue, formState: { errors } } = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            tempNameEn: '',
            tempNameAr: '',
            subjText: '',
            headText: '',
            Active: true
        }
    });

    const fullviewRowAddUpdate = (responseId: number) => {
        gridActionChangeEvent({
            id: responseId,
            status:
                currentPage === MenuId.New
                    ? fullGridDataAction.InsertRow
                    : fullGridDataAction.UpdateRow,
        });
        //  onCloseDialog(true);
    };
    const [selectedColumnFile, setSelectedColumnFile] = useState<any>({
        file: '',
        fileName: '',
        fileExtension: '',
        fileHTML: ''
    });

    useEffect(() => {
        if (activeAction.MenuId === MenuId.View) {
            setViewMode(true);
        }
        EditData();
    }, [])

    const EditData = async () => {
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            const Param = {
                Procedure: "FRM_MASTER.EMAIL_TEMPLATES_SPR",
                CultureId: lang,
                Criteria: [{
                    Name: "@ID",
                    Value: rowData?.ID_,
                    IsArray: false
                }]
            };
            try {
                setLoading(true);
                const [emailTemplate] =
                    await axios.all([
                        ApiService.httpPost('data/getRow', Param)
                    ]);
                console.log(emailTemplate);
                setLoading(false);
                if (emailTemplate.Valid > 0) {
                    const resetVal = {
                        tempNameEn: emailTemplate?.Data.TEMPLATE_NAME_EN,
                        tempNameAr: emailTemplate?.Data.TEMPLATE_NAME_AR,
                        subjText: emailTemplate?.Data.SUBJECT_TEXT,
                        headText: emailTemplate?.Data.HEADER_TEXT,
                        Active: emailTemplate?.Data.IS_ACTIVE
                    }
                    reset(resetVal);
                    const divContent = emailTemplate?.Data.TEMPLATE;

                    const blob = new Blob([divContent], { type: "text/html" });

                    //  selectedColumnFile.file = URL.createObjectURL(blob);
                    selectedColumnFile.file = blob;
                    selectedColumnFile.fileHTML = emailTemplate?.Data.TEMPLATE;
                    setEditValue(true);
                }
            } catch (e) {
                console.error(e);
                setLoading(false);

            }
        }
    }
    function openDivInBrowser() {
        const divContent = selectedColumnFile.file;
        const blob = new Blob([divContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        // Open the URL in the current window
        window.open(url, "_blank");

        // Cleanup
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 0);
    }


    function downloadDiv() {
        // if(selectedColumnFile.file)

        const divContent = selectedColumnFile.file;
        const blob = new Blob([divContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "Template.html";
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 0);
    }

    const onSubmit = handleSubmit(async (data: any) => {
        if ((selectedColumnFile?.fileName === '' || selectedColumnFile?.fileName === null) && !editValue) {
            toast.error(`${t("Select Template")}`);
            return
        }
        const jSon = {
            UserId: userID,
            Data: {
                ID: editValue ? rowData.ID_ : -1,
                TEMPLATE_CODE: '',
                TEMPLATE_NAME_EN: data?.tempNameEn,
                TEMPLATE_NAME_AR: data?.tempNameAr,
                SUBJECT_TEXT: data?.subjText,
                HEADER_TEXT: data?.headText,
                TEMPLATE: '',
                IS_ACTIVE: data?.Active ? 1 : 0,
                IS_REPLY_TEMPLATE: 0
            }
        }
        const formData = new FormData();
        formData.append('json', JSON.stringify(jSon));
        formData.append('file', selectedColumnFile.file ? selectedColumnFile.file : null);
        const choice = await confirm({
            ui: 'confirmation',
            title: `${t('You Are About To Save')}`,
            description: `${t('Are you sure you want to Save this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            try {
                const response = await ApiService.httpPost('emailTemplate/saveMailTemplate', formData);
                console.log(response);
                if (response?.Id > 0) {
                    fullviewRowAddUpdate(response.Id);
                    if (editValue) {
                        onCloseDialog(true);
                    }
                    reset();
                    selectedColumnFile.file = '';
                    selectedColumnFile.fileName = '';
                    selectedColumnFile.fileExtension = '';
                    toast.success(response?.Message);
                } else {
                    toast.error(response?.Message);
                }
            } catch (e: any) {

            }
        }
    })


    const selectHtmlFile = async (event: any) => {
        const file = event.target.files[0];
        //  setFileName(file.name)
        if (!file) {
            // handle null or undefined file
            return;
        }

        const fileName = file.name.split('.');
        const extension = fileName.length ? fileName[fileName.length - 1] : '';
        const docname = v4() + '.' + file?.name.split('.').pop();
        const result = await validateFile(file, ['html', 'htm'], 5);
        /*  if (extension !== 'html' && extension !== 'htm') {
             toast.error("Select html file");
             event.target.value = null; // reset file input field
             return;
         } */

        if (result.valid && file) {
            const reader = new FileReader();
            // reader.readAsDataURL(file);
            reader.onload = (e) => {
                const htmlText = e.target?.result;
                // Do something with the HTML text
                console.log(htmlText);
                setSelectedColumnFile({ fileHTML: htmlText, fileName: file.name, file: file, fileExtension: extension, })

            };
            reader.readAsText(file);

            console.log(file.name);
            /* setSelectedColumnFile({
                file: file,
                fileName: file.name,
                fileExtension: extension,
               
            }) */
            setdownLoadVisible(false);
        } else {
            toast.error(result.message);
        }

        // handle selected HTML file

    };
    const columnUploadButton = () => {
        IdInputRef.current?.click();
    }
    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                <p className="dialog_title">
                    <PixOutlinedIcon className="head-icon" />
                    <span className="mx-2">
                        {popupConfiguration && popupConfiguration.DialogHeading}
                    </span>
                </p>
                <IconButton
                    aria-label="close"
                    className="head-close-bttn"
                    onClick={() => onCloseDialog(true)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers className="dialog-content-wrapp " style={{ "minHeight": "250px" }}>
                {isLoading ?

                    <div className="loader">
                        {/*  <ReactLoading type="spin" color="#00BFFF" height={40} width={40} />
                        <AiOutlineLoading className="icon" /> */}
                    </div>
                    :
                    <Row>
                        <div className="outlined-box ">
                            <h5 className="outlined-box-head my-3">
                            </h5>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="tempNameAr"
                                    control={control}
                                    label={t("Template Name in Arabic")}
                                    errors={errors}
                                    align={{ textAlign: 'right' }}

                                    readOnly={viewMode}
                                />
                            </Col>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="tempNameEn"
                                    control={control}
                                    label={t("Template Name in English")}
                                    errors={errors}
                                    readOnly={viewMode}
                                />
                            </Col>

                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="headText"
                                    control={control}
                                    label={t("Header")}
                                    errors={errors}
                                    readOnly={viewMode}
                                />
                            </Col>


                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="subjText"
                                    control={control}
                                    label={t("Subject")}
                                    errors={errors}
                                    readOnly={viewMode}
                                />
                            </Col>
                            <Col md={12} className="mb-3 upload-sec  justify-content-between ">

                                {!viewMode &&
                                    <Button className="upload-btn-wrap" onClick={columnUploadButton} startIcon={<FileUploadOutlinedIcon />}>
                                        <input style={{ display: 'none' }} ref={IdInputRef} type="file" id="fileInput" accept=".html,.htm" onChange={selectHtmlFile} />
                                        {t("Upload")}
                                    </Button>
                                }
                                <p className="file-name">{selectedColumnFile.fileName} </p>
                                {editValue &&
                                    <div className="d-flex justify-content-end">
                                        {downLoadVisible &&
                                            <div>
                                                <Button className="download-btn-wrap mx-3" startIcon={<FileDownloadOutlinedIcon />} onClick={downloadDiv}>{t("Download")}</Button>
                                            </div>
                                        }
                                        <div>
                                            <Button className="download-btn-wrap" onClick={viewTemplateClick} startIcon={<RemoveRedEyeOutlinedIcon />}>{t("View")}</Button>
                                        </div>
                                    </div>
                                }

                            </Col>

                        </div>



                    </Row>

                }
            </DialogContent>

            <DialogActions className="dialog-action-buttons">
                <Row className="w-100 justify-content-between no-gutters">
                    <Col md={6}>
                        <FormInputCheckbox
                            name="Active"
                            control={control}
                            label={t("Active")}
                            errors={errors}
                            disabled={viewMode}
                        />
                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end">
                            <Button
                                autoFocus
                                onClick={() => onCloseDialog(true)}
                                className="mx-3"
                            >
                                {t("Close")}
                            </Button>
                            {!viewMode &&
                                < Button
                                    type="submit"
                                    variant="contained"
                                    className="colored-btn"
                                    onClick={onSubmit}
                                >
                                    {t("Save")}
                                </Button>
                            }
                        </div>
                    </Col>
                </Row>
            </DialogActions>

            <ViewMailTemplate open={manageDialog.open === "View"} onClose={closeDialog} mailcontent={selectedColumnFile.fileHTML} />
        </>
    )
}
