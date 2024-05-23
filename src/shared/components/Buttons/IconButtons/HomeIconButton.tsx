import { IconButton } from '@material-ui/core';
import HouseIcon from '@mui/icons-material/House';

interface HomeIconButtonProps {
    onClick: () => void;
}

const HomeIconButton = ({ onClick }: HomeIconButtonProps) => {
    return (
        <>
            <IconButton
                aria-label="close"
                className="head-close-bttn"
                onClick={onClick}
            >
                <HouseIcon /> 
            </IconButton>
        </>

    );
};

export default HomeIconButton;