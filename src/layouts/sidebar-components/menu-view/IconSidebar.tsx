import { IconButton } from "@mui/material";
import { menuicons } from "../../../assets/images/menuicons/menuicons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import localStore from "../../../common/browserstore/localstore";
import ApiService from "../../../core/services/axios/api";
import { getMasterMenuList, updateMasterListFavorite } from "../../../redux/reducers/sidebar.reducer";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { CultureId } from "../../../common/application/i18n";
import { StarFav, StarFilledFav } from "../../../assets/images/svgicons/svgicons";

interface Props {
    menu: any;
    child: any;
    onClickMenu: (menu: any, child: any, e: any) => void; 
}
export const IconMenu = (props: Props) => {
    const { menu, child, onClickMenu } = props;
    const [menuIcon, setMenuIcon] = useState();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [isFavorite, setIsFavorite] = useState(child.IsFavorite);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  
    const onClickFavButton = async () => {
        const params = {
            Data: {
                MASTER_ID: child.MenuId,
                SORT_ORDER: 0, 
                IS_MARKED: isFavorite === 0 ? 1 : 0
            },
            UserId: userID
        }
        const response = await ApiService.httpPost(`data/saveFavorite`, params); 
        if (response.Id > 0) { 
            setIsFavorite(isFavorite === 0 ? 1 : 0); 
        }
        dispatch(updateMasterListFavorite(child.MenuId));
    }

    useEffect(() => {
        setMenuIcon(menuicons[child.icon]); 
    }, [child]);

    return (
        <>
            {!(child.CriteriaMode === 0) ? (
                <div title={child.title}
                    className="h-100 icon-menu-inner"
                    onClick={(e) => onClickMenu(menu, child, e)}
                >
                    <IconButton
                        aria-label="delete"
                        size="large"
                        className="menu-icon-button"
                    >
                        <img src={menuIcon} alt={menuIcon} />
                    </IconButton> 
                </div>
            ) : (
                <Link to={child.redirectUrl} title={child.title} className="h-100 w-100 d-flex align-items-centre justify-content-center py-1 icon-frm">
                    <IconButton
                        aria-label="delete"
                        size="large"
                        className="menu-icon-button"
                    >
                        <img src={menuIcon} alt={menuIcon} />
                    </IconButton> 
                    <span onClick={(event) => {
                        event.preventDefault();
                        onClickFavButton();
                    }}>
                    <img className="fav-star-frm" src={isFavorite ? StarFilledFav : StarFav} alt="" /></span>
                </Link>
            )}
        </>
    );
};
