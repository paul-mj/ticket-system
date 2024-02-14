import { toast } from "react-toastify";
import { validateFile } from "../../../core/validators/fileValidator";
import { DownloadBlob } from "../../../common/application/shared-function";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useConfirm } from "../../components/dialogs/confirmation";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import ImageShowCard from "../../components/UI/ImageCard/ImageCard";
import { FileUpload } from "../../../assets/images/svgicons/svgicons";
import { ReactFileViewer } from "../../components/dialogs/Preview/react-file-viewer";

interface AttachUploadProps {
    popupConfiguration?: any,
    showPanel?: boolean
}


const DocsUpload = ({ popupConfiguration, showPanel }: AttachUploadProps) => {
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


    const IdInputRefImages = useRef<HTMLInputElement>(null);

    const columnImageUploadButton = () => {
        IdInputRefImages.current?.click();
    }
    /* File Upload */
    const handleImageDrop = (event: any) => {
        event.preventDefault();
        setShowImageDropDiv(false); // Reset showDropDiv state 
        const files = Array.from(event.dataTransfer.files);
        handleColumnImageSelect(files)
    };

    const handleImageInputChange = (event: any) => {
        const files = Array.from(event.target.files);
        handleColumnImageSelect(files)
    };



    /* File Upload */
    const handleDrop = (event: any) => {
        event.preventDefault();
        setShowDropDiv(false); // Reset showDropDiv state 
        const files = Array.from(event.dataTransfer.files);
        handleColumnImageSelect(files)
    };

    const handleDragLeave = (event: any) => {
        event.preventDefault();
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('drop-files-block')) {
            setShowDropDiv(false);
        }
    };



    const removeImage = async (index: number) => {
        const choice = await confirm({
            ui: 'delete',
            title: `${t('You Are About To Delete')}`,
            description: `${t('Are you sure you want to delete this?')}`,
            confirmBtnLabel: `${t('Continue')}`,
            cancelBtnLabel: `${t('Cancel')}`,
        });
        if (choice) {
            const docs = methods.getValues().Docs;
            docs.splice(index, 1);
            methods.setValue('Docs', docs);
            methods.trigger();
        }
    }

    const handleImageclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }

    const handleImageDragEnter = (event: any) => {
        event.preventDefault();
        if (!event.target.classList.contains('drop-files-block')) {
            setShowImageDropDiv(true);
        }
    };

    const handleImageDragLeave = (event: any) => {
        event.preventDefault();
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('drop-files-block')) {
            setShowImageDropDiv(false);
        }
    };

    const handleColumnImageSelect = async (files: any) => {
        if (methods?.getValues()?.Docs?.length > 0) {
            toast.error(`${t('Only Allows 1 Document')}`);
            return;
        }
        if (files && files.length > 0) {
            const docs: any = methods.getValues().Docs || [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await validateFile(file, ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'], 5);
                if (result.valid) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const newImage = {
                            DISPLAY_NAME: file.name,
                            src: reader.result as string,
                            file: file,
                            ext: file?.name?.split('.').pop(),
                            isExist: false,
                            isAttachment: false
                        };
                        docs.push(newImage);
                        methods.setValue('Docs', docs);
                        methods.trigger();
                    };

                    reader.readAsDataURL(file);
                } else {
                    toast.error(result.message);
                }
            }
        }
    };


    /* Preview Selecred Images */
    const handleImageView = (image: any) => {
        console.log(image);
        setPreviewParam({
            popupOpenState: true,
            image: image
        })
    }


    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }


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
                        {t("Images")}
                    </div>
                    <div className="drag-and-drop-placing" onDragEnter={handleImageDragEnter}>
                        <div className="drop-box image mb-3" onClick={columnImageUploadButton}>
                            <img src={FileUpload} alt="" />
                            <p>{t("Click or Drop Files Here")}</p>
                            <div>
                                <input
                                    type="file"
                                    onChange={handleImageInputChange}
                                    style={{ display: 'none' }} ref={IdInputRefImages}
                                /></div>

                        </div>
                        <Col md={12}>

                            <div className={`image-list-wrap details_show_block ${showPanel ? 'showPanel' : ''}`}>
                                <Row className="h-100 align-items-center selected_doc_corrs row no-gutters">
                                    {
                                        (methods?.getValues() && methods?.getValues()?.Docs?.length) ?
                                            methods?.getValues().Docs.map((image: any, index: number) => (
                                                <ImageShowCard
                                                    key={index}
                                                    image={image}
                                                    index={index}
                                                    handleImageView={handleImageView}
                                                    removeImage={removeImage} />
                                            )) : <></>
                                    }
                                </Row>
                            </div>
                        </Col>
                    </div>
                </div>
            </Row>

            <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview}> </ReactFileViewer>
        </>
    )
}

export default DocsUpload
