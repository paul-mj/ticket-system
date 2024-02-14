import { Button } from '@mui/material';
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface TextCloseButtonProps {
    onClick: () => void;
}

const TextCurvedCloseButton = ({ onClick }: TextCloseButtonProps) => {
    const { t, i18n } = useTranslation();
    return (
        <Button autoFocus onClick={onClick}>
           {t("Close")}
        </Button>
    );
};

export default TextCurvedCloseButton;