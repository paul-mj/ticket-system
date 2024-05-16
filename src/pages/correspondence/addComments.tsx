import { Button, Dialog, DialogContent, DialogTitle, IconButton, Box, Tab, DialogActions, LinearProgress } from "@mui/material"
import React, { useContext, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import localStore from "../../common/browserstore/localstore";
import { CultureId } from "../../common/application/i18n";
import TinyMceEditor from "./tiny-mce";
import { LimitTagsGroupController } from "../../shared/components/form-components/FormAutoCompleteGroupSearchChip";
import ApiService, { Url } from "../../core/services/axios/api";
import { CorrespondanceEditorContext, fullViewRowDataContext } from "../../common/providers/viewProvider";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SwitchField } from "../../shared/components/form-components/FormSwitch";
import {  UploadSvg } from "../../assets/images/svgicons/svgicons"; 
import { FormattedRecipientList, SaveCommentLogType, FormattedAttachmentList } from "./correspondence-param-formatter";
import { toast } from "react-toastify"; 
import { Col, Row } from "react-bootstrap"; 
import { validateFile } from "../../core/validators/fileValidator";
import { v4 as uuidv4, v4 } from "uuid";
import axios from "axios"; 
import { useTranslation } from "react-i18next"; 
import "./../../../src/scss/attchmentshow.scss";
import AttachmentUpload from "../../shared/file-controler/attachment-upload/attachment-upload";
import { updateConfig } from "../../redux/reducers/common.reducer";
import { useDispatch } from "react-redux";



type Image = {
    id: string;
    src: string;
    fileName: string;
    file: any;
    ext: any;
    isExist: boolean;
};


export const AddCommentsDialog = (props: any) => {
    const { open, onClose, popupConfigurationView, formattedResponse, extraData } = props;
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const [scroll, setScroll] = React.useState("paper");
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const [optionsrecipts, setOptionsrecipts] = useState<any>(); 
    const userID = userData && JSON.parse(userData).USER_ID;
    const franchiseId = extraData?.franchiseId ? extraData?.franchiseId : userData && JSON.parse(userData).FRANCHISE_ID;
    const [resetChildItems, setResetChildItems] = useState(false);
    const [tinyLanguage, setIsTinyLanguage] = useState(true); // change this based on current lang
    const [selectedFiles, setSelectedFiles] = useState<any>([]);
    const [showDropDiv, setShowDropDiv] = useState(false);
    const [images, setImages] = useState<Image[]>([]);
    const [progress, setProgress] = useState(0);
    const [imageLoader, setImageLoader] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const { t, i18n } = useTranslation(); 
    const dispatch = useDispatch();

    let validationSchema = yup.object().shape({
        LanguageSwitcher: yup.boolean().required(""),
        TransContent: yup.string().required(""),
        configureRole: yup.boolean(),
        Receipts: yup.array().when('configureRole', {
            is: false,
            then: yup.array().min(1).required(),
            otherwise: yup.array().notRequired(),
        }),
    });

    const methods = useForm<any>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            LanguageSwitcher: true,
            TransContent: "",
            configureRole: true,
            Receipts: [],
            Attachments: []
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors }
    } = methods

    const handleAutocompleteReceiptsChange = async (newInputValue: any) => {
        console.log(newInputValue);
        const param = {
        }
        const response = await ApiService.httpPost('', param);
        /* Call API And Set Response */
        //setOptionList(optionListResponse)
    }

    const resetTinyExpansion = () => {
    };
    const handleFormInputChange = (name: any, value: any) => {
        setValue(name, value);
    }

    const handleOnEditorChange = (event: any) => {
        setIsTinyLanguage(event);
    }

    const onCloseHandle = (e: any) => {
        onClose(e)
        setImages([])
        setValue('TransContent', '')

    }
    useEffect(() => {
        handleDropDownChange();
        if (formattedResponse && formattedResponse?.defReceipient) {
            setValue('Receipts', formattedResponse?.defReceipient)
        }
    }, [saveSuccess]);


    const handleDropDownChange = async () => {
        const recipientsParam = {
            UserId: userID,
            CultureId: lang,
            ServiceType: null,
            TransId: rowData ? rowData?.ID_ : null, // TransiD based on Row Data,
        }
        const response = await ApiService.httpPost('trans/getRecipients', recipientsParam);
        setOptionsrecipts(response.Data)
        console.log(response)
        /* Call API And Set Response */
        //setOptionList(optionListResponse)
    }

    const [manageDialog, setManageDialog] = useState<any>({
        open: '',
        onclose: null
    })

    const viewConfigClick = () => {
        setManageDialog({ open: "View" })
    }

    const closeDialog = async () => {
        setManageDialog({ open: null });
    };


    const onSubmit = (data: any) => onSubmitUserCreate(data);

    const onSubmitUserCreate = async (data: any) => {

        console.log(data)
        if (data.Attachments && data.Attachments?.length) {
            try {
                setImageLoader(true);
                const attachmentList: any[] = [];
                let totalProgress: number = 0;

                for (let i = 0; i < data.Attachments.length; i++) {
                    if (data.Attachments[i].file) {
                        const formData = new FormData();
                        formData.append(`file`, data.Attachments[i].file);

                        const onUploadProgress = (progressEvent: any) => {
                            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                            totalProgress += progress;
                            setProgress(Math.min(Math.round(totalProgress / data.Attachments.length), 100));
                        }

                        const response = await axios.post(Url('file/writeDoc'), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            onUploadProgress,
                        });
                        if (response && response.data.Id > 0) {
                            const attachment = {
                                ID: null,
                                SORT_ORDER: i + 1,
                                ATTACHMENT_NAME: response && response.data.Message,
                                ATTACHMENT_PATH: response && response.data.Message.substring(0, response.data.Message.lastIndexOf("\\")),
                                DISPLAY_NAME: data.Attachments[i].DISPLAY_NAME,
                                TASK_ID: rowData.TASK_ID_ ? rowData.TASK_ID_ : null
                            };
                            attachmentList.push(attachment);
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                setImageLoader(false);
                saveComment(data, attachmentList);
            } catch (error) {
                console.error(error);
            } finally {
            }

        } else {
            saveComment(data);
        }
    }

    const saveComment = async (data: any, attachmentList?: any) => {
        console.log(data)
        const param = {
            UserId: userID,
            StatusId: 2,
            CultureId: lang,
            Data: {
                TRANS_ID: rowData ? rowData?.ID_ : -1,
                LOG_TYPE: SaveCommentLogType(popupConfigurationView.MasterId),
                FRANCHISE_ID: franchiseId ? franchiseId : null,
                SEND_TO_CONFIGURED_ROLES: 0,
                CONTENT_EDITOR_CULTURE_ID: 0, //data.LanguageSwitcher ? 1 : 0,
                TRANS_CONTENT: data.TransContent,
                TASK_ID: rowData.TASK_ID_ ? rowData.TASK_ID_ : null
            },
            Recipients: FormattedRecipientList(data.Receipts),
            Attachments: attachmentList?.length ? FormattedAttachmentList(attachmentList) : [],
            Franchisee: []
        }

        const response = await ApiService.httpPost('trans/saveCommunication', param);
        if (response?.Id > 0) {
            toast.success(response?.Message, { autoClose: 2500 });
            reset(); 
            dispatch(updateConfig({ action: 'reloadTask', payload: { reloadTask: true } }))

            setSaveSuccess(true);
            onCloseHandle(true);


        } else {
            toast.error(response?.Message, { autoClose: 3000 })
        }
    }


    /* const handleDrop = (event: any) => {
        event.preventDefault();
        setShowDropDiv(false); // Reset showDropDiv state
        const files = Array.from(event.dataTransfer.files);
        setSelectedFiles((prevSelectedFiles: any) => [...prevSelectedFiles, ...files]);
    };

    const handleFileInputChange = (event: any) => {
        const files = Array.from(event.target.files);
        setSelectedFiles((prevSelectedFiles: any) => [...prevSelectedFiles, ...files]);
    }; */


    /* File Upload */
    const handleDrop = (event: any) => {
        event.preventDefault();
        setShowDropDiv(false); // Reset showDropDiv state 
        const files = Array.from(event.dataTransfer.files);
        handleColumnFileSelect(files)
        /*  setSelectedFiles((prevSelectedFiles: any) => [...prevSelectedFiles, ...files]); */
    };

    const handleFileInputChange = (event: any) => {
        const files = Array.from(event.target.files);
        handleColumnFileSelect(files)
        /* setSelectedFiles((prevSelectedFiles: any) => [...prevSelectedFiles, ...files]); */
    };

    const handleRemoveFile = (file: any) => {
        /* setSelectedFiles((prevSelectedFiles: any) =>
            prevSelectedFiles.filter((f: any) => f !== file)
        ); */
        const filteredImages = images.filter((image: any) => image !== file);
        setImages(filteredImages);
    };

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

    const IdInputRef = useRef<HTMLInputElement>(null);

    const columnUploadButton = () => {
        IdInputRef.current?.click();
    }

    const handleColumnFileSelect = async (files: any) => {
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await validateFile(file, ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'], 5);
                if (result.valid) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const id = v4();
                        const src = reader.result as string;
                        const fileName = file.name;
                        const ext = file?.name?.split(".").pop();
                        const isExist = false;
                        console.log(id);
                        setImages((prevImages) => [
                            ...prevImages,
                            { id, src, fileName, file, ext, isExist },
                        ]);
                    };

                    reader.readAsDataURL(file);
                } else {
                    toast.error(result.message);
                }
            }

        }
    };

    const [showPanel, setShowPanel] = useState(true);
    const handlePanelShow = () => {
        setShowPanel(prev => !prev);
    }





    return (
        <React.Fragment>
            <Dialog onClose={onCloseHandle}
                open={open}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper">
                    <div className="add-comments-heading">
                        <p className="dialog_title">
                            <span className="mx-2">{t("New Comment")}
                            </span>
                        </p>
                        <div className="switch-lang">
                          {/*   <div className="lang-name">{t("English")}</div>
                            <SwitchField name="LanguageSwitcher" control={control} label="" onChange={handleOnEditorChange} />
                            <div className="lang-name">{t("Arabic")}</div> */}
                        </div>
                    </div>
                    <IconButton
                        aria-label="close"
                        className="head-close-bttn"
                        onClick={() => onCloseHandle(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme: any) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="Dialog-body" dividers={scroll === "paper"}>
                    {showDropDiv && (
                        <div
                            onDragOver={(event) => event.preventDefault()}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className="drop-files-block"
                        >
                            {/* Your drop div content */}
                        </div>
                    )}
                    <div className="dialog-body-sec dialog-with-drop">
                        {/* <LimitTagsGroupController
                            name="Receipts"
                            control={control}
                            label={t("Recipients")}
                            placeholder={t("Type and Search")}
                            limitTags={5}
                            defaultValue={[]}
                            isOnchangeNew={false}
                            errors={errors}
                            optionList={optionsrecipts}
                            handleAutocompleteChange={handleAutocompleteReceiptsChange} /> */}

                        <CorrespondanceEditorContext.Provider value={{ width: 800, height: 600 }}>
                            <TinyMceEditor
                                control={control}
                                name="TransContent"
                                tinyLanguage={tinyLanguage ? 1 : 0}
                                resetChildItems={resetChildItems}
                                onFullscreenChange={resetTinyExpansion}
                                setValue={handleFormInputChange}
                            />
                        </CorrespondanceEditorContext.Provider>
                        <div className="attachments-section">
                            <FormProvider {...methods}>
                                <AttachmentUpload
                                    popupConfiguration={popupConfigurationView}
                                    showPanel={showPanel} />
                            </FormProvider>
                        </div>

                    </div>
                    {/* <ViewConfiguredRole open={manageDialog.open === "View"} onClose={closeDialog} serviceType={30401} /> */}
                </DialogContent>
                <DialogActions>
                    <DialogActions className="comment-action-buttons">
                        <div className="comment-head">
                            {/*  <SwitchField name="configureRole" control={control} label="Send To Configured Roles" />
                            <div className="view-config" onClick={viewConfigClick}>
                                <img src={Eye} alt="" />
                            </div> */}
                        </div>
                        <div className="comment-head">
                            <Button autoFocus onClick={() => onCloseHandle(false)}>{t("Cancel")}</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="colored-btn"
                                onClick={handleSubmit(onSubmit)}>
                                {t("Save")}
                            </Button>
                        </div>
                    </DialogActions>
                </DialogActions>

                {
                    imageLoader &&
                    <>
                        <div className="mail-save-box-wrapper">
                            <div className="mail-save-box-wrap">
                                <div className="loader-text">
                                    <Row className="align-items-center no-gutters">
                                        <Col md={2}>
                                            <div className="img-wrpp">
                                                <img src={UploadSvg} alt="" />
                                            </div>
                                        </Col>
                                        <Col md={10}>
                                            <Row className="justify-content-start align-items-center no-gutters">
                                                <Col md={12}>
                                                    <h4>{t("Uploading")}</h4>
                                                    <p>{t("Just give us a moment to process your file")}</p>
                                                </Col>
                                                <Col md={12} className="mt-5">
                                                    <div className="d-flex align-items-center justify-content-between w-100">
                                                        <div className="progress-bar">
                                                            <LinearProgress variant="determinate" value={progress} />
                                                        </div>
                                                        <p className="m-0 perce">{`${Math.round(progress)}%`}</p>
                                                    </div>

                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        <div className="mail-save-overlay"></div>
                    </>
                }
            </Dialog>
        </React.Fragment>


    )

}




