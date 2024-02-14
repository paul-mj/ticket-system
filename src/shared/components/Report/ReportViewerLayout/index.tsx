import { Outlet } from "react-router-dom";
import './ReportViewerLayout.scss';
import ReportPageToolbar from "./Components/ReportPageToolbar";
const ReportViewerLayout = () => {
    return (
        <div className="report-viewer-layout">
            <ReportPageToolbar/>
            <Outlet />
        </div>
    )
}
export default ReportViewerLayout;