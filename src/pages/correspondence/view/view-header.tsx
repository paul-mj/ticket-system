import { useTranslation } from "react-i18next";
import { MasterId } from "../../../common/database/enums";
import FormatField from "../../../shared/components/UI/FormatField";
import { useEffect, useState } from "react";

interface ViewHeaderInterface {
    editFormattedData: any;
    showOrgin: boolean;
    headerName: string;
    masterId: number | null;
}


const FormatDate = ({ date }: any) => {
    return (
        <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={date} />
    )
}
const FormatDateTime = ({ date }: any) => {
    return (
        <FormatField type='dateTime' format="dd-mmm-yyyy" delimiter="-" value={date} />
    )
}
const ViewHeader = ({ editFormattedData, showOrgin, headerName, masterId }: ViewHeaderInterface) => {
    const { t } = useTranslation(); 
    const [editFormattedresponse, setEditFormattedresponse] = useState<any>({});

    useEffect(() =>{
        console.log(editFormattedData, 'Edit Formatted Data Test In Header')
        setEditFormattedresponse(editFormattedData);
    }, [editFormattedData, editFormattedresponse])

    return (
        <div className="details-view">
            {showOrgin && <div className="det-name">{t("Origin")} : <span>{headerName}</span> </div>}
            {showOrgin && <div className="det-name">{t("Trans No:")} : <span className="transdata"> {editFormattedresponse?.TransNo}</span> </div>}
            {editFormattedresponse?.CreatedUser && <div className="det-name">{t("By")} : <span>{editFormattedresponse?.CreatedUser}</span> </div>}

            {editFormattedresponse?.franchiseName && <div className="det-name">{t("Customer")} : <span>{editFormattedresponse?.franchiseName}</span> </div>}


            {editFormattedresponse?.TransDate && <div className="det-name">{t("On")} : <span><FormatDate date={editFormattedresponse?.TransDate} /></span> </div>}
            {editFormattedresponse?.DocumentDate && <div className="det-name">{t("Doc Date")}: <span><FormatDate date={editFormattedresponse?.DocumentDate} /></span> </div>}
            {editFormattedresponse?.ReferenceNumber && <div className="det-name">{t("Reference No")} : <span>{editFormattedresponse?.ReferenceNumber}</span> </div>}
            {editFormattedresponse?.EffectiveDate && <div className="det-name">{t("Effective Date")} : <span><FormatDate date={editFormattedresponse?.EffectiveDate} /></span> </div>}
            {(masterId === MasterId.Resolutions) && (
                <>
                    {editFormattedresponse?.ResolutionNo && <div className="det-name">{t("Resolution Number")}: <span>{editFormattedresponse?.ResolutionNo}</span></div>}
                    {editFormattedresponse?.ResolutionDate && <div className="det-name">{t("Resolution Date")}: <span><FormatDate date={editFormattedresponse?.ResolutionDate} /></span></div>}
                </>
            )}

            {(masterId === MasterId.Circulars) && (
                <>
                    {editFormattedresponse?.ResolutionNo && <div className="det-name">{t("Circular Number")}: <span>{editFormattedresponse?.ResolutionNo}</span></div>}
                    {editFormattedresponse?.ResolutionDate && <div className="det-name">{t("Circular Date")}: <span><FormatDate date={editFormattedresponse?.ResolutionDate} /></span></div>}
                    {editFormattedresponse?.DepartmentName && <div className="det-name">{t("Department")}: <span>{editFormattedresponse?.DepartmentName}</span></div>}
                </>
            )}

            {(masterId === MasterId.Requests) && (
                <>
                    {editFormattedresponse?.RequestType && <div className="det-name">{t("Request Type")}: <span>{editFormattedresponse?.RequestType}</span></div>}
                    {editFormattedresponse?.ITCApplication && <div className="det-name">{t("ITC Application")}: <span>{editFormattedresponse?.ITCApplication}</span></div>}
                </>
            )}

            {(masterId === MasterId.Events) && (
                <>
                    {editFormattedresponse?.Location && <div className="det-name">{t("Location")}: <span>{editFormattedresponse?.Location}</span></div>}
                </>
            )}

            {editFormattedresponse?.StartDate && <div className="det-name">{t("Start Date")} : <span>
                {
                    (masterId === MasterId.Meetings || masterId === MasterId.Events) ?
                        <FormatDateTime date={editFormattedresponse?.StartDate} /> :
                        <FormatDate date={editFormattedresponse?.StartDate} />
                }
            </span> </div>}
            {editFormattedresponse?.EndDate && <div className="det-name">{t("End Date")} : <span>
                {
                    (masterId === MasterId.Meetings || masterId === MasterId.Events) ?
                        <FormatDateTime date={editFormattedresponse?.EndDate} /> :
                        <FormatDate date={editFormattedresponse?.EndDate} />
                }</span> </div>}
            {editFormattedresponse?.ExpiryDate && <div className="det-name">{t("Expiry Date")} : <span><FormatDate date={editFormattedresponse?.ExpiryDate} /></span> </div>}
            {editFormattedresponse?.TransStatus && <div className="det-name">{t("Current Status")} : <span>{editFormattedresponse?.TransStatus}</span> </div>}
        </div>
    )
}

export default ViewHeader;