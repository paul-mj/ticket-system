import { Col, Row } from "react-bootstrap";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { useFormContext } from "react-hook-form";
import { validateFile } from "../../core/validators/fileValidator";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../common/application/api.config";
import { Url } from "../../core/services/axios/api";
import { FileUpload, Pen } from "../../assets/images/svgicons/svgicons";
import ViewIconButton from "../../shared/components/Buttons/IconButtons/ViewIconButton";
import DeleteIconButton from "../../shared/components/Buttons/IconButtons/DeleteIconButton";
import { useConfirm } from "../../shared/components/dialogs/confirmation";
import { useEffect, useState } from "react";
import { ReactFileViewer } from "../../shared/components/dialogs/Preview/react-file-viewer";
import { useTranslation } from "react-i18next";
import { Pdf } from "../../assets/images/file/fileicon";
import { ImageComponent } from "../../shared/components/DocsView/docs";
import { CircularProgress } from "@mui/material";



export const Documents = (props: any) => {
    const { docBoxValidator } = props;
    const methods = useFormContext();
    const confirm = useConfirm();
    const [previewParam, setPreviewParam] = useState({
        popupOpenState: false,
        image: null
    });
    const [visibleStatusRemarks, setStatusRemarks] = useState(false);
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const docsList = methods.getValues().Docs;
        const showStatusRemarks = docsList.some((y: any) => y.STATUS_ID === -1 || y.STATUS_ID === 4);
        setStatusRemarks(showStatusRemarks);
    }, [])



    const handleColumnImageSelect = async (files: any, doc: any) => {
        const config = window['config'];
        const file = files[0];
        if (file) {
            const result = await validateFile(files[0], config.ValidateAllExtension, config.uploadFileSize);
            if (result.valid) {
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64 = reader.result;
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                        setIsLoading(true);
                        const response = await uploadDocument(formData);
                        handleUploadResponse(response, doc, base64, file.type.split('/')[1]);
                    } catch (error) {
                    } finally {
                        setIsLoading(false);
                    }
                };

                reader.readAsDataURL(file);
            } else {
                toast.error(result.message);
            }
        }
    };

    const uploadDocument = async (formData: FormData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(Url(API.writeDoc), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    };


    const handleUploadResponse = async (response: any, doc: any, base64: any, type: any) => {
        if (response && response.data.Id > 0) {
            const updatedDocs = methods.getValues().Docs.map((item: any) => {
                if (item.DOC_ID === doc?.DOC_ID) {
                    return {
                        ...item,
                        base64File: base64,
                        type: type,
                        DOC_NAME: response.data.Message,
                    };
                }
                return item;
            });

            await methods.setValue('Docs', updatedDocs, {
                shouldDirty: true,
                shouldValidate: true,
            });
        } else {
            // Handle response errors
        }
    };


    const removeImage = async (doc: any) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to delete this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            doc.DOC_NAME = null;
        }
    };

    const handleImageView = (image: any) => {
        setPreviewParam({
            popupOpenState: true,
            image: image
        })
    };

    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }



    return (
        <>
            {
                methods.getValues().Docs?.length ?
                    <div className={`block__wrap ${docBoxValidator ? 'box-border-error' : ''} `}>
                        <Row>
                            <Col md={12}>
                                <h4 className="block__heading">Document</h4>
                            </Col>
                            <div className="table-wrapper">
                                <div className="table-outer doc-table">
                                    <div className="table-header">
                                        <div className="element">Document Type</div>
                                        <div className="element">Remarks</div>
                                        <div className="element">{visibleStatusRemarks ? 'Status' : 'Status Remarks'}</div>

                                        <div className="element">Actions</div>
                                    </div>
                                    {
                                        methods.getValues().Docs.map((doc: any, index: number) => (
                                            <div className="table-body" key={index}>

                                                <div className="element">
                                                    {doc?.DOC_TYPE_NAME}
                                                </div>

                                                <div className="element">
                                                    {doc?.REMARKS}
                                                </div>



                                                <div className="element">
                                                    {
                                                        !(doc?.STATUS_ID === -1 || doc?.STATUS_ID === 4) ?
                                                            <FormInputText
                                                                name={`Docs[${index}].STATUSREMARKS`}
                                                                control={methods.control}
                                                                label="Status Remarks"
                                                                errors={methods.formState.errors}
                                                                hideError={true}
                                                            />
                                                            :
                                                            <p className={`m-0 ${!(doc?.STATUS_ID === 4) && 'Submitted'}`}>
                                                                {!(doc?.STATUS_ID === 4) && 'Submitted'}
                                                            </p>
                                                    }
                                                </div>



                                                <div className="element">
                                                    <Row className="w-100 align-items-center justify-content-center doc-row-upload">
                                                        {/* {
                                                            !(doc?.STATUS_ID === -1 || doc?.STATUS_ID === 4) && */}
                                                        <Col md={3}>
                                                            <div className="inline-upload">
                                                                <label htmlFor={`upload-file-${index}`} className="upload-button">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*, application/pdf"
                                                                        onChange={(e) => handleColumnImageSelect(e.target.files, doc)}
                                                                        id={`upload-file-${index}`}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                    {
                                                                        isLoading ?
                                                                            <CircularProgress className="upload-circular-load" size={20} /> :
                                                                            !doc?.base64File && !doc?.DOC_NAME ? <img src={FileUpload} alt="" className="upld" /> : <img src={Pen} alt="" className="pen" />
                                                                    }

                                                                </label>
                                                            </div>
                                                        </Col>
                                                        {/* } */}
                                                        <Col md={6}>
                                                            <div className="row align-items-center justify-content-center">
                                                                {
                                                                    isLoading ?
                                                                        <p className="m-0 uploading-p">Uploading...</p> :
                                                                        (doc?.base64File) && (
                                                                            <div className="image-preview">
                                                                                {
                                                                                    doc?.type === 'png' || doc?.type === 'jpg' || doc?.type === 'jpeg' ?
                                                                                        <img key={doc?.base64File} src={doc?.base64File} alt="" /> :
                                                                                        <ImageComponent image={{ ext: doc?.type }} />
                                                                                }
                                                                            </div>
                                                                        )
                                                                }
                                                            </div>
                                                        </Col>

                                                        <Col md={3}>
                                                            {doc?.DOC_NAME && (
                                                                <Row className="align-items-center justify-content-end">
                                                                    <ViewIconButton onClick={() => handleImageView(doc)} />
                                                                    {/* {
                                                                        !(doc?.STATUS_ID === -1 || doc?.STATUS_ID === 4) &&
                                                                        <DeleteIconButton onClick={() => removeImage(doc)} />
                                                                    } */}
                                                                </Row>
                                                            )}

                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        ))

                                    }

                                </div>
                            </div>
                        </Row>
                    </div>
                    :
                    <></>
            }
            <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>

        </>
    )
}