import { IconButton } from '@material-ui/core';
import { HiArrowDownOnSquare } from 'react-icons/hi2';
import "../buttons.scss";
import { BsDownload } from 'react-icons/bs';

interface DownloadIconButtonProps {
    onClick: () => void;
}

const DownloadIconButton = ({ onClick }: DownloadIconButtonProps) => {
    return (
        <>
            <IconButton
                aria-label="download" 
                size="small"
                className="px-1 head-dwnd-bttn"
                onClick={onClick}
            >
                <BsDownload />
            </IconButton>
        </>

    );
};

export default DownloadIconButton;