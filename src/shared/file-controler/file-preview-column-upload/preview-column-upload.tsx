import React, { useEffect, useRef, useState } from 'react';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useConfirm } from '../../components/dialogs/confirmation';
import { fileUploadMaxSizeCheck, fileUploadaMimeTypeCheck } from '../../../core/validators/imageValidators';
import { AddNewPhoto } from '../../../assets/images/svgicons/svgicons';
import { useSelector } from 'react-redux';



export const PreviewColumnUpload = (props: any) => {
    const confirm = useConfirm();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasImage, setHasImage] = useState(false);
    const { onFileSelect, onFileDelete, columnFileExists } = props;
    const [isView, setIsView] = useState(false);



    useEffect(() => { 
        if (columnFileExists) {
            setHasImage(true);
        } else {
            setHasImage(false);
        }
    }, [columnFileExists])

    const handleFileSelect = () => {
        const config = window['config'];
        const extensions = [...config.jpgExtensions, ...config.pngExtensions]
        if ((fileUploadMaxSizeCheck(fileInputRef.current?.files?.[0], confirm)) && (fileUploadaMimeTypeCheck(fileInputRef.current?.files?.[0], extensions, confirm))) {
            const file = fileInputRef.current?.files?.[0] || null;
            onFileSelect(file);
        }
    };

    const ImageUploadButton = () => {
        fileInputRef.current?.click();
    }

    const handleFileDelete = () => {
        let form = fileInputRef?.current?.files;
        if (form) {
            form = null;
        }
        onFileDelete(true);
    }

    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );

    useEffect(() => {
        if ((activeDetails[0]?.Master.MASTER_ID === 2027)) {
            setIsView(true)
        }
    }, []);






    return (
        <>
            {!isView && <div className="column-sec">
                <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />

                {!hasImage && <button className="mx-1" onClick={ImageUploadButton}>

                    <UploadFileOutlinedIcon />
                </button>}
            </div>}
        </>
    )
}