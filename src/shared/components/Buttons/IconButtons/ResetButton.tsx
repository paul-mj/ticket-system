import React from 'react';
import { IconButton } from '@material-ui/core';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import '../buttons.scss';
import { useTranslation } from 'react-i18next';
interface ViewIconButtonProps {
    onClick: () => void;
}

const ResetButton = ({ onClick }: ViewIconButtonProps) => {
    const { t, i18n } = useTranslation();

    return (
       <>
         <IconButton
            aria-label="calendar"
            size="small"
            className="px-1 reset-btn"
            onClick={onClick} 
            title={`${t('Reset')}`}
        >
            <RotateLeftIcon />
        </IconButton>
       </>
    );
};

export default ResetButton;