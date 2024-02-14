import { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import ApiService from "../../../../core/services/axios/api";
import CircularProgress from '@material-ui/core/CircularProgress';
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import FileViewerCustom from "./FileViewerCustom";
import { DialogTitle } from "@mui/material";


export const ReactFileViewer = (props: any) => {
    const [fileViewerProps, setFileViewerProps] = useState<any>(null)
    const { previewParentProps, onClose } = props;
    const { t, i18n } = useTranslation();
    const [docPreviews, setDocPreviews] = useState<any[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setDocPreviews([]);
        if (previewParentProps && previewParentProps.popupOpenState) {
            downloadDoc(previewParentProps);
        }
    }, [previewParentProps]); // Add previewParentProps as dependency to useEffect

    const downloadDoc = async (previewParentProps: any) => {
        setLoading(true);
        console.log(previewParentProps);
        if (previewParentProps.image.file) {
            // If the file property exists, use its values directly
            // const { src, ext } = previewParentProps.image;
            // const docPreview: any = {
            //     uri: src,
            //     fileType: ext,
            // };
            /*  file?.name?.split(".").pop() */
            // setDocPreviews([docPreview]);
            const file = previewParentProps.image.file
            const fileType = file.type.split('/').pop()

            setFileViewerProps({ fileType: fileType, filePath: URL.createObjectURL(file) })
            setLoading(false);
            return;
        }

        const file = previewParentProps.image.ATTACHMENT_NAME ? previewParentProps.image.ATTACHMENT_NAME : previewParentProps.image.DOC_NAME ? previewParentProps.image.DOC_NAME : previewParentProps.image.src;
        const response = await ApiService.httpGetBlob(
            `file/downloadDoc?docpath=${file}`
        );
        if (response) {
            setFileViewerProps({ fileType: file.split('.').pop(), filePath: URL.createObjectURL(response) })
            setLoading(false);
            // const fileReader = new FileReader();
            // fileReader.readAsDataURL(response);
            // fileReader.onload = () => {
            //     const base64Data = fileReader.result as string;
            //     const docPreview: any = {
            //         uri: base64Data,
            //         fileType: previewParentProps.ext
            //     };
            //     setDocPreviews([docPreview]);
            //     setLoading(false);
            // };
        }
    };

    const onDialogClose = () => {
        setFileViewerProps(null)
        onClose(); // Remove the argument from onClose
    };

    return (
        <>
            <Dialog
                open={previewParentProps.popupOpenState}
                fullWidth={true}
                maxWidth={"md"}
                onClose={onDialogClose}
                className="react-prvw"
            >
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <DialogTitle sx={{ m: 0 }} className="dialog_title_wrapper white-bg bg-col px-2 py-1">
                            <h4 className="preview-file-name">{previewParentProps.image && previewParentProps.image.DISPLAY_NAME}</h4>
                        </DialogTitle>
                        <DialogContent className="preview-doc py-4">
                            {fileViewerProps && <FileViewerCustom fileViewerProps={fileViewerProps} />}

                            {/* {docPreviews.length > 0 && (
                                <DocViewer
                                    documents={docPreviews}
                                    style={{ height: 500 }}
                                    pluginRenderers={DocViewerRenderers}
                                    config={{
                                        header: {
                                            disableHeader: false,
                                            disableFileName: false,
                                            retainURLParams: false
                                        }
                                    }}
                                />
                            )} */}
                        </DialogContent>
                    </>
                )}
                <DialogActions>
                    <Button color="primary" onClick={onDialogClose}>
                        {t("Close")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};



