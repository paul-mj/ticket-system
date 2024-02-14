import React from "react"; 
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import "./header-component.scss";
import { useTranslation } from "react-i18next";

const AppHeaderSearch: React.FC<any> = () => {
    const { t, i18n } = useTranslation()
    return (
        <>
           <div className="search-wrapper">
                <div className="search-ip-wrap position-relative">
                    <input type="text" placeholder={t("Search")?? 'Search'} className="w-100"/>
                    <div className="search-icon">
                        <SearchOutlinedIcon fontSize="inherit" />
                    </div>
                </div>
                <div className="search-result-wrap">

                </div>
           </div>
        </>
    )
};

export default AppHeaderSearch;

