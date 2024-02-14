import { Button } from '@mui/material';

interface TextIconPrimaryButtonProps {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
    fontSize?: string;
}

const TextIconPrimaryButton = ({ icon: Icon, text: Text, onClick, fontSize = '12px' }: TextIconPrimaryButtonProps) => {
    return (
        <Button variant="outlined" className="w-100" startIcon={<Icon />} onClick={onClick} style={{ fontSize }}>
            {Text}
        </Button>
    );
};

export default TextIconPrimaryButton;