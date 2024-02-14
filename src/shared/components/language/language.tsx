import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cookies from "js-cookie";
import i18next from "i18next";
import { IconButton, Switch } from "@mui/material";
import { LanguageNewSvg, LanguageSvg } from "../../../assets/images/svgicons/svgicons";
import LanguageIcon from '@mui/icons-material/Language';
import './language.scss';
import axios from "axios";

const Language = (props: any) => {
    const { uiType } = props;
    const [currentLanguage, setCurrentLanguage] = React.useState(false);

    {
        /* <img src={LanguageSvg} alt="" /> */
    }

    const { t } = useTranslation();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const lang = event.target.checked ? "ar" : "en";
        setCurrentLanguage(event.target.checked);
        i18next.changeLanguage(lang);
    };

    const handleLangChange = (currLang: any) => {
        const lang = !currLang ? "ar" : "en";
        setCurrentLanguage(currLang);
        i18next.changeLanguage(lang);
    }

    useEffect(() => {
        const presentLanguge = cookies.get("i18next");
        if (presentLanguge === "ar") {
            setLanguageToDom(presentLanguge);
        } else {
            setLanguageToDom(presentLanguge);
        }
    }, [currentLanguage, t]);

    const setLanguageToDom = (lang: string | undefined) => {
        document.body.dir = lang === "ar" ? "rtl" : "ltr";
        setCurrentLanguage(lang === "ar" ? true : false);
        if (lang === "ar") {
            document.body.classList.add("rtl");
            document.body.classList.remove("ltr");
        } else {
            document.body.classList.add("ltr");
            document.body.classList.remove("rtl");
        }
        document.title = t("app_title");
    };

    return (
        <>
            {/* {t("language")} */}
            {uiType === "switch" ? (
                <div className="d-flex align-items-center justify-content-end switch-text">
                    <p className="m-0">{t('English')}</p>
                    <Switch
                        checked={currentLanguage}
                        onChange={handleChange}
                        id="lang-switch"
                        inputProps={{ "aria-label": "controlled" }}
                    />
                    <p className="m-0">{t('Arabic')}</p>
                </div>
            ) : (
                <IconButton aria-label="language" size="large" onClick={() => handleLangChange(currentLanguage)}>
                    <img src={LanguageNewSvg} alt="" />
                    <span className="lang-label">{currentLanguage ? 'En' : 'Ar'}</span>
                </IconButton>
            )}
        </>
    );
};

export default Language;
