import { Button, CircularProgress } from '@mui/material';
import '../../buttons.scss'
import { useTranslation } from 'react-i18next';
interface PrimaryButtonProps {
    text: string;
    onClick: () => void;
    cssClass?: string,
    isLoading?: boolean;
    styleType?: string;
    disabled?:boolean;
}

const PrimaryButton = ({ text: Text, onClick, cssClass, isLoading, styleType, disabled }: PrimaryButtonProps) => {
    const {t} = useTranslation()
    return (
        <Button variant="contained"  className={`primary-button  ${cssClass ?? ''} ${styleType} ${isLoading ? styleType + '-active' : ''} colored-btn`} onClick={onClick} disabled={disabled || isLoading}>
            <span className='btn-label'>{t(Text)}</span> {isLoading ? <span className="btn-spinner"><CircularProgress size={20} /></span> : ''}
        </Button>
    );
};

export default PrimaryButton;
