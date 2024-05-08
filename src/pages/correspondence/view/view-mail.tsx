import { IconButton } from "@mui/material";
import React from "react";
import { OpenInNewTab } from "../../../assets/images/svgicons/svgicons";
import { useTranslation } from "react-i18next";
import Status from "../../../shared/components/UI/Status";

interface ViewMailInterface {
    showMore: boolean;
    editFormattedresponse: any;
    viewMailBody?: any;
    showMoreToggle: () => void;
}

const ViewMail = ({ showMore, editFormattedresponse, viewMailBody, showMoreToggle }: ViewMailInterface) => {
    const { t } = useTranslation();
    return (
        <React.Fragment> 
            <div className="mail-body-wrap" style={{ height: showMore ? "auto" : "300px" }} >
                <div className="subject-sec">
                    <div className="subject">{editFormattedresponse?.Subject}</div>
                    <div className="open-stat-sec">
                        <div className={``}>
                            <Status label={editFormattedresponse?.TransStatus} status={editFormattedresponse?.StatusID} cssClass="table-cell-status" />
                        </div>
                        <IconButton> <img onClick={viewMailBody} src={OpenInNewTab} alt="" /></IconButton>
                    </div>
                </div> 
                <div className={`greetings ${editFormattedresponse?.editorLang ? 'isRtl' : 'isLtr'}`} dangerouslySetInnerHTML={{ __html: editFormattedresponse?.TransContent }}>
                </div>
            </div>
            <IconButton className="show-more-toggle" onClick={showMoreToggle}>{t("Show")} {showMore ? t('Less') : t('More')}</IconButton>
        </React.Fragment>
    )
}

export default ViewMail;
