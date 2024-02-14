import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileUpload } from "../../../assets/images/svgicons/svgicons";
import ImageShowCard from "../../components/UI/ImageCard/ImageCard";
import { useConfirm } from "../../components/dialogs/confirmation";
import { Col, Row } from "react-bootstrap";
import { ReactFileViewer } from "../../components/dialogs/Preview/react-file-viewer";
import { validateFile } from "../../../core/validators/fileValidator";
import { toast } from "react-toastify";
import { DownloadBlob } from "../../../common/application/shared-function";
import { useFormContext } from "react-hook-form";


interface AttachUploadProps {
    popupConfiguration?: any;
    showPanel?: boolean;
    cardSize?: number;
}

const AttachmentUpload = ({ popupConfiguration, showPanel, cardSize }: AttachUploadProps) => {
    const { t, i18n } = useTranslation();
    const confirm = useConfirm();
    const methods = useFormContext();
    const [showDropDiv, setShowDropDiv] = useState(false);
    const [previewParam, setPreviewParam] = useState({
        popupOpenState: false,
        image: null
    });
    const [showImageDropDiv, setShowImageDropDiv] = useState(false);
    const IdInputRef = useRef<HTMLInputElement>(null);



    const columnUploadButton = () => {
        IdInputRef.current?.click();
    }
    /* File Upload */
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

    const downloadAttachment = (image: any) => {
        DownloadBlob({ path: image.ATTACHMENT_NAME ? image.ATTACHMENT_NAME : image.DOC_NAME, name: image.DISPLAY_NAME });
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
            const attachments = methods.getValues().Attachments;
            attachments.splice(index, 1);
            methods.setValue('Attachments', attachments);
            methods.trigger();
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
        const config = window['config']; 
        if (files && files.length > 0) {
            const attachments: any = methods.getValues().Attachments || [];  
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await validateFile(file, config.ValidateAllExtension, config.uploadFileSize);
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
                        methods.setValue("Attachments", attachments);
                        methods.trigger();
                    };

                    reader.readAsDataURL(file);
                } else {
                    toast.error(result.message);
                }
            }
        }
    };

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

    return (
        <>
            {(showDropDiv || showImageDropDiv) && (
                <div
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={showDropDiv ? handleDragLeave : handleImageDragLeave}
                    onDrop={showDropDiv ? handleDrop : handleImageDrop}
                    className="drop-files-block"
                >
                </div>
            )}
            <Row>
                <div className="attachments-section">
                    <div className="task-heading py-3">
                        {t("Attachments")}
                    </div>
                    <div className="drag-and-drop-placing" onDragEnter={handleDragEnter}>

                        <div className="drop-box mb-3" onClick={columnUploadButton}>
                            <img src={FileUpload} alt="" />
                            <p>{t("Click or Drop Files Here")}</p>
                            <div>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileInputChange}
                                    style={{ display: 'none' }} ref={IdInputRef}
                                /></div>

                        </div> 
                        {
                            methods.getValues().Attachments?.length ?
                                <Col md={12} className="image-list-sec">
                                    <div className={`image-list-wrap details_show_block ${showPanel ? 'showPanel' : ''}`}>
                                        {showPanel && <Row className=" h-100 align-items-center selected_doc_corrs row no-gutters">
                                            {methods.getValues().Attachments.map((image: any, index: number) => (
                                                <ImageShowCard
                                                    key={index}
                                                    image={image}
                                                    index={index}
                                                    handleImageView={handleImageView}
                                                    removeImage={removeAttachment} 
                                                    colsize={cardSize}/>

                                            ))}
                                        </Row>}
                                    </div>
                                </Col>
                                : <></>
                        }

                    </div>
                </div>
                <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview}> </ReactFileViewer>
            </Row>
        </>
    )
}


export default AttachmentUpload;