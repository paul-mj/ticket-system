import { useContext, useEffect, useRef, useState } from 'react';
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { useConfirm } from '../../components/dialogs/confirmation';
import { fileUploadMaxSizeCheck, fileUploadaMimeTypeCheck } from '../../../core/validators/imageValidators';
import { AddNewPhoto } from '../../../assets/images/svgicons/svgicons';
import { useSelector } from 'react-redux';
import { fullViewRowDataContext } from '../../../common/providers/viewProvider';
import { MenuId } from '../../../common/database/enums';



export const PreviewUpload = (props: any) => {
    const confirm = useConfirm();
    const [hasImage, setHasImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { onFileSelect, onFileDelete, fileExists, popupConfiguration } = props;
    const [isView, setIsView] = useState(false);
    const { rowData, activeAction } = useContext(fullViewRowDataContext);


    useEffect(() => {
        console.log(fileExists)
        if (fileExists) {
            setHasImage(true);
        } else {
            setHasImage(false);
        }
    }, [fileExists])

    const handleFileSelect = () => {
        const config = window['config'];
        const extensions = [...config.jpgExtensions, ...config.pngExtensions]
        if ((fileUploadMaxSizeCheck(fileInputRef.current?.files?.[0], confirm)) && (fileUploadaMimeTypeCheck(fileInputRef.current?.files?.[0], extensions, confirm))) {
            const file = fileInputRef.current?.files?.[0] || null;
            onFileSelect(file);
            //CheckFileExits();
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
        setHasImage(false);
    }

    // const CheckFileExits = () => {
    //     if (fileInputRef.current?.files?.[0]) {
    //         setHasImage(true);
    //     } else {
    //         setHasImage(false);
    //     }
    // };
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );

    useEffect(() => {
        if ((activeDetails[0]?.Master.MASTER_ID === 2027) || (rowData?.ACTION_TYPE_ID_ === 32601)) {
            setIsView(true)
        }
    }, []);

    const [pageState, setPageState] = useState({
        isNew: false,
        isView: false,
        isEdit: false,
        isChangeStatus: false
    });

    /* Find Current Page */
    useEffect(() => {
        switch (popupConfiguration?.action?.MenuId) {
            case MenuId.New:
                setPageState(prevState => ({ ...prevState, isNew: true }));
                break;
            case MenuId.View:
                setPageState(prevState => ({ ...prevState, isView: true }));
                break;
            case MenuId.Edit:
                setPageState(prevState => ({ ...prevState, isEdit: true }));
                break;
            case MenuId.ChangeStatus:
                setPageState(prevState => ({ ...prevState, isChangeStatus: true }));
                break;
            default:
                setPageState({
                    isNew: false,
                    isView: false,
                    isEdit: false,
                    isChangeStatus: false
                });
        }
    }, [])

    useEffect(() => {
        if ((popupConfiguration?.action?.MenuId === MenuId?.View)) {
            setIsView(true)
        }
    }, [popupConfiguration]);

    console.log(pageState)


    return (
        <>
            {!isView && <div className="btn-sec">
                <div className="avatar-edit">
                    <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
                    {/* <button onClick={ImageUploadButton}>
                        <HiOutlinePencilSquare/>
                    </button> */}
                    {hasImage ? (
                        <button onClick={ImageUploadButton}>
                            <HiOutlinePencilSquare />
                        </button>
                    ) : (
                        <img src={AddNewPhoto} alt="" onClick={ImageUploadButton} />
                    )}
                </div>
                {hasImage && (
                    <button className='upload-delete-btn' onClick={handleFileDelete}>
                        <HiOutlineTrash />
                    </button>
                )}
            </div>}
        </>
    )
}