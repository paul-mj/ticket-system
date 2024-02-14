import { useTranslation } from "react-i18next";

/* Langauge Functions */
export const CurrentDirection = () => {
    const { i18n } = useTranslation(); 
    const dir = i18n.dir();
    return dir;
}


export const CurrentLanguage = () => {
    const { i18n } = useTranslation(); 
    const language = (i18n.dir() === 'ltr') ? 'en' : 'ar';
    return language;
}


export const CultureId = () => {
    const { i18n } = useTranslation(); 
    const languageId = (i18n.dir() === 'ltr') ? 0 : 1;
    return languageId;
}
 