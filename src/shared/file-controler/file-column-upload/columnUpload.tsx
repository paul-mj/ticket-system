import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useRef } from 'react';
import { useConfirm } from '../../components/dialogs/confirmation';
import { fileUploadMaxSizeCheck, fileUploadaMimeTypeCheck } from '../../../core/validators/imageValidators';

export const ColumnUpload = (props: any) => {
    const confirm = useConfirm();
    const IdInputRef = useRef<HTMLInputElement>(null);
    const { onColumnFileSelect } = props;

    const handleColumnFileSelect = () => {
        const config = window['config'];
        const extensions = [...config.jpgExtensions, ...config.jpgExtensions]
        if ((fileUploadMaxSizeCheck(IdInputRef.current?.files?.[0], confirm)) && (fileUploadaMimeTypeCheck(IdInputRef.current?.files?.[0], extensions,confirm))) {
            const file = IdInputRef.current?.files?.[0] || null;
            onColumnFileSelect(file);
        }
    };

    const columnUploadButton = () => {
        IdInputRef.current?.click();
    }



    return (
        <>
            <div className="mx-2" onClick={columnUploadButton}>
                <input type="file" style={{ display: 'none' }} ref={IdInputRef} onChange={handleColumnFileSelect} />
                <UploadFileOutlinedIcon />
            </div>
        </>
    )
}
