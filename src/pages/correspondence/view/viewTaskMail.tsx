import { IconButton } from "@mui/material";
import React from "react";
import { OpenInNewTab } from "../../../assets/images/svgicons/svgicons";
import { useTranslation } from "react-i18next";
import { MasterId } from "../../../common/database/enums";

interface ViewMailInterface {
    showMore: boolean;
    editFormattedresponse: any;
    showMoreToggle: () => void;
    masterID: any
}

const ViewTaskMail = ({ showMore, editFormattedresponse, showMoreToggle, masterID }: ViewMailInterface) => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <div className="mail-body-wrap" style={{ height: showMore ? "auto" : "300px" }} >
                <div className="subject-sec">
                    <div className="subject">{editFormattedresponse?.TASK_TITLE}</div>
                </div>
                <div className={`greetings ${editFormattedresponse?.CONTENT_EDITOR_CULTURE_ID === 1 ? 'isRtl' : 'isLtr'}`} dangerouslySetInnerHTML={{ __html: editFormattedresponse?.TASK_CONTENT }}>
                </div>
            </div>
            <IconButton className="show-more-toggle" onClick={showMoreToggle}
            >{t("Show")} {showMore ? t('Less') : t('More')}</IconButton>
        </React.Fragment>
    )
}

export default ViewTaskMail;
