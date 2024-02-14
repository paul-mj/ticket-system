import { NavLink } from "react-router-dom";
import { ExpandedLogo } from "../../../../../../assets/images/png/pngimages";
import {
    HomeSvg,
} from "../../../../../../assets/images/svgicons/svgicons";
import AppHeaderUser from "../../../../../../layouts/header-components/user";
import { Card, CardContent } from "@mui/material";
import Language from "../../../../language/language";

const ReportPageToolbar = () => {
    return (
        <Card className='flex-1 mb-3'>
            <CardContent className="p-0">
                <div className="header-wrapper">
                    <div className="logo-search-section">
                        <div className="logo-img">
                            <img src={ExpandedLogo} alt="" />
                        </div>
                        <div className="search-section">
                            <div className="home-btn">
                                <NavLink to='/dashboard'>
                                    <img className="home-icon" src={HomeSvg} alt="" />
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="icons-section">
                        <div className="frm-icons featured-icons">
                            <div className="report-language-icon">
                                <Language uiType={"icon"} />
                            </div>
                        </div>
                        <div className="frm-profile">
                            <AppHeaderUser />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default ReportPageToolbar;