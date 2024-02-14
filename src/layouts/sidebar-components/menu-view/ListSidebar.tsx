import { Button, IconButton } from "@mui/material";
import MuiIconsComponent from "../../../shared/components/Mui-Icons/muiicons";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useDispatch, useSelector } from "react-redux";
import localStore from "../../../common/browserstore/localstore";
import ApiService from "../../../core/services/axios/api";
import { menuicons } from "../../../assets/images/menuicons/menuicons";
import { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getMasterMenuList, updateMasterListFavorite } from "../../../redux/reducers/sidebar.reducer";
import { CultureId } from "../../../common/application/i18n";
import { Link } from "react-router-dom";
import { StarFav, StarFilledFav } from "../../../assets/images/svgicons/svgicons";

interface Props {
    menu: any,
    child: any,
    onClickMenu: (menu: any, child: any, e: any) => void;
}

const ListMenu = (props: Props) => {
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
                <div className="d-flex align-items-center"> 
                    <span className="px-2">
                        {/* <img className="fav-star-frm star-width" src={isFavorite ? StarFav : StarFilledFav} alt="" /> */}                   
                    </span>
                    <Button
                        className="menu-bttn"
                        size="medium"
                        onClick={(e) =>
                            onClickMenu(menu, child, e)
                        }
                    >
                        <img src={menuIcon} alt={menuIcon} />
                        <span className="menu-name">
                            {child.title}
                        </span>
                    </Button>
                </div>
            ) : (
                <Link to={child.redirectUrl} title={child.title} className="h-100 w-100 py-1 icon-frm">
                    <div className="d-flex align-items-center">
                        <div onClick={(event) => {
                            event.preventDefault();
                            onClickFavButton();
                        }}> 
                            <span><img className="fav-star-frm star-width" src={isFavorite ? StarFilledFav : StarFav} alt="" /></span>
                        </div>
                        <Button
                            className="menu-bttn"
                            size="medium"
                        >
                            <img src={menuIcon} alt={menuIcon} />
                            <span className="menu-name">
                                {child.title}
                            </span>
                        </Button>
                    </div>
                </Link>
            )}
        </>
    )
};

export default ListMenu