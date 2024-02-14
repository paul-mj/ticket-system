import { useEffect } from 'react';
import FileViewer from 'react-file-viewer';

const FileViewerCustom = ({ fileViewerProps }) => {
    useEffect(() => {
        console.log(fileViewerProps)
    }, [fileViewerProps])
    const onError = (e) => {
        console.log(e)
    }
    const CustomErrorComponent = () => {
        return <>Failed to load</>
    }

    return (<div className='file-viewr-wrapper'>
        <FileViewer {...fileViewerProps} errorComponent={CustomErrorComponent} onError={onError} />
    </div>)
}
export default FileViewerCustom;