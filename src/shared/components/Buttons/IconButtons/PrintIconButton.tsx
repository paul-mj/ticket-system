import { IconButton } from '@material-ui/core';
import PrintIcon from '@mui/icons-material/Print';

interface PrintIconButtonProps {
    onClick: () => void;
}

const PrintIconButton = ({ onClick }: PrintIconButtonProps) => {
    return (
        <>
            <IconButton
                aria-label="close"
                className="head-close-bttn p-0"
                onClick={onClick}
            >
                <PrintIcon />
            </IconButton>
        </>

    );
};

export default PrintIconButton;