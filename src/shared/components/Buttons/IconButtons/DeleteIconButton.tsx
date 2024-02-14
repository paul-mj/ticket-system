import React from 'react';
import { IconButton } from '@material-ui/core';
import { HiOutlineTrash } from 'react-icons/hi';

interface DeleteIconButtonProps {
    onClick: () => void;
}

const DeleteIconButton = ({ onClick }: DeleteIconButtonProps) => {
    return (
        <IconButton
            aria-label="calendar"
            size="small"
            className="px-1 delete-trash"
            onClick={onClick}
        >
            <HiOutlineTrash />
        </IconButton>
    );
};

export default DeleteIconButton;