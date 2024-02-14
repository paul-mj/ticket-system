import { Outlet } from "react-router-dom";
import './static-layout.scss'
import StaticLayoutToolbar from "./static-layout-toolbar";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";

const StaticLayout = () => {

    


    return (
            <div className="full-view-wrapp h-100pb-2">
                <div className="full-view-head px-3 ">
                    <StaticLayoutToolbar />
                </div>
                <div className="full-view-grid">
                    <div className="full-view-grid-wrapper h-100">
                        <Outlet />
                    </div>
                </div>
            </div>
    )
}


export default StaticLayout;