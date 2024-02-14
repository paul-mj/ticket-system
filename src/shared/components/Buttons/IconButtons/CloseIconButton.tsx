import { IconButton } from '@material-ui/core';
import CloseIcon from "@mui/icons-material/Close";

interface CloseIconButtonProps {
    onClick: () => void;
}

const CloseIconButton = ({ onClick }: CloseIconButtonProps) => {
    return (
        <>
            <IconButton
                aria-label="close"
                className="head-close-bttn"
                onClick={onClick}
            >
                <CloseIcon />
            </IconButton>
        </>

    );
};

export default CloseIconButton;