import React from "react";
import { useTranslation } from "react-i18next";


const SaveLoader = () => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <div className="mail-save-box-wrapper">
                <div className="mail-save-box-wrap">
                    <div className="loader-text">
                        <p className="save-mail-msg">{t("Please wait, Saving...")}</p>
                        {/* <p className="save-mail-msg mt-1" >{t("Just give us a moment to process your choice")}</p> */}
                    </div>
                </div>
            </div>
            <div className="mail-save-overlay"></div>
        </React.Fragment>
    )
}

export default SaveLoader;
