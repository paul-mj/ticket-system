import ReportFilter from "../Components/ReportFilter";
import useURLParser from "../../../../common/hooks/URLParser";
import './ReportLayout.scss';
import TitleBox from "../../TitleBox";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const ReportLayout = () => {
    const [menuTitle, setMenuTitle] = useState('');
    const { getQuery } = useURLParser();
    const { t, i18n } = useTranslation();
    const { MasterId } = getQuery();
    const { activeDetails } = useSelector(
        (state: any) => state.menus.activeDetails
    );
    useEffect(() => {
        if(Array.isArray(activeDetails)){
            const [{Master:{MASTER_NAME}}] = activeDetails ?? [{}];
            setMenuTitle(MASTER_NAME);
        }
    },[activeDetails])
    return (
        <div className="full-view-wrapp h-100pb-2">
            <div className="full-view-head px-3 report-toolbar-title">
                {menuTitle}
            </div>
            <div className="full-view-grid">
                <div className="full-view-grid-wrapper h-100 py-4 px-3 report-grid-layout">
                    <div className="report-filter-page-wrap">
                        <TitleBox header={<>{t("Filter Criteria")}</>} content={
                            <div className="py-4">
                                <ReportFilter MasterId={MasterId} />
                            </div>
                        } />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ReportLayout