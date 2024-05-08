import { useTranslation } from "react-i18next";
import TitleBox from "../../../shared/components/TitleBox";

interface LogsInterface {
    editFormattedresponse: any;
}

const ViewLogs = ({ editFormattedresponse }: LogsInterface) => {
    const { t } = useTranslation();

    return (
        <TitleBox header={<>{t('Status Log')}</>}
            content={
                <div className="mail-right">
                    <div className="status-sec py-3">
                        {editFormattedresponse?.StatusLog?.length ? editFormattedresponse?.StatusLog.map((item: any, index: any) => (
                            <div className="wraaaap" key={index}>
                                <div className="status-date">
                                    {new Date(item.STATUS_TIME).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    }).replace(/\//g, '-')}
                                </div>
                                <div className="each-status">
                                    <div className="status-state">
                                        {item.STATUS_NAME}
                                    </div>
                                    <p className="status-remarks">
                                        {item.STATUS_REMARKS}
                                    </p>
                                    <div className="status-name">
                                        {t("By")} : {item.USER_FULL_NAME}
                                    </div>
                                </div>
                            </div>
                        )) : <div className="nodata">{("No Data")}</div>}
                    </div>
                </div>
            } />
    )
}

export default ViewLogs;

