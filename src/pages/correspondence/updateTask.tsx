import { Button, Dialog, DialogContent, DialogTitle, IconButton, Box, Tab, DialogActions, LinearProgress } from "@mui/material"
import React, { useContext, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import ApiService, { Url } from "../../core/services/axios/api";
import { CorrespondanceEditorContext, fullViewRowDataContext, taskRefreshContext } from "../../common/providers/viewProvider";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"; 
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap"; 
import { validateFile } from "../../core/validators/fileValidator";
import "./viewTask.scss"
import { FormInputSelect } from "../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { FormInputDate } from "../../shared/components/form-components/FormInputDate";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import { formatOptionsArray } from "../../common/application/shared-function";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import ViewIconButton from "../../shared/components/Buttons/IconButtons/ViewIconButton";
import DeleteIconButton from "../../shared/components/Buttons/IconButtons/DeleteIconButton";
import DownloadIconButton from "../../shared/components/Buttons/IconButtons/DownloadIconButton";
import { ImageComponent } from "../../shared/components/DocsView/docs";
import { AddComment, FileUpload } from "../../assets/images/svgicons/svgicons";
import { ReactFileViewer } from "../../shared/components/dialogs/Preview/react-file-viewer";
import { API } from "../../common/application/api.config";
import AttachmentUpload from "../../shared/file-controler/attachment-upload/attachment-upload";
import { AxiosError } from "axios";
import { AddCommentsDialog } from "./addComments";



type Image = {
    id: string;
    src: string;
    fileName: string;
    file: any;
    ext: any;
    isExist: boolean;
};


export const UpdateTask = (props: any) => {
    console.log(props, props)
    const { open, onClose, popupConfigurationView, editFormattedresponse } = props;
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [scroll, setScroll] = React.useState("paper");
    const lang = CultureId();
    const { t, i18n } = useTranslation();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const franchiseId = userData && JSON.parse(userData).FRANCHISE_ID;
    const [dropdownData, setDropdownData] = useState<any>();

    const [showDropDiv, setShowDropDiv] = useState(false);
    const [showImageDropDiv, setShowImageDropDiv] = useState(false);
    const [letterCount, setLetterCount] = useState(0);
    const [previewParam, setPreviewParam] = useState({
        popupOpenState: false,
        image: null
    });
    const confirm = useConfirm();

    const [commentsDialogStatus, setCommentsDialogStatus] = useState<any>({
        open: '',
        onclose: null

    })

    let validationSchema = yup.object().shape({
        Status: yup.string().required(""),
        Progress: yup.number().when('Status', {
            is: '7',
            then: yup.number()
                .typeError('')
                .required('')
                .max(100, '')
                .min(0, ''),
            otherwise: yup.number().transform((value: any) => 100).notRequired()
        }),
        Remarks: yup.string().required(''),
    });

    const methods = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            Status: "",
            Progress: "",
            CompletionDate: null,
            Remarks: "",
            Attachments: [],
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        trigger,
        reset,
        formState: { errors }
    } = methods

    useEffect(() => {
        setDropdownData(formatOptionsArray(props.statusList, 'ACTION_NAME', 'STATUS_ID'));
    }, [props.statusList]);

    const IdInputRef = useRef<HTMLInputElement>(null);
    const onCloseHandler = (e: any) => {
        reset();
        onClose(e);
    }
    const columnUploadButton = () => {
        IdInputRef.current?.click();
    }
    /* File Upload */
    const handleImageDrop = (event: any) => {
        event.preventDefault();
        setShowImageDropDiv(false); // Reset showDropDiv state 
        const files = Array.from(event.dataTransfer.files);
        handleColumnFileSelect(files)
    };
    const handleImageDragLeave = (event: any) => {
        event.preventDefault();
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('drop-files-block')) {
            setShowImageDropDiv(false);
        }
    };
    const handleDrop = (event: any) => {
        event.preventDefault();
        setShowDropDiv(false); // Reset showDropDiv state 
        const files = Array.from(event.dataTransfer.files);
        handleColumnFileSelect(files)
    };

    const handleFileInputChange = (event: any) => {
        const files = Array.from(event.target.files);
        handleColumnFileSelect(files)
    };


    /* Preview Selecred Images */
    const handleImageView = (image: any) => {
        setPreviewParam({
            popupOpenState: true,
            image: image
        })
    }

    const removeAttachment = async (index: number) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to delete this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const attachments = getValues().Attachments;
            attachments.splice(index, 1);
            setValue('Attachments', attachments);
            trigger();
        }
    }

    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }

    const handleDragEnter = (event: any) => {
        event.preventDefault();
        if (!event.target.classList.contains('drop-files-block')) {
            setShowDropDiv(true);
        }
    };

    const handleDragLeave = (event: any) => {
        event.preventDefault();
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('drop-files-block')) {
            setShowDropDiv(false);
        }
    };

    const handleColumnFileSelect = async (files: any) => {
        if (files && files.length > 0) {
            const attachments: any = getValues().Attachments || [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await validateFile(file, ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xlsx'], 5);
                if (result.valid) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const newImage = {
                            DISPLAY_NAME: file.name,
                            src: reader.result as string,
                            file: file,
                            ext: file?.name?.split(".").pop(),
                            isExist: false,
                            isAttachment: true,
                        };
                        attachments.push(newImage);
                        setValue("Attachments", attachments);
                        trigger('Attachments');
                    };

                    reader.readAsDataURL(file);
                } else {
                    toast.error(result.message);
                }
            }
        }
    };

    const fileUpload = async () => {
        const { Attachments } = getValues();
        try {
            const fork: any = []
            Attachments.forEach((item: any, index: number) => {
                const formData = new FormData();
                console.log(item.file)
                formData.append(`file`, item.file);
                fork.push({ url: API.writeDoc, method: 'post', data: formData })
            })
            const response = await ApiService.httpForkJoin(fork);
            return {
                response,
                request: Attachments
            }
        } catch (error) {
            return {
                response: [],
                request: Attachments
            }
        }
    }
    const onStatusChange = (e: any) => {
        trigger('Status');
        console.log(e)
    }
    const onClickChangeStatus = async () => {
        const isValid = await handleSubmit(async (data) => {
            console.log(data)
            const param: any = {
                CultureId: lang,
                FranchiseId: franchiseId,
                TaskId: rowData?.TASK_ID_,
                StatusId: data.Status,
                CmplPrnct: data.Progress,
                Remarks: data.Remarks,
                CmplDate: data.CompletionDate,
                UserId: userID,
                AssignedToUserId: 0,
                Attachments: []
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
            if (getValues().Attachments.length) {
                const { response: uploaderResponse, request: uploadRequest } = await fileUpload();
                const [hasError] = uploaderResponse;
                if (hasError instanceof AxiosError) {
                    toast.error(hasError?.response?.data?.Message, { autoClose: 3000 });
                    return
                } else {
                    uploaderResponse.forEach((element: any, index: number) => {
                        const { Message } = element;
                        param.Attachments.push({
                            ID: null,
                            TASK_ID: rowData?.TASK_ID_,
                            SORT_ORDER: index + 1,
                            ATTACHMENT_NAME: Message,
                            ATTACHMENT_PATH: Message.substring(0, Message.lastIndexOf("\\")),
                            DISPLAY_NAME: uploadRequest[index].DISPLAY_NAME
                        })
                    });
                }
            }
            const response = await ApiService.httpPost("trans/updateTaskStatus", param);
            if (response.Id > 0) {
                toast.success(response?.Message, { autoClose: 3000 });
                onCloseHandler(response);
            } else {
                toast.error(response?.Message, { autoClose: 3000 });
            }
        })();
    };

    const [showPanel, setShowPanel] = useState(true);
    const handlePanelShow = () => {
        setShowPanel(prev => !prev);
    }

    const onChangetextField = (event: any) => {
        setLetterCount(event.length);
    }

    const addComments = () => {
        setCommentsDialogStatus({ open: "View" })
    }
    
    const closeCommentsDialog = async (e: any) => { 
        setCommentsDialogStatus({ open: null }); 
    };


    return (
        <React.Fragment>
            <Dialog onClose={() => onCloseHandler(false)}
                open={open}
                fullWidth={true}
                maxWidth={'md'}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <div className="add-comments-heading">
                        <p className="dialog_title">
                            <span className="mx-2">{t("Update Status")}
                            </span>
                        </p>
                    </div>
                    <IconButton
                        aria-label="close"
                        className="head-close-bttn"
                        onClick={() => onCloseHandler(false)}
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
                <DialogContent className="Dialog-body" dividers={scroll === "paper"}>
                    {(showDropDiv || showImageDropDiv) && (
                        <div
                            onDragOver={(event) => event.preventDefault()}
                            onDragLeave={showDropDiv ? handleDragLeave : handleImageDragLeave}
                            onDrop={showDropDiv ? handleDrop : handleImageDrop}
                            className="drop-files-block"
                        >
                            {/* Your drop div content */}
                        </div>
                    )}
                    <Row className="no-gutters">
                        <Row md={9} className="p-0">
                            <Col md={4} className="mb-2">
                                <FormInputSelect
                                    name="Status"
                                    control={control}
                                    label={t("Status")}
                                    onChange={onStatusChange}
                                    // options={dropdownData.map((option: any) => ({
                                    //     label: option.STATUS_NAME,
                                    //     value: option.STATUS_ID
                                    // }))}
                                    options={dropdownData}
                                    errors={errors}
                                />
                            </Col>
                            {getValues().Status === 7 && <Col md={4} className="mb-3">
                                <FormInputText
                                    name="Progress"
                                    control={control}
                                    label={t("Progress %")}
                                    type="number"
                                    errors={errors}
                                />
                            </Col>}
                            <Col md={4} className="mb-3">
                                <FormInputDate
                                    name="CompletionDate"
                                    control={control}
                                    label={t("Status Date")}
                                    errors={errors}
                                    inputFormat="DD/MM/YYYY"
                                    maxDate={new Date()}
                                />
                            </Col>
                            <Col md={12} className="mb-3">
                                <FormInputText
                                    name="Remarks"
                                    control={control}
                                    label={t("Status Remarks")}
                                    errors={errors}
                                    multiline={true}
                                    minRows={5}
                                    maxLength={300}
                                    onChange={(e: any) => { onChangetextField(e) }}
                                />
                                <div className="d-flex pt-2 align-items-center justify-content-between">
                                    <button className="add-comment" onClick={addComments}>
                                        <img src={AddComment} alt="" />
                                        <div className="add-cmt">{t("Add Comments")}</div>
                                    </button>
                                    <p className="m-0">{letterCount}/300</p>
                                </div>
                            </Col>
                            <Col md={12} className="mb-3">
                                <div className="attachments-section">
                                    <FormProvider {...methods}>
                                        <AttachmentUpload
                                            showPanel={showPanel} />
                                    </FormProvider>
                                </div>

                            </Col>
                        </Row>
                    </Row>
                    <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>
                </DialogContent>
                <DialogActions>
                    <DialogActions className="">

                        <div className="comment-head">
                            <Button autoFocus onClick={() => onCloseHandler(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                onClick={() => onClickChangeStatus()}>
                                {t("Save")}
                            </Button>
                        </div>
                    </DialogActions> 
                </DialogActions> 
            </Dialog>


            {
                (editFormattedresponse && commentsDialogStatus.open === "View") && 
                    <AddCommentsDialog
                        open={commentsDialogStatus.open === "View"}
                        onClose={closeCommentsDialog}
                        popupConfigurationView={popupConfigurationView}
                        formattedResponse={editFormattedresponse} /> 
            }
            
        </React.Fragment>


    )

}


