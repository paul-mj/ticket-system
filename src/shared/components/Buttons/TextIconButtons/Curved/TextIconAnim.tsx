import { Button } from '@mui/material';

interface TextIconAnimButtonProps {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
    fontSize?: string;
}

const TextIconAnimButton = ({ icon: Icon, text: Text, onClick, fontSize = '12px' }: TextIconAnimButtonProps) => {
    return (
        <Button variant="outlined" className="w-100" startIcon={<Icon />} onClick={onClick} style={{ fontSize }}>
            <span>{Text}</span>
        </Button>
    );
};

export default TextIconAnimButton;