import React from 'react';
import { IconButton } from '@material-ui/core'; 
import { BsEye } from 'react-icons/bs';

interface ViewIconButtonProps {
    onClick: () => void;
}

const ViewIconButton = ({ onClick }: ViewIconButtonProps) => {
    return (
        <IconButton
            aria-label="calendar"
            size="small"
            className="px-1 view-eye"
            onClick={onClick}
        >
            <BsEye />
        </IconButton>
    );
};

export default ViewIconButton;