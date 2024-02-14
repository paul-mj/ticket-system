import { Button } from '@mui/material';

interface TextIconWhiteButtonProps {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
    fontSize?: string;
}

const TextIconWhiteCloseButton = ({ icon: Icon, text: Text, onClick, fontSize = '12px' }: TextIconWhiteButtonProps) => {
    return (
        <Button variant="outlined" className="w-100" startIcon={<Icon />} onClick={onClick} style={{ fontSize }}>
            <span>{Text}</span>
        </Button>
    );
};

export default TextIconWhiteCloseButton;